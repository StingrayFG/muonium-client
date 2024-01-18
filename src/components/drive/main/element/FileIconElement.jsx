
export default function FileIconElement ({ file }) { 
  const ext = file.name.slice((file.name.lastIndexOf('.') - 1 >>> 0) + 2);
  
  const textExtensions = ['txt', 'cfg', 'log', 'conf'];
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
  const archiveExtensions = ['zip', '7z', 'rar', 'gz', 'bz2'];
  const musicExtensions = ['mp3', 'wav', 'flac'];
  const playExtensions = ['mp4', 'webm', 'avi', 'mkv', 'exe', 'bak'];

  if (textExtensions.includes(ext)) {
    return <img src='/icons/file-text.svg' alt='icon' width='60' className='place-self-center -mt-48 pointer-events-none select-none'/>
  } else if (imageExtensions.includes(ext)) {
    return <img src='/icons/file-image.svg' alt='icon' width='60' className='place-self-center -mt-48 pointer-events-none select-none'/>
  } else if (archiveExtensions.includes(ext)) {
    return <img src='/icons/file-zip.svg' alt='icon' width='60' className='place-self-center -mt-48 pointer-events-none select-none'/>
  } else if (musicExtensions.includes(ext)) {
    return <img src='/icons/file-music.svg' alt='icon' width='60' className='place-self-center -mt-48 pointer-events-none select-none'/>
  } else if (playExtensions.includes(ext)) {
    return <img src='/icons/file-play.svg' alt='icon' width='60' className='place-self-center -mt-48 pointer-events-none select-none'/>
  }  
}
