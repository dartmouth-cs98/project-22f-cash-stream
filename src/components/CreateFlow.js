//Modified code from: https://docs.superfluid.finance/superfluid/developers/constant-flow-agreement-cfa/money-streaming-1
import React, { useState } from "react";
import { Framework } from "@superfluid-finance/sdk-core";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Form, FormGroup } from "react-bootstrap";
import { ethers } from "ethers";
import axios from 'axios';
import { SnackBar } from "./Snackbar";
import { TxModal } from "./Modal";
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

async function createNewFlow(recipient, flowRate, setTxLoading, setTxCompleted, setTxHash, setTxMsg) {

  console.log(recipient);

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  console.log(provider);

  const signer = provider.getSigner();
  console.log(signer);

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
    const createFlowOperation = sf.cfaV1.createFlow({
      sender: account, 
      receiver: recipient,
      flowRate: flowRate,
      superToken: fDAIx
      // userData?: string
    });

    console.log("Creating your stream...");
    setTxLoading(true);
    setTxMsg("Transaction being broadcasted...");

    const createTxn = await createFlowOperation.exec(signer);
    await createTxn.wait().then(function (tx) {
      console.log(
        `Congrats - you've just created a money stream!
        View Your Stream At: https://app.superfluid.finance/dashboard/${recipient}
        Network: Goerli
        Super Token: fDAIx
        Receiver: ${recipient},
        FlowRate: ${flowRate},
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
      setTxHash(tx.transactionHash);
    });
  } catch (error) {
    console.error(error);
    alert("Hmmm, your transaction threw an error. Make sure that this stream does not already exist, and that you've entered a valid Ethereum address");
    setTxLoading(false);
  }
}

export const CreateFlow = () => {
  const [recipient, setRecipient] = useState("");
  //const [isButtonLoading, setIsButtonLoading] = useState(false); //spinner for loading when the button is pressed.
  const [flowRate, setFlowRate] = useState("");
  const [flowRateDisplay, setFlowRateDisplay] = useState("");
  const [txLoading, setTxLoading] = useState(false); //transaction loading progress bar
  const [txCompleted, setTxCompleted] = useState(false); //confirmation message after transaction has been broadcasted.
  const [txHash, setTxHash] = useState(""); //transaction hash for broadcasted transactions
  const [txMsg, setTxMsg] = useState("");

  //convert wei/sec to fDAIx/month
  function calculateFlowRate(amount) {
    if (typeof Number(amount) !== "number" || isNaN(Number(amount)) === true) {
      alert("You can only calculate a flowRate based on a number");
      return;
    } else if (typeof Number(amount) === "number") {
      if (Number(amount) === 0) {
        return 0;
      }
      const amountInWei = ethers.BigNumber.from(amount);
      const monthlyAmount = ethers.utils.formatEther(amountInWei.toString());
      const calculatedFlowRate = monthlyAmount * 3600 * 24 * 30;
      return calculatedFlowRate;
    }
  }

  function CreateButton({ children, ...props }) {
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

  const handleFlowRateChange = (e) => {
    try {
      setFlowRate(() => ([e.target.name] = e.target.value));
      let newFlowRateDisplay = calculateFlowRate(e.target.value);
      setFlowRateDisplay(newFlowRateDisplay.toString());
    } catch {
      console.error("Flowrate invalid.")
    }
  };

  return (
    <div className="createFlowContainer">
      <Card sx={{ width: "60%", borderRadius: "15px", marginLeft: "auto", marginRight: "auto"}}>
        <CardContent>
          {
            txLoading
            ? <Typography variant="h6" component="div" sx={{marginTop: "20px", color: "#424242"}}>Create Stream</Typography>
            : <Typography variant="h6" component="div" sx={{marginTop: "20px"}}>Create Stream</Typography>
          }

          <Form className="createFlowForm">
            <FormGroup className="mb-3">
              <TextField 
                name="recipient"
                value={recipient}
                onChange={handleRecipientChange}
                placeholder="Recipient wallet address"
                color="success"
                sx={{width: "70%", marginBottom: "5px"}}
              /> 
            </FormGroup>

            <FormGroup className="mb-3">
              <TextField 
                name="flowRate"
                value={flowRate}
                onChange={handleFlowRateChange}
                placeholder="Flow rate in wei/second"
                color="success"
                sx={{width: "70%", marginBottom: "10px"}}
              />
            </FormGroup>
            
            {
              recipient == "" || flowRate == "" || txLoading
              ? <Button variant="outlined" color="success" disabled sx={{textTransform: "none"}}>Create</Button>
              : <CreateButton
                  onClick={() => {
                    createNewFlow(recipient, flowRate, setTxLoading, setTxCompleted, setTxHash, setTxMsg);
                    setRecipient('');
                    setFlowRate('');
                  }}
                >
                  Create
                </CreateButton>
            }
          </Form>
        </CardContent>
      </Card>

      {
        txLoading
        ? <TxModal txMsg={txMsg}/>
        : <div className="displayNone"/>
      }

      <SnackBar openSnackBar={txCompleted} setOpenSnackBar={setTxCompleted}>
        {"Transaction successful! View on block explorer "}
        <a href={`https://goerli.etherscan.io/tx/${txHash}`}>here</a>.
      </SnackBar>

      {/*
      <h3>Create Stream</h3>
      <Form className="createFlowForm">
        <FormGroup className="mb-3">
          <FormControl
            name="recipient"
            value={recipient}
            onChange={handleRecipientChange}
            placeholder="Enter recipient address"
          ></FormControl>
        </FormGroup>
        <FormGroup className="mb-3">
          <FormControl
            name="flowRate"
            value={flowRate}
            onChange={handleFlowRateChange}
            placeholder="Enter a flowRate in wei/second"
          ></FormControl>
        </FormGroup>
        <CreateButton
          onClick={() => {
            setIsButtonLoading(true);
            createNewFlow(recipient, flowRate);
            setTimeout(() => {
              setIsButtonLoading(false);
            }, 1000);
          }}
        >
          Create Stream
        </CreateButton>
      </Form>

      <div className="createFlowCalculation">
        <p>Your flow will be equal to:</p>
        <p>
          <b>${flowRateDisplay !== " " ? flowRateDisplay : 0}</b> DAIx/month
        </p>
        </div>*/}
    </div>
  );
};
