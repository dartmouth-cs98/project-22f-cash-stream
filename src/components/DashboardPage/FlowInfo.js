import React, { Component, useEffect } from 'react';
import { ethers } from 'ethers';
import { Framework } from "@superfluid-finance/sdk-core";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import "../../css/flowInfo.css"
// import { Dashboard } from './Dashboard';
import { DashboardTable } from './Dashboard';

import { request, gql } from "graphql-request";
import { useQuery } from 'react-query';

import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import axios from 'axios';
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
    this.getWalletBalance()
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

  getTokensInfo(){
     // GraphQL Query
      const TOKENS_QUERY =
       `
      query {
         accounts(
           where: {
             #enter an address below
             id: "0xa35a21adcb4490816d26a798394223dd67dab652"
           }
         ) {
           accountTokenSnapshots {
             token {
               symbol
             }
             totalInflowRate
             totalOutflowRate
             totalNetFlowRate
           }
         }
       }
       `

      axios({
        url: 'https://api.thegraph.com/subgraphs/name/superfluid-finance/protocol-v1-goerli',
        method: 'post',
        data: {
          query: TOKENS_QUERY
        }
      }).then((result) => {
        console.log("TOKENS DATAAAAAAAAAAAAAAAAAA:",result.data.data.accounts[0].accountTokenSnapshots)
      });
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

      // ======= Get Account Tokens Info =========
      const pageResult = await sf.query.listUserInteractedSuperTokens({account:account})
      const tokensData = pageResult.data
      const tokensArray = []
      for (let i=0; i<tokensData.length; i++){
        tokensArray.push(tokensData[i].token.symbol)
      }

      // ======= Get Account NetFlow Info =========
      const accountNetFlowInfo = await sf.cfaV1.getNetFlow({
          superToken: fDAIxAddress,
          account: account,
          providerOrSigner: signer
        }); 
      
      const accountFlowInfoFormat = accountNetFlowInfo.toString();
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

  // ========================== Dashboard Table Data ================================
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
            <button onClick={this.getTokensInfo}>
              Fetch Tokens Data
            </button>
            <div className="flowInfoContainer">
              <p>Your current fDAIx: {this.state.fDaixBalance}</p>
              <p>Your current netFlow: {this.state.fDaixNetflow} wei/second</p>
            </div>
        </ThemeProvider>
      );
    }
  }
  
  export default FlowInfo;