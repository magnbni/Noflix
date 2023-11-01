// Import the MUI icons
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';

// HamburgerMenu.tsx

import React, { useState } from 'react';
import './HamburgerMenu.css';

interface HamburgerMenuProps {
  items: string[];
}

const HamburgerMenu: React.FC<HamburgerMenuProps> = ({ items }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`hamburger-menu ${isOpen ? 'open' : ''}`}>
      <div className="menu-icon" onClick={toggleMenu}>
        {isOpen ? (
          <CloseRoundedIcon fontSize="large" />
        ) : (
          <MenuRoundedIcon fontSize="large" />
        )}
      </div>
      {isOpen && (
        <ul className="menu-list">
          {items.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default HamburgerMenu;
