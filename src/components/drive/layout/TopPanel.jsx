import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import { clearUser } from 'services/slice/UserSlice';
import { setAbsolutePath, moveToNew, moveToNext, moveToPrevious } from 'services/slice/PathSlice';
import { setType } from 'services/slice/SettingsSlice';

import FolderService from 'services/FolderService.jsx';

export default function TopPanel () {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const userData = useSelector(state => state.user);
  const driveData = useSelector(state => state.drive);
  const pathData = useSelector(state => state.path);

  const logOut = () => {
    dispatch(clearUser());
    navigate('/login');
  };

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

  const [editingPath, setEditingPath] = useState(false);
  const [previousPath, setPreviousPath] = useState('');
  const [inputData, setInputData] = useState();
  
  useEffect(() => {
    if (!inputData) { setInputData(pathData.currentAbsolutePath); }
  })

  useEffect(() => {
    if (!editingPath && (inputData !== pathData.currentAbsolutePath)) {
      setInputData(pathData.currentAbsolutePath);
      setPreviousPath(pathData.currentAbsolutePath);
    }
  })

  const savePreviousPath = (event) => {
    setPreviousPath(event.target.value);
    setEditingPath(true);
  }

  const setPath = async (event) => {
    let path = event.target.value;
    if (path[path.length - 1] === '/') { path = path.slice(0, path.length - 1); }
    await FolderService.handleGetByPath(userData, path)
    .then(res => {
      dispatch(moveToNew({ uuid: res.uuid }));
      dispatch(setAbsolutePath({ currentAbsolutePath: path }));
      setEditingPath(false);
    })
    .catch(err => {
      setInputData(previousPath);
      showMessage('Incorrect path');
      setEditingPath(false);
    })
  }

  const delay = ms => new Promise(res => setTimeout(res, ms));
  const [showingMessage, setShowingMessage] = useState();
  const [message, setMessage] = useState();

  const showMessage = async (msg) => {
    setMessage(msg);
    setShowingMessage(true);
    await delay(1500);
    setShowingMessage(false);
  };

  return (
    <div className='w-full h-20 px-4 py-4 flex
      bg-gradient-to-b from-zinc-600 to-zinc-700
      border-solid border-b-2 border-zinc-800
      text-lg font-semibold font-sans text-neutral-200'>
        <div className='flex'>

          <div className='w-[86px] h-12 mr-1 grid'>
            <img src='/icons/mu-logo.svg' alt='logo' width='72' className='place-self-center -mt-1'/>
          </div>

          <div className='mx-4 border-solid border-l-2 border-zinc-800'></div>

          <button className={`w-12 h-12 grid
          bg-gradient-to-b from-zinc-300 to-zinc-400 border-zinc-400
          ${(pathData.positionInHistory > 0) ? 
          'hover:bg-gradient-to-b hover:from-sky-200/75 hover:to-sky-400/75 hover:border-sky-600/75' : 'pointer-events-none'}  
          border-solid border-2 border-r rounded-l-lg`}
          onClick={handlePreviousPath}>
            <img src='/icons/chevron-left.svg' alt='prev' width='28' 
            className={`place-self-center ${(pathData.positionInHistory > 0) ? 'opacity-100' : 'opacity-30'}`}/>
          </button>
          <button className={`w-12 h-12 grid
          bg-gradient-to-b from-zinc-300 to-zinc-400 border-zinc-400
          ${(pathData.positionInHistory < pathData.pathHistory.length - 1) ? 
          'hover:bg-gradient-to-b hover:from-sky-200/75 hover:to-sky-400/75 hover:border-sky-600/75' : 'pointer-events-none'}  
          border-solid border-2 border-l rounded-r-lg`}
          onClick={handleNextPath}>
            <img src='/icons/chevron-right.svg' alt='next' width='28' 
            className={`place-self-center ${(pathData.positionInHistory < pathData.pathHistory.length - 1) ? 'opacity-100' : 'opacity-30'}`}/>
          </button>

          <div className='mx-4 border-solid border-l-2 border-zinc-800'></div>

          <button className='w-12 h-12 grid
          bg-gradient-to-b from-zinc-300 to-zinc-400 border-zinc-400
          hover:bg-gradient-to-b hover:from-sky-200/75 hover:to-sky-400/75 hover:border-sky-600/75
          border-solid border-2 border-r rounded-l-lg'
          onClick={handleGridView}>
            <img src='/icons/grid.svg' alt='prev' width='28' className='place-self-center'/>
          </button>
          <button className='w-12 h-12 grid
          bg-gradient-to-b from-zinc-300 to-zinc-400 border-zinc-400
          hover:bg-gradient-to-b hover:from-sky-200/75 hover:to-sky-400/75 hover:border-sky-600/75
          border-solid border-2 border-l rounded-r-lg'
          onClick={handleListView}>
            <img src='/icons/list-ul.svg' alt='next' width='28' className='place-self-center'/>          
          </button>

          <div className='mx-4 border-solid border-l-2 border-zinc-800'></div>

        </div>

        <div className='w-full h-12 px-4 bg-white flex text-left text-neutral-800
          bg-gradient-to-b from-zinc-300 to-zinc-400 border-zinc-400
          border-solid border-2 rounded-lg'>
            <textarea className='w-full h-8 place-self-center outline-none resize-none
            bg-transparent'
            name='path'
            value={inputData}
            onChange={e => setInputData(e.target.value)}
            onBlur={setPath}
            onFocus={savePreviousPath}
            onKeyDown={(event) => { if (event.code === 'Enter') { event.target.blur(); } }}>
            </textarea> 
            <p className={`w-64 text-right place-self-center transition-all duration-500
            ${showingMessage ? 'opacity-100': 'opacity-0'}`}>
            {'' + message}  
            </p>
        </div>

        <div className='mx-4 border-solid border-l-2 border-zinc-800'></div>

        <div className='ml-auto flex'>
          <div className='w-[302px] h-12 pl-4 flex text-left
          bg-gradient-to-b from-neutral-700 to-neutral-800 border-neutral-800
          border-solid border-2 border-r rounded-l-lg outline-none'>
            <p className='place-self-center'>{userData.login}</p>
          </div>
          <button className='w-12 h-12 grid
          bg-gradient-to-b from-neutral-700 to-neutral-800 border-neutral-800
          hover:bg-gradient-to-b hover:from-sky-200/75 hover:to-sky-400/60 hover:border-sky-600/75
          border-solid border-2 border-l rounded-r-lg outline-none'
          onClick={logOut}>
            <img src='/icons/box-arrow-right.svg' alt='logout' width='28' className='place-self-center'/>
          </button >    
        </div>
        
    </div>
  );
}