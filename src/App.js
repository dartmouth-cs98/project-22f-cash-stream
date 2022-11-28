import "./css/styles.css";
import {Route, Routes, BrowserRouter} from 'react-router-dom';
import  NavBar from "./components/NavBar";
import { Dashboard } from "./components/Dashboard";
import FlowInfo from "./components/FlowInfo";
import { Stream } from "./components/Stream";
import { WrapUnwrap } from "./components/WrapUnwrap";

export default function App() {
  return (
    <div className="App">
    <BrowserRouter>
      <NavBar/>
      <Routes>
        <Route exact path="/" element={<FlowInfo />}></Route>
        <Route exact path="/stream" element={<Stream />}></Route>
        <Route exact path="/wrap" element={<WrapUnwrap />}></Route>
    
      </Routes>
    </BrowserRouter>
  </div>
  );
}
