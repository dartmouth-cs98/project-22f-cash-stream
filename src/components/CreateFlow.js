//Modified code from: https://docs.superfluid.finance/superfluid/developers/constant-flow-agreement-cfa/money-streaming-1
import React, { useState } from "react";
import { Framework } from "@superfluid-finance/sdk-core";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import { MenuItem } from "@mui/material";
import Button from '@mui/material/Button';
import { Typography } from '@mui/material';
import { Form, FormGroup } from "react-bootstrap";
import { ethers } from "ethers";
import axios from 'axios';
import { TxModal } from "./Modal";
import { SnackBar } from "./Snackbar";
import { InputAdornment } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import ether from '../img/ether.png';
import dai from '../img/dai.png';
import store from '../app/store'
import "../css/stream.css";

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

async function createNewFlow(recipient, flowRate, token, setTxLoading, setTxCompleted, setTxMsg) {

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
    const createFlowOperation = sf.cfaV1.createFlow({
      sender: account, 
      receiver: recipient,
      flowRate: flowRate,
      superToken: superToken
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
        Token: ${token},
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

async function saveName(token, address, name){
  if (token == 'ETHx'){
    var contact = localStorage.getItem('ETHx_contact');
    var parsed_contact = JSON.parse(contact);
    var exists = false;

    for(const item of parsed_contact){
      if(typeof item[address] !== "undefined"){
        item[address] = name
        exists = true;
      }
    }
    if(!exists){
      parsed_contact.push({[address]: name})
    }

    localStorage.setItem('ETHx_contact', JSON.stringify(parsed_contact));
  }

  else if (token == 'fDAIx'){
    var contact = localStorage.getItem('fDAIx_contact');
    var parsed_contact = JSON.parse(contact);
    var exists = false;

    for(const item of parsed_contact){
      if(typeof item[address] !== "undefined"){
        item[address] = name
        exists = true;
      }
    }
    if(!exists){
      parsed_contact.push({[address]:name})
    }
    localStorage.setItem('fDAIx_contact', JSON.stringify(parsed_contact));
  }
}

export const CreateFlow = (props) => {
  const [recipient, setRecipient] = useState("");
  const [flowRate, setFlowRate] = useState("");
  const [interval, setInterval] = useState("month");
  const [token, setToken] = useState("ETHx");
  const [txLoading, setTxLoading] = useState(false); //transaction loading progress bar
  const [txCompleted, setTxCompleted] = useState(false); //confirmation message after transaction has been broadcasted.
  const [txMsg, setTxMsg] = useState("");
  const [lowBalance, setLowBalance] = useState(false);
  const [name, setName] = useState("");
  
  function checkLowBalance(token, amount, period){
    if (typeof Number(amount) !== "number" || isNaN(Number(amount)) === true) {
      return;
    }

    let buffer = amount
    
    if(period == "month"){
      buffer = buffer/30;
    }
    else if(period == "day"){
      buffer = buffer/30/24;
    }

    if(token == 'ETHx' && buffer > props.ETHxBalance){
      console.log("balance is low!")
      setLowBalance(true);
    }
    else if(token == 'fDAIx' && buffer > props.fDAIxBalance){
      console.log("balance is low!")
      setLowBalance(true);
    }
    else{
      setLowBalance(false);
    }
  }

  function calculateFlowRate(amount, period){
    if (typeof Number(amount) !== "number" || isNaN(Number(amount)) === true) {
      alert("You can only calculate a flowRate based on a number");
      return;
    }
    else{
      if (Number(amount) === 0) {
        return 0;
      }

      const formattedAmount = amount * Math.pow(10, 18);
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
        alert("The flowrate cannot exceed the maximum safe integer value (32/hr, 778/day, 23346/month). Enter a smaller amount.");
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
      checkLowBalance(token, e.target.value, interval);
    } catch {
      alert("Enter a valid flowrate.");
      console.error("Flowrate invalid.");
    }
  };
  
  const handleTokenChange = (e) => {
    setToken(() => ([e.target.name] = e.target.value));
  };

  const handleIntervalChange = (e) => {
    setInterval(() => ([e.target.name] = e.target.value));
  };

  const handleNameChange = (e) => {
    setName(() => ([e.target.name] = e.target.value));
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
            <div className="titleContainer">
              <div className="flowTitle">{txLoading ? <h5 sx={{color: "#424242"}}>Send Stream</h5> : <h5>Send Stream</h5>}</div>
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
                    <MenuItem key={'ETHx'} value={'ETHx'}>ETHx</MenuItem>
                    <MenuItem key={'fDAIx'} value={'fDAIx'}>fDAIx</MenuItem>
                  </TextField>
                </FormGroup>
              </Form>
            </div>

            <Form className="flowForm">
              <FormGroup>
                <TextField
                  label="stream name"
                  name="recipient"
                  value={name}
                  onChange={handleNameChange}
                  placeholder="untitled stream"
                  color="success"
                  sx={{width: "100%", marginBottom: '3%'}}
                /> 
              </FormGroup>

              <FormGroup>
                <TextField
                  label="recipient wallet address"
                  name="recipient"
                  value={recipient}
                  onChange={handleRecipientChange}
                  placeholder="0x00..."
                  color="success"
                  sx={{width: "100%"}}
                /> 
              </FormGroup>

              <div className="flowRateForm">
                <FormGroup className="flowAmount">
                  <TextField
                    label="amount"
                    name="flowRate"
                    value={flowRate}
                    onChange={handleFlowRateChange}
                    placeholder={token === "ETHx"?"ETHx":"fDAIx"}
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
            
            {
              lowBalance
              ? <div>
                <Typography sx={{fontSize: 15}} gutterBottom>You don't have enough balance to initate this stream.</Typography>
                <Typography sx={{fontSize: 12, marginBottom: '25px'}} gutterBottom>Your balance should be greater than the upfront buffer (1 hour flowrate)</Typography>
              </div>
              : <></>
            }

            <div className="flowButtonContainer">
            {
              recipient == "" || flowRate == "" || txLoading || lowBalance
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
                    createNewFlow(recipient, calculateFlowRate(flowRate, interval), token, setTxLoading, setTxCompleted, setTxMsg);
                    saveName(token, recipient.toLowerCase(), name)
                    setName('');
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
