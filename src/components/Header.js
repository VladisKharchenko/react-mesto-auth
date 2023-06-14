import React from 'react';
import logo from '../images/header-logo.svg';

function Header() {
  return (
    <header className="header">
      <img
        src={logo}
        className="header__logo"
        alt="Логотип состоящий из слова Местро в степени Россия на английском"
      />
    </header>
  );
}

export default Header;
