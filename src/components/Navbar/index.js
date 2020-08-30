import React, { useState, useRef, useEffect, useCallback } from 'react';
import './styles.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import profileImg from 'resources/images/sample.jpg';

const navbarOpenStatus = (closed) => {
  if (closed === null) return '';
  return closed ? 'closed' : 'opened';
};

const Navbar = () => {
  const [closed, close] = useState(null);
  const navRef = useRef();

  const handleNavbarClose = useCallback(() => {
    close(true);
  }, []);

  const handleNavbarOpen = useCallback(() => {
    close(false);
  }, []);

  return (
    <div className={`navbar ${navbarOpenStatus(closed)}`} ref={navRef}>
      <div className="navbar-open-btn" onClick={handleNavbarOpen}>
        <FontAwesomeIcon icon={faBars} size="2x" onClick={handleNavbarClose} />
      </div>
      <div className="profile">
        <img src={profileImg} alt="profile" className="profile-image" />
        <div className="profile-detail">Profile Detail</div>
        <div className="navbar-close-btn">
          <FontAwesomeIcon
            icon={faBars}
            size="3x"
            onClick={handleNavbarClose}
          />
        </div>
      </div>
      <div className="works">works</div>
      <div className="new-work">new work</div>
      <div className="settings">settings</div>
      <div className="for-future">space</div>
    </div>
  );
};

export default Navbar;
