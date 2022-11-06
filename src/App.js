import "./css/styles.css";

import { CreateFlow } from "./components/CreateFlow";
import { ConnectWallet } from "./components/ConnectWallet";

export default function App() {
  return (
    <div className="App">
      <ConnectWallet />
      <CreateFlow />
    </div>
  );
}
