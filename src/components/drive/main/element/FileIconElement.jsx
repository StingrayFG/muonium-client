
export default function FileIconElement ({ file, type }) { 
  const ext = file.name.slice((file.name.lastIndexOf('.') - 1 >>> 0) + 2);
  
  const textExtensions = ['txt', 'cfg', 'log', 'conf'];
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
  const archiveExtensions = ['zip', '7z', 'rar', 'gz', 'bz2'];
  const musicExtensions = ['mp3', 'wav', 'flac'];
  const playExtensions = ['mp4', 'webm', 'avi', 'mkv', 'exe', 'bak'];

  if (type === 'grid') {
    if (textExtensions.includes(ext)) {
      return <img src='/icons/files-dark/file-text.svg' alt='icon' width='60' className='place-self-center absolute pointer-events-none select-none'/>
    } else if (imageExtensions.includes(ext)) {
      return <img src='/icons/files-dark/file-image.svg' alt='icon' width='60' className='place-self-center absolute pointer-events-none select-none'/>
    } else if (archiveExtensions.includes(ext)) {
      return <img src='/icons/files-dark/file-zip.svg' alt='icon' width='60' className='place-self-center absolute pointer-events-none select-none'/>
    } else if (musicExtensions.includes(ext)) {
      return <img src='/icons/files-dark/file-music.svg' alt='icon' width='60' className='place-self-center absolute pointer-events-none select-none'/>
    } else if (playExtensions.includes(ext)) {
      return <img src='/icons/files-dark/file-play.svg' alt='icon' width='60' className='place-self-center absolute pointer-events-none select-none'/>
    } 
  } else if (type === 'list') {
    if (textExtensions.includes(ext)) {
      return <img src='/icons/files-light/file-text.svg' alt='icon' width='40' className='place-self-center pointer-events-none select-none'/>
    } else if (imageExtensions.includes(ext)) {
      return <img src='/icons/files-light/file-image.svg' alt='icon' width='40' className='place-self-center pointer-events-none select-none'/>
    } else if (archiveExtensions.includes(ext)) {
      return <img src='/icons/files-light/file-zip.svg' alt='icon' width='40' className='place-self-center pointer-events-none select-none'/>
    } else if (musicExtensions.includes(ext)) {
      return <img src='/icons/files-light/file-music.svg' alt='icon' width='40' className='place-self-center pointer-events-none select-none'/>
    } else if (playExtensions.includes(ext)) {
      return <img src='/icons/files-light/file-play.svg' alt='icon' width='40' className='place-self-center pointer-events-none select-none'/>
    } else {
      return <img src='/icons/files-light/file-earmark.svg' alt='icon' width='40' className='place-self-center pointer-events-none select-none'/>
    }
  }

}
