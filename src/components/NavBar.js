import { NavLink } from 'react-router-dom';
import { ConnectWallet } from "./ConnectWallet";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTableColumns, faBarsStaggered, faGift } from '@fortawesome/free-solid-svg-icons'
import "../css/navBar.css";

export const NavBar = (props) => {
  return (
    <nav class='nav-bar'>
      <a class='nav-logo-and-items'>
        <ConnectWallet class="connectButton" connected={props.connected} setConnected={props.setConnected}/>        
        <div class='nav-items'>    
          <NavLink to ="/"> 
            <p class='nav-item'><FontAwesomeIcon icon={faTableColumns} className="icon"/>Dashboard</p>
          </NavLink>
          <NavLink to ="/stream"> 
            <p class='nav-item'><FontAwesomeIcon icon={faBarsStaggered} className="icon"/>Send Stream</p>
          </NavLink>
          <NavLink to ="/wrap"> 
            <p class='nav-item'><FontAwesomeIcon icon={faGift} className="icon"/>Wrap/Unwrap</p>
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
