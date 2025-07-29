import React from 'react'
import { render } from '@testing-library/react'
import { Provider } from 'react-redux'

import { setupStore } from 'state/store/store'


export function renderWithProviders(
  ui,
  {
    preloadedState = {},
    dispatch = () => {},
    store = {
      ...setupStore(preloadedState),
      dispatch
    },
    ...renderOptions
  } = {}
) {
  function Wrapper({ children }) {
    return <Provider store={store}>{children}</Provider>
  }

  return { 
    store, 
    ...render(ui, { 
      wrapper: Wrapper, 
      ...renderOptions 
    }) 
  }
}