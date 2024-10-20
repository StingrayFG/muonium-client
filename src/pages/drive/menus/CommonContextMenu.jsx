import { useRef, useContext } from 'react';
import { Box } from '@mui/material';

import { ContextMenuContext } from 'contexts/ContextMenuContext.jsx';

import MenuOptionElement from 'pages/drive/elements/MenuOptionElement';


export default function CommonContextMenu ({ options }) {
  const contextMenuContext = useContext(ContextMenuContext);

  const linesCount = options.filter(option => option === 'line').length
  const menuWidth = 256;
  const menuHeight = 2 + (32 * (options.length - linesCount)) + linesCount * 9;


  const windowWidth = useRef(window.innerWidth).current;
  const windowHeight = useRef(window.innerHeight).current;

  let position = contextMenuContext.contextMenuClickPosition;

  if (position.x + menuWidth > windowWidth) { position.x -= menuWidth; }
  if (position.y + menuHeight > windowHeight) { position.y -= menuHeight; }


  return (
    <Box className={`transition-opacity duration-300
    bg-gray-950/90 border border-sky-300/20 rounded-[0.3rem]
    ${contextMenuContext.isContextMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none' }`}
    onMouseEnter={() => contextMenuContext.setIsHoveredOverMenu(true)}
    onMouseLeave={() => contextMenuContext.setIsHoveredOverMenu(false)}
    style={{
      width: menuWidth + 'px',
      position: 'absolute', 
      top: position.y, 
      left: position.x
    }}>

      {options.map((option, index) => (typeof(option) === 'object' ? 
        <MenuOptionElement option={option} key={'option-' + index}/>
        :
        <Box className='separator-horizontal' key={'option-' + index}/>
      ))}
      
    </Box>    
  );
};
