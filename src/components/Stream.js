import { CreateFlow } from "./CreateFlow";
import { Card, Typography } from '@mui/material';
import "../css/stream.css";

//Stream page (wrapper component for create/delete flow)
export const Stream = (props) => {
  {/*
  const [alignment, setAlignment] = useState('create'); //togglebutton options

  const handleToggleChange = (event, newAlignment) => {
    setAlignment(newAlignment);
  };
  */}

  return (
    <div className="streamPage">
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
      <CreateFlow/>
      {/*
        alignment === "create" 
        ? <CreateFlow alignment={alignment} handleToggleChange={handleToggleChange}/>
        : <DeleteFlow alignment={alignment} handleToggleChange={handleToggleChange}/>
    */}
    </div>
  );
}