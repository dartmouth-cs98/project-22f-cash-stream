import "./css/styles.css";
import { useState, useEffect } from "react";
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import  NavBar from "./components/NavBar";
import FlowInfo from "./components/DashboardPage/FlowInfo";
import { Stream } from "./components/Stream";
import { WrapUnwrap } from "./components/WrapUnwrap";
import { Subscriptions } from "./components/ServicesPage/Subscriptions";
import { Main } from "./components/Main";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from "@mui/material";
import { UserGuide } from "./components/UserGuide";

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: "#10bb35",
    },
    secondary: {
      main: "#343434",
      light: "#111111",
      dark: "#000000"
    }
  },
  typography: {
    fontFamily: [
      'Lato'
    ].join(','),
  },
});

export default function App() {
  let [connected, setConnected] = useState(false);
  let [ETHxBalance, setETHxBalance] = useState('');
  let [fDAIxBalance, setfDAIxBalance] = useState('');
  
  useEffect(() => {
    document.title = 'CashStream';
    document.icon
    }, []);
  
  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <CssBaseline/>
        <BrowserRouter>
          {
            connected
            ? <NavBar connected={connected} setConnected={setConnected}/>
            : <></>
          }
          <Routes>
            <Route exact path="/" element={
                connected
                ? <FlowInfo connected={connected} setConnected={setConnected} setfDAIxBalance={setfDAIxBalance} setETHxBalance={setETHxBalance}/>
                : <Main connected={connected} setConnected={setConnected}/>
              }>  
            </Route>
            <Route exact path="/stream" element={
                connected
                ? <Stream ETHxBalance={ETHxBalance} fDAIxBalance={fDAIxBalance}/>
                : <Main connected={connected} setConnected={setConnected}/>
              }>
            </Route>
            <Route exact path="/wrap" element={
              connected
              ? <WrapUnwrap ETHxBalance={ETHxBalance} fDAIxBalance={fDAIxBalance}/>
              : <Main connected={connected} setConnected={setConnected}/>
              }>
            </Route>
            <Route exact path="/subscriptions" element={
              connected
              ? <Subscriptions/>
              : <Main connected={connected} setConnected={setConnected}/>
              }>
            </Route>
            <Route exact path="/userguide" element={<UserGuide/>}></Route>
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
  </div>
  );
}
