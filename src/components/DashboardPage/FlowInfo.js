import React, { Component, useEffect } from 'react';
import { ethers } from 'ethers';
import { Framework } from "@superfluid-finance/sdk-core";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import "../../css/flowInfo.css"
import { DashboardTable } from './Dashboard';
import axios from 'axios';

class FlowInfo extends Component {
  constructor(props) {
    super(props)
    this.state = {
      fDaixBalance:0,
      account: '',
      tokensInfo:[]
    }

    this.getTokensInfo = this.getTokensInfo.bind(this)
    this.getTokenBalance= this.getTokenBalance.bind(this)
  }

  async componentDidMount(){
    await this.getWalletBalance()
    await this.getTokensInfo()

    this.timerID = setInterval(
      () => this.getTokensInfo(),1000
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

  async getTokensInfo(){
     // GraphQL Query
      const TOKENS_QUERY =
       `
      query {
         accounts(
           where: {
             #enter an address below (NEED TO BE ALL LOWERCASE)
             id: "${this.state.account}"
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

      const queryResult = await axios({
        url: 'https://api.thegraph.com/subgraphs/name/superfluid-finance/protocol-v1-goerli',
        method: 'post',
        data: {
          query: TOKENS_QUERY
        }
      })

      // Get Subgraph Schema by running the Query in this playground
      // https://thegraph.com/hosted-service/subgraph/superfluid-finance/protocol-v1-goerli
      const tokensData = queryResult.data.data.accounts[0].accountTokenSnapshots      
      const tokensInfo = []

      // Add Tokens Info to Array
      for (let i=0; i<tokensData.length; i++){
        const tokenSymbol = tokensData[i].token.symbol
        const balance = await this.getTokenBalance(tokenSymbol)
        const totalInflowRate = tokensData[i].totalInflowRate
        const totalOutflowRate = tokensData[i].totalOutflowRate
        const totalNetflowRate = tokensData[i].totalNetFlowRate
        // Add current Token To Array
        tokensInfo.push({
            name: tokenSymbol,
            balance: balance,
            inflow : totalInflowRate,
            outflow: totalOutflowRate,
            netflow: totalNetflowRate,
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
        })
      }


      // console.log("TokenBalance:",tokenBalance)
      // UPDATE STATE
      this.setState({       
        tokensInfo:tokensInfo     
      }) 
      
    }

  async getTokenBalance(tokenName) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const accounts = await ethereum.request({ method: "eth_accounts" });
      const account = accounts[0]
      const chainId = await window.ethereum.request({ method: "eth_chainId" });

      const sf = await Framework.create({
        chainId: Number(chainId),
        provider: provider
      });

      const fDAIx = await sf.loadSuperToken(tokenName);
      const fDAIxAddress= fDAIx.address;

      // ================================================================
      // Real Time Balance
      const realTimeBalance= await fDAIx.realtimeBalanceOf({
          account: account,
          // timestamp: string,
          providerOrSigner: signer
      });

      const fDaixBalance = realTimeBalance.availableBalance;
      const balanceInComa = ethers.utils.formatEther(fDaixBalance).substring(0,30);
      return balanceInComa
  }

  render() {
      return (
        <ThemeProvider>
            <div className="flowInfoContainer">
              {DashboardTable(this.state.tokensInfo)}              
            </div>

            {/* <button onClick={this.getTokensInfo}>
              Fetch Tokens Data
            </button> */}
            {/* <div className="flowInfoContainer">
              <p>Your current fDAIx: {this.state.fDaixBalance}</p>
              <p>Your current netFlow: {this.state.fDaixNetflow} wei/second</p>
            </div> */}
        </ThemeProvider>
      );
    }
  }
  
  export default FlowInfo;