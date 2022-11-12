import "./css/styles.css";

import { CreateFlow } from "./components/CreateFlow";
import { ConnectWallet } from "./components/ConnectWallet";
import { Wrap } from "./components/Wrap";

export default function App() {
  return (
    <div className="App">
      <ConnectWallet />
      <CreateFlow />
      <Wrap />
    </div>
  );
}
