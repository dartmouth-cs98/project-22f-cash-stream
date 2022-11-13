import React, { Component, useEffect } from 'react';
import { ethers } from 'ethers';
import { Framework } from "@superfluid-finance/sdk-core";

class FlowInfo extends Component {
    async componentDidMount(){
      // await this.getBlockNumber()
      await this.getFlow()
    //   this.timerID = setInterval(
    //     () => this.getFlow(),1000
    //   );

      
    };

    async getWalletBalance(){

    // Load account
    const accounts = await ethereum.request({ method: "eth_accounts" });
    const account = accounts[0]

    this.setState({ 
      account: accounts[0],
      accountBalance: accountBalance
    })
    


    }

    async getFlow() {
        console.log("GETFLOW!!!!!!!!!")
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();

        const accounts = await ethereum.request({ method: "eth_accounts" });
        const account = accounts[0]

        console.log(typeof account)
        const chainId = await window.ethereum.request({ method: "eth_chainId" });

        const sf = await Framework.create({
          chainId: Number(chainId),
          provider: provider
        });
      
        const fDAIx = await sf.loadSuperToken("fDAIx");
        console.log(fDAIx)
        
        const fDaixBalance = await fDAIx.balanceOf({
            account: account,
            providerOrSigner: signer
          });
          

        console.log(fDaixBalance)
    
        this.state = {
            fDaixBalance: fDaixBalance
        }

        console.log(this.state.fDaixBalance)

        return fDaixBalance
      }

    constructor(props) {
      super(props)
      this.state = {
        account: '',
        ethergram: null,
        images: [],
        loading: true
      }
    }
  
    render() {
      return (
        <div>
 
          <div>The Current FDAix is: {this.getFlow}</div>

        </div>
      );
    }
  }
  
  export default FlowInfo;