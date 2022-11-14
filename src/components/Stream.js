import {useState} from "react";
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { ThemeProvider, createTheme } from '@mui/material/styles';
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
      <div className="streamContainer">
        <ToggleButtonGroup
          color="standard"
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
          <CreateFlow></CreateFlow> :
          <DeleteFlow></DeleteFlow>
        }
      </div>
  );
}