import React, { Component } from 'react';
import { ethers } from 'ethers';
import { Framework } from "@superfluid-finance/sdk-core";
import { DashboardTable } from './Dashboard';
import { Main } from "../Main";
import axios from 'axios';
import "../../css/flowInfo.css"
import { DeleteFlow } from '../DeleteFlow';
import { TokenCard } from './TokenCard';

class FlowInfo extends Component {
  constructor(props) {
    super(props)

    this.state = {
      account: '',
      tokensInfo: [],
      close: false,
      closeToken: '',
      closeAddress: '',
    }

    this.setCloseInfo = (token, addr) => {
      this.setState({
        close: true,
        closeToken: token,
        closeAddress: addr,
      });
    }

    this.openDashboard = () => {
      this.setState({
        close: false,
      })
    }

  }

  async componentDidMount(){
    await this.getWalletBalance();
    await this.getTokensInfo();

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
            
            outflows(orderBy: createdAtTimestamp, orderDirection: desc){
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
        // console.log("Tokens DATA:",tokensData);
        // Add Tokens Info to Array 
        for (let i=0; i<tokensData.length; i++){
          const tokenSymbol = tokensData[i].token.symbol

          // const balance = await this.getTokenBalance(tokenSymbol)
          
          var totalInflowRate = ethers.utils.formatEther(tokensData[i].totalInflowRate)*3600*24*30;
          var formattedInflow = " " + parseFloat(totalInflowRate.toFixed(5).toString()) + " /mo";
          
          var totalOutflowRate = ethers.utils.formatEther(tokensData[i].totalOutflowRate)*3600*24*30;
          var formattedOutflow = " " + parseFloat(totalOutflowRate.toFixed(5).toString()) + " /mo";

          var totalNetflowRate = ethers.utils.formatEther(tokensData[i].totalNetFlowRate)*3600*24*30;
          var formattedNetflow = parseFloat(totalNetflowRate.toFixed(5).toString()) + " /mo";
          
          // Add current Token To Array
          tokensInfo.push({
              name: tokenSymbol,
              // balance: 0,
              formattedInflow: formattedInflow,
              formattedOutflow: formattedOutflow,
              netflow: tokensData[i].totalNetFlowRate,
              formattedNetflow: formattedNetflow,
              history:[],
          })
        }

        // Batch Promise To Constantly Update Balance More Efficiently
        await Promise.all(tokensInfo.map(async token => (
          token.balance = await this.getTokenBalance(token.name)
        )));

        // ======== Outflows Data ========
        const outflowsData = queryResult.data.data.accounts[0].outflows
        //console.log(outflowsData)

        const outflowsInfo = []
        outflowsData.map(outflow => {
          if(outflow.currentFlowRate !== '0'){
            const time = outflow.createdAtTimestamp * 1000;
            const dateObject = new Date(time);
            const date = dateObject.toDateString();

            const outflowRate = ethers.utils.formatEther(outflow.currentFlowRate)*3600*24*30;
            const formattedOutflow = "- " + parseFloat(outflowRate.toFixed(5).toString()) + " /mo";

            const outflowDetail = {
              tokenName: outflow.token.symbol, 
              history: {
                date: date,
                id: outflow.receiver.id,
                amount: formattedOutflow,
              },
            }
            outflowsInfo.push(outflowDetail);
          }
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
          if(inflow.currentFlowRate !== '0'){

            const time = inflow.createdAtTimestamp * 1000;
            const dateObject = new Date(time);
            const date = dateObject.toDateString();

            const inflowRate = ethers.utils.formatEther(inflow.currentFlowRate)*3600*24*30;
            const formattedInflow = "+ " + parseFloat(inflowRate.toFixed(5).toString()) + " /mo";

            const inflowDetail = {
              tokenName: inflow.token.symbol, 
              history: {
                date: date,
                id: inflow.sender.id,
                amount: formattedInflow,
              },
            }
            inflowsInfo.push(inflowDetail);
          }
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
      const balanceInComa = ethers.utils.formatEther(superTokenBalance).substring(0,13);
      return balanceInComa
  }

  render() {
    return (
      <div>
        {
        this.props.connected
        ? <div className="dashboardPage">
          {
          this.state.close
          ? <DeleteFlow openDashboard = {this.openDashboard} token={this.state.closeToken} recipient={this.state.closeAddress}/>
          : <div className="dashboardContainer">
            <div className='tokenCard'>
              {
              this.state.tokensInfo.map((token) => (
                <TokenCard key={token.name} token={token}/>
              ))
              }
            </div>
            <DashboardTable tokensInfo={this.state.tokensInfo} setClose={this.setCloseInfo}/>
          </div>
          }
        </div>
        : <Main/>
        }
      </div>
    );
  }
}
  
export default FlowInfo;