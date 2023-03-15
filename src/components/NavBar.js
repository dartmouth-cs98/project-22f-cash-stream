// Import necessary packages
import { NavLink } from 'react-router-dom';
import { ConnectWallet } from "./ConnectWallet";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTableColumns, faBarsStaggered, faGift, faSquarePlus} from '@fortawesome/free-solid-svg-icons';
import { useLocation } from 'react-router-dom';

// Import the CSS file for this component
import "../css/navBar.css";

// Define the NavBar component
export const NavBar = (props) => {
  // Get the current location
  const location = useLocation();
  
  return(
    // Render the navigation bar
    <nav class='nav-bar'>
      <a class='nav-logo-and-items'>
        {/* Render the app name */}
        <a class="name" href="/">CashStream</a>
        
        {/* Render the connect wallet button */}
        <ConnectWallet class="connectButton" connected={props.connected} setConnected={props.setConnected}/>        
        
        <div class='nav-items'>    
          {/* Render the Dashboard link */}
          <NavLink to ="/">
            {
              // Check if the user is currently on the Dashboard page
              location.pathname == "/"
              // If yes, highlight the link
              ? <p className="nav-item-clicked"><FontAwesomeIcon icon={faTableColumns} className="icon"/>Dashboard</p>
              // If not, render the regular link
              : <p className="nav-item"><FontAwesomeIcon icon={faTableColumns} className="icon"/>Dashboard</p>
            }
          </NavLink>
          
          {/* Render the Send Stream link */}
          <NavLink to ="/stream">
            {
              // Check if the user is currently on the Send Stream page
              location.pathname == "/stream"
              // If yes, highlight the link
              ? <p className='nav-item-clicked'><FontAwesomeIcon icon={faBarsStaggered} className="icon"/>Send Stream</p>
              // If not, render the regular link
              : <p className='nav-item'><FontAwesomeIcon icon={faBarsStaggered} className="icon"/>Send Stream</p>
            }
          </NavLink>
          
          {/* Render the Wrap/Unwrap link */}
          <NavLink to ="/wrap">
            {
              // Check if the user is currently on the Wrap/Unwrap page
              location.pathname == "/wrap"
              // If yes, highlight the link
              ? <p className='nav-item-clicked'><FontAwesomeIcon icon={faGift} className="icon"/>Wrap/Unwrap</p>
              // If not, render the regular link
              : <p className='nav-item'><FontAwesomeIcon icon={faGift} className="icon"/>Wrap/Unwrap</p>
            }
          </NavLink>
          
          {/* Render the Subscriptions link */}
          <NavLink to ="/subscriptions">
            {
              // Check if the user is currently on the Subscriptions page
              location.pathname == "/subscriptions"
              // If yes, highlight the link
              ? <p className='nav-item-clicked'><FontAwesomeIcon icon={faSquarePlus} className="icon"/>Subscriptions</p>
              // If not, render the regular link
              : <p className='nav-item'><FontAwesomeIcon icon={faSquarePlus} className="icon"/>Subscriptions</p>
            }
          </NavLink>
        </div>
      </a>
    </nav>
  );  
}

// Export the component as default
export default NavBar;
