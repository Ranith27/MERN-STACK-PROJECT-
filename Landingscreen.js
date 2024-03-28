import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';


function Landingscreen() {
  const [showTitle, setShowTitle] = useState(false);

  useEffect(() => {
    setShowTitle(true);
  }, []);

  return (
    <div className='row landing'>
      <div className='col-md-12 text-center'>
        <h4 className={showTitle ? "animated-h2" : ""}>M&N Guest Houses</h4>
        <h3 className='animated-h3 subtitle'>Your journey starts here. Reserve your oasis today!</h3>
        <Link to='/home'>
          <button className='btn btn-primary animated-button'>Get Started</button>
        </Link>
      </div>
    </div>
  );
}

export default Landingscreen;
