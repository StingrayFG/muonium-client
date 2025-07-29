import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'

import { renderWithProviders } from 'utils/test-utils'

import { ContextMenuContext } from 'contexts/ContextMenuContext';

import FolderElement from 'pages/drive/elements/FolderElement/FolderElement';

import currentFolderSliceTestData from 'state/testdata/currentFolderSlice.testdata.json';
import config from 'config.json';


describe('folder element', () => {
  
  const testFolder = {
    "name": "icons",
    "size": 0,
    "creationDate": "2024-11-23T19:55:25.991Z",
    "modificationDate": "2024-11-23T19:55:25.991Z",
    "uuid": "4c947c53-2a62-4415-9d6d-e8d06a43d1b6",
    "ownerUuid": "3c6ef54d-d5e2-41dd-bfab-4e1e80d1d424",
    "driveUuid": "c808eb64-8970-4a5d-a7e1-571f6cad4ac5",
    "parentUuid": "696b5d09-e26c-479a-8e15-e964d5eeff47",
    "absolutePath": "/home/test/icons",
    "isRemoved": false,
    "isRemovedAsChild": false,
    "type": "folder"
  }

  const testGeneratedData = {
    "rowColumns": <p data-testid={'columns-placeholder'}></p>
  }

  const handleOnElementMouseDownMock = jest.fn(() => {});
  const handleOnElementContextMenuMock = jest.fn(() => {});
  const handleOnElementDoubleClickMock = jest.fn(() => {});

  const setHoveredElementMock = jest.fn((element) => {});
  const clearHoveredElementMock = jest.fn(() => {});

  const defaultRender = (viewMode) => {
    renderWithProviders(
      <ContextMenuContext.Provider value={{
        clickedElements: [],
        hoveredElement: {},
        setHoveredElement: setHoveredElementMock,
        clearHoveredElement: clearHoveredElementMock
      }}>
        <FolderElement
        folder={testFolder}
        generatedData={testGeneratedData}
        viewMode={viewMode}
        handleOnElementMouseDown={handleOnElementMouseDownMock}
        handleOnElementContextMenu={handleOnElementContextMenuMock}
        handleOnElementDoubleClick={handleOnElementDoubleClickMock} />
      </ContextMenuContext.Provider>,
      {
        preloadedState: {
          currentFolder: currentFolderSliceTestData,
          settings: config.defaultSettings
        }   
      }
    );
  }

  test('render in grid view', () => {
    defaultRender('grid');

    expect(screen.getByTestId('folder-icon')).toBeInTheDocument();
    expect(screen.getByText(testFolder.name)).toBeInTheDocument();
  });

  test('render in list view', () => {
    defaultRender('list');

    expect(screen.getByTestId('folder-icon')).toBeInTheDocument();
    expect(screen.getByTestId('columns-placeholder')).toBeInTheDocument();
  });

  test('interact in grid view', async () => {
    const user = userEvent.setup();
    defaultRender('grid');

    //
    const folderIconElement = screen.getByTestId('folder-icon-box');

    await user.click(folderIconElement);
    expect(handleOnElementMouseDownMock.mock.calls[0][1]).toEqual(testFolder);
    expect(setHoveredElementMock.mock.calls[0][0]).toEqual(testFolder);

    await user.dblClick(folderIconElement);
    expect(handleOnElementDoubleClickMock.mock.calls[0][1]).toEqual(testFolder);

    await user.pointer({ keys: '[MouseRight>]', target: folderIconElement })
    expect(handleOnElementContextMenuMock.mock.calls[0][1]).toEqual(testFolder);

    //
    const folderNameElement = screen.getByTestId('folder-name-box');

    await user.click(folderNameElement);
    expect(handleOnElementMouseDownMock.mock.calls[1][1]).toEqual(testFolder);
    expect(setHoveredElementMock.mock.calls[1][0]).toEqual(testFolder);

    await user.dblClick(folderNameElement);
    expect(handleOnElementDoubleClickMock.mock.calls[1][1]).toEqual(testFolder);

    await user.pointer({ keys: '[MouseRight>]', target: folderNameElement })
    expect(handleOnElementContextMenuMock.mock.calls[1][1]).toEqual(testFolder);
  });

  test('render in list view', async () => {
    const user = userEvent.setup();
    defaultRender('list');

    //
    const folderRow = screen.getByTestId('folder-row-box');

    await user.click(folderRow);
    expect(handleOnElementMouseDownMock.mock.calls[0][1]).toEqual(testFolder);
    expect(setHoveredElementMock.mock.calls[0][0]).toEqual(testFolder);

    await user.dblClick(folderRow);
    expect(handleOnElementDoubleClickMock.mock.calls[0][1]).toEqual(testFolder);

    await user.pointer({ keys: '[MouseRight>]', target: folderRow })
    expect(handleOnElementContextMenuMock.mock.calls[0][1]).toEqual(testFolder);
  });

})
