import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux';

import { setInitialUuid, setAbsolutePath, confirmUpdate } from 'services/slice/PathSlice';
import { getDrive } from 'services/slice/DriveSlice';
import { setCounts } from 'services/slice/SelectionSlice';

import { FolderContext } from 'components/drive/context/FolderContext';

import SidePanel from 'components/drive/layout/SidePanel.jsx';
import PropertiesPanel from 'components/drive/layout/PropertiesPanel.jsx';
import DropzoneComponent from 'components/drive/folder/DropzoneComponent';
import CutCopyPasteComponent from 'components/drive/folder/CutCopyPasteComponent';
import ContextMenuComponent from 'components/drive/folder/ContextMenuComponent';
import FolderContentsComponent from 'components/drive/folder/FolderContentsComponent';

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
  const [doesRequireUpdate, setDoesRequireUpdate] = useState(true);
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

    if (pathData.doesRequireUpdate) {
      setDoesRequireUpdate(true);
      dispatch(confirmUpdate());
      dispatch(getDrive(userData));
    }
  });

  useEffect(() => {
    const getFolder = async () => {
      if (doesRequireUpdate) {
        setDoesRequireUpdate(false);
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