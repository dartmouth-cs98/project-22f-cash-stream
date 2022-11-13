import "./css/styles.css";

import { CreateFlow } from "./components/CreateFlow";
import { ConnectWallet } from "./components/ConnectWallet";
import { DeleteFlow } from "./components/DeleteFlow";

export default function App() {
  return (
    <div className="App">
      <ConnectWallet />
      <CreateFlow />
      <DeleteFlow />
    </div>
  );
}
