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
        <Card sx={{minWidth: 275, marginRight: '15px', paddingTop: '10px', paddingBottom: '8px', borderRadius: '15px'}}>
            <Typography sx={{fontSize: 15, fontWeight: '700'}} color="text.secondary" gutterBottom>{props.ETHxBalance} ETHx</Typography>
        </Card>
        <Card sx={{minWidth: 275, marginRight: '15px', paddingTop: '10px', paddingBottom: '8px', borderRadius: '15px'}}>
          <Typography sx={{fontSize: 15, fontWeight: '700'}} color="text.secondary" gutterBottom>{props.fDAIxBalance} fDAIx</Typography>
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