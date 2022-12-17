import React, { useState } from "react";
import { Framework } from "@superfluid-finance/sdk-core";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Form, FormGroup, FormControl, Spinner } from "react-bootstrap";
import { ethers } from "ethers";

//where the Superfluid logic takes place
async function deleteFlow(recipient) {

  console.log(recipient)

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();

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
    const deleteFlowOperation = sf.cfaV1.deleteFlow({
      sender: account,
      receiver: recipient,
      superToken: fDAIx
      // userData?: string
    });

    console.log("Deleting your stream...");

    await deleteFlowOperation.exec(signer);

    console.log(
      `Congrats - you've just deleted your money stream!
       Network: Goerli
       Super Token: fDAIx
       Sender: ${signer._address}
       Receiver: ${recipient}
    `
    );
  } catch (error) {
    console.error(error);
    alert("Hmmm, your transaction threw an error.")
  }
}

export const DeleteFlow = () => {
  const [recipient, setRecipient] = useState("");
  const [isButtonLoading, setIsButtonLoading] = useState(false);

  function DeleteButton({ isLoading, children, ...props }) {
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

  return (
    <div className="deleteFlowContainer">
      <Card sx={{ width: "70%", borderRadius: "15px", marginLeft: "auto", marginRight: "auto"}}>
        <CardContent>
          <Typography variant="h5" component="div" sx={{marginTop: "20px"}}>
            Delete Stream
          </Typography>
          <Form className="createFlowForm">
            <FormGroup className="mb-3">
              <TextField 
                name="recipient"
                value={recipient}
                onChange={handleRecipientChange}
                placeholder="Recipient wallet address"
                color="success"
                sx={{width: "70%", marginBottom: "10px"}}
              >  
              </TextField>
            </FormGroup>
            <DeleteButton
              onClick={() => {
                setIsButtonLoading(true);
                deleteFlow(recipient);
                setTimeout(() => {
                  setIsButtonLoading(false);
                }, 1000);
              }}
            >
              Delete
            </DeleteButton>
          </Form>
        </CardContent>
      </Card>

      {/*
      <h3>Delete Stream</h3>
      <Form className="deleteFlowForm">
        <FormGroup className="mb-3">
          <FormControl
            name="recipient"
            value={recipient}
            onChange={handleRecipientChange}
            placeholder="Enter recipient address"
          ></FormControl>
        </FormGroup>
        <DeleteButton
          onClick={() => {
            setIsButtonLoading(true);
            deleteFlow(recipient);
            setTimeout(() => {
              setIsButtonLoading(false);
            }, 1000);
          }}
        >
          Delete Stream
        </DeleteButton>
      </Form>
      */}
    </div>
  );
};
