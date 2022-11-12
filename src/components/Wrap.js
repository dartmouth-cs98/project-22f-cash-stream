//The component and functions on this file are from: 
//https://docs.superfluid.finance/superfluid/developers/constant-flow-agreement-cfa/money-streaming-1
//adjusted to connect to web3 provider (metamask)

import React, { useState } from "react";
import { customHttpProvider } from "../config";
import { Framework } from "@superfluid-finance/sdk-core";
import { ethers } from "ethers";
import { daiABI } from "../config";
import { Button, Form, FormGroup, FormControl, Spinner } from "react-bootstrap";
import "../css/wrap.css";

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
  const DAI = new ethers.Contract(
    "0x88271d333C72e51516B67f5567c728E702b3eeE8",
    daiABI,
    signer
  );
  try {
    console.log("approving DAI spend");
    await DAI.approve(
      "0xF2d68898557cCb2Cf4C10c3Ef2B034b2a69DAD00",
      ethers.utils.parseEther(amt.toString())
    ).then(function (tx) {
      console.log(
        `Congrats, you just approved your DAI spend. You can see this tx at https://kovan.etherscan.io/tx/${tx.hash}`
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
