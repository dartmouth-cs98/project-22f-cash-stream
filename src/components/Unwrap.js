//Modified code from: https://docs.superfluid.finance/superfluid/developers/constant-flow-agreement-cfa/money-streaming-1
import React, { useState } from "react";
import { customHttpProvider } from "../config";
import { Framework } from "@superfluid-finance/sdk-core";
import { ethers } from "ethers";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Form, FormGroup } from "react-bootstrap";
import { SnackBar } from "./Snackbar";
import { TxModal } from "./Modal";
import axios from 'axios';
import "../css/wrapUnwrap.css";

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

//Token Contract Addresses (can be found here: https://docs.superfluid.finance/superfluid/developers/networks)
const fDAIx_contract_address = "0xF2d68898557cCb2Cf4C10c3Ef2B034b2a69DAD00";

//where the Superfluid logic takes place
async function daiDowngrade(amt, setTxLoading, setTxCompleted, setTxHash, setTxMsg) {
  const sf = await Framework.create({
    chainId: 5,
    provider: customHttpProvider
  });

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();

  const fDAIx = await sf.loadSuperToken(fDAIx_contract_address);
  console.log(fDAIx.address);

  try {
    console.log(`Downgrading ${amt} fDAIx...`);
    setTxLoading(true);
    setTxMsg("Transaction being broadcasted...");

    const amtToDowngrade = ethers.utils.parseEther(amt.toString());
    const downgradeOperation = fDAIx.downgrade({
      amount: amtToDowngrade.toString()
    });

    const downgradeTxn = await downgradeOperation.exec(signer);
    await downgradeTxn.wait().then(function (tx) {
      console.log(
        `
        Congrats - you've just downgraded fDAIx to fDAI!
        You can see this tx at https://goerli.etherscan.io/tx/${tx.transactionHash}
        Network: Goerli
        NOTE: you downgraded the dai of 0xDCB45e4f6762C3D7C61a00e96Fb94ADb7Cf27721.
        You can use this code to allow your users to do it in your project.
        Or you can downgrade tokens at app.superfluid.finance/dashboard.
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
    setTxLoading(false);
  }
}

export const Unwrap = () => {
  const [amount, setAmount] = useState("");
  //const [isDowngradeButtonLoading, setIsDowngradeButtonLoading] = useState(false);
  const [txLoading, setTxLoading] = useState(false); //transaction loading progress bar
  const [txCompleted, setTxCompleted] = useState(false); //confirmation message after transaction has been broadcasted.
  const [txHash, setTxHash] = useState(""); //transaction hash for broadcasted transactions
  const [txMsg, setTxMsg] = useState("");

  function DowngradeButton({ isLoading, children, ...props }) {
    return (
      <div>
        {
          txLoading || amount == ""
          ? <Button variant="outlined" color="success" disabled sx={{textTransform: "none"}}>{children}</Button>
          : <Button variant="outlined" 
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
        }
      </div>
    );
  }

  const handleAmountChange = (e) => {
    setAmount(() => ([e.target.name] = e.target.value));
  };

  return (
    <div className="unwrapContainer">
      <Card sx={{ width: "60%", borderRadius: "15px", marginLeft: "auto", marginRight: "auto"}}>
        <CardContent>
        {
            txLoading
            ? <Typography variant="h6" component="div" sx={{marginTop: "20px", color: "#424242"}}>Unwrap</Typography>
            : <Typography variant="h6" component="div" sx={{marginTop: "20px"}}>Unwrap</Typography>
          }
          <Form>
            <FormGroup className="unwrapForm">
              <TextField 
                name="amount"
                value={amount}
                onChange={handleAmountChange}
                placeholder="0.0"
                color="success"
                sx={{width: "70%", marginBottom: "10px"}}
              />
            </FormGroup>
            <p>
              <DowngradeButton
                onClick={() => {
                  daiDowngrade(amount, setTxLoading, setTxCompleted, setTxHash, setTxMsg);
                  setAmount("");
                }}
              >
                Unwrap fDAIx to fDAI
              </DowngradeButton>
            </p>
          </Form>
        </CardContent>
      </Card>

      {
        txLoading
        ? <TxModal txMsg={txMsg}/>
        : <div className="displayNone"/>
      }

      <SnackBar openSnackBar={txCompleted} setOpenSnackBar={setTxCompleted}>
        {"Your transaction has been boradcasted! View on block explorer "}
        <a href={`https://goerli.etherscan.io/tx/${txHash}`}>here</a>.
      </SnackBar>

      {/*
      <h3>Unwrap Token</h3>
      <Form>
        <FormGroup className="unwrapForm">
          <FormControl
            name="amount"
            value={amount}
            onChange={handleAmountChange}
            placeholder="0"
          ></FormControl>
        </FormGroup>

        <DowngradeButton
          onClick={() => {
            setIsDowngradeButtonLoading(true);
            daiDowngrade(amount);
            setTimeout(() => {
              setIsDowngradeButtonLoading(false);
            }, 1000);
          }}
        >
          Unwrap fDAIx to fDAI
        </DowngradeButton>
      </Form>
      */}
    </div>
  );
};
