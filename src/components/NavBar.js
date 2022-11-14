//import WalletStatusBar from "./WalletStatusBar";
import { NavLink } from 'react-router-dom';
import { ConnectWallet } from "./ConnectWallet";

export const NavBar = () => {
  return (
    <nav className='nav-bar'>
      <a className='nav-logo-and-items' href='#hero'>
        <ConnectWallet class="connectButton"/>
        <div class='nav-items'>    
          <NavLink to ="/"> 
            <p class='nav-item'> Dashboard </p>
          </NavLink>
          <NavLink to ="/stream"> 
            <p class='nav-item'> Send Stream </p>
          </NavLink>

          <NavLink to ="/wrap"> 
            <p class='nav-item'> Wrap/Unwrap </p>
          </NavLink>

          <NavLink to ="/flow"> 
            <p class='nav-item'> Flow Info </p>
          </NavLink>
        </div>
      </a>
    </nav> 
  );  
}
export default NavBar;
