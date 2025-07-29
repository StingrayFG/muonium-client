import { ReactComponent as FolderMu } from 'assets/icons/elements/muonium/folder.svg'
import { ReactComponent as FolderBs } from 'assets/icons/elements/bootstrap/folder2.svg'


export default function FolderElementIcon ({ isSmall=false }) { 
 
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
    return <FolderBs data-testid='folder-icon' className={iconStyle}/>
  } else {
    return <FolderMu data-testid='folder-icon' className={iconStyle}/>
  }

}
