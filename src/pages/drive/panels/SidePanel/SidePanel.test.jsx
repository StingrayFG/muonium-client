import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import { useDispatch } from 'react-redux';

import { renderWithProviders } from 'utils/test-utils';
import { store } from 'state/store/store';

import { ContextMenuContext } from 'contexts/ContextMenuContext';
import { DrivePageContext } from 'contexts/DrivePageContext';

import SidePanel from 'pages/drive/panels/SidePanel/SidePanel';

import bookmarkSliceTestData from 'state/testdata/bookmarkSlice.testdata.json';


describe('side panel', () => {

  const setHoveredElementMock = jest.fn((element) => {});
  const clearHoveredElementMock = jest.fn(() => {});
  const clearSelectedElementsMock = jest.fn(() => {});

  const dispatchMock = jest.fn(() => {});

  const defaultRender = () => {
    renderWithProviders(
      <DrivePageContext.Provider value={{
        isSidePanelOpen: true
      }}>
        <ContextMenuContext.Provider value={{
          selectedElements: [],
          hoveredElement: {},
          setHoveredElement: setHoveredElementMock,
          clearHoveredElement: clearHoveredElementMock,
          clearSelectedElements: clearSelectedElementsMock,
        }}>
          <SidePanel/>
        </ContextMenuContext.Provider>,
      </DrivePageContext.Provider>,
      {
        preloadedState: {
          bookmark: bookmarkSliceTestData
        },
        dispatch: dispatchMock
      }
    );
  }

  test('render bookmarks', () => {
    defaultRender();

    expect(screen.getAllByTestId('bookmark-element')).toBeInstanceOf(Array);
    expect(screen.getAllByTestId('bookmark-element')).toHaveLength(2 + bookmarkSliceTestData.bookmarks.length);

    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Trash')).toBeInTheDocument();
    expect(screen.getByText(bookmarkSliceTestData.bookmarks[0].folder.name)).toBeInTheDocument();
  });

  test('interact with bookmarks', async () => {
    const user = userEvent.setup();
    defaultRender();

    const bookmarkElement = screen.getAllByTestId('bookmark-element')[2];

    await user.click(bookmarkElement);
    expect(dispatchMock.mock.calls[0][0]).toEqual({
      type: 'path/moveToNew',
      payload: {
        uuid: bookmarkSliceTestData.bookmarks[0].folder.uuid
      }
    });

  });
})



