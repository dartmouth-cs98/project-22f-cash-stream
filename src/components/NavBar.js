import { NavLink } from 'react-router-dom';
import { ConnectWallet } from "./ConnectWallet";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTableColumns, faBarsStaggered, faGift, faSquarePlus} from '@fortawesome/free-solid-svg-icons';
import { useLocation } from 'react-router-dom';
import "../css/navBar.css";
import { ConnectWalletWagmi} from "./ConnectWalletWagmi"



export const NavBar = (props) => {
  const location = useLocation();

  return(
    <nav class='nav-bar'>
      <a class='nav-logo-and-items'>
        <ConnectWalletWagmi/>
        
        <ConnectWallet class="connectButton" connected={props.connected} setConnected={props.setConnected}/>        
        <div class='nav-items'>    
          <NavLink to ="/dashboard">
            {
              location.pathname == "/dashboard"
              ? <p className="nav-item-clicked"><FontAwesomeIcon icon={faTableColumns} className="icon"/>Dashboard</p>
              : <p className="nav-item"><FontAwesomeIcon icon={faTableColumns} className="icon"/>Dashboard</p>
            }
          </NavLink>
          <NavLink to ="/stream">
            {
              location.pathname == "/stream"
              ? <p className='nav-item-clicked'><FontAwesomeIcon icon={faBarsStaggered} className="icon"/>Send Stream</p>
              : <p className='nav-item'><FontAwesomeIcon icon={faBarsStaggered} className="icon"/>Send Stream</p>
            }
          </NavLink>
          <NavLink to ="/wrap">
            {
              location.pathname == "/wrap"
              ? <p className='nav-item-clicked'><FontAwesomeIcon icon={faGift} className="icon"/>Wrap/Unwrap</p>
              : <p className='nav-item'><FontAwesomeIcon icon={faGift} className="icon"/>Wrap/Unwrap</p>
            }
          </NavLink>
          <NavLink to ="/subscriptions">
            {
              location.pathname == "/subscriptions"
              ? <p className='nav-item-clicked'><FontAwesomeIcon icon={faSquarePlus} className="icon"/>Subscriptions</p>
              : <p className='nav-item'><FontAwesomeIcon icon={faSquarePlus} className="icon"/>Subscriptions</p>
            }
          </NavLink>
        </div>
      </a>
    </nav>
  );  
}
export default NavBar;
