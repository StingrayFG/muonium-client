import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'

import { renderWithProviders } from 'utils/test-utils';

import { ContextMenuContext } from 'contexts/ContextMenuContext';

import FileElement from 'pages/drive/elements/FileElement/FileElement';

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
    "type": "image",
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
        selectedElements: [],
        hoveredElement: {},
        setHoveredElement: setHoveredElementMock,
        clearHoveredElement: clearHoveredElementMock
      }}>
        <FileElement 
        file={testFile}
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

    expect(screen.getByTestId('file-icon')).toBeInTheDocument();
    expect(screen.getByText(testFile.name)).toBeInTheDocument();
  });

  test('render in list view', () => {
    defaultRender('list');

    expect(screen.getByTestId('file-icon')).toBeInTheDocument();
    expect(screen.getByTestId('columns-placeholder')).toBeInTheDocument();
  });

  test('interact in grid view', async () => {
    const user = userEvent.setup();
    defaultRender('grid');

    //
    const fileIconElement = screen.getByTestId('file-icon-box');

    await user.click(fileIconElement);
    expect(handleOnElementMouseDownMock.mock.calls[0][1]).toEqual(testFile);
    expect(setHoveredElementMock.mock.calls[0][0]).toEqual(testFile);

    await user.dblClick(fileIconElement);
    expect(handleOnElementDoubleClickMock.mock.calls[0][1]).toEqual(testFile);

    await user.pointer({ keys: '[MouseRight>]', target: fileIconElement })
    expect(handleOnElementContextMenuMock.mock.calls[0][1]).toEqual(testFile);

    //
    const fileNameElement = screen.getByTestId('file-name-box');

    await user.click(fileNameElement);
    expect(handleOnElementMouseDownMock.mock.calls[1][1]).toEqual(testFile);
    expect(setHoveredElementMock.mock.calls[1][0]).toEqual(testFile);

    await user.dblClick(fileNameElement);
    expect(handleOnElementDoubleClickMock.mock.calls[1][1]).toEqual(testFile);

    await user.pointer({ keys: '[MouseRight>]', target: fileNameElement })
    expect(handleOnElementContextMenuMock.mock.calls[1][1]).toEqual(testFile);
  });

  test('render in list view', async () => {
    const user = userEvent.setup();
    defaultRender('list');

    //
    const fileRow = screen.getByTestId('file-row-box');

    await user.click(fileRow);
    expect(handleOnElementMouseDownMock.mock.calls[0][1]).toEqual(testFile);
    expect(setHoveredElementMock.mock.calls[0][0]).toEqual(testFile);

    await user.dblClick(fileRow);
    expect(handleOnElementDoubleClickMock.mock.calls[0][1]).toEqual(testFile);

    await user.pointer({ keys: '[MouseRight>]', target: fileRow })
    expect(handleOnElementContextMenuMock.mock.calls[0][1]).toEqual(testFile);
  });

})
