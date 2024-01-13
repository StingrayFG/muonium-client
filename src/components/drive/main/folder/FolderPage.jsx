import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux';

import { setInitialUuid, setAbsolutePath, confirmUpdate } from 'services/slice/PathSlice';
import { getDrive } from 'services/slice/DriveSlice';

import { FolderContext } from 'components/drive/main/context/FolderContext';

import SidePanel from 'components/drive/layout/SidePanel.jsx';
import DropzoneComponent from 'components/drive/main/folder/DropzoneComponent';
import ContextMenuComponent from 'components/drive/main/folder/ContextMenuComponent';
import FolderContentsComponent from 'components/drive/main/folder/FolderContentsComponent';

import FolderService from 'services/FolderService.jsx'

export default function FolderPage ({ folderUuid }) {
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const userData = useSelector(state => state.user);
  const pathData = useSelector(state => state.path);

  const { uuid } = useParams();
  if (!folderUuid) { 
    folderUuid = uuid;
  }

  // Update
  const [requiresUpdate, setRequiresUpdate] = useState(true);
  const [currentFolder, setCurrentFolder] = useState();
  const [requiresContextReset, setRequiresContextReset] = useState(false);

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

    if (pathData.requiresUpdate) {
      setRequiresUpdate(true);
      dispatch(confirmUpdate());
      dispatch(getDrive(userData.driveUuid))
    }
  });

  useEffect(() => {
    const getFolder = async () => {
      if (requiresUpdate) {
        setRequiresUpdate(false);
        await FolderService.handleGetByUuid(userData, pathData.currentUuid)
        .then(res => {
          console.log(res)
          setRequiresContextReset(true)
          setCurrentFolder(res);
          dispatch(setAbsolutePath({ currentAbsolutePath: res.absolutePath }));
        })
        .catch(err => {
          console.error(err);
        }); 
      }
    }
    getFolder();
  });

  return (
    <div className='w-full h-full overflow-y-scroll scrollbar-none 
    bg-gradient-to-b from-zinc-600/90 to-zinc-700/90'>
      <FolderContext.Provider value={{ currentFolder, requiresContextReset, setRequiresContextReset }}> 
        <ContextMenuComponent>
          <SidePanel />
          <DropzoneComponent>
            <FolderContentsComponent />   
          </DropzoneComponent>
        </ContextMenuComponent>
      </FolderContext.Provider>     
    </div>
  );
}