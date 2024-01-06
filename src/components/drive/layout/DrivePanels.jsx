import { Outlet } from "react-router-dom";

import TopPanel from 'components/drive/layout/TopPanel.jsx';
import SidePanel from 'components/drive/layout/SidePanel.jsx';

export default function DrivePanels () {
  return (
    <div className='w-screen h-screen grid grid-rows-[max-content_1fr]'>
      <TopPanel />   
      <div className='grid grid-cols-[max-content_1fr]'>
        <SidePanel />
        <Outlet />
      </div>
    </div>
  );
}