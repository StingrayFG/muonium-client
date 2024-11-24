import { render, screen, cleanup } from "@testing-library/react";
import '@testing-library/jest-dom'

import { renderWithProviders } from 'utils/test-utils';

import { FolderContext } from "contexts/FolderContext";
import { ContextMenuContext } from 'contexts/ContextMenuContext';

import TopPanel from './TopPanel';

import userSliceTestData from 'state/testdata/userSlice.testdata.json';
import pathSliceTestData from 'state/testdata/pathSlice.testdata.json';


describe('contents panel', () => {

  const defaultRender = () => {
    renderWithProviders(
      <FolderContext.Provider value={{
        handleLogout: jest.fn()
      }}>
        <ContextMenuContext.Provider value={{
          clickedElements: [],
          hoveredElement: {}
        }}>
          <TopPanel />
        </ContextMenuContext.Provider>
      </FolderContext.Provider>,
      {
        preloadedState: {
          path: pathSliceTestData,
          user: userSliceTestData
        }   
      }
    );
  }
  
  test('render current path', () => {
    defaultRender();
    expect(screen.getByDisplayValue(pathSliceTestData.currentAbsolutePath)).toBeInTheDocument();
  });

  test('render username', () => {
    defaultRender();
    expect(screen.getByText(userSliceTestData.login)).toBeInTheDocument();
  });
  
})

