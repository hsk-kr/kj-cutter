import React from 'react';
import './styles.scss';

import Navbar from 'components/Navbar';
import Cutter from 'components/Cutter';

const MainPage = () => {
  return (
    <div className="main-page">
      <Navbar />
      <Cutter className="cutter" />
    </div>
  );
};

export default MainPage;
