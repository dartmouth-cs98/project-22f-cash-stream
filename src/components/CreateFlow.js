//The component and functions on this file are from: 
//https://docs.superfluid.finance/superfluid/developers/constant-flow-agreement-cfa/money-streaming-1

import React, { useState } from "react";
import { Framework } from "@superfluid-finance/sdk-core";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Form, FormGroup, Spinner } from "react-bootstrap";
import { ethers } from "ethers";
import "../css/stream.css";

//where the Superfluid logic takes place
async function createNewFlow(recipient, flowRate) {

  console.log(recipient)

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  console.log(provider);
  const signer = provider.getSigner();
  console.log(signer);

  const chainId = await window.ethereum.request({ method: "eth_chainId" });

  const sf = await Framework.create({
      chainId: Number(chainId),
      provider: provider
  });

  const fDAIxContract = await sf.loadSuperToken("fDAIx");
  const fDAIx = fDAIxContract.address;

  const accounts = await ethereum.request({ method: "eth_accounts" });
  const account = accounts[0];

  try {
    const createFlowOperation = sf.cfaV1.createFlow({
      sender: account, 
      receiver: recipient,
      flowRate: flowRate,
      superToken: fDAIx
      // userData?: string
    });

    console.log("Creating your stream...");

    await createFlowOperation.exec(signer);

    console.log(
      `Congrats - you've just created a money stream!
      View Your Stream At: https://app.superfluid.finance/dashboard/${recipient}
      Network: Goerli
      Super Token: fDAIx
      Receiver: ${recipient},
      FlowRate: ${flowRate}
      `
    );
  } catch (error) {
    console.error(error);
    alert("Hmmm, your transaction threw an error. Make sure that this stream does not already exist, and that you've entered a valid Ethereum address")
  }
}

export const CreateFlow = () => {
  const [recipient, setRecipient] = useState("");
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const [flowRate, setFlowRate] = useState("");
  const [flowRateDisplay, setFlowRateDisplay] = useState("");

  function calculateFlowRate(amount) {
    if (typeof Number(amount) !== "number" || isNaN(Number(amount)) === true) {
      alert("You can only calculate a flowRate based on a number");
      return;
    } else if (typeof Number(amount) === "number") {
      if (Number(amount) === 0) {
        return 0;
      }
      const amountInWei = ethers.BigNumber.from(amount);
      const monthlyAmount = ethers.utils.formatEther(amountInWei.toString());
      const calculatedFlowRate = monthlyAmount * 3600 * 24 * 30;
      return calculatedFlowRate;
    }
  }

  function CreateButton({ isLoading, children, ...props }) {
    return (
      <Button variant="outlined" 
        sx={{
          color: "success.main", 
          borderColor: "success.main",
          ":hover": {borderColor: "success.main"}
        }}
      >
        {isButtonLoading ? <Spinner animation="border" /> : children}
      </Button>
    );
  }

  const handleRecipientChange = (e) => {
    setRecipient(() => ([e.target.name] = e.target.value));
  };

  const handleFlowRateChange = (e) => {
    try {
      setFlowRate(() => ([e.target.name] = e.target.value));
      let newFlowRateDisplay = calculateFlowRate(e.target.value);
      setFlowRateDisplay(newFlowRateDisplay.toString());
    } catch {
      console.error("Flowrate invalid.")
    }
  };

  return (
    <div className="createFlowContainer">
      <Card sx={{ width: "70%", borderRadius: "15px", marginLeft: "auto", marginRight: "auto"}}>
        <CardContent>
          <Typography variant="h5" component="div" sx={{marginTop: "20px"}}>
            Create Stream
          </Typography>
          <Form className="createFlowForm">
            <FormGroup className="mb-3">
              <TextField 
                name="recipient"
                value={recipient}
                onChange={handleRecipientChange}
                placeholder="Recipient wallet address"
                color="success"
                sx={{width: "70%", marginBottom: "5px"}}
              >  
              </TextField>
            </FormGroup>
            <FormGroup className="mb-3">
              <TextField 
                name="flowRate"
                value={flowRate}
                onChange={handleFlowRateChange}
                placeholder="Flow rate in wei/second"
                color="success"
                sx={{width: "70%", marginBottom: "10px"}}
              >
              </TextField>
            </FormGroup>
            <CreateButton
              onClick={() => {
                setIsButtonLoading(true);
                createNewFlow(recipient, flowRate);
                setTimeout(() => {
                  setIsButtonLoading(false);
                }, 1000);
              }}
            >
              Create
            </CreateButton>
          </Form>
        </CardContent>
      </Card>

      {/*
      <h3>Create Stream</h3>
      <Form className="createFlowForm">
        <FormGroup className="mb-3">
          <FormControl
            name="recipient"
            value={recipient}
            onChange={handleRecipientChange}
            placeholder="Enter recipient address"
          ></FormControl>
        </FormGroup>
        <FormGroup className="mb-3">
          <FormControl
            name="flowRate"
            value={flowRate}
            onChange={handleFlowRateChange}
            placeholder="Enter a flowRate in wei/second"
          ></FormControl>
        </FormGroup>
        <CreateButton
          onClick={() => {
            setIsButtonLoading(true);
            createNewFlow(recipient, flowRate);
            setTimeout(() => {
              setIsButtonLoading(false);
            }, 1000);
          }}
        >
          Create Stream
        </CreateButton>
      </Form>

      <div className="createFlowCalculation">
        <p>Your flow will be equal to:</p>
        <p>
          <b>${flowRateDisplay !== " " ? flowRateDisplay : 0}</b> DAIx/month
        </p>
        </div>*/}
    </div>
  );
};
