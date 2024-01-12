import { useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

import TopPanel from 'components/drive/layout/TopPanel.jsx';
import SidePanel from 'components/drive/layout/SidePanel.jsx';

export default function DrivePanels () {
  const navigate = useNavigate();

  const userData = useSelector(state => state.user);

  useEffect(() => {
    if (!userData) {
      navigate('/login');
    }
  })

  if (userData) {
    return (
      <div className='w-screen h-screen grid grid-rows-[max-content_1fr]' 
        onContextMenu={(e) => { e.preventDefault(); }}>
        <TopPanel />   
        <div className='grid grid-cols-[max-content_1fr] overflow-hidden'>
          <SidePanel />
          <Outlet />
        </div>
      </div>
    );
  } else {
    return null;
  }
}