//Modified code from: https://docs.superfluid.finance/superfluid/developers/constant-flow-agreement-cfa/money-streaming-1
import React, { useState } from "react";
import { Framework } from "@superfluid-finance/sdk-core";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
//import Typography from '@mui/material/Typography';
import { MenuItem } from "@mui/material";
import Button from '@mui/material/Button';
import { Form, FormGroup } from "react-bootstrap";
import { ethers } from "ethers";
import axios from 'axios';
import { SnackBar } from "./Snackbar";
import { TxModal } from "./Modal";
import "../css/stream.css";
//import { width } from "@mui/system";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { typography } from "@mui/system";

const theme = createTheme({
  palette: {
    success: {
      main: '#10bb35',
    },
  },
});

const intervals = [
  {
    value: 'hour',
    label: '/ hour',
  },
  {
    value: 'day',
    label: '/ day',
  },
  {
    value: 'month',
    label: '/ month',
  },
];

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
  const [flowRate, setFlowRate] = useState("");
  const [interval, setInterval] = useState("hour");
  const [txLoading, setTxLoading] = useState(false); //transaction loading progress bar
  const [txCompleted, setTxCompleted] = useState(false); //confirmation message after transaction has been broadcasted.
  const [txHash, setTxHash] = useState(""); //transaction hash for broadcasted transactions
  const [txMsg, setTxMsg] = useState("");
  
  function calculateFlowRate(amount, period){
    if (typeof Number(amount) !== "number" || isNaN(Number(amount)) === true) {
      alert("You can only calculate a flowRate based on a number");
      return;
    }
    else{
      if (Number(amount) === 0) {
        return 0;
      }
      const amountBN = ethers.BigNumber.from(amount);
      const formattedAmount = ethers.utils.parseEther(amountBN.toString());

      if(period == "hour"){
        console.log(Math.round(formattedAmount/3600));
        return Math.round(formattedAmount/3600);
      }
      else if(period == "day"){
        return Math.round(formattedAmount/3600/24);
      }
      else if(period == "month"){
        return Math.round(formattedAmount/3600/24/30);
      }
    }
  }

  function CreateButton({ children, ...props }) {
    return (
      <ThemeProvider theme={theme}>
        <Button variant="contained"
          color="success"
          sx={{
            height: "45px",
            width: "100%",
            color: "white",
            textTransform: "none",
            fontFamily: 'Lato',
            fontWeight: "700",
            ":hover": {borderColor: "success.main"}
          }}
          {...props}
        >
          {children}
        </Button>
      </ThemeProvider>
    );
  }

  const handleRecipientChange = (e) => {
    setRecipient(() => ([e.target.name] = e.target.value));
  };

  const handleFlowRateChange = (e) => {
    try {
      setFlowRate(() => ([e.target.name] = e.target.value));
    } catch {
      console.error("Flowrate invalid.");
    }
  };

  const handleIntervalChange = (e) => {
    setInterval(() => ([e.target.name] = e.target.value));
  };

  return (
    <div>
      <Card className="createFlowCard" sx={{borderRadius: "20px"}}>
        <CardContent>
          <div className="createFlowTitle">
          {
            txLoading
            ? <h5 sx={{color: "#424242"}}>Send Stream</h5>
            : <h5>Send Stream</h5>
          }
          </div>

          <Form className="createFlowForm">
            <FormGroup>
              <TextField
                label="Recipient Wallet Address"
                name="recipient"
                value={recipient}
                onChange={handleRecipientChange}
                placeholder="0x00..."
                color="success"
                sx={{width: "100%", fontFamily: "Inter"}}
              /> 
            </FormGroup>

            <div className="flowRateForm">
              <FormGroup className="flowAmount">
                <TextField
                  label="Amount"
                  name="flowRate"
                  value={flowRate}
                  onChange={handleFlowRateChange}
                  placeholder="fDAIx"
                  color="success"
                  sx={{width: "100%"}}
                />
              </FormGroup>

              <FormGroup className="flowInterval">
                <TextField 
                  select
                  defaultValue="hour"
                  value={interval}
                  onChange={handleIntervalChange}
                  color="success"
                  sx={{width: "100%"}}
                >
                  {
                    intervals.map((option) => (
                      <MenuItem key={option.value} value={option.value}> {option.label}</MenuItem>
                    ))
                  }
                </TextField>
              </FormGroup>
            </div>
          </Form>

          <div className="createButtonContainer">
          {
            recipient == "" || flowRate == "" || txLoading
            ? <Button variant="contained" disabled 
              sx={{textTransform:"none", 
                width:"100%", 
                height:"45px", 
                fontFamily:'Lato', 
                fontWeight:'700',
              }}>
                Send Stream
              </Button>
            : <CreateButton
                onClick={() => {
                  createNewFlow(recipient, calculateFlowRate(flowRate, interval), setTxLoading, setTxCompleted, setTxHash, setTxMsg);
                  setRecipient('');
                  setFlowRate('');
                }}
              >
                Send Stream
              </CreateButton>        
          }
          </div>
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
    </div>
  );
};
