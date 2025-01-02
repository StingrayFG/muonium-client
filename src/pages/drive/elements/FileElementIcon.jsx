import { ReactComponent as FileEmptyMu } from 'assets/icons/elements/muonium/file-empty.svg'
import { ReactComponent as FileTextMu } from 'assets/icons/elements/muonium/file-text.svg'
import { ReactComponent as FileMusicMu } from 'assets/icons/elements/muonium/file-music.svg'
import { ReactComponent as FileVideoMu } from 'assets/icons/elements/muonium/file-video.svg'
import { ReactComponent as FileArchiveMu } from 'assets/icons/elements/muonium/file-archive.svg'
import { ReactComponent as FileAppMu } from 'assets/icons/elements/muonium/file-app.svg'

import { ReactComponent as FileEmptyBs } from 'assets/icons/elements/bootstrap/file-earmark.svg'
import { ReactComponent as FileTextBs } from 'assets/icons/elements/bootstrap/file-earmark-text.svg'
import { ReactComponent as FileMusicBs } from 'assets/icons/elements/bootstrap/file-earmark-music.svg'
import { ReactComponent as FileVideoBs } from 'assets/icons/elements/bootstrap/file-earmark-play.svg'
import { ReactComponent as FileArchiveBs } from 'assets/icons/elements/bootstrap/file-earmark-zip.svg'
import { ReactComponent as FileAppBs } from 'assets/icons/elements/bootstrap/terminal.svg'


export default function FileElement ({ file, shallBeSmall }) { 
 
  const iconStyle = 'h-full w-full';

  const ext = file.name.split('.').pop();

  const textExtensions = ['txt', 'cfg', 'log', 'conf'];
  const musicExtensions = ['mp3', 'wav', 'flac'];
  const videoExtensions = ['mp4', 'webm', 'avi', 'mkv', ];
  const archiveExtensions = ['zip', '7z', 'rar', 'gz'];
  const appExtensions = ['x86_64', 'sh', 'AppImage', 'exe' ];

  if (shallBeSmall) {
    if (textExtensions.includes(ext)) { return <FileTextBs className={iconStyle}/> } 
    else if (musicExtensions.includes(ext)) { return <FileMusicBs className={iconStyle}/> } 
    else if (videoExtensions.includes(ext)) { return <FileVideoBs className={iconStyle}/>  } 
    else if (archiveExtensions.includes(ext)) { return <FileArchiveBs className={iconStyle}/> } 
    else if (appExtensions.includes(ext)) { return <FileAppBs className={iconStyle}/> } 
    else { return <FileEmptyBs className={iconStyle}/> }
  } else {
    if (textExtensions.includes(ext)) { return <FileTextMu className={iconStyle}/> } 
    else if (musicExtensions.includes(ext)) { return <FileMusicMu className={iconStyle}/> } 
    else if (videoExtensions.includes(ext)) { return <FileVideoMu className={iconStyle}/>  } 
    else if (archiveExtensions.includes(ext)) { return <FileArchiveMu className={iconStyle}/> } 
    else if (appExtensions.includes(ext)) { return <FileAppMu className={iconStyle}/> } 
    else { return <FileEmptyMu className={iconStyle}/> }
  }


}
