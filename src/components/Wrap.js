//The component and functions on this file are from: 
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

async function getAllowance(){
  const sf = await Framework.create({
    chainId: 5,
    provider: customHttpProvider
  });

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  
  const fDAI = new ethers.Contract(
    "0x88271d333C72e51516B67f5567c728E702b3eeE8",
    daiABI,
    signer
  );

  try{
    await fDAI.allowance(
      "0x643a5a4e68C90A72642326E34FC1A181a3f5F8c4",
      "0xF2d68898557cCb2Cf4C10c3Ef2B034b2a69DAD00",
    ).then((value)=>{console.log(value.toString());});
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

  //fDAI on goerli: you can find network addresses here: https://docs.superfluid.finance/superfluid/developers/networks
  //note that this abi is the one found here: https://goerli.etherscan.io/address/0x88271d333C72e51516B67f5567c728E702b3eeE8
  const fDAI = new ethers.Contract(
    "0x88271d333C72e51516B67f5567c728E702b3eeE8",
    daiABI,
    signer
  );
  try {
    console.log("approving DAI spend");
    await fDAI.approve(
      "0xF2d68898557cCb2Cf4C10c3Ef2B034b2a69DAD00",
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
    setAmount(() => ([e.target.name] = e.target.value));
  };

  return (
    <div className="container">
      <h2>Wrap Token</h2>
      <Button onClick={() => {
              getAllowance();
              setTimeout(() => {
                setIsApproveButtonLoading(false);
              }, 1000);
            }}>allowance      
      </Button>
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
