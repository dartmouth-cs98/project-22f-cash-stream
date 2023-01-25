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
import { BeforeConnect } from "./components/BeforeConnect";

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
  
  useEffect(() => {
    document.title = 'CashStream';
    document.icon
    }, []);
  
  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <CssBaseline/>
        <BrowserRouter>
          <NavBar connected={connected} setConnected={setConnected}/>
          <Routes>
            <Route exact path="/" element={<Main/>}></Route>
            <Route exact path="/dashboard" element={
                <FlowInfo connected={connected} setConnected={setConnected}/>
              }>  
            </Route>
            <Route exact path="/stream" element={
              connected 
              ? <Stream/>
              : <BeforeConnect/>
              }>
            </Route>
            <Route exact path="/wrap" element={
              connected
              ? <WrapUnwrap/>
              : <BeforeConnect/>
              }>  
            </Route>
            <Route exact path="/subscriptions" element={
                connected
                ? <Subscriptions/>
                : <BeforeConnect/>
              }>  
            </Route>
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
  </div>
  );
}
