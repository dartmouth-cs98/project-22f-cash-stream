import {useState} from "react";
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { Wrap } from "./Wrap";
import { Unwrap } from "./Unwrap";
import "../css/wrapUnwrap.css";

//Stream page (wrapper component for wrap/unwrap)
export const WrapUnwrap = () => {
  const [alignment, setAlignment] = useState('wrap'); //togglebutton options

  const handleToggleChange = (event, newAlignment) => {
    setAlignment(newAlignment);
  };

  return (
    <div className="wrapUnwrapPage">
        {
          alignment === "wrap" 
          ? <Wrap alignment={alignment} handleToggleChange={handleToggleChange}/> 
          : <Unwrap alignment={alignment} handleToggleChange={handleToggleChange}/>
        }
    </div>
  );
}