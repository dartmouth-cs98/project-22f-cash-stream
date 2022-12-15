import { NavLink } from 'react-router-dom';
import { ConnectWallet } from "./ConnectWallet";

export const NavBar = (props) => {
  return (
    <nav className='nav-bar'>
      <a className='nav-logo-and-items'>
        <ConnectWallet class="connectButton" connected={props.connected} setConnected={props.setConnected}/>        
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
        </div>
      </a>
    </nav> 
  );  
}
export default NavBar;
