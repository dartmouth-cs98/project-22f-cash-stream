import React, { Component, useEffect } from 'react';
import { ethers } from 'ethers';
import { Framework } from "@superfluid-finance/sdk-core";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import "../../css/flowInfo.css"
// import { Dashboard } from './Dashboard';
import { DashboardTable } from './Dashboard';

class FlowInfo extends Component {
  constructor(props) {
    super(props)
    this.state = {
      fDaixBalance:0,
      account: '',
    }
  }

  async componentDidMount(){
    //await this.getBlockNumber()
    await this.getFlow()
    this.timerID = setInterval(
      () => this.getFlow(),1000
    );
  };

  async getWalletBalance(){
    // Load account
    const accounts = await ethereum.request({ method: "eth_accounts" });
    const account = accounts[0]
    this.setState({ 
      account: account,
    })
  }

  async getFlow() {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const accounts = await ethereum.request({ method: "eth_accounts" });
      const account = accounts[0]
      const chainId = await window.ethereum.request({ method: "eth_chainId" });

      const sf = await Framework.create({
        chainId: Number(chainId),
        provider: provider
      });
      const fDAIx = await sf.loadSuperToken("fDAIx");
      const fDAIxAddress= fDAIx.address;
      // ======= Get Account Flow Info =========
      const accountFlowInfo = await sf.cfaV1.getNetFlow({
          superToken: fDAIxAddress,
          account: account,
          providerOrSigner: signer
        });
      
      //const accountFlowInfoFormat = ethers.utils.formatEther(accountFlowInfo[0]);
      console.log(accountFlowInfo);
      const accountFlowInfoFormat = accountFlowInfo.toString();
      this.setState({
          fDaixNetflow: accountFlowInfoFormat
      })
      // ================================================================

      // Real Time Balance
      const realTimeBalance= await fDAIx.realtimeBalanceOf({
          account: account,
          // timestamp: string,
          providerOrSigner: signer
      });

      const fDaixBalance = realTimeBalance.availableBalance;
      const balanceInComa = ethers.utils.formatEther(fDaixBalance);
      this.setState({            
          fDaixBalance: balanceInComa.substring(0,30)
      })
  }

  testData=  {
    name:'input Test',
    balance:1,
    inflow:1,
    outflow:1,
    netflow:1,
    history:[ {
      date: '2020-01-05',
      customerId: '11091700',
      amount: 3,
    },
    {
      date: '2020-01-02',
      customerId: 'Anonymous',
      amount: 1,
    },],
  }

  // Data Container For Tokens Streams Information
  rows = [
    this.testData,
    this.testData,
    this.testData,
    this.testData,
  ];
  
  // Create Dashboard Table with Flow Datas
  dashboardTable = DashboardTable(this.rows);

  render() {
      return (
        <ThemeProvider>
            <div className="flowInfoContainer">
              {this.dashboardTable}              
            </div>
            
            <div className="flowInfoContainer">
              <p>Your current fDAIx: {this.state.fDaixBalance}</p>
              <p>Your current netFlow: {this.state.fDaixNetflow} wei/second</p>
            </div>
        </ThemeProvider>
      );
    }
  }
  
  export default FlowInfo;