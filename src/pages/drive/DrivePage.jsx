import { useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Box } from '@mui/material';

import TopPanel from 'pages/drive/panels/TopPanel.jsx';
import BottomPanel from 'pages/drive/panels/BottomPanel.jsx';

export default function DrivePanels () {
  const navigate = useNavigate();

  const userData = useSelector(state => state.user);

  useEffect(() => {
    if (!userData) {
      navigate('/login');
    }
  })

  const handleOnContextMenu = (event) => {
    event.preventDefault()
  }

  if (userData) {
    return (
      <Box className='w-screen h-dvh grid grid-rows-[max-content_1fr]
      animate-fadein-custom' 
        onContextMenu={handleOnContextMenu}>
        <TopPanel />   
        <Outlet />
        <BottomPanel />
      </Box>
    );
  } else {
    return null;
  }
}