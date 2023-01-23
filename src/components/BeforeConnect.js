import "../css/beforeConnect.css"
import metamask from '../img/metamask.png'

export const BeforeConnect = () => {
  return(
    <div className="beforeConnection">        
      <div className='animatedNameContainer'>
        <p>Money flows with</p>
        <div className='animatedName'>
          <h1>CashStream</h1>
          <h1>CashStream</h1>
        </div>
      </div>
      <div className="bcMessage">
        <img src={metamask}></img>
        <p>Connect your wallet to get started!</p>
      </div>
    </div>
  )
}