import React, { useContext, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

import { FolderContext } from 'contexts/FolderContext.jsx';
import { ClipboardContext } from 'contexts/ClipboardContext.jsx';

import FileElement from 'pages/drive/elements/FileElement.jsx';
import FolderElement from 'pages/drive/elements/FolderElement.jsx';


export default function FolderContents ({ children }) {
  const folderContext = useContext(FolderContext);
  const clipboardContext = useContext(ClipboardContext);

  const settingsData = useSelector(state => state.settings);


  const defaultSize = 200;
  const windowRef = useRef(window.innerWidth);
  const [columnsCount, setColumnsCount] = useState(Math.floor(windowRef.current/ defaultSize));

  const handleResize = (width) => {
    setColumnsCount(Math.floor(width / defaultSize));
  }


 
  useEffect(() => {
    window.addEventListener('resize', () => handleResize(window.innerWidth));
    return () => window.removeEventListener('resize', handleResize);
  }, [])


  return (
    <div className={`scrollbar scrollbar-sky-300/20 scrollbar-corner-sky-300/20 scrollbar-track-transparent
    ${settingsData.type === 'grid' && 
    'w-full max-h-full grid gap-2 p-2 overflow-y-auto'}
    ${settingsData.type === 'list' && 'grid p-2 gap-2 '}`}
    style={{
      gridTemplateColumns: `repeat(${columnsCount}, minmax(0, 1fr))`
    }}
    >
      {clipboardContext.isCreatingFolder && (
        <FolderElement />
      )}

      {folderContext.currentFolder.uuid && <>
        {folderContext.currentFolder.files.map((file) => (
          <FileElement key={file.uuid} file={file}/>
        ))}
        {folderContext.currentFolder.folders.map((folder) => (
          <FolderElement key={folder.uuid} folder={folder} />
        ))}
        </>}
    </div>    
  );
}