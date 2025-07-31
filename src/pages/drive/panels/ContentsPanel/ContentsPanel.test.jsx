import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'

import { renderWithProviders } from 'utils/testUtils';

import { ContextMenuContext } from 'contexts/ContextMenuContext';
import { ModalContext } from 'contexts/ModalContext';

import ContentsPanel from 'pages/drive/panels/ContentsPanel/ContentsPanel';

import currentFolderSliceTestData from 'state/testdata/currentFolderSlice.testdata.json';
import config from 'config.json';


describe('contents panel', () => {

  const dispatchMock = jest.fn();

  const addSelectedElementMock = jest.fn();
  const clearSelectedElementsMock = jest.fn();

  const setHoveredElementMock = jest.fn();
  const clearHoveredElementMock = jest.fn();

  const handleFileContextMenuClickMock = jest.fn();
  const handleFolderContextMenuClickMock = jest.fn();
  const handleDefaultContextMenuClickMock = jest.fn();

  const openModalMock = jest.fn();

  const defaultRender = (viewMode) => {
    renderWithProviders(
      <ContextMenuContext.Provider value={{
        selectedElements: [],
        addSelectedElement: addSelectedElementMock,
        clearSelectedElements: clearSelectedElementsMock,
        hoveredElement: {},
        setHoveredElement: setHoveredElementMock,
        clearHoveredElement: clearHoveredElementMock,
        handleFileContextMenuClick: handleFileContextMenuClickMock,
        handleFolderContextMenuClick: handleFolderContextMenuClickMock,
        handleDefaultContextMenuClick: handleDefaultContextMenuClickMock,
        getIsOnMobile: () => false
      }}>
        <ModalContext.Provider value={{
          openModal: openModalMock
        }}>
          <ContentsPanel />
        </ModalContext.Provider>
      </ContextMenuContext.Provider>,
      {
        preloadedState: {
          currentFolder: currentFolderSliceTestData,
          settings: { 
            ...config.defaultSettings, 
            viewMode: viewMode
          }
        },
        dispatch: dispatchMock
      }
    );
  }

  test('render in grid view', () => {
    defaultRender('grid');

    expect(screen.getByTestId('file-element')).toBeInTheDocument();
    expect(screen.getByTestId('folder-element')).toBeInTheDocument();
  });

  test('render in list view', () => {
    defaultRender('list');

    expect(screen.getByTestId('file-element')).toBeInTheDocument();
    expect(screen.getByTestId('folder-element')).toBeInTheDocument();
  });

  test('interact in grid view', async () => {
    const user = userEvent.setup();
    defaultRender('grid');

    // Folder
    const folderElement = screen.getByTestId('folder-icon-box');

    await user.pointer({ keys: '[MouseLeft]', target: folderElement })
    expect(addSelectedElementMock.mock.calls[0][1]).toEqual(currentFolderSliceTestData.folders[0])

    await user.pointer({ keys: '[MouseLeft][MouseLeft]', target: folderElement })
    expect(dispatchMock.mock.calls[1][0]).toEqual({
      type: 'path/moveToNew',
      payload: {
        uuid: currentFolderSliceTestData.folders[0].uuid
      }
    });

    await user.pointer({ keys: '[MouseRight]', target: folderElement })
    expect(handleFolderContextMenuClickMock.mock.calls[0][1]).toEqual(currentFolderSliceTestData.folders[0])

    // Files
    const fileElement = screen.getByTestId('file-icon-box');

    await user.pointer({ keys: '[MouseLeft]', target: fileElement})
    expect(addSelectedElementMock.mock.calls[3][1]).toEqual(currentFolderSliceTestData.files[0])

    await user.pointer({ keys: '[MouseLeft][MouseLeft]', target: fileElement })
    expect(openModalMock.mock.calls[0][0]).toBeDefined();

    await user.pointer({ keys: '[MouseRight]', target: fileElement })
    expect(handleFileContextMenuClickMock.mock.calls[0][1]).toEqual(currentFolderSliceTestData.files[0])
  });

  test('interact in list view', async () => {
    const user = userEvent.setup();
    defaultRender('list');

    // Folders
    const folderElement = screen.getByTestId('folder-row-box');

    await user.pointer({ keys: '[MouseLeft]', target: folderElement })
    expect(addSelectedElementMock.mock.calls[0][1]).toEqual(currentFolderSliceTestData.folders[0])

    await user.pointer({ keys: '[MouseLeft][MouseLeft]', target: folderElement })
    expect(dispatchMock.mock.calls[1][0]).toEqual({
      type: 'path/moveToNew',
      payload: {
        uuid: currentFolderSliceTestData.folders[0].uuid
      }
    });

    await user.pointer({ keys: '[MouseRight]', target: folderElement })
    expect(handleFolderContextMenuClickMock.mock.calls[0][1]).toEqual(currentFolderSliceTestData.folders[0])

    // Files
    const fileElement = screen.getByTestId('file-row-box');

    await user.pointer({ keys: '[MouseLeft]', target: fileElement})
    expect(addSelectedElementMock.mock.calls[3][1]).toEqual(currentFolderSliceTestData.files[0])

    await user.pointer({ keys: '[MouseLeft][MouseLeft]', target: fileElement })
    expect(openModalMock.mock.calls[0][0]).toBeDefined();

    await user.pointer({ keys: '[MouseRight]', target: fileElement })
    expect(handleFileContextMenuClickMock.mock.calls[0][1]).toEqual(currentFolderSliceTestData.files[0])
  });
})

