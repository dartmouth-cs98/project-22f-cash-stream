// Importing React and useState hooks from the react package
import { React } from "react"
import { useState } from "react";

// Importing FontAwesomeIcon and faArrowUpRightFromSquare icon from the @fortawesome package
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';

// Importing the ServicePage.css file
import '../../css/ServicePage.css'

// Importing the etherstream image
import etherstream from '../../img/etherstream.png'; {/*https://icons8.com/icons/set/ethereum*/}

// Creating a ServiceCard component
export const ServiceCard = () => {
  // Initializing copy state with "Copy Address"
  const [copy, setCopy] = useState("Copy Address")

  // Function to copy the address to the clipboard and change the copy state to "Copied!"
  function copyAddress(){
    navigator.clipboard.writeText("0x45c01ceb87dbe6807ebecb9161408fc5c6acb5d1");
    setCopy("Copied!")
  }

  // Returning the JSX for the ServiceCard component
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
        {/* Subscribe button that calls the copyAddress function on click and sets copy state to "Copied!" */}
        <div class ='service-subscribe-button' onClick={copyAddress} onMouseOut={()=>{setCopy("Copy Address")}}>{copy}</div>
        {/* Link to external website */}
        <a class='service-link' href="https://spotify-3-0.onrender.com/" target='_blank'>
          <FontAwesomeIcon icon={faArrowUpRightFromSquare}/>
        </a>
      </div>
    </div>
  )
}

// Creating a Subscriptions component that contains the ServiceCard component
export const Subscriptions = () => {
  // Returning the JSX for the Subscriptions component
  return (
      <div class='subscriptions-container'>
        <h5>Pay for your favorite streaming services with CashStream</h5>
        <ServiceCard/>
      </div>
  )
}
