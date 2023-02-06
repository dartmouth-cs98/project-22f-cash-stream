import React, { Component } from 'react';
import { ethers } from 'ethers';
import { Framework } from "@superfluid-finance/sdk-core";
import "../../css/flowInfo.css"
import { DashboardTable } from './Dashboard';
import { Main } from "../Main";
import axios from 'axios';

class FlowInfo extends Component {
  constructor(props) {
    super(props)

    this.state = {
      fDaixBalance:0,
      account: '',
      tokensInfo: []
    }

    //this.getTokensInfo = this.getTokensInfo.bind(this)
    //this.getTokenBalance= this.getTokenBalance.bind(this)
  }

  async componentDidMount(){

    await this.getWalletBalance()
    
    this.timerID = setInterval(
      () => {
        if (this.props.connected) {
          this.getWalletBalance();
          this.getTokensInfo();
        }
      }, 1000
    );
  };

  async getWalletBalance(){
    // Load account
    const accounts = await ethereum.request({ method: "eth_accounts" });
    const account = accounts[0];

    if (account !== undefined) {
      this.setState({ 
        account: account,
      })
    }
    else{
      this.props.setConnected(false);
      this.setState({account: "",});
    }
  }

  async getTokensInfo(){
    const account = this.state.account;

    if (account !== undefined){
      if(this.state.account !== ""){

        //GraphQL Query (https://console.superfluid.finance/subgraph?_network=goerli)
        const TOKENS_QUERY =
        `
        query {
          accounts(where: {
          #enter an address below
          id: "${this.state.account}"
          })
          
          {
            
           # Get Account's Tokens Info
            accountTokenSnapshots {
              token {
                symbol
              }
              totalInflowRate
              totalOutflowRate
              totalNetFlowRate
            }
            
            # Get Account's Stream History
            inflows {
              token{
                symbol
              }
              createdAtTimestamp
              sender {
                id
              }
              currentFlowRate
            }
            outflows {
              token {
                symbol
              }
              createdAtTimestamp
              receiver {
                id
              }
              currentFlowRate
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
        console.log("Tokens DATA:",tokensData);
        // Add Tokens Info to Array 
        for (let i=0; i<tokensData.length; i++){
          const tokenSymbol = tokensData[i].token.symbol
          // const balance = await this.getTokenBalance(tokenSymbol)
          const totalInflowRate = tokensData[i].totalInflowRate
          const totalOutflowRate = tokensData[i].totalOutflowRate
          const totalNetflowRate = tokensData[i].totalNetFlowRate
          
          // Add current Token To Array
          tokensInfo.push({
              name: tokenSymbol,
              // balance: 0,
              inflow : ethers.utils.formatEther(totalInflowRate).substring(0,30),
              outflow: ethers.utils.formatEther(totalOutflowRate).substring(0,30),
              netflow: ethers.utils.formatEther(totalNetflowRate).substring(0,30),
              history:[],
          })
        }

        // Batch Promise To Constantly Update Balance More Efficiently
        await Promise.all(tokensInfo.map(async token => (
          token.balance = await this.getTokenBalance(token.name)
        )));


        // ======== Outflows Data ========
        const outflowsData = queryResult.data.data.accounts[0].outflows
        const outflowsInfo = []
        outflowsData.map(outflow => {
          const outflowDetail = {
            tokenName: outflow.token.symbol, 
            history: {
              date: outflow.createdAtTimestamp,
              customerId: outflow.receiver.id,
              amount: -outflow.currentFlowRate,
            },
          }
          outflowsInfo.push(outflowDetail);
        })

        // Push Outflow Info into TokensInfo
        outflowsInfo.map(outflowDetail => {
          tokensInfo.map(tokenDetail => {
            if (tokenDetail.name == outflowDetail.tokenName){
              tokenDetail.history.push(outflowDetail.history);
            }
          })
        })

        // ======== Inflows Data ========
        const inflowsData = queryResult.data.data.accounts[0].inflows
        const inflowsInfo = []
        inflowsData.map(inflow => {
          const inflowDetail = {
            tokenName: inflow.token.symbol, 
            history: {
              date: inflow.createdAtTimestamp,
              customerId: inflow.sender.id,
              amount: +inflow.currentFlowRate,
            },
          }
          inflowsInfo.push(inflowDetail);
        })

        // Push inflow Info into TokensInfo
        inflowsInfo.map(inflowDetail => {
          tokensInfo.map(tokenDetail => {
            if (tokenDetail.name == inflowDetail.tokenName){
              tokenDetail.history.push(inflowDetail.history);
            }
          })
        })



        // // ======== Inflows Data ========
        // const inflowsData = queryResult.data.data.accounts[0].inflows      
        // const inflowsInfo = []
        // inflowsData.map(inflow => {
        //   console.log("===========================")
        //   console.log("Token:",inflow.token.symbol);
        //   console.log("Sender:",inflow.sender.id);
        //   console.log("Time:",inflow.createdAtTimestamp);
        //   console.log("FlowRate:", inflow.currentFlowRate);
        //   console.log("===========================")
        // })


        // UPDATE STATE
        this.setState({       
          tokensInfo:tokensInfo     
        })
      }
    }
    else {
      this.props.setConnected(false);
      this.setState({account: "",});
    }
  }


  async getTokenBalance(tokenName) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const account = this.state.account;
      const chainId = await window.ethereum.request({ method: "eth_chainId" });

      const sf = await Framework.create({
        chainId: Number(chainId),
        provider: provider
      });

      // ERROR TRY/CATCH FOR UNOFFICIAL TOKENS THAT CANT GET BALANCE
      try {
        const superToken = await sf.loadSuperToken(tokenName);
      }
      catch (error) {
        console.log(tokenName,": Not Found ", error);
        return "N/A"
      }

      const superToken = await sf.loadSuperToken(tokenName);
      // const fDAIxAddress= superToken.address;
      // ================================================================
      // Real Time Balance
      const realTimeBalance= await superToken.realtimeBalanceOf({
          account: account,
          // timestamp: string,
          providerOrSigner: signer
      });

      const superTokenBalance = realTimeBalance.availableBalance;
      const balanceInComa = ethers.utils.formatEther(superTokenBalance).substring(0,30);
      return balanceInComa
  }

  render() {
    return (
      <div>
        {
        this.props.connected
        ? <div className="flowInfoContainer"> {DashboardTable(this.state.tokensInfo)}</div>
        : <Main/>
        }
      </div>
    );
  }
}
  
export default FlowInfo;