import { render, screen, cleanup } from "@testing-library/react";
import '@testing-library/jest-dom'

import { renderWithProviders } from 'utils/test-utils';

import { ContextMenuContext } from 'contexts/ContextMenuContext';

import ContentsPanel from './ContentsPanel';

import currentFolderSliceTestData from 'state/testdata/currentFolderSlice.testdata.json';
import config from 'config.json';


const defaultRender = (viewMode) => {
  renderWithProviders(
    <ContextMenuContext.Provider value={{
      clickedElements: [],
      hoveredElement: {}
    }}>
      <ContentsPanel/>
    </ContextMenuContext.Provider>,
    {
      preloadedState: {
        currentFolder: currentFolderSliceTestData,
        settings: { ...config.defaultSettings, viewMode: viewMode ? viewMode : config.defaultSettings.viewMode}
      }   
    }
  );
}

const defaultTests = (viewMode) => {
  test('content box', () => {
    defaultRender(viewMode);
    expect(screen.getByTestId('content-box')).toBeInTheDocument();
  });

  test('rendered file element', () => {
    defaultRender(viewMode);
    expect(screen.getByTestId('file-element')).toBeInTheDocument();
  });

  test('rendered folder element', () => {
    defaultRender(viewMode);
    expect(screen.getByTestId('folder-element')).toBeInTheDocument();
  });
}


describe('contents panel, grid view', () => {
  defaultTests('grid');
})

describe('contents panel, list view', () => {
  defaultTests('list');
})

