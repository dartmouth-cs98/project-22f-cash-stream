//import WalletStatusBar from "./WalletStatusBar";
import { NavLink } from 'react-router-dom';
import { ConnectWallet } from "./ConnectWallet";

export const NavBar = () => {
  return (
    <nav className='nav-bar'>
      <a className='nav-logo-and-items' href='#hero'>
        <ConnectWallet className="connectButton"/>
        <div className='nav-items'>    
          <NavLink to ="/"> 
            <p className='nav-item'> Dashboard </p>
          </NavLink>
          <NavLink to ="/stream"> 
            <p className='nav-item'> Send Stream </p>
          </NavLink>

          <NavLink to ="/wrap"> 
            <p className='nav-item'> Wrap/Unwrap </p>
          </NavLink>

          <NavLink to ="/flow"> 
            <p className='nav-item'> Flow Info </p>
          </NavLink>
        </div>
      </a>
    </nav> 
  );  
}
export default NavBar;
