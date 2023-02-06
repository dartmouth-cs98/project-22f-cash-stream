//Modified code from: https://docs.superfluid.finance/superfluid/developers/constant-flow-agreement-cfa/money-streaming-1
import React, { useState } from "react";
import { Framework } from "@superfluid-finance/sdk-core";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Form, FormGroup } from "react-bootstrap";
import { ethers } from "ethers";
import { SnackBar } from "./Snackbar";
import { TxModal } from "./Modal";
import axios from 'axios';

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

async function deleteFlow(recipient, setTxLoading, setTxCompleted, setTxMsg) {

  console.log(recipient);

  if (typeof window.provider == 'undefined') {
    console.log('Retrieving provider & signer.')
    window.provider = new ethers.providers.Web3Provider(window.ethereum);
    console.log(window.provider);

    window.signer = provider.getSigner();
    console.log(window.signer);

    window.sf = await Framework.create({
      chainId: Number(chainId),
      provider: provider
    });
  }

  const chainId = await window.ethereum.request({ method: "eth_chainId" });

  const fDAIxContract = await window.sf.loadSuperToken("fDAIx");
  const fDAIx = fDAIxContract.address;

  const accounts = await ethereum.request({ method: "eth_accounts" });
  const account = accounts[0];

  try {
    const deleteFlowOperation = window.sf.cfaV1.deleteFlow({
      sender: account,
      receiver: recipient,
      superToken: fDAIx
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
       Super Token: fDAIx
       Sender: ${window.signer._address}
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

export const DeleteFlow = () => {
  const [recipient, setRecipient] = useState("");
  const [txLoading, setTxLoading] = useState(false); //transaction loading progress bar
  const [txCompleted, setTxCompleted] = useState(false); //confirmation message after transaction has been broadcasted.
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

  return (
    <>
      <div className="streamContainer">
        <Card className="flowCard"
          sx={{
            bgcolor: "secondary.dark",
            borderRadius: "20px",
          }}>
          <CardContent>
            <div className="flowTitle">
              {
                txLoading
                ? <h5 sx={{color: "#424242"}}>Close Stream</h5>
                : <h5>Close Stream</h5>
              }
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
                      deleteFlow(recipient, setTxLoading, setTxCompleted, setTxMsg);
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

      <SnackBar openSnackBar={txCompleted} setOpenSnackBar={setTxCompleted}>
        {"Transaction successful! View on block explorer "}
        <a href={`https://goerli.etherscan.io/tx/${txHash}`}>here</a>.
      </SnackBar>
    </>
  );
};
