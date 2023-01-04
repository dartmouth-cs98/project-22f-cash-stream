import "./css/styles.css";
import { useState, useEffect } from "react";
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import  NavBar from "./components/NavBar";
import FlowInfo from "./components/DashboardPage/FlowInfo";
import { Stream } from "./components/Stream";
import { WrapUnwrap } from "./components/WrapUnwrap";
import { Subscriptions } from "./components/ServicesPage/Subscriptions";

export default function App() {

  let [connected, setConnected] = useState(false);
  
  useEffect(() => {
    document.title = 'CashStream';
    document.icon
    }, []);
  
  return (
    <div className="App">
    <BrowserRouter>
      <NavBar connected={connected} setConnected={setConnected}/>
      <Routes>
        <Route exact path="/" element={<FlowInfo connected={connected} setConnected={setConnected}/>}></Route>
        <Route exact path="/stream" element={<Stream/>}></Route>
        <Route exact path="/wrap" element={<WrapUnwrap />}></Route>
        <Route exact path="/subscriptions" element={<Subscriptions />}></Route>
      </Routes>
    </BrowserRouter>
  </div>
  );
}
