import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux';
import { Box } from '@mui/material';

import { useDelayedNavigate } from 'hooks/UseDelayedNavigate';

import { setAbsolutePath, setInitialUuid } from 'state/slices/pathSlice';
import { clearUser } from 'state/slices/userSlice';
import { getDrive } from 'state/slices/driveSlice';
import { getBookmarks } from 'state/slices/bookmarkSlice';
import { getFolder } from 'state/slices/currentFolderSlice';

import { FolderContext } from 'contexts/FolderContext';

import TopPanel from 'pages/drive/panels/TopPanel/TopPanel.jsx';
import BottomPanel from 'pages/drive/panels/BottomPanel.jsx';
import SidePanel from 'pages/drive/panels/SidePanel/SidePanel.jsx';
import DropzoneWrap from 'pages/drive/wraps/DropzoneWrap.jsx';
import ContextMenuWrap from 'pages/drive/wraps/ContextMenuWrap.jsx';
import ContentsPanel from 'pages/drive/panels/ContentsPanel/ContentsPanel.jsx';

import ModalWrap from './wraps/ModalWrap';
import OverlayWrap from './wraps/OverlayWrap';


export default function DrivePanels ({ folderUuid }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const userData = useSelector(state => state.user);
  const driveData = useSelector(state => state.drive);
  const pathData = useSelector(state => state.path);
  const settingsData = useSelector(state => state.settings);

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
    if (userData) {
      dispatch(getDrive(userData));
    }
  }, [])

  useEffect(() => {
    if (driveData.uuid) {
      dispatch(getFolder({
        userData, 
        driveData, 
        folderData: { uuid: pathData.currentUuid } 
      }))
      .then(res => {
        dispatch(setAbsolutePath(res.payload.absolutePath))
      })
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

  
  // RENDER
  if (userData) {
    return (
      <Box className={`w-screen h-dvh 
      transition-all duration-300
      ${isAwaitingNavigation ? 'opacity-0' : 'opacity-100'}`}>
        <FolderContext.Provider value={{ handleLogout }}> 
          <DropzoneWrap>
            <ContextMenuWrap>
              <ModalWrap>
                <OverlayWrap>
            
                  <TopPanel />   
                  <Box className={`w-full h-full overflow-hidden grid grid-cols-[max-content_1fr] overflow-hidden
                  ${settingsData.sidePanelIsOverlayMode ? 'grid-cols-[100vw]' : 'grid-cols-[max-content_1fr]'}`}>
                    <SidePanel />
                    <Box className='w-full h-full overflow-hidden relative'>
                      <ContentsPanel />   
                      <BottomPanel />
                    </Box>
                  </Box>
                  
                </OverlayWrap>
              </ModalWrap>
            </ContextMenuWrap>
          </DropzoneWrap>
        </FolderContext.Provider>   
      </Box>
    );
  } else {
    return null;
  }
}