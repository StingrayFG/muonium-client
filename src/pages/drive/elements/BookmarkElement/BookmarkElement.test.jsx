import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'

import { renderWithProviders } from 'utils/test-utils';

import { ContextMenuContext } from 'contexts/ContextMenuContext';

import BookmarkElement from 'pages/drive/elements/BookmarkElement/BookmarkElement';

import currentFolderSliceTestData from 'state/testdata/currentFolderSlice.testdata.json';
import config from 'config.json';


describe('bookmark element', () => {

  const testBookmark = {
    "ownerUuid": "3c6ef54d-d5e2-41dd-bfab-4e1e80d1d424",
    "folderUuid": "4c947c53-2a62-4415-9d6d-e8d06a43d1b6",
    "position": 0,
    "uuid": "3c6ef54d-d5e2-41dd-bfab-4e1e80d1d4244c947c53-2a62-4415-9d6d-e8d06a43d1b6",
    "folder": {
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
      "isRemovedAsChild": false
    },
    "type": "bookmark"
  }

  const handleOnBookmarkMouseDownMock = jest.fn(() => {})

  const setHoveredElementMock = jest.fn((element) => {});
  const clearHoveredElementMock = jest.fn(() => {});

  const defaultRender = () => {
    renderWithProviders(
      <ContextMenuContext.Provider value={{
        selectedElements: [],
        hoveredElement: {},
        setHoveredElement: setHoveredElementMock,
        clearHoveredElement: clearHoveredElementMock
      }}>
        <BookmarkElement 
        bookmark={testBookmark}
        handleOnBookmarkMouseDown={handleOnBookmarkMouseDownMock}/>
      </ContextMenuContext.Provider>,
      {
        preloadedState: {
          currentFolder: currentFolderSliceTestData,
          settings: config.defaultSettings
        }   
      }
    );
  }

  test('render bookmark', () => {
    defaultRender();

    expect(screen.getByTestId('bookmark-name')).toBeInTheDocument();
    expect(screen.getByText(testBookmark.folder.name)).toBeInTheDocument();
  });

  test('interact with bookmark', async () => {
    const user = userEvent.setup();
    defaultRender();

    const bookmarkElement = screen.getByTestId('bookmark-element');

    await user.click(bookmarkElement);
    expect(handleOnBookmarkMouseDownMock.mock.calls[0][1]).toEqual(testBookmark);
    expect(setHoveredElementMock.mock.calls[0][0]).toEqual(testBookmark);
  });
})
