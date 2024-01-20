import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux';

import { setInitialUuid, setAbsolutePath, confirmUpdate } from 'services/slice/PathSlice';
import { getDrive } from 'services/slice/DriveSlice';
import { setCounts } from 'services/slice/SelectionSlice';

import { FolderContext } from 'components/drive/main/context/FolderContext';

import SidePanel from 'components/drive/layout/SidePanel.jsx';
import PropertiesPanel from 'components/drive/layout/PropertiesPanel.jsx';
import DropzoneComponent from 'components/drive/main/folder/DropzoneComponent';
import CutCopyPasteComponent from 'components/drive/main/folder/CutCopyPasteComponent';
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
      dispatch(getDrive(userData));
    }
  });

  useEffect(() => {
    const getFolder = async () => {
      if (requiresUpdate) {
        setRequiresUpdate(false);
        await FolderService.handleGetByUuid(userData, pathData.currentUuid)
        .then(res => {
          //console.log(res)
          dispatch(setCounts({ filesCount: res.files.length, foldersCount: res.folders.length  }))
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
    <div className='w-full h-full overflow-hidden
    bg-gradient-to-b from-zinc-600/90 to-zinc-700/90'>
      <FolderContext.Provider value={{ currentFolder }}> 
        <DropzoneComponent>
          <CutCopyPasteComponent>
            <ContextMenuComponent>
              <SidePanel />
              <div className='flex-1 h-full'>
                <FolderContentsComponent />   
              </div>
              <PropertiesPanel />
            </ContextMenuComponent>
          </CutCopyPasteComponent>
        </DropzoneComponent>
      </FolderContext.Provider>     
    </div>
  );
}