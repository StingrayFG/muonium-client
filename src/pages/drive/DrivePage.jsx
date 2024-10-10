import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Outlet } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux';
import { Box } from '@mui/material';

import { useDelayedNavigate } from 'hooks/UseDelayedNavigate';

import { setInitialUuid, setAbsolutePath } from 'state/slices/PathSlice';
import { clearUser } from 'state/slices/UserSlice';
import { getDrive } from 'state/slices/DriveSlice';
import { getBookmarks } from 'state/slices/BookmarkSlice';

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
  const [currentFolder, setCurrentFolder] = useState({
    uuid: '',
    folders: [],
    files: []
  });

  useEffect(() => {
    dispatch(getDrive(userData));
    dispatch(getBookmarks(userData));
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
  const addElementsOnClient = (elements, updatedFolder) => {
    console.log(elements)
    if (elements.length > 0) {
      let reorderedFiles = updatedFolder ? updatedFolder.files : currentFolder.files;
      let reorderedFolders = updatedFolder ? updatedFolder.folders : currentFolder.folders;

      for (const element of elements) {
        if (element.type === 'file') {
          reorderedFiles.push(element);
        } else if (element.type === 'folder') {
          reorderedFolders.push(element);
        }
      }

      reorderedFiles.sort((a, b) => a.name.localeCompare(b.name));
      reorderedFolders.sort((a, b) => a.name.localeCompare(b.name));

      setCurrentFolder({ ...currentFolder, files: reorderedFiles, folders: reorderedFolders });
      return({ ...currentFolder, files: reorderedFiles, folders: reorderedFolders });
    }
  }

  const updateElementsOnClient = (elements, updatedFolder) => {
    if (elements.length > 0) {
      let reorderedFiles = updatedFolder ? updatedFolder.files : currentFolder.files;
      let reorderedFolders = updatedFolder ? updatedFolder.folders : currentFolder.folders;

      for (const element of elements) {
        if (element.type === 'file') {
          reorderedFiles.find((o, i) => {
            if (o.uuid === element.uuid) {
              reorderedFiles[i] = element;
            }
          })
        } else if (element.type === 'folder') {
          reorderedFolders.find((o, i) => {
            if (o.uuid === element.uuid) {
              reorderedFolders[i] = element;
            }
          })
        }
      }

      reorderedFiles.sort((a, b) => a.name.localeCompare(b.name));
      reorderedFolders.sort((a, b) => a.name.localeCompare(b.name));

      setCurrentFolder({ ...currentFolder, files: reorderedFiles, folders: reorderedFolders });
      return({ ...currentFolder, files: reorderedFiles, folders: reorderedFolders });
    }
  }

  const deleteElementsOnClient = (elements, updatedFolder) => {
    if (elements.length > 0) {
      let reorderedFiles = updatedFolder ? updatedFolder.files : currentFolder.files;
      let reorderedFolders = updatedFolder ? updatedFolder.folders : currentFolder.folders;

      const elementsUuids = elements.map(e => e.uuid);

      reorderedFiles = reorderedFiles.filter(file => (!elementsUuids.includes(file.uuid)))
      reorderedFolders = reorderedFolders.filter(folder => (!elementsUuids.includes(folder.uuid)))

      setCurrentFolder({ ...currentFolder, files: reorderedFiles, folders: reorderedFolders });
      return({ ...currentFolder, files: reorderedFiles, folders: reorderedFolders });
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
        addElementsOnClient, updateElementsOnClient, deleteElementsOnClient }}> 
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