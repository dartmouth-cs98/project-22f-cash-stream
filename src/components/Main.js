import "../css/main.css";
import metamask from '../img/metamask.png';
import tokens from '../img/tokens.png';
import send from '../img/send.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import { ConnectWallet } from "./ConnectWallet";

export const Main = (props) => {

  return(
    <div className="mainPage">
      <div className="infoContainer">
        <div className="infoSlogan">
          <p>Transfer your crypto in real-time with CashStream!</p>
        </div>
        <div className="info">
          <div className="infoItem">
            <img src={metamask}/> {/*https://icons8.com/icon/Oi106YG9IoLv/metamask-logo*/}
            <div className="infoText">
              <p className="header">1. &nbsp;&nbsp; Connect to wallet</p>
              <p className="content">Connect to Web3Provider (Metamask)</p>
            </div>
          </div>
          <div className="infoItem">
            <img src={tokens}/> {/*https://icons8.com/icon/D6Z4XXSIK1kE/token*/}
            <div className="infoText">
              <p className="header">2. &nbsp;&nbsp; Wrap your tokens</p>
              <p className="content">Convert your tokens to wrapped tokens</p>
            </div>
          </div>
          <div className="infoItem">
            <img src={send}/> {/*https://icons8.com/icon/HxucuUypRwuW/send*/}
            <div className="infoText">
              <p className="header">3. &nbsp;&nbsp; Start streaming!</p>
              <p className="content">Open a stream to another crypto wallet</p>
            </div>
          </div>     
        </div>     
        <a href="/userguide" className="link" target="_blank">
          <FontAwesomeIcon icon={faCircleInfo} className="icon"/>
          Click here to learn more about how CashStream works!
        </a>
      </div>

      <div className="graphicContainer">
        <div className='animatedNameContainer'>
          <p>Money flows with</p>
          <div className='animatedName'>
            <h1>CashStream</h1>
            <h1>CashStream</h1>
            <div className="mainConnect">
              <ConnectWallet connected={props.connected} setConnected={props.setConnected}/>
            </div>
          </div>
        </div>
      </div>
        
        
      <div className="bcMessage">
        <img src={metamask}></img>
        <p>Connect your wallet to get started!</p>
      </div>
    </div>
  )
}