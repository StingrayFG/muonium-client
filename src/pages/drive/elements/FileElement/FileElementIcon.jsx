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


export default function FileElementIcon ({ type, isSmall=false }) { 
 
  const iconStyle = isSmall ? 
  `element-icon-small
  w-full h-full
  transition-opacity
  pointer-events-none select-none`
  :
  `element-icon
  w-full h-full
  transition-opacity
  pointer-events-none select-none`;

  if (isSmall) {
    if (type === 'text') { return <FileTextBs data-testid='file-icon' className={iconStyle}/> } 
    else if (type === 'audio') { return <FileMusicBs data-testid='file-icon' className={iconStyle}/> } 
    else if (type === 'video') { return <FileVideoBs data-testid='file-icon' className={iconStyle}/>  } 
    else if (type === 'archive') { return <FileArchiveBs data-testid='file-icon' className={iconStyle}/> } 
    else if (type === 'app') { return <FileAppBs data-testid='file-icon' className={iconStyle}/> } 
    else { return <FileEmptyBs data-testid='file-icon' className={iconStyle}/> }
  } else {
    if (type === 'text') { return <FileTextMu data-testid='file-icon' className={iconStyle}/> } 
    else if (type === 'audio') { return <FileMusicMu data-testid='file-icon' className={iconStyle}/> } 
    else if (type === 'video') { return <FileVideoMu data-testid='file-icon' className={iconStyle}/>  } 
    else if (type === 'archive') { return <FileArchiveMu data-testid='file-icon' className={iconStyle}/> } 
    else if (type === 'app') { return <FileAppMu data-testid='file-icon' className={iconStyle}/> } 
    else { return <FileEmptyMu data-testid='file-icon' className={iconStyle}/> }
  }

}
