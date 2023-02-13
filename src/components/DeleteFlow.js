//Modified code from: https://docs.superfluid.finance/superfluid/developers/constant-flow-agreement-cfa/money-streaming-1
import React, { useState } from "react";
import { Framework } from "@superfluid-finance/sdk-core";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { MenuItem } from "@mui/material";
import { Form, FormGroup } from "react-bootstrap";
import { ethers } from "ethers";
import { SnackBar } from "./Snackbar";
import { TxModal } from "./Modal";
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { InputAdornment } from '@mui/material';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import ether from '../img/ether.png';
import dai from '../img/dai.png';

var txHash = ''; //transaction hash for createFlow transaction (Used to access etherscan transaction info)

//Checks transaction status from Etherscan until success
async function checkTxStatus(resolve, reject){
  const url = `https://api-goerli.etherscan.io/api?module=transaction&action=getstatus&txhash=${txHash}&apikey=${process.env.REACT_APP_ETHERSCAN_API_KEY}`;
  const res = await axios.get(url);
  
  console.log('transaction status: ' + res.data.status);
  if(res.data.status == '1'){
    console.log('indexing...')
    checkTxStatus(resolve);
  }
  else{
    resolve(res);
  }
}

async function deleteFlow(recipient, token, setTxLoading, setTxCompleted, setTxMsg) {

  console.log(recipient);

  const currState = store.getState();
  console.log(currState);

  var chainId = currState.appReducer.chainId;
  var account = currState.appReducer.account;
  
  if (typeof chainId == 'undefined') {
    /*
     * Redux store is not up to date. Retrieve chainId and account & save to 
     * redux store via action dispatch.
     */

    chainId = await window.ethereum.request({ method: "eth_chainId" });
    const accounts = await ethereum.request({ method: "eth_accounts" });
    account = accounts[0];

    const connectWalletAction = {
      type: 'wallet/connect',
      payload: {
        chainId: chainId, // string
        account: account
      }
    }
    store.dispatch(connectWalletAction);
    console.log('Wallet redux state updated.')
  }

  console.log(chainId);
  console.log(account);

  if (typeof window.provider == 'undefined') {
    console.log('Retrieving provider & signer.')
    window.provider = new ethers.providers.Web3Provider(window.ethereum);
    console.log(window.provider);
  }

  if (typeof window.signer == 'undefined') {
    window.signer = provider.getSigner();
    console.log(window.signer);
  }

  if (typeof window.sf == 'undefined') {
    window.sf = await Framework.create({
      chainId: Number(chainId),
      provider: provider
    });   
    console.log(window.sf);
  }

  var superToken = '';

  if (token == 'fDAIx'){
    console.log("creating a fDAIX stream...");
    const fDAIxContract = await window.sf.loadSuperToken("fDAIx");
    superToken = fDAIxContract.address;
  }
  else if (token == 'ETHx'){
    console.log("creating a ETHx stream...");
    const ETHxContract = await window.sf.loadSuperToken("ETHx");
    superToken = ETHxContract.address;
  }

  const accounts = await ethereum.request({ method: "eth_accounts" });
  const account = accounts[0];

  try {
    const deleteFlowOperation = window.sf.cfaV1.deleteFlow({
      sender: account,
      receiver: recipient,
      superToken: superToken,
      // userData?: string
    });

    console.log("Deleting your stream...");
    setTxLoading(true);
    setTxMsg("Transaction being broadcasted...");

    const deleteTxn = await deleteFlowOperation.exec(window.signer);
    await deleteTxn.wait().then(function (tx) {
    console.log(
      `Congrats - you've just deleted your money stream!
       Network: Goerli
       Super Token: ${token}
       Sender: ${signer._address}
       Receiver: ${recipient}
       Transaction: ${tx.transactionHash}
    `
    );
    
    setTxMsg("Transaction being indexed...");
    txHash = tx.transactionHash;
    new Promise((resolve, reject)=>{
      checkTxStatus(resolve, reject);
    }).then((result)=>{
      console.log('transaction successful!');
      setTxMsg("");
    });

    setTxLoading(false);
    setTxCompleted(true);
    //setTxHash(tx.transactionHash);
    });
  } catch (error) {
    console.error(error);
    alert("Hmmm, your transaction threw an error.");
    setTxLoading(false);
  }
}

