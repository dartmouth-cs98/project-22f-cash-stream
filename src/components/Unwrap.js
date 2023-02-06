//Modified code from: https://docs.superfluid.finance/superfluid/developers/constant-flow-agreement-cfa/money-streaming-1
import React, { useState } from "react";
import { customHttpProvider } from "../config";
import { Framework } from "@superfluid-finance/sdk-core";
import { ethers } from "ethers";
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
import "../css/stream.css";
import ether from '../img/ether.png';
import dai from '../img/dai.png';

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
const ETHx_contract_address = "0x5943F705aBb6834Cad767e6E4bB258Bc48D9C947";

//where the Superfluid logic takes place
async function daiDowngrade(amt, token, setTxLoading, setTxCompleted, setTxHash, setTxMsg) {
  const sf = await Framework.create({
    chainId: 5,
    provider: customHttpProvider
  });

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();

  var superToken = '';
  if (token == "fDAIx"){
    superToken = await sf.loadSuperToken(fDAIx_contract_address);
  }
  else{
    superToken = await sf.loadSuperToken(ETHx_contract_address);
  }

  try {
    console.log(`Downgrading ${amt} ${token}...`);
    setTxLoading(true);
    setTxMsg("Transaction being broadcasted...");

    const amtToDowngrade = ethers.utils.parseEther(amt.toString());
    const downgradeOperation = superToken.downgrade({
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
      setTxHash(txHash);
    });
  } catch (error) {
    console.error(error);
    setTxLoading(false);
  }
}

export const Unwrap = (props) => {
  const [amount, setAmount] = useState("");
  const [txLoading, setTxLoading] = useState(false); //transaction loading progress bar
  const [txCompleted, setTxCompleted] = useState(false); //confirmation message after transaction has been broadcasted.
  const [txHash, setTxHash] = useState(""); //transaction hash for broadcasted transactions
  const [txMsg, setTxMsg] = useState("");
  const [token, setToken] = useState("ETHx");

  function DowngradeButton({ isLoading, children, ...props }) {
    return (
      <div>
        {
          txLoading || amount == ""
          ? <Button 
              variant="contained" 
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
              <div className="wrapTitle">{txLoading?<h5 sx={{color: "#424242"}}>Unwrap</h5>:<h5>Unwrap</h5>}</div>
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
                    <MenuItem key={'ETHx'} value={'ETHx'}>
                      ETHx
                    </MenuItem>
                    <MenuItem key={'fDAIx'} value={'fDAIx'}>
                      fDAIx
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
                  placeholder={token}
                  color="success"
                  sx={{width: "100%"}}
                />
              </FormGroup>
            </Form>

            {
              token == "fDAIx"
              ? <p>fDAIx <FontAwesomeIcon icon={faArrowRight} className="arrow"/> fDAI</p> 
              : <p>ETHx <FontAwesomeIcon icon={faArrowRight} className="arrow"/> ETH</p>
            }

            <div className="wrapButtonContainer">
              <DowngradeButton
                onClick={() => {
                  daiDowngrade(amount, token, setTxLoading, setTxCompleted, setTxHash, setTxMsg);
                  setAmount("");
                }}
              >
                Unwrap
              </DowngradeButton>
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
