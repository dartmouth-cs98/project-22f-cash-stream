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

export const WrapUnwrap = () => {
  const [alignment, setAlignment] = useState('create');

  const handleChange = (event, newAlignment) => {
    setAlignment(newAlignment);
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline/>
      <div className="wrapUnwrapContainer">
        <ToggleButtonGroup
          color="standard"
          value={alignment}
          exclusive
          onChange={handleChange}
          aria-label="Platform"
        >
          <ToggleButton value="create">Wrap</ToggleButton>
          <ToggleButton value="delete">Unwrap</ToggleButton>
        </ToggleButtonGroup>
        {
          alignment === "create" ? 
          <Wrap /> :
          <Unwrap />
        }
      </div>
    </ThemeProvider>
  );
}