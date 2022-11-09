import "./css/styles.css";

import { CreateFlow } from "./components/CreateFlow";
import { ConnectWallet } from "./components/ConnectWallet";
import Dashboard from "./components/Dashboard";
export default function App() {

  return (
    <div className="App">
      
      <ConnectWallet />
      <CreateFlow />

      <Dashboard/>
    </div>
  );
}
