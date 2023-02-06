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
import { TxModal } from "./Modal";
import { SnackBar } from "./Snackbar";
import "../css/stream.css";
//import { width } from "@mui/system";

const intervals = [
  {
    value: 'month',
    label: '/ month',
  },
  {
    value: 'day',
    label: '/ day',
  },
  {
    value: 'hour',
    label: '/ hour',
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

async function createNewFlow(recipient, flowRate, setTxLoading, setTxCompleted, setTxMsg) {

  console.log(recipient);

  if (typeof window.provider == 'undefined') {
    console.log('Retrieving provider & signer.')
    window.provider = new ethers.providers.Web3Provider(window.ethereum);
    console.log(window.provider);

    window.signer = window.provider.getSigner();
    console.log(window.signer);

    window.sf = await Framework.create({
      chainId: Number(chainId),
      provider: window.provider
    });
  }

  const chainId = await window.ethereum.request({ method: "eth_chainId" });

  const fDAIxContract = await window.sf.loadSuperToken("fDAIx");
  const fDAIx = fDAIxContract.address;

  const accounts = await ethereum.request({ method: "eth_accounts" });
  const account = accounts[0];

  try {
    const createFlowOperation = window.sf.cfaV1.createFlow({
      sender: account, 
      receiver: recipient,
      flowRate: flowRate,
      superToken: fDAIx
      // userData?: string
    });

    console.log("Creating your stream...");
    setTxLoading(true);
    setTxMsg("Transaction being broadcasted...");

    const createTxn = await createFlowOperation.exec(window.signer);
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
      //setTxHash(tx.transactionHash);
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
  const [interval, setInterval] = useState("month");
  const [txLoading, setTxLoading] = useState(false); //transaction loading progress bar
  const [txCompleted, setTxCompleted] = useState(false); //confirmation message after transaction has been broadcasted.
  //const [txHash, setTxHash] = useState(""); //transaction hash for broadcasted transactions
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
      var flowRate = 0;

      if(period == "hour"){
        console.log(Math.round(formattedAmount/3600));
        flowRate = Math.round(formattedAmount/3600);
      }
      else if(period == "day"){
        flowRate = Math.round(formattedAmount/3600/24);
      }
      else if(period == "month"){
        flowRate = Math.round(formattedAmount/3600/24/30);
      }

      if(flowRate == 0){
        alert("The flowrate is too small. Enter a greater amount.");
        return;
      }

      if (flowRate > Number.MAX_SAFE_INTEGER){
        //max safe integer is 2^53-1, 9007199254740000.
        //Amount greater than 32.425917/hour, 778.22202/day, and 2334666.66/month will throw an overflow error.
        alert("The flowrate cannot exceed the maximum safe integer value (32/hr, 778/day, 23346/month). Enter a smaller amount. ");
        return;
      }

      return flowRate;
    }
  }

  function CreateButton({ children, ...props }) {
    return (
      <Button 
        variant="contained"
        color="primary"
        sx={{
          height: "45px",
          width: "100%",
          color: "white",
          textTransform: "none",
          fontFamily: 'Lato',
          fontWeight: "700",
          ":hover": {borderColor: "primary"}
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
    } catch {
      console.error("Flowrate invalid.");
    }
  };

  const handleIntervalChange = (e) => {
    setInterval(() => ([e.target.name] = e.target.value));
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
              ? <h5 sx={{color: "#424242"}}>Send Stream</h5>
              : <h5>Send Stream</h5>
            }
            </div>

            <Form className="flowForm">
              <FormGroup>
                <TextField
                  label="recipient wallet address"
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
                    label="amount"
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

            <div className="flowButtonContainer">
            {
              recipient == "" || flowRate == "" || txLoading
              ? <Button variant="contained" disabled 
                sx={{textTransform:"none", 
                  width:"100%", 
                  height:"45px", 
                  fontFamily:'Lato',
                }}>
                  Send Stream
                </Button>
              : <CreateButton
                  onClick={() => {
                    createNewFlow(recipient, calculateFlowRate(flowRate, interval), setTxLoading, setTxCompleted, setTxMsg);
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
