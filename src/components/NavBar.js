import { NavLink } from 'react-router-dom';
import { ConnectWallet } from "./ConnectWallet";

export const NavBar = () => {
  return (
    <nav className='nav-bar'>
      <a className='nav-logo-and-items'>
        <ConnectWallet class="connectButton"/>

        
        <div class='nav-items'>    
          <NavLink to ="/" activeStyle={{ color:'red' }}> 
            <p class='nav-item'> Dashboard </p>
          </NavLink>

          <NavLink to ="/stream" activeStyle={{ color:'red' }}> 
            <p class='nav-item'> Send Stream </p>
          </NavLink>

          <NavLink activeStyle={{ color:'red' }} to ="/wrap"> 
            <p class='nav-item'> Wrap/Unwrap </p>
          </NavLink>

          <NavLink activeStyle={{ color:'red' }} to ="/subscriptions"> 
            <p class='nav-item'> Subscriptions </p>
          </NavLink>

        </div>
      </a>
    </nav> 
  );  
}
export default NavBar;
