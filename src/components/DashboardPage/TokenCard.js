import Card from '@mui/material/Card';
import { useState } from 'react';
import { CardContent, Typography } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretUp, faCaretDown, faMinus } from '@fortawesome/free-solid-svg-icons';

export const TokenCard = (props) => {
  const[time, updateTime] = useState(setTime());

  function setTime(){
    if(props.token.formattedNetflow.slice(0,1) == '-'){
      const monthlyNetflow = parseFloat(props.token.formattedNetflow.slice(1, props.token.formattedNetflow.length-4));
      const seconds = Math.round(props.token.balance / monthlyNetflow) * 30 * 24 * 3600;
      
      const date = new Date();
      date.setSeconds(seconds); // specify value of SECONDS
      const res = date.toDateString();
      return res.substring(0,10) + ", " + res.substring(11,15);
    }
    else{
      return "-";
    }
  }

  function decreaseTime(){

  }

  return (
    <Card sx={{minWidth: 275,
      display: "inline-block",
      marginRight: '15px'}}>
      <CardContent>
        <Typography sx={{fontSize: 18, fontWeight: '700'}} color="text.secondary" gutterBottom>
          {
            props.token.formattedNetflow.slice(0,1) == '-'
            ? <FontAwesomeIcon icon={faCaretDown}/>
            : <>
            { 
              props.token.formattedNetflow.slice(0, props.token.formattedNetflow.length-4) == '0'
              ? <span sx={{fontWeight: 700}}>-</span>
              : <FontAwesomeIcon icon={faCaretUp}/>
            }
            </>
          }
          &nbsp; {props.token.balance} {props.token.name}
        </Typography>
        {
          props.token.history.length == 0
          ? <Typography sx={{fontSize: 13}} color="text.secondary" gutterBottom>No active stream</Typography>
          : <Typography sx={{fontSize: 13}} color="text.secondary" gutterBottom>{props.token.history.length} active streams</Typography>
        }
        {
          props.token.formattedNetflow.slice(0,1) == '-'
          ? <Typography sx={{fontSize: 13}} color="text.secondary">Liquidation Date: {time}</Typography>
          : <Typography sx={{fontSize: 13}} color="text.secondary">Liquidation Date: N/A</Typography>
        }
      </CardContent>
    </Card>
  );
}