//Modified code from: https://docs.superfluid.finance/superfluid/developers/constant-flow-agreement-cfa/money-streaming-1
import React, { useEffect, useState } from "react";
import { customHttpProvider } from "../config";
import { Framework } from "@superfluid-finance/sdk-core";
import { ethers } from "ethers";
import { daiABI } from "../config";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Form, FormGroup } from "react-bootstrap";
import { SnackBar } from "./Snackbar";
import { TxModal } from "./Modal";
import { InputAdornment } from '@mui/material';
import { MenuItem } from "@mui/material";
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import "../css/wrapUnwrap.css";
import ether from '../img/ether.png';
import dai from '../img/dai.png';

//Token Contract Addresses (can be found here: https://docs.superfluid.finance/superfluid/developers/networks)
const fDAI_contract_address = "0x88271d333C72e51516B67f5567c728E702b3eeE8";
const fDAIx_contract_address = "0xF2d68898557cCb2Cf4C10c3Ef2B034b2a69DAD00";
const ETH_contract_address = "0x0000000000000000000000000000000000000000";
const ETHx_contract_address = "0x5943F705aBb6834Cad767e6E4bB258Bc48D9C947";

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
async function daiUpgrade(amt, token, setTxLoading, setTxCompleted, setTxHash, setTxMsg) {

  const sf = await Framework.create({
    chainId: 5,
    provider: customHttpProvider
  });

  const provider = new ethers.providers.Web3Provider(window.ethereum);

  const signer = provider.getSigner();
  var superToken = '';
  if (token == "fDAIx"){
    superToken = await sf.loadSuperToken("fDAIx");
  }
  else{
    superToken = await sf.loadSuperToken("ETHx");
  }

  try {
    console.log(`upgrading ${amt} ${token}`);
    setTxLoading(true);
    setTxMsg("Transaction being broadcasted...");
    
    const amtToUpgrade = ethers.utils.parseEther(amt.toString());
    const upgradeOperation = superToken.upgrade({
      amount: amtToUpgrade.toString()
    });

    const upgradeTxn = await upgradeOperation.exec(signer);
    await upgradeTxn.wait().then(function (tx) {
      console.log(
        `
        Congrats - you've just upgraded to ${token}
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
      setTxHash(txHash);
    });
  } catch (error) {
    console.error(error);
    setTxLoading(false);
  }
}

export const Wrap = (props) => {
  const [amount, setAmount] = useState("");
  const [exceedsAllowance, setExceedsAllowance] = useState(false); //checks if the number of tokens to wrap exceeds allowance
  const [txLoading, setTxLoading] = useState(false); //transaction loading progress bar
  const [txCompleted, setTxCompleted] = useState(false); //confirmation message after transaction has been broadcasted.
  const [txHash, setTxHash] = useState(""); //transaction hash for broadcasted transactions
  const [txMsg, setTxMsg] = useState("");
  const [token, setToken] = useState("ETHx");

  useEffect(() => {
    getAllowance();
    if(amount > allowance && token == "fDAIx"){
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
        ? <Button variant="contained"
          disabled 
          sx={{
            textTransform: "none",
            width:"100%", 
            height:"45px", 
            fontFamily:'Lato',
          }}>
            {children}
          </Button>
        : <Button 
            variant="contained" 
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
      }
      </div>
    );
  }

  function ApproveButton({ children, ...props }) {
    return (
      <>
        {        
          txLoading || amount == ""
          ? <Button variant="contained" 
              disabled 
              sx={{
                textTransform: "none",
                width:"100%", 
                height:"45px", 
                fontFamily:'Lato',
              }}
            >
              {children}
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
              ":hover": {borderColor: "primary.main"}
            }}
            {...props}
          >
            {children}
          </Button>
        }
      </>
    );
  }

  const handleAmountChange = (e) => {
    setAmount(() => ([e.target.name] = e.target.value));
  };

  const handleTokenChange = (e) => {
    setToken(() => ([e.target.name] = e.target.value));
  };

  return (
    <>
      <div className="wrapUnwrapContainer">
        <div className="wrapToggle">
          <ToggleButtonGroup
            color="success"
            value={props.alignment}
            exclusive
            onChange={props.handleToggleChange}
            aria-label="Platform"
          >
            <ToggleButton value="wrap" sx={{textTransform: "none"}}>Wrap</ToggleButton>
            <ToggleButton value="unwrap" sx={{textTransform: "none"}}>Unwrap</ToggleButton>
          </ToggleButtonGroup>
        </div>

        <Card className="wrapCard" 
          sx={{
            bgcolor: "secondary.dark",
            borderRadius: "20px",
          }}>
          <CardContent>
            <div className="titleContainer">
              <div className="wrapTitle">{txLoading ? <h5 sx={{color: "#424242"}}>Wrap</h5> : <h5>Wrap</h5>}</div>
              <Form className="token">
                <FormGroup>
                  <TextField 
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
                      ETH
                    </MenuItem>
                    <MenuItem key={'fDAIx'} value={'fDAIx'}>
                      fDAI
                    </MenuItem>
                  </TextField>
                </FormGroup>
              </Form>
            </div>

            <Form className="wrapForm">
              <FormGroup>
                <TextField 
                  name="amount"
                  label="amount"
                  value={amount}
                  onChange={handleAmountChange}
                  placeholder={token == "fDAIx" ? "fDAI" : "ETH"}
                  color="success"
                  sx={{width: "100%"}}
                />
              </FormGroup>
            </Form>
            
            {
              token == "fDAIx"
              ? <p>fDAI <FontAwesomeIcon icon={faArrowRight} className="arrow"/> fDAIx</p> 
              : <p>ETH <FontAwesomeIcon icon={faArrowRight} className="arrow"/> ETHx</p>
            }

            <div className="wrapButtonContainer">
            {
              //display approve button if exceedsAllowance, display upgrade button if not.
              exceedsAllowance 
              ? <div>
                <ApproveButton
                  onClick={() => {
                    daiApprove(amount, token, setTxLoading, setTxCompleted, setTxHash, setTxMsg);
                    setAmount("");
                  }}
                >
                  Allow protocol to wrap your fDAI
                </ApproveButton>
                <p className="wrapMessage">The protocol can currently wrap up to {allowance} tokens</p>
              </div>
              : <UpgradeButton
                  onClick={() => {
                    daiUpgrade(amount, token, setTxLoading, setTxCompleted, setTxHash, setTxMsg);
                    setAmount("");
                  }}
                >
                  Wrap
                </UpgradeButton>
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
        {"Your transaction has been boradcasted! View on block explorer "}
        <a href={`https://goerli.etherscan.io/tx/${txHash}`}>here</a>.
      </SnackBar>
    </>
  );
};
