import React from 'react';
import Logo from '../logo';
import '../Navbar.css';

function Navbar() {
  return (
    <nav>
      <Logo />
      <ul className='navul'>
        <li><a href="/">Dashboard</a></li>
        <li><a href="/customers">Customers</a></li>
        <li><a href="/inventories">Inventory</a></li>
        <li><a href="/orders">Orders</a></li>
      </ul>
    </nav>
  );
}

export default Navbar;
