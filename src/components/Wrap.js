//Most component and functions (daiApprove, daiUpgrade, Wrap) on this file are from: 
//https://docs.superfluid.finance/superfluid/developers/constant-flow-agreement-cfa/money-streaming-1
//adjusted to connect to web3 provider (metamask)
//adjusted to request approval only if the amount is greater than the current allowance on contract

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
import { LoadingButton } from "@mui/lab";
import { Form, FormGroup } from "react-bootstrap";
import "../css/wrapUnwrap.css";

//Contract Addresses
//Can be found here: https://docs.superfluid.finance/superfluid/developers/networks
const fDAI_contract_address = "0x88271d333C72e51516B67f5567c728E702b3eeE8";
const fDAIx_contract_address = "0xF2d68898557cCb2Cf4C10c3Ef2B034b2a69DAD00";
let allowance = "0";

function convertWeitofDAIx(wei){
  return wei * Math.pow(10, -18);
}

//Get allowance (how much the spender has been approved to spend on behalf of the owner)
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

//will be used to approve super token contract to spend DAI
async function daiApprove(amt) {
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
    await fDAI.approve(
      fDAI_contract_address,
      ethers.utils.parseEther(amt.toString())
    ).then(function (tx) {
      console.log(
        `Congrats, you just approved your DAI spend. You can see this tx at https://goerli.etherscan.io/tx/${tx.hash}`
      );
    });
  } catch (error) {
    console.error(error);
  }
}

//where the Superfluid logic takes place
async function daiUpgrade(amt) {

  const sf = await Framework.create({
    chainId: 5,
    provider: customHttpProvider
  });

  const provider = new ethers.providers.Web3Provider(window.ethereum);

  const signer = provider.getSigner();
  const DAIx = await sf.loadSuperToken("fDAIx");

  try {
    console.log(`upgrading ${amt} DAI to DAIx`);
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
    });
  } catch (error) {
    console.error(error);
  }
}

export const Wrap = () => {
  const [amount, setAmount] = useState("");
  const [isUpgradeButtonLoading, setIsUpgradeButtonLoading] = useState(false);
  const [isApproveButtonLoading, setIsApproveButtonLoading] = useState(false);
  const [exceedsAllowance, setExceedsAllowance] = useState(false);

  useEffect(() => {
    getAllowance();
    if(amount > allowance){
      setExceedsAllowance(true);
    }
    else{
      setExceedsAllowance(false);
    }
  });

  function UpgradeButton({ isLoading, children, ...props }) {
    return (
      <div>
      {
      isUpgradeButtonLoading
      ? <LoadingButton loading/>
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

  function ApproveButton({ isLoading, children, ...props }) {
    return (
      <div>
        {
        isApproveButtonLoading
        ? <LoadingButton loading/>
        : <Button variant="outlined" 
            sx={{
              color: "success.main", 
              borderColor: "success.main",
              ":hover": {borderColor: "success.main"}
            }}
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
      <Card sx={{ width: "70%", borderRadius: "15px", marginLeft: "auto", marginRight: "auto"}}>
        <CardContent>
          <Typography variant="h5" component="div" sx={{marginTop: "20px"}}>
            Wrap
          </Typography>
          <Form>
            <FormGroup className="wrapForm">
              <TextField 
                name="amount"
                value={amount}
                onChange={handleAmountChange}
                placeholder="0.0"
                color="success"
                sx={{width: "70%", marginBottom: "10px"}}
              >  
              </TextField>
            </FormGroup>
            {
              exceedsAllowance 
              ? <p>
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
              </p>
              : <p>
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
        </CardContent>
      </Card>

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
