import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux';

import { setInitialUuid, setAbsolutePath, confirmUpdate } from 'state/slices/PathSlice';
import { getDrive } from 'state/slices/DriveSlice';
import { setCounts } from 'state/slices/SelectionSlice';

import { FolderContext } from 'contexts/FolderContext';

import SidePanel from 'pages/drive/panels/SidePanel.jsx';
import PropertiesPanel from 'pages/drive/panels/PropertiesPanel.jsx';
import DropzoneWrap from 'pages/drive/wraps/DropzoneWrap.jsx';
import ClipboardWrap from 'pages/drive/wraps/ClipboardWrap.jsx';
import ContextMenuWrap from 'pages/drive/wraps/ContextMenuWrap.jsx';
import FolderContents from 'pages/drive/folder/FolderContents.jsx';

import FolderService from 'services/FolderService.jsx'

export default function FolderPage ({ folderUuid }) {
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const userData = useSelector(state => state.user);
  const driveData = useSelector(state => state.drive);
  const pathData = useSelector(state => state.path);

  const { uuid } = useParams();
  if (!folderUuid) { 
    folderUuid = uuid;
  }

  // Update
  const [doesRequireUpdate, setDoesRequireUpdate] = useState(true);
  const [currentFolder, setCurrentFolder] = useState();

  useEffect(() => {
    dispatch(getDrive(userData));
  }, [])

  const getFolder = async () => {
    if (doesRequireUpdate) {
      setDoesRequireUpdate(false);
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

    if (pathData.doesRequireUpdate) {
      setDoesRequireUpdate(true);
      dispatch(confirmUpdate());
      dispatch(getDrive(userData));
    }
  }, [pathData.currentUuid]);

  useEffect(() => {
    if (driveData.uuid) {
      getFolder();
    }
    
  }, [pathData.currentUuid, driveData]);

  return (
    <div className='w-full h-full overflow-hidden
    bg-gradient-to-b from-zinc-600/90 to-zinc-700/90'>
      <FolderContext.Provider value={{ currentFolder }}> 
        <DropzoneWrap>
          <ClipboardWrap>
            <ContextMenuWrap>
              <SidePanel />
              <div className='flex-1 h-full'>
                <FolderContents />   
              </div>
              {/*<PropertiesPanel />*/}
            </ContextMenuWrap>
          </ClipboardWrap>
        </DropzoneWrap>
      </FolderContext.Provider>     
    </div>
  );
}