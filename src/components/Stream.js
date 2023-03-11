import { CreateFlow } from "./CreateFlow";
import { Button, Card, Typography } from '@mui/material';
import { useState } from "react";
import "../css/stream.css";
import "../css/styles.css"

const dummy = "0x45c01ceb87dbe6807ebecb9161408fc5c6acb5d1"

//Stream page (wrapper component for create flow)
export const Stream = (props) => {

  const [copy, setCopy] = useState("Click to copy dummy address!")

  function copyAddress(){
    navigator.clipboard.writeText(dummy);
    setCopy("Copied!")
  }

  return (
    <div className="streamPage">
      <div className="tokenBalance">
        
        {/*Click copy dummy address at the top of the send stream page*/}
        <div className="dummy">
          <Button variant="contained" onClick={copyAddress} onMouseOut={()=>{setCopy("Click to copy dummy address!")}}
            sx={{
                backgroundColor: "rgba(255, 255, 255, 0.05)",
                color: "white",
                textTransform: "none", 
                minWidth: 250,
                marginRight: '10px',
                paddingTop: '12px', 
                paddingBottom: '12px',
                borderRadius: '10px',
                cursor: 'pointer',
              }}>
              <Typography sx={{fontSize: 15, fontWeight: '700'}}>{copy}</Typography>
          </Button>
        </div>

        {/*ETHx Balance*/}
        <Card sx={{
                minWidth: 200, 
                marginRight: '10px', 
                paddingTop: '12px', 
                paddingBottom: '12px', 
                borderRadius: '10px',
                display: 'inline-block'}}>
            <Typography sx={{fontSize: 15, fontWeight: '700'}}>{props.ETHxBalance} ETHx</Typography>
        </Card>

        {/*fDAIx Balance*/}
        <Card sx={{
                minWidth: 200, 
                paddingTop: '12px', 
                paddingBottom: '12px', 
                borderRadius: '10px',
                display: 'inline-block'}}>
          <Typography sx={{fontSize: 15, fontWeight: '700'}}>{props.fDAIxBalance} fDAIx</Typography>
        </Card>
      </div>
      
      <CreateFlow ETHxBalance={props.ETHxBalance} fDAIxBalance={props.fDAIxBalance}/>
    </div>
  );
}