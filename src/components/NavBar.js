import React, { Component } from "react";
// import WalletStatusBar from "./WalletStatusBar";
import {BrowserRouter, Routes, Route, NavLink} from 'react-router-dom';
// import Send from "./Send";
// import Receive from "./Receive";
// import NewWalletPage from "./NewWalletPage";
// import Transactions from "./Transactions";
import { ConnectWallet } from "./ConnectWallet";
import Dashboard from "./Dashboard";
import { CreateFlow } from "./CreateFlow";
class NavBar extends Component {
    render() {
        return (
            <BrowserRouter>
                <nav class='nav-bar'>
                    <a class='nav-logo-and-items' href='#hero'>
                        <ConnectWallet class="connectButton"/>

                        <div class='nav-items'>
                              
                                <NavLink to ="/dashboard"> 
                                    <p class='nav-item'> Dashboard </p>
                                </NavLink>
                                <NavLink to ="/stream"> 
                                    <p class='nav-item'> Send Stream </p>
                                </NavLink>

                                <NavLink to ="/receive"> 
                                    <p class='nav-item'> Wrap/Unwrap </p>
                                </NavLink>

                                <NavLink to ="/transactions"> 
                                    <p class='nav-item'> Address Book </p>
                                </NavLink>
                    </div>
                    </a>

                </nav>

                {/* This is to render the Route after NavBar */}
                <Routes>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/stream" element={<CreateFlow />} />

                </Routes>
            </BrowserRouter>    
        )
    }
}

export default NavBar;

