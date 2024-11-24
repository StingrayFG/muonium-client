import { render, screen, cleanup } from "@testing-library/react";
import '@testing-library/jest-dom'

import { renderWithProviders } from 'utils/test-utils';

import { ContextMenuContext } from 'contexts/ContextMenuContext';

import FolderElement from './FolderElement';

import currentFolderSliceTestData from 'state/testdata/currentFolderSlice.testdata.json';
import config from 'config.json';


describe('folder element', () => {
  
  const folderTestData = {
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

  const defaultRender = () => {
    renderWithProviders(
      <ContextMenuContext.Provider value={{
        clickedElements: [],
        hoveredElement: {}
      }}>
        <FolderElement folder={folderTestData}/>
      </ContextMenuContext.Provider>,
      {
        preloadedState: {
          currentFolder: currentFolderSliceTestData,
          settings: config.defaultSettings
        }   
      }
    );
  }

  test('folder icon', () => {
    defaultRender();
    expect(screen.getByTestId('folder-icon')).toBeInTheDocument();
  });

  test('folder name', () => {
    defaultRender();
    expect(screen.getByTestId('folder-name')).toBeInTheDocument();
    expect(screen.getByText(folderTestData.name)).toBeInTheDocument();
  });
})
