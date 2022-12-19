import { React } from "react"
import '../../css/ServicePage.css'

export const ServiceCard = () => {
    return (
        <div class="service-card">

            <div class = 'service-left'>
                <div class='service-thumbnail'>
                </div>
                
                <div class = 'service-name-and-price'>
                <div class= 'service-name'>
                    Netflix
                </div>

                <div class= 'service-price'>
                    $9/month
                </div>
                </div>
               

      
            </div>

            <a href="/" target='_blank' class ='service-right'>
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
            <h2>Hi, I am The Subscripton Page</h2>
            <ServiceCard/>
            <ServiceCard/>
            <ServiceCard/>
            <ServiceCard/>

        </div>
    )
    }
  

