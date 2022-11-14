import "./css/styles.css";
import {Route, Routes, BrowserRouter} from 'react-router-dom';
import { CreateFlow } from "./components/CreateFlow";
import  NavBar from "./components/NavBar";
import { Wrap } from "./components/Wrap";
import { Unwrap } from "./components/Unwrap";
import { Dashboard } from "./components/Dashboard";
import { DeleteFlow } from "./components/DeleteFlow";
import FlowInfo from "./components/FlowInfo";

export default function App() {
  return (
    <div className="App">
    <BrowserRouter>
      <NavBar/>
      <Routes>
        <Route exact path="/" element={<Dashboard />}></Route>
        <Route exact path="/stream" element={<><CreateFlow /><DeleteFlow /></>}></Route>
        <Route exact path="/wrap" element={<><Wrap /><Unwrap /></>}></Route>
        <Route exact path="/flow" element={<FlowInfo />}></Route>
      </Routes>
    </BrowserRouter>
  </div>
  );
}
