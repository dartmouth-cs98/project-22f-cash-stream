import {useState} from "react";
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { Wrap } from "./Wrap";
import { Unwrap } from "./Unwrap";
import "../css/wrapUnwrap.css";

//Stream page (wrapper component for wrap/unwrap)
export const WrapUnwrap = () => {
  const [alignment, setAlignment] = useState('wrap'); //togglebutton options

  const handleChange = (event, newAlignment) => {
    setAlignment(newAlignment);
  };

  return (
      <div className="wrapUnwrapPage">
        <div className="wrapUnwrapContainer">
          <ToggleButtonGroup
            color="success"
            value={alignment}
            exclusive
            onChange={handleChange}
            aria-label="Platform"
          >
            <ToggleButton value="wrap" sx={{fontFamily: 'Lato', textTransform: "none"}}>Wrap</ToggleButton>
            <ToggleButton value="unwrap" sx={{fontFamily: 'Lato', textTransform: "none"}}>Unwrap</ToggleButton>
          </ToggleButtonGroup>
          {
            alignment === "wrap" ? 
            <Wrap /> :
            <Unwrap />
          }
        </div>
      </div>
  );
}