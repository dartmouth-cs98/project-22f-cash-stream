import {useState} from "react";
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Wrap } from "./Wrap";
import { Unwrap } from "./Unwrap";
import "../css/wrapUnwrap.css";

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

//Stream page (wrapper component for wrap/unwrap)
export const WrapUnwrap = () => {
  const [alignment, setAlignment] = useState('wrap'); //togglebutton options

  const handleChange = (event, newAlignment) => {
    setAlignment(newAlignment);
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline/>
      <div className="wrapUnwrapContainer">
        <ToggleButtonGroup
          color="success"
          value={alignment}
          exclusive
          onChange={handleChange}
          aria-label="Platform"
        >
          <ToggleButton value="wrap" sx={{textTransform: "none"}}>Wrap</ToggleButton>
          <ToggleButton value="unwrap" sx={{textTransform: "none"}}>Unwrap</ToggleButton>
        </ToggleButtonGroup>
        {
          alignment === "wrap" ? 
          <Wrap /> :
          <Unwrap />
        }
      </div>
    </ThemeProvider>
  );
}