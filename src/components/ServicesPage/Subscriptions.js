import { React } from "react"
import { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';
import '../../css/ServicePage.css'
import etherstream from '../../img/etherstream.png'; {/*https://icons8.com/icons/set/ethereum*/}

export const ServiceCard = () => {
  const [copy, setCopy] = useState("Copy Address")

  function copyAddress(){
    navigator.clipboard.writeText("0x45c01ceb87dbe6807ebecb9161408fc5c6acb5d1");
    setCopy("Copied!")
  }

  return (
    <div class="service-card">
      <div class = 'service-left'>
        <div class='service-thumbnail'><img src={etherstream}/></div>
        <div class = 'service-name-and-price'>
          <div class= 'service-name'>
            Ether Stream
          </div>

          <div class='service-price'>
            0.001 ETHx/month
          </div>
        </div>          
      </div>

      <div>
        <div class ='service-subscribe-button' onClick={copyAddress} onMouseOut={()=>{setCopy("Copy Address")}}>{copy}</div>
        <a class='service-link' href="https://spotify-3-0.onrender.com/" target='_blank'>
          <FontAwesomeIcon icon={faArrowUpRightFromSquare}/>
        </a>
      </div>
    </div>
  )
}


export const Subscriptions = () => {
  return (
      <div class='subscriptions-container'>
        <h5>Pay for your favorite streaming services with CashStream</h5>
        <ServiceCard/>
      </div>
  )
}
  

