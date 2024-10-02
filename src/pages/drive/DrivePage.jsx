import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Outlet } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux';
import { Box } from '@mui/material';

import { useDelayedNavigate } from 'hooks/UseDelayedNavigate';

import { setInitialUuid, setAbsolutePath, confirmUpdate } from 'state/slices/PathSlice';
import { clearUser } from 'state/slices/UserSlice';
import { getDrive } from 'state/slices/DriveSlice';
import { setCounts } from 'state/slices/SelectionSlice';

import { FolderContext } from 'contexts/FolderContext';

import TopPanel from 'pages/drive/panels/TopPanel.jsx';
import BottomPanel from 'pages/drive/panels/BottomPanel.jsx';
import SidePanel from 'pages/drive/panels/SidePanel.jsx';
import PropertiesPanel from 'pages/drive/panels/PropertiesPanel.jsx';
import DropzoneWrap from 'pages/drive/wraps/DropzoneWrap.jsx';
import ClipboardWrap from 'pages/drive/wraps/ClipboardWrap.jsx';
import ContextMenuWrap from 'pages/drive/wraps/ContextMenuWrap.jsx';
import FolderContents from 'pages/drive/folder/FolderContents.jsx';

import FolderService from 'services/FolderService.jsx'
import ModalWrap from './wraps/ModalWrap';


export default function DrivePanels ({ folderUuid }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const userData = useSelector(state => state.user);
  const driveData = useSelector(state => state.drive);
  const pathData = useSelector(state => state.path);

  const { uuid } = useParams();
  if (!folderUuid) { 
    folderUuid = uuid;
  }

  const [currentFolder, setCurrentFolder] = useState({});
  const [isAwaitingNavigation, NavigateWithDelay] = useDelayedNavigate();

  // Auth
  useEffect(() => {
    if (!userData && !isAwaitingNavigation) {
      navigate('/login');
    }
  }, []);

  const handleLogout = () => {
    NavigateWithDelay('/login', 500);
    setTimeout(() => {dispatch(clearUser())}, 500);
  }

  // Update
  useEffect(() => {
    dispatch(getDrive(userData));
  }, [])

  const getFolder = async () => {
    await FolderService.handleGetByUuid(userData, driveData, { uuid: pathData.currentUuid })
    .then(res => {
      dispatch(setCounts({ filesCount: res.files.length, foldersCount: res.folders.length  }))
      setCurrentFolder(res);
      dispatch(setAbsolutePath({ currentAbsolutePath: res.absolutePath }));
    })
    .catch(err => {
      //console.error(err);
    }); 
  }

  useEffect(() => {
    if (!pathData.currentUuid) {
      dispatch(setInitialUuid({ uuid: folderUuid }));
    }

    if (pathData.currentUuid !== folderUuid) {
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
  }, [pathData.currentUuid]);

  useEffect(() => {
    if (driveData.uuid) {
      getFolder();
    }
  }, [pathData.currentUuid, driveData]);


  const handleOnContextMenu = (event) => {
    event.preventDefault();
  }

  const reorderFolders = (editedFolder) => {
    let reorderedFolders = currentFolder.folders;

    reorderedFolders = reorderedFolders.filter((folder) => {
      return (folder.uuid !== editedFolder.uuid)
    })
    
    const insertTo = (reorderedFolders.findIndex((folder) => {
      return (editedFolder.name < folder.name)
    }))
    reorderedFolders.splice(insertTo, 0, editedFolder);

    setCurrentFolder({ ...currentFolder, folders: reorderedFolders })
  }


  if (userData) {
    return (
      <Box className={`w-screen h-dvh grid grid-rows-[max-content_1fr]
      animate-fadein-custom
      ${isAwaitingNavigation ? 'opacity-0' : 'opacity-100'}`}
        onContextMenu={handleOnContextMenu}>
        <FolderContext.Provider value={{ currentFolder, setCurrentFolder, reorderFolders, handleLogout }}> 
          <ModalWrap>
            
            <TopPanel />   

            <Box className='w-full h-full overflow-hidden'>
              <DropzoneWrap>
                <ClipboardWrap>
                  <ContextMenuWrap>
                    <SidePanel />
                    <Box className='flex-1 h-full'>
                      <FolderContents />   
                    </Box> 
                  </ContextMenuWrap>
                </ClipboardWrap>   
              </DropzoneWrap>
            </Box>

            <BottomPanel />

          </ModalWrap>
        </FolderContext.Provider>   
      </Box>
    );
  } else {
    return null;
  }
}