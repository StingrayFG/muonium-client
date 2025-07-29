import { render, screen, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom'

import { renderWithProviders } from 'utils/test-utils';

import { ContextMenuContext } from 'contexts/ContextMenuContext';
import { DrivePageContext } from 'contexts/DrivePageContext';

import SidePanel from './SidePanel';

import bookmarkSliceTestData from 'state/testdata/bookmarkSlice.testdata.json';


describe('side panel', () => {
  const defaultRender = () => {
    renderWithProviders(
      <DrivePageContext.Provider value={{
        isSidePanelOpen: true
      }}>
        <ContextMenuContext.Provider value={{
          selectedElements: [],
          hoveredElement: {}
        }}>
          <SidePanel/>
        </ContextMenuContext.Provider>,
      </DrivePageContext.Provider>,
      {
        preloadedState: {
          bookmark: bookmarkSliceTestData
        }   
      }
    );
  }

  test('render places', () => {
    defaultRender();
    expect(screen.getAllByTestId('bookmark-element')).toBeInstanceOf(Array);
    expect(screen.getAllByTestId('bookmark-element')).not.toHaveLength(0);
  });

  test('render bookmarks', () => {
    defaultRender();
    expect(screen.getAllByTestId('bookmark-element')).toBeInstanceOf(Array);
    expect(screen.getAllByTestId('bookmark-element')).not.toHaveLength(0);
  });
})



