import { useSelector } from 'react-redux';

export default function TopPanel () {
  const driveData = useSelector(state => state.drive);
  const clipboardData = useSelector(state => state.clipboard);

  return (
    <div className='w-full h-12 flex
    bg-gradient-to-b from-zinc-600 to-zinc-700
    border-solid border-t-2 border-zinc-800
    text-lg font-semibold font-sans text-neutral-200'>
      <div className='w-96 flex px-4 py-2'>
        <p className='h-8 place-self-center text-left'>
          {(driveData.spaceTotal / (1024 * 1024)).toFixed(0)} MB drive, 
          {' ' + (driveData.spaceUsed / (1024 * 1024)).toFixed(0)} MB used
          {' (' + (driveData.spaceUsed / driveData.spaceTotal * 100).toFixed(0) + '% full)'}
        </p>
      </div>

      <div className='-ml-[2px] my-2 border-solid border-l-2 border-zinc-800'></div>

      <div className='flex px-4 py-2'>
        <p className='h-8 place-self-center text-left'>
          {(clipboardData.foldersCount > 0) && <>
            {clipboardData.foldersCount}
            {(clipboardData.foldersCount > 1) ?  (' folders') : (' folder')}
          </>}
          {(clipboardData.filesCount > 0) && <>
            {', ' + clipboardData.filesCount}
            {(clipboardData.filesCount > 1) ? (' files') : (' file')}
          </>}
        </p>
      </div>

      <div className='my-2 border-solid border-l-2 border-zinc-800'></div>

      <div className='flex px-4 py-2'>
        <p className='h-8 place-self-center text-left'>
          {(!clipboardData.mode) && <>
            {(clipboardData.clickedElements.length > 0) && <>
              {(clipboardData.clickedElements.length > 1) ? (clipboardData.clickedElements.length + ' items selected') : ('1 item selected')}
            </>}
          </>}
          {(clipboardData.mode === 'copy') && <>
            {(clipboardData.elements.length > 0) && <>
              {(clipboardData.elements.length > 1) ? (clipboardData.elements.length + ' items copied') : ('1 item copied')}
            </>}
          </>}
          {(clipboardData.mode === 'cut') && <>
            {(clipboardData.elements.length > 0) && <>
              {(clipboardData.elements.length > 1) ? (clipboardData.elements.length + ' items cut') : ('1 item cut')}
            </>}
          </>}
        </p>
      </div>
    </div>
  );
}