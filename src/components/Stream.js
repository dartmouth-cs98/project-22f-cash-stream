import {useState} from "react";
import { CreateFlow } from "./CreateFlow";
import { DeleteFlow } from "./DeleteFlow";
import "../css/stream.css";

//Stream page (wrapper component for create/delete flow)
export const Stream = () => {
  {/*
  const [alignment, setAlignment] = useState('create'); //togglebutton options

  const handleToggleChange = (event, newAlignment) => {
    setAlignment(newAlignment);
  };
  */}

  return (
    <div className="streamPage">
      <CreateFlow/>
      {/*
        alignment === "create" 
        ? <CreateFlow alignment={alignment} handleToggleChange={handleToggleChange}/>
        : <DeleteFlow alignment={alignment} handleToggleChange={handleToggleChange}/>
    */}
    </div>
  );
}