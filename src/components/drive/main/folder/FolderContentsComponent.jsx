import React, { useContext } from 'react';
import { useSelector } from 'react-redux';

import { FolderContext } from 'components/drive/main/context/FolderContext.jsx';
import { ContextMenuContext } from 'components/drive/main/context/ContextMenuContext.jsx';

import FileElement from 'components/drive/main/element/FileElement.jsx';
import FolderElement from 'components/drive/main/element/FolderElement.jsx';

export default function FolderContentsComponent ({ children }) {
  const folderContext = useContext(FolderContext);
  const contextMenuContext = useContext(ContextMenuContext);

  const settingsData = useSelector(state => state.settings);

  return (
    <div className={`
    ${settingsData.type === 'grid' && 
    'grid grid-cols-5 gap-4 px-4 py-4 max-h-full overflow-y-auto scrollbar scrollbar-thumb-zinc-400 scrollbar-corner-zinc-400 scrollbar-track-transparent'}
    ${settingsData.type === 'list' && 'grid grid-cols-1 gap-1 px-4 py-4'}
    `}>
      {contextMenuContext.creatingFolder && (
        <FolderElement />
      )}

      {folderContext.currentFolder && <>
        {folderContext.currentFolder.files.map((file) => (
          <FileElement key={file.uuid} file={file}/>
        ))}
        {folderContext.currentFolder.folders.map((folder) => (
          <FolderElement key={folder.uuid} folder={folder}/>
        ))}
        </>}
    </div>    
  );
}