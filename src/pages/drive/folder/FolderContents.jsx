import React, { useContext } from 'react';
import { useSelector } from 'react-redux';

import { FolderContext } from 'contexts/FolderContext.jsx';
import { ClipboardContext } from 'contexts/ClipboardContext.jsx';

import FileElement from 'pages/drive/elements/FileElement.jsx';
import FolderElement from 'pages/drive/elements/FolderElement.jsx';

export default function FolderContents ({ children }) {
  const folderContext = useContext(FolderContext);
  const clipboardContext = useContext(ClipboardContext);

  const settingsData = useSelector(state => state.settings);

  return (
    <div className={`
    ${settingsData.type === 'grid' && 
    'grid grid-cols-5 gap-4 px-4 py-4 max-h-full overflow-y-auto scrollbar scrollbar-thumb-zinc-300 scrollbar-corner-zinc-300 scrollbar-track-transparent'}
    ${settingsData.type === 'list' && 'grid grid-cols-1 gap-1 px-4 py-4'}
    `}>
      {clipboardContext.isCreatingFolder && (
        <FolderElement />
      )}

      {folderContext.currentFolder.uuid && <>
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