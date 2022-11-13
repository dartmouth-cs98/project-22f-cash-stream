import "./css/styles.css";

import { CreateFlow } from "./components/CreateFlow";
import NavBar from "./components/NavBar";
import { ConnectWallet } from "./components/ConnectWallet";
import { Wrap } from "./components/Wrap";
import { Unwrap } from "./components/Unwrap";
import { Dashboard } from "./components/Dashboard";
import { DeleteFlow } from "./components/DeleteFlow";

export default function App() {

  return (
    <div className="App">
      <NavBar/>
      <ConnectWallet />
      <CreateFlow />
      <DeleteFlow />
      <Wrap />
      <Unwrap />
    </div>
  );
}
