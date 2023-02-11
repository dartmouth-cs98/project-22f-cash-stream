import { React } from "react"
import '../../css/ServicePage.css'
import spotify from '../../img/spotify.png'; {/*https://icons8.com/icons/set/spotify*/}

export const ServiceCard = () => {
    return (
      <div class="service-card">
        <div class = 'service-left'>
          <div class='service-thumbnail'><img src={spotify}/></div>
          <div class = 'service-name-and-price'>
            <div class= 'service-name'>
              Spotify
            </div>

            <div class= 'service-price'>
              0.001 ETHx/month
            </div>
          </div>          
        </div>

        <a href="https://spotify-3-0.onrender.com/" target='_blank' class ='service-right'>
          <div class ='service-subscribe-button'>
            Subscribe
          </div>
        </a>
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
  

