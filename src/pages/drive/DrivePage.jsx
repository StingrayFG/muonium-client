import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Outlet } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux';
import { Box } from '@mui/material';

import { useDelayedNavigate } from 'hooks/UseDelayedNavigate';

import { setInitialUuid, setAbsolutePath } from 'state/slices/PathSlice';
import { clearUser } from 'state/slices/UserSlice';
import { getDrive } from 'state/slices/DriveSlice';

import { FolderContext } from 'contexts/FolderContext';

import TopPanel from 'pages/drive/panels/TopPanel.jsx';
import BottomPanel from 'pages/drive/panels/BottomPanel.jsx';
import SidePanel from 'pages/drive/panels/SidePanel.jsx';
import DropzoneWrap from 'pages/drive/wraps/DropzoneWrap.jsx';
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

  const [currentFolder, setCurrentFolder] = useState({
    uuid: '',
    folders: [],
    files: []
  });
  const [isAwaitingNavigation, NavigateWithDelay] = useDelayedNavigate();

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
  }, [])

  useEffect(() => {
    if (driveData.uuid) {
      getFolder();
    }
  }, [pathData.currentUuid, driveData]);

  const getFolder = async () => {
    await FolderService.handleGetByUuid(userData, driveData, { uuid: pathData.currentUuid })
    .then(res => {
      setCurrentFolder(res);
      dispatch(setAbsolutePath({ currentAbsolutePath: res.absolutePath }));
    })
    .catch(err => {
      //console.error(err);
    }); 
  }


  // ROUTE SYNC
  useEffect(() => { // Syncs url route and the chosen folder
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


  // CONTEXT MENU
  const handleOnContextMenu = (event) => { // Used for top and bottom panels only
    event.preventDefault();
  }


  // CLIENT SIDE UPDATES
  const addElementOnClient = (element) => {
    if (element.type === 'file') {
      let reorderedFiles = currentFolder.files;
      const insertTo = reorderedFiles.findIndex(file => (element.name < file.name))
      reorderedFiles.splice(insertTo, 0, element);
      setCurrentFolder({ ...currentFolder, files: reorderedFiles })
    } else if (element.type === 'folder') {
      let reorderedFolders = currentFolder.folders;
      const insertTo = reorderedFolders.findIndex(folder => (element.name < folder.name))
      reorderedFolders.splice(insertTo, 0, element);
      setCurrentFolder({ ...currentFolder, folders: reorderedFolders })
    }
  }

  const updateElementOnClient = (element) => {
    if (element.type === 'file') {
      let reorderedFiles = currentFolder.files.filter(file => (file.uuid !== element.uuid))
      const insertTo = reorderedFiles.findIndex(file => (element.name < file.name))
      reorderedFiles.splice(insertTo, 0, element);
      setCurrentFolder({ ...currentFolder, files: reorderedFiles })
    } else if (element.type === 'folder') {
      let reorderedFolders = currentFolder.folders.filter(folder => (folder.uuid !== element.uuid))
      const insertTo = reorderedFolders.findIndex(folder => (element.name < folder.name))
      reorderedFolders.splice(insertTo, 0, element);
      setCurrentFolder({ ...currentFolder, folders: reorderedFolders })
    }
  }

  const deleteElementOnClient = (element) => {
    if (element.type === 'file') {
      const reorderedFiles = currentFolder.files.filter(file => (file.uuid !== element.uuid))
      setCurrentFolder({ ...currentFolder, files: reorderedFiles })
    } else if (element.type === 'folder') {
      const reorderedFolders = currentFolder.folders.filter(folder => (folder.uuid !== element.uuid))
      setCurrentFolder({ ...currentFolder, folders: reorderedFolders })
    }
  }


  // RENDER
  if (userData) {
    return (
      <Box className={`w-screen h-dvh grid grid-rows-[max-content_1fr]
      animate-fadein-custom
      ${isAwaitingNavigation ? 'opacity-0' : 'opacity-100'}`}
        onContextMenu={handleOnContextMenu}>
        <FolderContext.Provider value={{ currentFolder, setCurrentFolder, handleLogout,
        addElementOnClient, updateElementOnClient, deleteElementOnClient }}> 
          <ModalWrap>
            
            <TopPanel />   

            <Box className='w-full h-full overflow-hidden'>
              <DropzoneWrap>
                <ContextMenuWrap>
                  <SidePanel />
                  <Box className='grid grid-rows-[1fr_max-content]'>
                    <FolderContents />   
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