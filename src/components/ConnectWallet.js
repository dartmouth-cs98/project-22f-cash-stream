//The component and functions on this file are from: 
//https://docs.superfluid.finance/superfluid/developers/constant-flow-agreement-cfa/money-streaming-1

import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { Framework } from "@superfluid-finance/sdk-core";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWallet } from '@fortawesome/free-solid-svg-icons'
import "../css/connectWallet.css";
import store from "../app/store";

export const ConnectWallet = (props) => {
  
  const [currentAccount, setCurrentAccount] = useState("");
  let accounts = null;
  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }
      // const accounts = await ethereum.request({
      accounts = await ethereum.request({

        method: "eth_requestAccounts"
      });
      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
      props.setConnected(true);
      // let account = currentAccount;
      // Setup listener! This is for the case where a user comes to our site
      // and connected their wallet for the first time.
      // setupEventListener()
      updateReduxState(accounts);
    } catch (error) {
      console.log(error);
    } 
    // finally {
    //   if (accounts != null) {
    //     updateReduxState(accounts);
    //   }
    // }
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
    // const chain = await window.ethereum.request({ method: "eth_chainId" });

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

  /*
   * Function to update Redux state with our now-connected wallet info.
   */ 
  const updateReduxState = async(accounts) => {
  // const updateReduxState = async() => {

    /* 
     * Assign provider and signer to globally-scoped variables. This is done since
     * Redux does not support non-immutable type storage.
     */

    // const provider = new ethers.providers.Web3Provider(window.ethereum);     // This only work on Local Dev Server, NOT on Hosting Server [HAROLD]

    // USE DEFAULT PROVIDERS WITH API KEYS INSTEAD [HAROLD]
    // (https://docs.ethers.org/v5/api-keys/)
    const provider = ethers.getDefaultProvider(network, {
      // etherscan: YOUR_ETHERSCAN_API_KEY,
      infura: "2FTMzOge17hhTwy3mfVXN4T7L3j", // YOUR_INFURA_PROJECT_ID,
      alchemy: "Eje_Y-pqB-HZwxVWpOYEUQoB44DhjZGO",//YOUR_ALCHEMY_API_KEY,
  });

    window.provider = provider;
    const signer = provider.getSigner();
    window.signer = signer;
    console.log('signer: ', signer);
    console.log('provider: ', provider);

    /*
     * chainId is stored as a string (immutable type). Thus, we store it in Redux.
     */
    const chainId = await window.ethereum.request({ method: "eth_chainId" });
    const sf = await Framework.create({
        chainId: Number(chainId),
        provider: provider
    });

    window.sf = sf;

    const connectWalletAction = {
      type: 'wallet/connect',
      payload: {
        // provider: provider, // TODO: make this global OR create a module 
        // signer: signer,
        chainId: chainId, // string
        // sf: sf, // Framework
        account: accounts[0]
      }
    }

    store.dispatch(connectWalletAction);
    console.log('Wallet state updated.')
  }

  return(
    <div>
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