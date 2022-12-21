//Modified code from: https://docs.superfluid.finance/superfluid/developers/constant-flow-agreement-cfa/money-streaming-1
import React, { useEffect, useState } from "react";
import { customHttpProvider } from "../config";
import { Framework } from "@superfluid-finance/sdk-core";
import { ethers } from "ethers";
import { daiABI } from "../config";
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

//Token Contract Addresses (can be found here: https://docs.superfluid.finance/superfluid/developers/networks)
const fDAI_contract_address = "0x88271d333C72e51516B67f5567c728E702b3eeE8";
const fDAIx_contract_address = "0xF2d68898557cCb2Cf4C10c3Ef2B034b2a69DAD00";
let allowance = "0"; //number of tokens the protocol is allowed to wrap
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

function convertWeitofDAIx(wei){
  return wei * Math.pow(10, -18);
}

async function getAllowance(){
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  
//note that this abi is the one found here: https://goerli.etherscan.io/address/0x88271d333C72e51516B67f5567c728E702b3eeE8
  const fDAI = new ethers.Contract(
    fDAI_contract_address,
    daiABI,
    signer
  );

  const accounts = await ethereum.request({ method: "eth_accounts" });
  const account = accounts[0];
  
  try{
    await fDAI.allowance(
      account,
      fDAIx_contract_address,
    ).then((value) => {
       allowance = convertWeitofDAIx(parseInt(value.toString()));
    });
  } catch (error){
    console.log(error);
  }
}

//this function increases the allowance if the number of tokens being wrapped is greater than allowance
async function daiApprove(amt, setTxLoading, setTxCompleted, setTxHash, setTxMsg) {
  const sf = await Framework.create({
    chainId: 5,
    provider: customHttpProvider
  });

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();

  //note that this abi is the one found here: https://goerli.etherscan.io/address/0x88271d333C72e51516B67f5567c728E702b3eeE8
  const fDAI = new ethers.Contract(
    fDAI_contract_address,
    daiABI,
    signer
  );

  try {
    console.log("approving DAI spend");
    setTxLoading(true);
    setTxMsg("Transaction being broadcasted...");

    await fDAI.approve(
      fDAIx_contract_address,
      ethers.utils.parseEther(amt.toString())
    ).then(function (tx) {
      console.log(
        `Congrats, you just approved your DAI spend. You can see this tx at https://goerli.etherscan.io/tx/${tx.hash}`
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
      setTxHash(tx.hash);
    });
  } catch (error) {
    console.error(error);
    setTxLoading(false);
  }
}

//wrap tokens to supertokens
async function daiUpgrade(amt, setTxLoading, setTxCompleted, setTxHash, setTxMsg) {

  const sf = await Framework.create({
    chainId: 5,
    provider: customHttpProvider
  });

  const provider = new ethers.providers.Web3Provider(window.ethereum);

  const signer = provider.getSigner();
  const DAIx = await sf.loadSuperToken("fDAIx");

  try {
    console.log(`upgrading ${amt} DAI to DAIx`);
    setTxLoading(true);
    setTxMsg("Transaction being broadcasted...");
    
    const amtToUpgrade = ethers.utils.parseEther(amt.toString());
    const upgradeOperation = DAIx.upgrade({
      amount: amtToUpgrade.toString()
    });

    const upgradeTxn = await upgradeOperation.exec(signer);
    await upgradeTxn.wait().then(function (tx) {
      console.log(
        `
        Congrats - you've just upgraded DAI to DAIx!
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
      setTxHash(tx.hash);
    });
  } catch (error) {
    console.error(error);
    setTxLoading(false);
  }
}

export const Wrap = () => {
  const [amount, setAmount] = useState("");
  //const [isUpgradeButtonLoading, setIsUpgradeButtonLoading] = useState(false);
  //const [isApproveButtonLoading, setIsApproveButtonLoading] = useState(false);
  const [exceedsAllowance, setExceedsAllowance] = useState(false); //checks if the number of tokens to wrap exceeds allowance
  const [txLoading, setTxLoading] = useState(false); //transaction loading progress bar
  const [txCompleted, setTxCompleted] = useState(false); //confirmation message after transaction has been broadcasted.
  const [txHash, setTxHash] = useState(""); //transaction hash for broadcasted transactions
  const [txMsg, setTxMsg] = useState("");

  useEffect(() => {
    getAllowance();
    if(amount > allowance){
      setExceedsAllowance(true);
    }
    else{
      setExceedsAllowance(false);
    }
  }, [amount]);

  function UpgradeButton({ children, ...props }) {
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

  function ApproveButton({ children, ...props }) {
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
    <div className="wrapContainer">
      <Card sx={{ width: "60%", borderRadius: "15px", marginLeft: "auto", marginRight: "auto"}}>
        <CardContent>
        {
            txLoading
            ? <Typography variant="h6" component="div" sx={{marginTop: "20px", color: "#424242"}}>Wrap</Typography>
            : <Typography variant="h6" component="div" sx={{marginTop: "20px"}}>Wrap</Typography>
          }
          <Form>
            <FormGroup className="wrapForm">
              <TextField 
                name="amount"
                value={amount}
                onChange={handleAmountChange}
                placeholder="0.0"
                color="success"
                sx={{width: "70%", marginBottom: "10px"}}
              />
            </FormGroup>

            { 
              //display approve button if exceedsAllowance, display upgrade button if not.
              exceedsAllowance 
              ? <div>
                <ApproveButton
                  onClick={() => {
                    daiApprove(amount, setTxLoading, setTxCompleted, setTxHash, setTxMsg);
                    setAmount("");
                  }}
                >
                  Allow protocol to wrap your fDAI
                </ApproveButton>
                <p className="wrapMessage">The protocol can currently wrap up to {allowance} tokens</p>
              </div>
              : <p>
                <UpgradeButton
                  onClick={() => {
                    daiUpgrade(amount, setTxLoading, setTxCompleted, setTxHash, setTxMsg);
                    setAmount("");
                  }}
                >
                  Wrap fDAI to fDAIx
                </UpgradeButton>
              </p>
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
        {"Your transaction has been boradcasted! View on block explorer "}
        <a href={`https://goerli.etherscan.io/tx/${txHash}`}>here</a>.
      </SnackBar>

      {/*
      <h3>Wrap Token</h3>
      <Form>
        <FormGroup className="wrapForm">
          <FormControl
            name="amount"
            value={amount}
            onChange={handleAmountChange}
            placeholder="0"
          ></FormControl>
        </FormGroup>
        {
          exceedsAllowance ? 
          <p>
            <ApproveButton
              onClick={() => {
                setIsApproveButtonLoading(true);
                daiApprove(amount);
                setTimeout(() => {
                  setIsApproveButtonLoading(false);
                }, 1000);
              }}
            >
            Allow protocol to wrap your fDAI
            </ApproveButton>
            <p className="wrapMessage">The protocol can currently wrap up to {allowance} tokens</p>
          </p>: 
          <p>
            <UpgradeButton
              onClick={() => {
                setIsUpgradeButtonLoading(true);
                daiUpgrade(amount);
                setTimeout(() => {
                  setIsUpgradeButtonLoading(false);
                }, 1000);
              }}
            >
            Wrap fDAI to fDAIx
            </UpgradeButton>
          </p>
        }
      </Form>
      */}
    </div>
  );
};