export const DeleteFlow = (props) => {
  const [recipient, setRecipient] = useState("");
  const [txLoading, setTxLoading] = useState(false); //transaction loading progress bar
  const [txCompleted, setTxCompleted] = useState(false); //confirmation message after transaction has been broadcasted.
  const [token, setToken] = useState("ETHx");
  //const [txHash, setTxHash] = useState(""); //transaction hash for broadcasted transactions
  const [txMsg, setTxMsg] = useState("");

  function DeleteButton({ children, ...props }) {
    return ( 
      <Button variant="contained"
        color="primary" 
        sx={{
          height: "45px",
          width: "100%",
          color: "white",
          textTransform: "none",
          fontFamily: 'Lato',
          fontWeight: "700",
          ":hover": {borderColor: "primary.main"}
        }}
        {...props}
        >
        {children}
      </Button>
      
    );
  }

  const handleRecipientChange = (e) => {
    setRecipient(() => ([e.target.name] = e.target.value));
  };

  const handleTokenChange = (e) => {
    setToken(() => ([e.target.name] = e.target.value));
  };

  return (
    <>
      <div className="streamContainer">
        <div className="streamToggle">
          <ToggleButtonGroup
            color="primary"
            value={props.alignment}
            exclusive
            onChange={props.handleToggleChange}
            aria-label="Platform"
          >
            <ToggleButton value="create" sx={{fontFamily: 'Lato', textTransform: "none"}}>Send</ToggleButton>
            <ToggleButton value="delete" sx={{fontFamily: 'Lato', textTransform: "none"}}>Close</ToggleButton>
          </ToggleButtonGroup>
        </div>

        <Card className="flowCard"
          sx={{
            bgcolor: "secondary.dark",
            borderRadius: "20px",
          }}>
          <CardContent>
          <div className="titleContainer">          
            <div className="flowTitle">{txLoading ? <h5 sx={{color: "#424242"}}>Close Stream</h5> : <h5>Close Stream</h5>}</div>
            <Form className="token">
              <FormGroup>
                <TextField
                  className="rainbow"
                  select
                  defaultValue="ETHx"
                  value={token}
                  onChange={handleTokenChange}
                  color="success"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        {token === "ETHx"?<img src={ether}/>:<img src={dai}/>}
                      </InputAdornment>
                    ),
                  }}
                >
                  <MenuItem key={'ETHx'} value={'ETHx'}>
                    ETHx
                  </MenuItem>
                  <MenuItem key={'fDAIx'} value={'fDAIx'}>
                    fDAIx
                  </MenuItem>
                </TextField>
              </FormGroup>
            </Form>
          </div>

            <Form className="flowForm">
              <FormGroup>
                <TextField 
                  name="recipient"
                  label="recipient wallet address"
                  value={recipient}
                  onChange={handleRecipientChange}
                  placeholder="0x00..."
                  color="success"
                  sx={{width: "100%", fontFamily: "Inter"}}
                >  
                </TextField>
              </FormGroup>
            </Form>
              
            <div className="flowButtonContainer">
              {
                recipient == "" || txLoading
                ? <Button variant="contained" 
                    disabled 
                    sx={{textTransform:"none", 
                    width:"100%", 
                    height:"45px", 
                    fontFamily:'Lato', 
                  }}>
                    Close Stream
                  </Button>
                : <DeleteButton
                    onClick={() => {
                      deleteFlow(recipient, token, setTxLoading, setTxCompleted, setTxMsg);
                      setRecipient('');
                    }}
                  >
                    Close Stream
                  </DeleteButton>
              }
            </div>
          </CardContent>
        </Card>
      </div>

      {
        txLoading
        ? <TxModal txMsg={txMsg}/>
        : <div className="displayNone"/>
      }
      
      <a href="/userguide" className="link help" target="_blank">
        <FontAwesomeIcon icon={faCircleInfo} className="icon"/>
        Having trouble?
      </a>

      <SnackBar openSnackBar={txCompleted} setOpenSnackBar={setTxCompleted}>
        {"Transaction successful! View on block explorer "}
        <a href={`https://goerli.etherscan.io/tx/${txHash}`}>here</a>.
      </SnackBar>
    </>
  );
};
