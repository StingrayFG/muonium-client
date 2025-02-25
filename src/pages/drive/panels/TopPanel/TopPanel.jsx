import { useState, useEffect, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Box } from '@mui/material';

import { setAbsolutePath, moveToNew, moveToNext, moveToPrevious } from 'state/slices/pathSlice';
import { setViewMode } from 'state/slices/settingsSlice';

import { DrivePageContext } from 'contexts/DrivePageContext.jsx';
import { ContextMenuContext } from 'contexts/ContextMenuContext';

import FolderService from 'services/FolderService.jsx';

import { ReactComponent as ChevronLeft } from 'assets/icons/chevron-left.svg'
import { ReactComponent as ChevronRight } from 'assets/icons/chevron-right.svg'
import { ReactComponent as Grid } from 'assets/icons/grid.svg'
import { ReactComponent as ListUl } from 'assets/icons/list-ul.svg'
import { ReactComponent as List } from 'assets/icons/list.svg'
import { ReactComponent as BoxArrowRight } from 'assets/icons/box-arrow-right.svg'
import { ReactComponent as FolderTwo } from 'assets/icons/elements/bootstrap/folder2.svg'
import { ReactComponent as Gear } from 'assets/icons/gear.svg'

export default function TopPanel () {
  const dispatch = useDispatch();

  const userData = useSelector(state => state.user);
  const driveData = useSelector(state => state.drive);
  const pathData = useSelector(state => state.path);
  const settingsData = useSelector(state => state.settings);

  const drivePageContext = useContext(DrivePageContext);
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

  const handleOnMenuMouseDown = (event) => {
    if (event.button === 0) {
      contextMenuContext.handleMainMenuClick(event);
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

  const getMenuButtonStyle = () => {
    if (contextMenuContext.isContextMenuOpen && (contextMenuContext.contextMenuType === 'main')) {
      return 'button-small-active'
    } else {
      return 'button-small'
    }
  }

  
  // RENDER
  return (
    <Box className='w-full px-2 py-2 flex 
    shadow-md
    bg-neutral-950/60 border-sky-300/20 border-b'
    onContextMenu={contextMenuContext.handleTopPanelContextMenuClick}>

      <Box className='flex'>
        <Box className={`button-small
        ${(pathData.positionInHistory > 0) ? '' : 'button-small-inactive'}`}
        onClick={handlePreviousPath}>
          <ChevronLeft className={`place-self-center h-5 w-5
          ${(pathData.positionInHistory > 0) ? 'opacity-100' : 'opacity-40'}`}/>
        </Box>

        <Box className={`button-small ml-2
        ${(pathData.positionInHistory < (pathData.pathHistory.length - 1)) ? '' : 'button-small-inactive'}`}
        onClick={handleNextPath}>
          <ChevronRight className={`place-self-center h-5 w-5
          ${(pathData.positionInHistory < (pathData.pathHistory.length - 1)) ? 'opacity-100' : 'opacity-40'}`}/>
        </Box>
        
        <Box className='hidden md:flex'>
          <Box className='separator-vertical' />

          <Box className={`button-small
          ${(settingsData.viewMode === 'grid') ? 'button-small-selected' : ''}`}
          onClick={handleGridView}>
            <Grid className='button-small-icon'/>
          </Box>

          <Box className={`button-small ml-2
          ${(settingsData.viewMode === 'list') ? 'button-small-selected' : ''}`}
          onClick={handleListView}>
            <ListUl className='button-small-icon'/>
          </Box>
        </Box>

      </Box> 

      <Box className='separator-vertical' />

      <Box className='w-full relative'>
        <Box className={`w-full h-8 flex absolute
        transition-all duration-300
        ${isEditingPath ? 'opacity-100' : 'opacity-0' }`}>
          <FolderTwo className='mt-2 ml-2 h-4 w-4' />
          <input className={`w-full -ml-6 pl-7 pr-2 place-self-center
          rounded-lg`}   
          name='path'
          value={pathInputValue}
          onChange={handleOnPathChange}
          onBlur={handleOnPathBlur}
          onFocus={handleOnPathFocus}
          onKeyDown={handleOnPathKeyDown} />
        </Box>

        <Box className={`w-full h-8 px-2 flex 
        transition-all duration-300
        ${isEditingPath ? 'opacity-0 pointer-events-none' : pathData.currentAbsolutePath ? 'opacity-100' : 'opacity-0' }`}>
          <ChevronRight className='mt-2 h-4 w-4' />
          <p className='my-auto ml-1'>
            {getCurrentFolderName()}
          </p>
        </Box>
      </Box>

      <Box className='separator-vertical' />

      <Box className='flex'>
        <Box className={`button-small
        ${getMenuButtonStyle()}`}
        onMouseDown={handleOnMenuMouseDown}>
          <List className='button-small-icon pointer-events-none'/>
        </Box>
      </Box>

      

      <Box className='ml-auto
      hidden md:flex'>
        <Box className='separator-vertical' />

        <Box className='h-8 mr-2 
        grid 
        animate-fadein-custom'>
          <p className={`place-self-center
          transition-all duration-300
          ${userData.login ? 'opacity-100' : 'opacity-0'}`}>
            {userData.login}
          </p>
        </Box>
        <Box className='button-small'
        onClick={drivePageContext.handleLogout}>
          <BoxArrowRight className='button-small-icon' />
        </Box >    
      </Box>
        
    </Box>
  );
}