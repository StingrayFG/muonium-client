import { useRef, useState, useEffect, useContext } from 'react';
import { Box } from '@mui/material';

import { ContextMenuContext } from 'contexts/ContextMenuContext.jsx';

import MenuOptionElement from 'pages/drive/menus/CommonContextMenu/MenuOptionElement';

import config from 'config.json';


export default function CommonContextMenu ({ options }) {
  const contextMenuContext = useContext(ContextMenuContext);

  const linesCount = options.filter(option => option === 'line').length;
  const menuWidth = config.menus.defaultWidth;
  const menuHeight = 2 + (32 * (options.length - linesCount)) + linesCount * 9;

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);
  
  useEffect(() => {
    window.addEventListener('resize', () => {
      setWindowWidth(window.innerWidth);
      setWindowHeight(window.innerHeight);
    });
    return () => window.removeEventListener('resize', setWindowWidth);
  }, [])

  const getUsedPosition = () => {
    let position = { ...contextMenuContext.contextMenuClickPosition };

    if (!contextMenuContext.getIsOnMobile()) {
      if (position.x + menuWidth > windowWidth) { position.x -= menuWidth; }
      if (position.y + menuHeight > windowHeight) { position.y -= menuHeight; }
    } else {
      if (position.x + menuWidth > windowWidth) { position.x = windowWidth - menuWidth; }
      if (position.y + menuHeight > windowHeight) { position.y -= windowHeight - menuHeight; }
    }

    return position;
  }

  const getPositionStyle = () => {
    const usedPosition = getUsedPosition();
    return {
      top: usedPosition.y, 
      left: usedPosition.x
    };
  }


  return (
    <Box data-testid='context-menu' 
    className={`transition-opacity duration-300 
    bg-gray-950/90 border border-sky-300/20 rounded
    ${contextMenuContext.isContextMenuOpen ? 'opacity-100 animate-fadein-custom-300' : 'opacity-0 pointer-events-none' }`}
    onMouseEnter={() => contextMenuContext.setIsHoveredOverMenu(true)}
    onMouseLeave={() => contextMenuContext.setIsHoveredOverMenu(false)}
    style={{
      width: menuWidth + 'px',
      position: 'absolute', 
      ...getPositionStyle()
    }}>

      {options.map((option, index) => (typeof(option) === 'object' ? 
        <MenuOptionElement key={'option-' + index}
        option={option} />
        :
        <Box data-testid='context-menu-separator' 
        key={'option-' + index}
        className='separator-horizontal' />
      ))}
      
    </Box>    
  );
};
