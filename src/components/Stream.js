import {useState} from "react";
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { CreateFlow } from "./CreateFlow";
import { DeleteFlow } from "./DeleteFlow";
import "../css/stream.css";

//Stream page (wrapper component for create/delete flow)
export const Stream = () => {
  const [alignment, setAlignment] = useState('create'); //togglebutton options

  const handleChange = (event, newAlignment) => {
    setAlignment(newAlignment);
  };

  return (
      <div className="streamPage">
        <div className="streamContainer">
          <ToggleButtonGroup
            color="primary"
            value={alignment}
            exclusive
            onChange={handleChange}
            aria-label="Platform"
          >
            <ToggleButton value="create" sx={{fontFamily: 'Lato', textTransform: "none"}}>Send</ToggleButton>
            <ToggleButton value="delete" sx={{fontFamily: 'Lato', textTransform: "none"}}>Close</ToggleButton>
          </ToggleButtonGroup>
          {
            alignment === "create" ? 
            <CreateFlow /> :
            <DeleteFlow />
          }
        </div>
      </div>
  );
}