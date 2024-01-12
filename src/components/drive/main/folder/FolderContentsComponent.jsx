import React, { useContext } from 'react';

import { FolderContext } from 'components/drive/main/context/FolderContext.jsx';
import { ContextMenuContext } from 'components/drive/main/context/ContextMenuContext.jsx';

import FileElement from 'components/drive/main/element/FileElement.jsx';
import FolderElement from 'components/drive/main/element/FolderElement.jsx';

export default function FolderPage ({ children }) {
  const folderContext = useContext(FolderContext);
  const contextMenuContext = useContext(ContextMenuContext);

  return (
    <div className='grid grid-cols-6 px-4 py-4'>
      {contextMenuContext.creatingFolder && (
        <FolderElement/>
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