import { render, screen, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom'

import { renderWithProviders } from 'utils/test-utils';

import { ContextMenuContext } from 'contexts/ContextMenuContext';

import ContentsPanel from './ContentsPanel';

import currentFolderSliceTestData from 'state/testdata/currentFolderSlice.testdata.json';
import config from 'config.json';


describe('contents panel', () => {

  const defaultRender = (viewMode) => {
    renderWithProviders(
      <ContextMenuContext.Provider value={{
        selectedElements: [],
        hoveredElement: {}
      }}>
        <ContentsPanel />
      </ContextMenuContext.Provider>,
      {
        preloadedState: {
          currentFolder: currentFolderSliceTestData,
          settings: { 
            ...config.defaultSettings, 
            viewMode: viewMode ? viewMode : config.defaultSettings.viewMode
          }
        }   
      }
    );
  }
  
  const defaultTests = (viewMode) => {
    test('render file element', () => {
      defaultRender(viewMode);
      expect(screen.getByTestId('file-element')).toBeInTheDocument();
    });
  
    test('render folder element', () => {
      defaultRender(viewMode);
      expect(screen.getByTestId('folder-element')).toBeInTheDocument();
    });
  }

  defaultTests('grid');
  defaultTests('list');

})

