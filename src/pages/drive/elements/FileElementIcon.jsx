import { useSelector } from 'react-redux';

import { ReactComponent as FileEmptyMu } from 'assets/icons/elements/muonium/file-empty.svg'
import { ReactComponent as FileTextMu } from 'assets/icons/elements/muonium/file-text.svg'
import { ReactComponent as FileMusicMu } from 'assets/icons/elements/muonium/file-music.svg'
import { ReactComponent as FileVideoMu } from 'assets/icons/elements/muonium/file-video.svg'
import { ReactComponent as FileArchiveMu} from 'assets/icons/elements/muonium/file-archive.svg'
import { ReactComponent as FileAppMu} from 'assets/icons/elements/muonium/file-app.svg'


export default function FileElement ({ file }) { 
 
  const settingsData = useSelector(state => state.settings);

  const iconStyle = 'h-full w-full';

  const ext = file.name.split('.').pop();

  const textExtensions = ['txt', 'cfg', 'log', 'conf'];
  const musicExtensions = ['mp3', 'wav', 'flac'];
  const videoExtensions = ['mp4', 'webm', 'avi', 'mkv', ];
  const archiveExtensions = ['zip', '7z', 'rar', 'gz'];
  const appExtensions = ['x86_64', 'sh', 'AppImage', 'exe' ];

  if (settingsData.viewMode === 'grid') {
    if (textExtensions.includes(ext)) { return <FileTextMu className={iconStyle}/> } 
    else if (musicExtensions.includes(ext)) { return <FileMusicMu className={iconStyle}/> } 
    else if (videoExtensions.includes(ext)) { return <FileVideoMu className={iconStyle}/>  } 
    else if (archiveExtensions.includes(ext)) { return <FileArchiveMu className={iconStyle}/> } 
    else if (appExtensions.includes(ext)) { return <FileAppMu className={iconStyle}/> } 
    else { return <FileEmptyMu className={iconStyle}/> }
  }
}
