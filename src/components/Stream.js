import { CreateFlow } from "./CreateFlow";
import { Card, Typography } from '@mui/material';
import { useState } from "react";
import "../css/stream.css";
import "../css/styles.css"

const dummy = "0x8a9dad5041c76E5D73a2f2b044C25b9D1B402C4A"

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
      <Card className="dummy" onClick={copyAddress} onMouseOut={()=>{setCopy("Click to copy dummy address!")}}
        sx={{
          minWidth: 250, 
          marginRight: '10px',
          paddingTop: '12px', 
          paddingBottom: '12px',
          borderRadius: '10px',
          display: 'inline-block',
          cursor: 'pointer'
          }}>
            <Typography sx={{fontSize: 15, fontWeight: '700'}}>{copy}</Typography>
        </Card>
        <Card sx={{
                  minWidth: 200, 
                  marginRight: '10px', 
                  paddingTop: '12px', 
                  paddingBottom: '12px', 
                  borderRadius: '10px',
                  display: 'inline-block'}}>
            <Typography sx={{fontSize: 15, fontWeight: '700'}}>{props.ETHxBalance} ETHx</Typography>
        </Card>
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