import { NavLink } from 'react-router-dom'
import './AlertAction.scss'
import Image from '../../assets/1xbet.jpg';
import { useEffect, useState } from 'react';

export default function AlertAction() {
  const [notShown, setNotShown] = useState(() => {
    const stored = localStorage.getItem('isShown');
    // If stored === 'false' or null, it means NOT shown yet
    return stored !== 'true';
  });

  useEffect(() => {
    if (notShown) {
      const timer = setTimeout(() => {
        setNotShown(false); // Now it's shown
        localStorage.setItem('isShown', 'true'); // Mark it as shown
      }, 10000);

      return () => clearTimeout(timer);
    }
  }, [notShown]);

  return (
    <div className='alert-action' style={{ display: notShown ? "flex" : "none" }}>
      <img src={Image} />
      <p>Get Upto 200% Bonus</p>
      <NavLink to={"https://refpa4219945.top/L?tag=d_3951731m_1573c_&site=3951731&ad=1573"} target='_blank'>GET NOW</NavLink>
    </div>
  )
}
