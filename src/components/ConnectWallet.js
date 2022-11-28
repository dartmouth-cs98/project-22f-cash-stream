//The component and functions on this file are from: 
//https://docs.superfluid.finance/superfluid/developers/constant-flow-agreement-cfa/money-streaming-1

import React, { useState, useEffect } from "react";
import { Card } from "react-bootstrap";
import "../css/connectWallet.css";


export const ConnectWallet = () => {
  
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
      // Setup listener! This is for the case where a user comes to our site
      // and ALREADY had their wallet connected + authorized.
      // setupEventListener()
    } else {
      console.log("No authorized account found");
    }
  };

  const generateIdenticon = () => {
    const identicon = require('identicon')
    const fs = require('fs')
    // Synchronous API
    const buffer = identicon.generateSync({ id: 'ajido', size: 100})  
    var img = new Image();
    img.src = buffer;

    console.log("GENERATE IDENTICON")
    return img;
  };

  // Some how cannot put this image object in render
  const identicon = generateIdenticon() 
  

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  return(
    <div >
        {currentAccount === "" ? (
          <div id="connectWallet" onClick={connectWallet}>
            Connect Wallet
          </div>
        ) : (
          <div class="connectedWalletInfo">
            <div class='identicon'>
              <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAAXNSR0IArs4c6QAAAtlJREFUWEfN2U1oE0EUAOC30ZSQUrdqo15ElBKLh1LwBxcERQoVPIheBQtqwYsS7U0vvXj0Bw8iRIsVPKsH0UARvTTgD5QeihbRipeaWJvFNpQmZGXGjJ3MvpndmO3u7LGzs/N1Zt6btxtj9mDGAeRKHu2D2u8yLL+bcbcakAcHLLHBPDcA9oMc9jgASR/85tW/Gipg18hpKFzJwvJ7AYkMRnCd54/BN+tyeMDU9UFwKlU3UgAyHJGFDiSDupAckMdFBqTIlSoUhuvLXQeKuEiBDcgPM3nz7IBF9px4RbLEPILM5OLTieK6rg0pLBqK18bQIGk/0jvtxGJ7vKJWbFdGMQkS8Srdfwn2aA5NM8rBDZDOOtaP7vvhLDQFpDiS5/4npyn2rQjkg9I38B+OPK0FIOmOBRdDihnDF7ABFwBQhmzIFHWxJ9CFCwgoIjEcHUp11MV3bsXP1haXmN9zZLnNM/2rOVbYkMaslZnAoqj9cK+59GbKxtriPdv7kgd2l5tJGeW3n5KVj98nsT4bL53oXrjz7DPWJp1B1eDmYP9854Xjm5sBlu49n7fHxtE+JJ2tfJlDV0sbICnvsP2uFZCsiIjUDigitQTySG2BDGksZF84WNlUfjUJssok6ChWZQM6g9jZqBUQOxu1A4pILYE8UlsgQ7bt2qZJkEiKhU2Zk92/bj9BD/CgiwVVYYLmwcS+NGy5MQT2o/FQyq3K1x9AtpSvaobhjLb19P4wClaSb30BRRz7j9a65PcFpLibQ2DE/86ceK3lS5Mn0AvnmskWSn7s1FIC5y7edUhAyGYOncmAX9yVwMLVh+gHTOUBXqtNL72eQj9jYF8jyLOqhVKx49ShFAs+/vmeS9zMuwW9V7HEO/K38P07mssn9qYtulr1DMFujBQofi7BMkVkQFnki0EZCdArd/LI0IF+Tx+G/Dny2N9J4jtYFEEi/SlC0iexPw2xjqQU+Aegk72HoLL3/QAAAABJRU5ErkJggg=="></img>
            </div>
            <div class="walletInfo">
              {`${currentAccount.substring(0, 4)}...${currentAccount.substring(38)}`}
            <p>Connected</p>
            </div>
          
          </div>
        )}
    </div>
  );
};