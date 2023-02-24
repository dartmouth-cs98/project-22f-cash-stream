import {useState} from "react";
import { Wrap } from "./Wrap";
import { Unwrap } from "./Unwrap";
import { Card, Typography } from '@mui/material';
import "../css/wrapUnwrap.css";

//Stream page (wrapper component for wrap/unwrap)
export const WrapUnwrap = (props) => {
  const [alignment, setAlignment] = useState('wrap'); //togglebutton options

  const handleToggleChange = (event, newAlignment) => {
    setAlignment(newAlignment);
  };

  return (
    <div className="wrapUnwrapPage">
      <div className="tokenBalance">
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
      {
        alignment === "wrap"
        ? <Wrap alignment={alignment} handleToggleChange={handleToggleChange} ETHxBalance={props.ETHxBalance} fDAIxBalance={props.fDAIxBalance}/>
        : <Unwrap alignment={alignment} handleToggleChange={handleToggleChange} ETHxBalance={props.ETHxBalance} fDAIxBalance={props.fDAIxBalance}/>
      }
    </div>
  );
}