import {useState} from "react";
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { CreateFlow } from "./CreateFlow";
import { DeleteFlow } from "./DeleteFlow";
import "../css/stream.css";

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

export const Stream = () => {
  const [alignment, setAlignment] = useState('create');

  const handleChange = (event, newAlignment) => {
    setAlignment(newAlignment);
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline/>

      <div className="streamContainer">
        <ToggleButtonGroup
          color="success"
          value={alignment}
          exclusive
          onChange={handleChange}
          aria-label="Platform"
        >
          <ToggleButton value="create">Create</ToggleButton>
          <ToggleButton value="delete">Delete</ToggleButton>
        </ToggleButtonGroup>
        {
          alignment === "create" ? 
          <CreateFlow /> :
          <DeleteFlow />
        }
      </div>
    </ThemeProvider>
  );
}