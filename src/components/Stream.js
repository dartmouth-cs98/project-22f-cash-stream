import { CreateFlow } from "./CreateFlow";
import { DeleteFlow } from "./DeleteFlow";
import ToggleButton from '@mui/material/ToggleButton';

export const Stream = () => {
  return(
    <div>
      <CreateFlow />
      <DeleteFlow />
    </div>
  );
}