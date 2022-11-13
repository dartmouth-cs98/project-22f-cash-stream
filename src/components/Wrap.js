//Most component and functions (daiApprove, daiUpgrade, Wrap) on this file are from: 
//https://docs.superfluid.finance/superfluid/developers/constant-flow-agreement-cfa/money-streaming-1
//adjusted to connect to web3 provider (metamask)
//adjusted to request approval only if the amount is greater than the current allowance on contract

import React, { useState } from "react";
import { customHttpProvider } from "../config";
import { Framework } from "@superfluid-finance/sdk-core";
import { ethers } from "ethers";
import { daiABI } from "../config";
import { Button, Form, FormGroup, FormControl, Spinner } from "react-bootstrap";
import "../css/wrap.css";

//Contract Addresses
//Can be found here: https://docs.superfluid.finance/superfluid/developers/networks
const fDAI_contract_address = "0x88271d333C72e51516B67f5567c728E702b3eeE8";
const fDAIx_contract_address = "0xF2d68898557cCb2Cf4C10c3Ef2B034b2a69DAD00";

let allowance = "0";

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
      allowance = value.toString();
    });
  } catch (error){
    console.log(error);
  }

  return allowance;
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

  function UpgradeButton({ isLoading, children, ...props }) {
    return (
      <Button variant="success" className="button" {...props}>
        {isUpgradeButtonLoading ? <Spinner animation="border" /> : children}
      </Button>
    );
  }

  function ApproveButton({ isLoading, children, ...props }) {
    return (
      <Button variant="success" className="button" {...props}>
        {isApproveButtonLoading ? <Spinner animation="border" /> : children}
      </Button>
    );
  }

  const handleAmountChange = (e) => {
    getAllowance();
    setAmount(() => ([e.target.name] = e.target.value));
  };

  return (
    <div className="container">
      <h2>Wrap Token</h2>
      <p>{allowance}</p>
      <Form>
        <FormGroup className="mb-3">
          <FormControl
            name="amount"
            value={amount}
            onChange={handleAmountChange}
            placeholder="Enter the dollar amount you'd like to upgrade"
          ></FormControl>
        </FormGroup>
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
            Click to Approve Token Upgrade
          </ApproveButton>
        </p>
        <UpgradeButton
          onClick={() => {
            setIsUpgradeButtonLoading(true);
            daiUpgrade(amount);
            setTimeout(() => {
              setIsUpgradeButtonLoading(false);
            }, 1000);
          }}
        >
          Click to Upgrade Your Tokens
        </UpgradeButton>
      </Form>
    </div>
  );
};
