//Modified code from: https://docs.superfluid.finance/superfluid/developers/constant-flow-agreement-cfa/money-streaming-1
import React, { useState } from "react";
import { Framework } from "@superfluid-finance/sdk-core";
import {Card, CardContent, TextField, Button, InputAdornment, } from '@mui/material';
import { Form, FormGroup } from "react-bootstrap";
import { ethers } from "ethers";
import { SnackBar } from "./Snackbar";
import { TxModal } from "./Modal";
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo, faCircleArrowLeft } from '@fortawesome/free-solid-svg-icons';
import ether from '../img/ether.png';
import dai from '../img/dai.png';
import store from '../app/store'
import "../css/stream.css";

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

  const provider = window.provider;

  if (typeof window.signer == 'undefined') {
    window.signer = provider.getSigner();
    console.log(window.signer);
  }

  const signer = window.signer;

  if (typeof window.sf == 'undefined') {
    window.sf = await Framework.create({
      chainId: Number(chainId),
      provider: provider
    });   
    console.log(window.sf);
  }

  const sf = window.sf;

  var superToken = '';

  if (token == 'fDAIx'){
    console.log("creating a fDAIX stream...");
    const fDAIxContract = await sf.loadSuperToken("fDAIx");
    superToken = fDAIxContract.address;
  }
  else if (token == 'ETHx'){
    console.log("creating a ETHx stream...");
    const ETHxContract = await sf.loadSuperToken("ETHx");
    superToken = ETHxContract.address;
  }

  try {
    const deleteFlowOperation = sf.cfaV1.deleteFlow({
      sender: account,
      receiver: recipient,
      superToken: superToken,
      // userData?: string
    });

    console.log("Deleting your stream...");
    setTxLoading(true);
    setTxMsg("Transaction being broadcasted...");

    const deleteTxn = await deleteFlowOperation.exec(signer);
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
  const [recipient, setRecipient] = useState(props.recipient);
  const [txLoading, setTxLoading] = useState(false); //transaction loading progress bar
  const [txCompleted, setTxCompleted] = useState(false); //confirmation message after transaction has been broadcasted.
  const [token, setToken] = useState(props.token);
  //const [txHash, setTxHash] = useState(""); //transaction hash for broadcasted transactions
  const [txMsg, setTxMsg] = useState("");

  const handleRecipientChange = (e) => {
    setRecipient(() => ([e.target.name] = e.target.value));
  };

  const handleTokenChange = (e) => {
    setToken(() => ([e.target.name] = e.target.value));
  };

  return (
    <>
      <div className="streamContainer">
        <div className="back">
          <Button variant="outlined" sx={{textTransform:"none", borderRadius:"10px"}} onClick={()=>{props.openDashboard()}}>
            <FontAwesomeIcon icon={faCircleArrowLeft}/> 
            <p>Dashboard</p>
          </Button>
        </div>

        <Card className="flowCard"
          sx={{
            bgcolor: "secondary.dark",
            borderRadius: "20px",
          }}>
          <CardContent>
            <div className="titleContainer">          
              <div className="flowTitle">
                {
                  txLoading 
                  ? <h5 sx={{color: "#424242"}}>Close Stream</h5> 
                  : <h5>Close Stream</h5>
                }
              </div>
              
              <Form className="token">
                <FormGroup>
                  <TextField
                    className="rainbow"
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
                    sx={{width: '110px'}}
                  />
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
                : <Button variant="contained"
                    color="primary"
                    sx={{
                      height: "45px",
                      width: "100%",
                      color: "white",
                      textTransform: "none",
                      fontFamily: 'Lato',
                      fontWeight: "700",
                    }}
                    onClick={() => {
                      deleteFlow(recipient, token, setTxLoading, setTxCompleted, setTxMsg);
                      setRecipient('');
                    }}
                    >
                    Close Stream
                  </Button>
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
