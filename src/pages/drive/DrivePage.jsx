import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux';
import { Box } from '@mui/material';

import { useDelayedNavigate } from 'hooks/UseDelayedNavigate';

import { setInitialUuid } from 'state/slices/pathSlice';
import { clearUser } from 'state/slices/userSlice';
import { getDrive } from 'state/slices/driveSlice';
import { getBookmarks } from 'state/slices/bookmarkSlice';
import { getFolder } from 'state/slices/currentFolderSlice';

import { FolderContext } from 'contexts/FolderContext';

import TopPanel from 'pages/drive/panels/TopPanel.jsx';
import BottomPanel from 'pages/drive/panels/BottomPanel.jsx';
import SidePanel from 'pages/drive/panels/SidePanel.jsx';
import DropzoneWrap from 'pages/drive/wraps/DropzoneWrap.jsx';
import ContextMenuWrap from 'pages/drive/wraps/ContextMenuWrap.jsx';
import ContentsPanel from 'pages/drive/panels/ContentsPanel.jsx';

import ModalWrap from './wraps/ModalWrap';


export default function DrivePanels ({ folderUuid }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const userData = useSelector(state => state.user);
  const driveData = useSelector(state => state.drive);
  const pathData = useSelector(state => state.path);

  const [isAwaitingNavigation, NavigateWithDelay] = useDelayedNavigate();

  const { uuid } = useParams();
  const usedFolderUuid = folderUuid ? folderUuid : uuid;
  

  // AUTH
  useEffect(() => {
    if (!userData && !isAwaitingNavigation) {
      navigate('/login');
    }
  }, []);

  const handleLogout = () => {
    NavigateWithDelay('/login', 500);
    setTimeout(() => {dispatch(clearUser())}, 500);
  }


  // UPDATE
  useEffect(() => {
    dispatch(getDrive(userData));
    dispatch(getBookmarks(userData));
  }, [])

  useEffect(() => {
    if (driveData.uuid) {
      dispatch(getFolder({
        userData, 
        driveData, 
        folderData: { uuid: pathData.currentUuid } 
      }))
    }
  }, [pathData.currentUuid, driveData]);


  // ROUTE SYNC
  useEffect(() => { // Syncs url route and the chosen folder
    if (!pathData.currentUuid) {
      dispatch(setInitialUuid({ uuid: usedFolderUuid }));
    }

    if (pathData.currentUuid !== usedFolderUuid) {
      if (pathData.currentUuid === 'trash') { 
        navigate('/drive/trash'); 
      }
      else if (pathData.currentUuid === 'home') { 
        navigate('/drive/home'); 
      }
      else if (pathData.currentUuid) { 
        navigate('/drive/folder/' + pathData.currentUuid); 
      }
    } 
  }, [pathData.currentUuid, usedFolderUuid]);


  // CONTEXT MENU
  const handleOnContextMenu = (event) => { // Used for top and bottom panels only
    event.preventDefault();
  }


  // RENDER
  if (userData) {
    return (
      <Box className={`w-screen h-dvh grid grid-rows-[max-content_1fr]
      animate-fadein-custom
      ${isAwaitingNavigation ? 'opacity-0' : 'opacity-100'}`}
        onContextMenu={handleOnContextMenu}>
        <FolderContext.Provider value={{ handleLogout }}> 
          <ModalWrap>
            
            <TopPanel />   

            <Box className='w-full h-full overflow-hidden'>
              <DropzoneWrap>
                <ContextMenuWrap>
                  <SidePanel />
                  <Box className='grid grid-rows-[1fr_max-content] overflow-hidden'>
                    <ContentsPanel />   
                    <BottomPanel />
                  </Box> 
                </ContextMenuWrap>
              </DropzoneWrap>
            </Box>

          </ModalWrap>
        </FolderContext.Provider>   
      </Box>
    );
  } else {
    return null;
  }
}