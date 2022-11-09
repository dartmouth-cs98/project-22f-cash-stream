import React, { useState } from "react";
import { Button, Form, FormGroup, FormControl, Spinner } from "react-bootstrap";
import "../css/createFlow.css";
import { getSfFramework } from "./Utils"

//where the Superfluid logic takes place
async function deleteFlow(recipient) {

  signer, sf = await getSfFramework(window);

  const DAIxContract = await sf.loadSuperToken("fDAIx");
  const DAIx = DAIxContract.address;

  try {
    const deleteFlowOperation = sf.cfaV1.deleteFlow({
      sender: signer._address,
      receiver: recipient,
      superToken: DAIx
      // userData?: string
    });

    console.log("Deleting your stream...");

    await deleteFlowOperation.exec(signer);

    console.log(
      `Congrats - you've just deleted your money stream!
       Network: Kovan
       Super Token: DAIx
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
      <Button variant="success" className="button" {...props}>
        {isButtonLoading ? <Spinner animation="border" /> : children}
      </Button>
    );
  }

  const handleRecipientChange = (e) => {
    setRecipient(() => ([e.target.name] = e.target.value));
  };

  return (
    <div>
      <h2>Delete a Flow</h2>
      <Form>
        <FormGroup className="mb-3">
          <FormControl
            name="recipient"
            value={recipient}
            onChange={handleRecipientChange}
            placeholder="Enter your Ethereum address"
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
          Click to Delete Your Stream
        </DeleteButton>
      </Form>
    </div>
  );
};
