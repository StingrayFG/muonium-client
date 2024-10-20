import { useState, useEffect, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Box } from '@mui/material';

import { setAbsolutePath, moveToNew, moveToNext, moveToPrevious } from 'state/slices/pathSlice';
import { setViewMode } from 'state/slices/settingsSlice';

import { FolderContext } from 'contexts/FolderContext.jsx';
import { ContextMenuContext } from 'contexts/ContextMenuContext';

import FolderService from 'services/FolderService.jsx';

import { ReactComponent as ChevronLeft } from 'assets/icons/chevron-left.svg'
import { ReactComponent as ChevronRight } from 'assets/icons/chevron-right.svg'
import { ReactComponent as Grid } from 'assets/icons/grid.svg'
import { ReactComponent as ListUl } from 'assets/icons/list-ul.svg'
import { ReactComponent as BoxArrowRight } from 'assets/icons/box-arrow-right.svg'
import { ReactComponent as FolderTwo } from 'assets/icons/elements/bootstrap/folder2.svg'


export default function TopPanel () {
  const dispatch = useDispatch();

  const userData = useSelector(state => state.user);
  const driveData = useSelector(state => state.drive);
  const pathData = useSelector(state => state.path);
  const settingsData = useSelector(state => state.settings);

  const folderContext = useContext(FolderContext);
  const contextMenuContext = useContext(ContextMenuContext);


  // BUTTONS
  const handleGridView = () => {
    dispatch(setViewMode('grid'));
  }

  const handleListView = () => {
    dispatch(setViewMode('list'));
  }

  const handleNextPath = () => {
    if (pathData.positionInHistory < pathData.pathHistory.length - 1) {
      dispatch(moveToNext());
    }
  }

  const handlePreviousPath = () => {
    if (pathData.positionInHistory > 0) {
      dispatch(moveToPrevious());
    }
  }


  // PATH INPUT
  const [isEditingPath, setIsEditingPath] = useState(false);
  const [previousPath, setPreviousPath] = useState('');
  const [pathInputValue, setPathInputValue] = useState('');
  
  useEffect(() => {
    if (!pathInputValue) { 
      setPathInputValue(pathData.currentAbsolutePath); 
    } else if (pathInputValue !== pathData.currentAbsolutePath) {
      setPathInputValue(pathData.currentAbsolutePath);
      setPreviousPath(pathData.currentAbsolutePath);
      setIsEditingPath(false);
    }
  }, [pathData.currentAbsolutePath])

  const savePreviousPath = (event) => {
    setPreviousPath(event.target.value);
    setIsEditingPath(true);
  }

  const setPath = async () => {
    let path = pathInputValue;
    if (path[path.length - 1] === '/') { path = path.slice(0, path.length - 1); }
    await FolderService.handleGetByPath(userData, driveData, { absolutePath: path })
    .then(res => {
      console.log(res)
      dispatch(moveToNew({ uuid: res.uuid }));
      dispatch(setAbsolutePath({ currentAbsolutePath: path }));
      setIsEditingPath(false);
    })
    .catch(err => {
      setPathInputValue(previousPath);
      setIsEditingPath(false);
    })
  }

  const handleOnPathChange = (event) => {
    setPathInputValue(event.target.value)
  }

  const handleOnPathFocus = (event) => {
    if (!isEditingPath) {
      event.currentTarget.setSelectionRange(
        event.currentTarget.value.length,
        event.currentTarget.value.length
      )
      savePreviousPath(event);
      setIsEditingPath(true);
    }
  }

  const handleOnPathBlur = (event) => {
    if (isEditingPath) {
      setIsEditingPath(false);
      setPathInputValue(previousPath);
    }
  }

  const handleOnPathKeyDown = (event) => {
    if (event.code === 'Enter') { 
      event.target.blur()
      setPath(pathInputValue);
      setIsEditingPath(false);
    } else if (event.code === 'Escape') { 
      event.target.blur()
      setIsEditingPath(false);
      setPathInputValue(previousPath);
    }
  }
  
  
  // GET
  const getCurrentFolderName = () => {
    let name = pathInputValue.split('/').pop();
    if (name === 'home') {
      name = 'Home';
    } else if (name === 'trash') {
      name = 'Trash';
    }
    return name;  
  }


  // RENDER
  return (
    <Box className='w-full px-2 py-2 flex 
    bg-neutral-950/40 border-sky-300/20 border-b'
    onContextMenu={contextMenuContext.handleTopPanelContextMenuClick}>

        <Box className='flex'>
          <button className={`w-8 h-8 grid
          ${(pathData.positionInHistory > 0) ? 'button-small' : 'button-small-inactive'}`}
          onClick={handlePreviousPath}>
            <ChevronLeft className={`place-self-center h-5 w-5
            ${(pathData.positionInHistory > 0) ? 'opacity-100' : 'opacity-40'}`}/>
          </button>

          <button className={`w-8 h-8 ml-1 grid
          ${(pathData.positionInHistory < (pathData.pathHistory.length - 1)) ? 'button-small' : 'button-small-inactive'}`}
          onClick={handleNextPath}>
            <ChevronRight className={`place-self-center h-5 w-5
            ${(pathData.positionInHistory < (pathData.pathHistory.length - 1)) ? 'opacity-100' : 'opacity-40'}`}/>
          </button>

          <Box className='separator-vertical' />

          <button className={`w-8 h-8 grid 
          ${(settingsData.viewMode === 'grid') ? 'button-small-selected' : 'button-small'}`}
          onClick={handleGridView}>
            <Grid className={`place-self-center h-5 w-5`} />
          </button>
          <button className={`w-8 h-8 grid ml-1
          ${(settingsData.viewMode === 'list') ? 'button-small-selected' : 'button-small'}`}
          onClick={handleListView}>
            <ListUl className={`place-self-center h-5 w-5`} />      
          </button>

          <Box className='separator-vertical' />
        </Box> 

        <Box className='w-full h-8 relative'>

          <Box className={`w-full h-8 flex absolute
          transition-all duration-300
          ${isEditingPath ? 'opacity-100' : 'opacity-0' }`}>
            <FolderTwo className='mt-2 ml-2 h-4 w-4' />
            <input className={`w-full -ml-6 pl-7 pr-2 place-self-center
            outline-none resize-none
            bg-black/20 border-sky-300/20 focus:bg-black/20 focus:border-sky-300/20 rounded-lg`}   
            name='path'
            value={pathInputValue}
            onChange={handleOnPathChange}
            onBlur={handleOnPathBlur}
            onFocus={handleOnPathFocus}
            onKeyDown={handleOnPathKeyDown} />
          </Box>

          <Box className={`w-full h-8 px-2 flex 
          transition-all duration-300
          ${isEditingPath ? 'opacity-0 pointer-events-none' : 'opacity-100' }`}>
            <ChevronRight className='mt-2 h-4 w-4' />
            <p className='h-8 ml-1'>
              {getCurrentFolderName()}
            </p>
          </Box>
 
        </Box>

        <Box className='separator-vertical' />

        <Box className='ml-auto flex'>
          <Box className='mr-2'>
            <p className='place-self-center'>{userData.login}</p>
          </Box>
          <button className='w-8 h-8 grid'
          onClick={folderContext.handleLogout}>
            <BoxArrowRight className='place-self-center h-5 w-5' />
          </button >    
        </Box>
        
    </Box>
  );
}