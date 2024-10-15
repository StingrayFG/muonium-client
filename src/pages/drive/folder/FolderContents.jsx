import React, { useContext, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Box } from '@mui/material';

import { ContextMenuContext } from 'contexts/ContextMenuContext.jsx';

import FileElement from 'pages/drive/elements/FileElement.jsx';
import FolderElement from 'pages/drive/elements/FolderElement.jsx';


export default function FolderContents () {
  const currentFolderData = useSelector(state => state.currentFolder);

  const contextMenuContext = useContext(ContextMenuContext);

  const settingsData = useSelector(state => state.settings);


  const elementSize = 160;
  const contentsRef = useRef(null);
  const [columnsCount, setColumnsCount] = useState(Math.floor(contentsRef?.current?.clientWidth / elementSize));

  useEffect(() => {
    if (!contentsRef.current) return;
    const resizeObserver = new ResizeObserver(() => {
      setColumnsCount(Math.floor(contentsRef?.current?.clientWidth / elementSize));
    });
    resizeObserver.observe(contentsRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  return (
    <Box className={`scrollbar scrollbar-thumb-gray-700 scrollbar-track-transparent
    ${settingsData.viewMode === 'grid' &&  'w-full h-fit max-h-full grid overflow-y-auto'}`}
    style={{
      gridTemplateColumns: `repeat(${columnsCount}, minmax(0, 1fr))`
    }}
    ref={contentsRef}>
      {contextMenuContext.isCreatingFolder && (
        <FolderElement elementSize={elementSize}/>
      )}

      {currentFolderData.uuid && <>
        {currentFolderData.folders.map((folder) => (
          <FolderElement key={folder.uuid} folder={folder} elementSize={elementSize}/>
        ))}
        {currentFolderData.files.map((file) => (
          <FileElement key={file.uuid} file={file} elementSize={elementSize}/>
        ))}
      </>}
    </Box>  
  )  
}