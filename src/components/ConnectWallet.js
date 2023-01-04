//The component and functions on this file are from: 
//https://docs.superfluid.finance/superfluid/developers/constant-flow-agreement-cfa/money-streaming-1

import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWallet } from '@fortawesome/free-solid-svg-icons'
import "../css/connectWallet.css";

export const ConnectWallet = (props) => {
  
  const [currentAccount, setCurrentAccount] = useState("");
  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }
      const accounts = await ethereum.request({
        method: "eth_requestAccounts"
      });
      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
      props.setConnected(true);
      // let account = currentAccount;
      // Setup listener! This is for the case where a user comes to our site
      // and connected their wallet for the first time.
      // setupEventListener()
    } catch (error) {
      console.log(error);
    }
  };
  
  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      console.log("Make sure you have metamask!");
      return;
    } else {
      console.log("We have the ethereum object", ethereum);
    }

    const accounts = await ethereum.request({ method: "eth_accounts" });
    const chain = await window.ethereum.request({ method: "eth_chainId" });
    let chainId = chain;
    console.log("chain ID:", chain);
    console.log("global Chain Id:", chainId);
    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorized account:", account);
      setCurrentAccount(account);
      props.setConnected(true);
      // Setup listener! This is for the case where a user comes to our site
      // and ALREADY had their wallet connected + authorized.
      // setupEventListener()
    } else {
      props.setConnected(false);
      console.log("No authorized account found");
    }
  };

  const generateIdenticon = () => {
    const identicon = require('identicon')

    // Synchronous API
    const identiconImageBuffer = identicon.generateSync({ id: 'put wallet address here', size: 50})  
    return identiconImageBuffer;
  };
  

  useEffect(() => {
    checkIfWalletIsConnected();
  }, [props.connected]);

  return(
    <div >
        {!props.connected
        ? (
          <div className="connectWallet" onClick={connectWallet}><FontAwesomeIcon icon={faWallet} className="icon"/>Connect Wallet</div>
        ) 
        : (
          <div className="connectedWalletInfo">
              <img src = {generateIdenticon()} className='identicon'></img>
            <div className="walletInfo">
              {`${currentAccount.substring(0, 4)}...${currentAccount.substring(38)}`}
              <p>Connected</p>
            </div>
          </div>
        )}
    </div>
  );
};