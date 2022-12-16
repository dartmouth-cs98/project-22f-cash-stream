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
            <div class='nav-item'><FontAwesomeIcon icon={faTableColumns} className="icon"/>Dashboard</div>
          </NavLink>
          <NavLink to ="/stream"> 
            <div class='nav-item'><FontAwesomeIcon icon={faBarsStaggered} className="icon"/>Send Stream</div>
          </NavLink>
          <NavLink to ="/wrap"> 
            <div class='nav-item'><FontAwesomeIcon icon={faGift} className="icon"/>Wrap/Unwrap</div>
          </NavLink>
        </div>
      </a>
    </nav> 
  );  
}
export default NavBar;
