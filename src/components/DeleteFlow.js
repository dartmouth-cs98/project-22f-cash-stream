//Modified code from: https://docs.superfluid.finance/superfluid/developers/constant-flow-agreement-cfa/money-streaming-1
import React, { useState } from "react";
import { Framework } from "@superfluid-finance/sdk-core";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import LinearProgress from '@mui/material/LinearProgress';
import { Form, FormGroup } from "react-bootstrap";
import { ethers } from "ethers";
import { SnackBar } from "./Snackbar";

async function deleteFlow(recipient, setTxLoading, setTxCompleted, setTxHash) {

  console.log(recipient);

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();

  const chainId = await window.ethereum.request({ method: "eth_chainId" });

  const sf = await Framework.create({
      chainId: Number(chainId),
      provider: provider
  });

  const fDAIxContract = await sf.loadSuperToken("fDAIx");
  const fDAIx = fDAIxContract.address;

  const accounts = await ethereum.request({ method: "eth_accounts" });
  const account = accounts[0];

  try {
    const deleteFlowOperation = sf.cfaV1.deleteFlow({
      sender: account,
      receiver: recipient,
      superToken: fDAIx
      // userData?: string
    });

    console.log("Deleting your stream...");
    setTxLoading(true);

    const deleteTxn = await deleteFlowOperation.exec(signer);
    await deleteTxn.wait().then(function (tx) {
    console.log(
      `Congrats - you've just deleted your money stream!
       Network: Goerli
       Super Token: fDAIx
       Sender: ${signer._address}
       Receiver: ${recipient}
       Transaction: ${tx.transactionHash}
    `
    );

    setTxLoading(false);
    setTxCompleted(true);
    setTxHash(tx.transactionHash);
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
  const [txHash, setTxHash] = useState(""); //transaction hash for broadcasted transactions

  function DeleteButton({ children, ...props }) {
    return (
      <Button variant="outlined" 
          sx={{
            textTransform: "none",
            color: "success.main", 
            borderColor: "success.main",
            ":hover": {borderColor: "success.main"}
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
    <div className="deleteFlowContainer">
      <Card sx={{ width: "60%", borderRadius: "15px", marginLeft: "auto", marginRight: "auto"}}>
        <CardContent>
          <Typography variant="h5" component="div" sx={{marginTop: "20px"}}>Delete Stream</Typography>
          
          <Form className="createFlowForm">
            <FormGroup className="mb-3">
              <TextField 
                name="recipient"
                value={recipient}
                onChange={handleRecipientChange}
                placeholder="Recipient wallet address"
                color="success"
                sx={{width: "70%", marginBottom: "10px"}}
              >  
              </TextField>
            </FormGroup>
            
            {
              recipient == "" || txLoading
              ? <Button variant="outlined" color="success" disabled sx={{textTransform: "none"}}>Delete</Button>
              : <DeleteButton
                  onClick={() => {
                    deleteFlow(recipient, setTxLoading, setTxCompleted, setTxHash);
                    setRecipient('');
                  }}
                >
                  Delete
                </DeleteButton>
            }
          </Form>
        </CardContent>

        {
          txLoading
          ? <LinearProgress color="success"/>
          : <div className="displayNone"/>
        }
      </Card>

      <SnackBar openSnackBar={txCompleted} setOpenSnackBar={setTxCompleted}>
        {"Your transaction has been boradcasted! View on block explorer "}
        <a href={`https://goerli.etherscan.io/tx/${txHash}`}>here</a>.
      </SnackBar>

      {/*
      <h3>Delete Stream</h3>
      <Form className="deleteFlowForm">
        <FormGroup className="mb-3">
          <FormControl
            name="recipient"
            value={recipient}
            onChange={handleRecipientChange}
            placeholder="Enter recipient address"
          ></FormControl>
        </FormGroup>
        <DeleteButton
          onClick={() => {
            setIsButtonLoading(true);
            deleteFlow(recipient);
            setTimeout(() => {
              setIsButtonLoading(false);
            }, 1000);
          }}
        >
          Delete Stream
        </DeleteButton>
      </Form>
      */}
    </div>
  );
};
