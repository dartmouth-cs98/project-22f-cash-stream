//The component and functions on this file are from: 
//https://docs.superfluid.finance/superfluid/developers/super-tokens/using-super-tokens 
//adjusted to connect to web3 provider (metamask)

import React, { useState } from "react";
import { customHttpProvider } from "../config";
import { Framework } from "@superfluid-finance/sdk-core";
import { ethers } from "ethers";
import { Button, Form, FormGroup, FormControl, Spinner } from "react-bootstrap";
import "../css/wrapUnwrap.css";

const fDAIx_contract_address = "0xF2d68898557cCb2Cf4C10c3Ef2B034b2a69DAD00";

//where the Superfluid logic takes place
async function daiDowngrade(amt) {
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
    });
  } catch (error) {
    console.error(error);
  }
}

export const Unwrap = () => {
  const [amount, setAmount] = useState("");
  const [isDowngradeButtonLoading, setIsDowngradeButtonLoading] = useState(
    false
  );

  function DowngradeButton({ isLoading, children, ...props }) {
    return (
      <Button variant="success" className="button" {...props}>
        {isDowngradeButtonLoading ? <Spinner animation="border" /> : children}
      </Button>
    );
  }

  const handleAmountChange = (e) => {
    setAmount(() => ([e.target.name] = e.target.value));
  };

  return (
    <div className="unwrapContainer">
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
    </div>
  );
};
