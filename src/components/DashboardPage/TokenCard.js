import { useEffect, useState } from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretUp, faCaretDown } from '@fortawesome/free-solid-svg-icons';

/* This is the summary card that shows information for each token on dashboard
 * Shows balance, number of active streams, and liquidation date
 */
export const TokenCard = (props) => {
  const[time, updateTime] = useState();

  useEffect(() => {
    setTime();
  },);

  //compute liquidation date
  function setTime (){
    if(props.token.formattedNetflow.slice(0,1) == '-'){
      const monthlyNetflow = parseFloat(props.token.formattedNetflow.slice(1, props.token.formattedNetflow.length-4));
      const seconds = Math.round(props.token.balance / monthlyNetflow) * 30 * 24 * 3600;
      
      const date = new Date();
      date.setSeconds(seconds);
      const res = date.toDateString();
      updateTime(res.substring(0,10) + ", " + res.substring(11,15));
    }
    else{
      updateTime("-");
    }
  }

  return (
    <Card sx={{minWidth: 275, height: '135px', display: "inline-block", marginRight: '15px'}} className="card">
      <CardContent>
        <Typography sx={{fontSize: 18, fontWeight: '700'}} color="text.secondary" gutterBottom>
          {
            props.token.formattedNetflow.slice(0,1) == '-'
            ? <FontAwesomeIcon icon={faCaretDown}/>
            : <>
            { 
              props.token.formattedNetflow.slice(0, props.token.formattedNetflow.length-4) == '0'
              ? <></>
              : <FontAwesomeIcon icon={faCaretUp}/>
            }
            </>
          }
          &nbsp;{props.token.balance} {props.token.name}
        </Typography>
        {props.token.history.length == 0 && <Typography sx={{fontSize: 13}} color="text.secondary" gutterBottom>No active stream</Typography>}
        {props.token.history.length == 1 && <Typography sx={{fontSize: 13}} color="text.secondary" gutterBottom>{props.token.history.length} active stream</Typography>}
        {props.token.history.length > 1 && <Typography sx={{fontSize: 13}} color="text.secondary" gutterBottom>{props.token.history.length} active streams</Typography>}
        {
          props.token.formattedNetflow.slice(0,1) == '-'
          ? <Typography sx={{fontSize: 13}} color="text.secondary">Liquidation Date: {time}</Typography>
          : <Typography sx={{fontSize: 13}} color="text.secondary">Liquidation Date: N/A</Typography>
        }
        {/*
          props.token.history.length == 0
          ? <></>
          : <LinearProgress color="success" sx={{marginTop: '20px'}} className="progress"/>
        */}
      </CardContent>
    </Card>
  );
}