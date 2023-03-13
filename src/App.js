// Importing necessary dependencies
import "./css/styles.css"; // Importing CSS file
import { useState, useEffect } from "react"; // Importing useState and useEffect hooks from React
import { Route, Routes, BrowserRouter } from 'react-router-dom'; // Importing Route, Routes, and BrowserRouter components from react-router-dom
import  NavBar from "./components/NavBar"; // Importing the NavBar component
import FlowInfo from "./components/DashboardPage/FlowInfo"; // Importing the FlowInfo component
import { Stream } from "./components/Stream"; // Importing the Stream component
import { WrapUnwrap } from "./components/WrapUnwrap"; // Importing the WrapUnwrap component
import { Subscriptions } from "./components/ServicesPage/Subscriptions"; // Importing the Subscriptions component
import { Main } from "./components/Main"; // Importing the Main component
import { ThemeProvider, createTheme } from '@mui/material/styles'; // Importing ThemeProvider and createTheme from Material-UI
import { CssBaseline } from "@mui/material"; // Importing CssBaseline from Material-UI
import { UserGuide } from "./components/UserGuide"; // Importing the UserGuide component

// Creating a custom Material-UI theme
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

// Defining the App component as the default export
export default function App() {
  // Using state hooks to store the current status of the app
  let [connected, setConnected] = useState(false); // connected stores whether the app is connected to a wallet or not
  let [ETHxBalance, setETHxBalance] = useState(''); // ETHxBalance stores the user's ETHx balance
  let [fDAIxBalance, setfDAIxBalance] = useState(''); // fDAIxBalance stores the user's fDAIx balance
  
  // Using useEffect to set the title of the document and initialize icon
  useEffect(() => {
    document.title = 'CashStream';
    document.icon
    }, []);
  
  // Rendering the app
  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <CssBaseline/>
        <BrowserRouter>
          {/* Rendering NavBar component only when app is connected */}
          {
            connected
            ? <NavBar connected={connected} setConnected={setConnected}/>
            : <></>
          }
          {/* Using Routes component from react-router-dom to manage the app's routes */}
          <Routes>
            {/* Defining the home route */}
            <Route exact path="/" element={
                // Rendering FlowInfo component when app is connected, otherwise rendering Main component
                connected
                ? <FlowInfo connected={connected} setConnected={setConnected} setfDAIxBalance={setfDAIxBalance} setETHxBalance={setETHxBalance}/>
                : <Main connected={connected} setConnected={setConnected}/>
              }>  
            </Route>
            {/* Defining the stream route */}
            <Route exact path="/stream" element={
                // Rendering Stream component when app is connected, otherwise rendering Main component
                connected
                ? <Stream ETHxBalance={ETHxBalance} fDAIxBalance={fDAIxBalance}/>
                : <Main connected={connected} setConnected={setConnected}/>
              }>
            </Route>
            {/*
