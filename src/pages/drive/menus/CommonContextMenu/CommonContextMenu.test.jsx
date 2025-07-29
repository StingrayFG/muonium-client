import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'

import { renderWithProviders } from 'utils/testUtils';

import { ContextMenuContext } from 'contexts/ContextMenuContext';

import CommonContextMenu from 'pages/drive/menus/CommonContextMenu/CommonContextMenu';


describe('context menus', () => {

  const handleOnClickMock = jest.fn();
  const setIsHoveredOverMenuMock = jest.fn();

  const testOptions = [
    { text: 'Download', icon: 'download', handleOnClick: () => handleOnClickMock('Download') },
    { text: 'Copy', icon: 'copy', handleOnClick: () => handleOnClickMock('Copy') },
    'line',
  ] 

  const defaultRender = (contextMenuClickPosition) => {
    renderWithProviders(
      <ContextMenuContext.Provider value={{
        contextMenuClickPosition: contextMenuClickPosition,
        setIsHoveredOverMenu: setIsHoveredOverMenuMock
      }}>
        <CommonContextMenu 
        options={testOptions}/>
      </ContextMenuContext.Provider>,
      {
        preloadedState: {}   
      }
    );
  }

  test('render options', async () => {
    defaultRender({ x: 0, y: 0 });

    expect(screen.getByTestId('context-menu')).toBeInTheDocument();

    const options = screen.getAllByTestId('context-menu-option');
    expect(options).toHaveLength(2);

    expect(screen.getByText(testOptions[0].text)).toBeInTheDocument();
    expect(screen.getByText(testOptions[1].text)).toBeInTheDocument();

    expect(screen.getByTestId('context-menu-separator')).toBeInTheDocument();
  });

  test('interact with menu and options', async () => {
    const user = userEvent.setup();

    defaultRender({ x: 0, y: 0 });

    const options = screen.getAllByTestId('context-menu-option');

    await user.pointer({ keys: '[MouseLeft]', target: options[0] });
    expect(handleOnClickMock.mock.calls[0][0]).toBe(testOptions[0].text)

    await user.pointer({ keys: '[MouseLeft]', target: options[1] });
    expect(handleOnClickMock.mock.calls[1][0]).toBe(testOptions[1].text)

    expect(setIsHoveredOverMenuMock.mock.calls).toBeDefined();
  });

  test('prevent display overflow', () => {
    global.innerWidth = 500;
    global.innerHeight = 500;
    
    const contextMenuClickPosition = { x: 480, y: 480 }
    defaultRender(contextMenuClickPosition);

    const menu = screen.getByTestId('context-menu');
    const menuStyles = getComputedStyle(menu);

    expect(parseInt(menuStyles.left, 10)).toBeLessThan(contextMenuClickPosition.x)
    expect(parseInt(menuStyles.top, 10)).toBeLessThan(contextMenuClickPosition.y)
  });
})
