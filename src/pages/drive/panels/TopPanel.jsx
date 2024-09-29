import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Box } from '@mui/material';

import { setAbsolutePath, moveToNew, moveToNext, moveToPrevious } from 'state/slices/PathSlice';
import { setType } from 'state/slices/SettingsSlice';

import { FolderContext } from 'contexts/FolderContext.jsx';

import FolderService from 'services/FolderService.jsx';

import { ReactComponent as ChevronLeft } from 'assets/icons/chevron-left.svg'
import { ReactComponent as ChevronRight } from 'assets/icons/chevron-right.svg'
import { ReactComponent as Grid } from 'assets/icons/grid.svg'
import { ReactComponent as ListUl } from 'assets/icons/list-ul.svg'
import { ReactComponent as BoxArrowRight } from 'assets/icons/box-arrow-right.svg'
import { ReactComponent as FolderTwo } from 'assets/icons/folder2.svg'


export default function TopPanel () {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const userData = useSelector(state => state.user);
  const driveData = useSelector(state => state.drive);
  const pathData = useSelector(state => state.path);
  const settingsData = useSelector(state => state.settings);

  const folderContext = useContext(FolderContext);

  const handleGridView = () => {
    dispatch(setType('grid'));
  }

  const handleListView = () => {
    dispatch(setType('list'));
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


  const [isEditingPath, setIsEditingPath] = useState(false);
  const [previousPath, setPreviousPath] = useState('');
  const [inputValue, setInputValue] = useState('');
  
  useEffect(() => {
    if (!inputValue) { 
      setInputValue(pathData.currentAbsolutePath); 
    } else if (inputValue !== pathData.currentAbsolutePath) {
      setInputValue(pathData.currentAbsolutePath);
      setPreviousPath(pathData.currentAbsolutePath);
      setIsEditingPath(false);
    }
  }, [pathData.currentAbsolutePath])

  const savePreviousPath = (event) => {
    setPreviousPath(event.target.value);
    setIsEditingPath(true);
  }

  const setPath = async () => {
    let path = inputValue;
    if (path[path.length - 1] === '/') { path = path.slice(0, path.length - 1); }
    await FolderService.handleGetByPath(userData, driveData, { absolutePath: path })
    .then(res => {
      console.log(res)
      dispatch(moveToNew({ uuid: res.uuid }));
      dispatch(setAbsolutePath({ currentAbsolutePath: path }));
      setIsEditingPath(false);
    })
    .catch(err => {
      setInputValue(previousPath);
      setIsEditingPath(false);
    })
  }

  const handleOnPathChange = (event) => {
    setInputValue(event.target.value)
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
      setInputValue(previousPath);
    }
  }

  const handleOnPathKeyDown = (event) => {
    if (event.code === 'Enter') { 
      event.target.blur()
      setPath(inputValue);
      setIsEditingPath(false);
    } else if (event.code === 'Escape') { 
      event.target.blur()
      setIsEditingPath(false);
      setInputValue(previousPath);
    }
  }
  

  const getCurrentFolderName = () => {
    let name = inputValue.split('/').pop();
    if (name === 'home') {
      name = 'Home';
    } else if (name === 'trash') {
      name = 'Trash';
    }
    return name;
  }


  return (
    <Box className='w-full px-2 py-2 flex 
    border-sky-300/20 border-b'>

        <Box className='flex'>
          <button className={`w-8 h-8 grid
          ${(pathData.positionInHistory > 0) ? '' : 'button-inactive'}`}
          onClick={handlePreviousPath}>
            <ChevronLeft className={`place-self-center h-5 w-5
            ${(pathData.positionInHistory > 0) ? 'opacity-100' : 'opacity-40'}`}/>
          </button>

          <button className={`w-8 h-8 ml-1 grid
          ${(pathData.positionInHistory < (pathData.pathHistory.length - 1)) ? '' : 'button-inactive'}`}
          onClick={handleNextPath}>
            <ChevronRight className={`place-self-center h-5 w-5
            ${(pathData.positionInHistory < (pathData.pathHistory.length - 1)) ? 'opacity-100' : 'opacity-40'}`}/>
          </button>

          <Box className='separator-vertical' />

          <button className={`w-8 h-8 grid
          ${(settingsData.type === 'grid') && 'bg-white/10'}`}
          onClick={handleGridView}>
            <Grid className={`place-self-center h-5 w-5`} />
          </button>
          <button className={`w-8 h-8 grid ml-1
          ${(settingsData.type === 'list') && 'bg-white/10'}`}
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
            value={inputValue}
            onChange={handleOnPathChange}
            onBlur={handleOnPathBlur}
            onFocus={handleOnPathFocus}
            onKeyDown={handleOnPathKeyDown} />
          </Box>

          <Box className={`w-full h-8 px-2 flex 
          transition-all duration-300
          ${isEditingPath ? 'opacity-0' : 'opacity-100' }`}>
            <ChevronRight className='mt-2 h-4 w-4' />
            <p className='h-8 ml-1'>
              {getCurrentFolderName()}
            </p>
          </Box>
 
        </Box>

        <Box className='separator-vertical' />

        <Box className='ml-auto flex pl-2'>
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