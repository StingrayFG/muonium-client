import { render, screen, cleanup } from "@testing-library/react";
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'

import { renderWithProviders } from 'utils/test-utils';

import { ContextMenuContext } from 'contexts/ContextMenuContext';

import FileElement from './FileElement';

import currentFolderSliceTestData from 'state/testdata/currentFolderSlice.testdata.json';
import config from 'config.json';


describe('file element', () => {

  const testFile = {
    "name": "gear.jpg",
    "nameExtension": "1732391711071",
    "size": 15007,
    "creationDate": "2024-11-23T19:55:11.074Z",
    "modificationDate": "2024-11-23T19:55:11.074Z",
    "uuid": "a5f3456b-54f1-4df3-83fb-f71f4272f355",
    "ownerUuid": "3c6ef54d-d5e2-41dd-bfab-4e1e80d1d424",
    "driveUuid": "c808eb64-8970-4a5d-a7e1-571f6cad4ac5",
    "parentUuid": "696b5d09-e26c-479a-8e15-e964d5eeff47",
    "isRemoved": false,
    "type": "file"
  }

  const testGeneratedData = {
    "type": "image"
  }

  const defaultRender = () => {
    renderWithProviders(
      <ContextMenuContext.Provider value={{
        clickedElements: [],
        hoveredElement: {}
      }}>
        <FileElement 
        file={testFile}
        generatedData={testGeneratedData}/>
      </ContextMenuContext.Provider>,
      {
        preloadedState: {
          currentFolder: currentFolderSliceTestData,
          settings: config.defaultSettings
        }   
      }
    );
  }

  test('file icon', () => {
    defaultRender();

    expect(screen.getByTestId('file-icon')).toBeInTheDocument();
  });

  test('file name', () => {
    defaultRender();

    expect(screen.getByTestId('file-name')).toBeInTheDocument();
    expect(screen.getByText(testFile.name)).toBeInTheDocument();
  });
  
})
