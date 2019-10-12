import React from 'react'
import ReactDOM from 'react-dom'
import { createStore, applyMiddleware, compose, Store } from 'redux'
import { Provider } from 'react-redux'
import batchedThunk from './redux/middleware/batched-thunk'
import './index.css'
import App from './Components/App'
import reducers from './redux/reducers'
// import { loadScheduleState, saveState, loadSettingsState } from './localStorage'
import debounce from 'lodash/throttle'
import config from './config.json'
import { StoreState } from './types'
import { mongoService } from './services'
import opsScheduleHelper from './helpers/opsScheduleHelper'


// const persistedSettings = config.useLocalStorage ? loadSettingsState() : undefined
// const persistedState = persistedSettings && persistedSettings.selectedOpsScheduleID ? loadScheduleState(persistedSettings.selectedOpsScheduleID) : undefined

const composeEnhancers = window['__REDUX_DEVTOOLS_EXTENSION_COMPOSE__'] || compose
const store: Store<StoreState> = createStore<StoreState, any, any, any>(
  reducers,
  {}, // Object.assign({}, persistedState, persistedSettings),
  composeEnhancers(applyMiddleware(batchedThunk))
  // applyMiddleware(batchedThunk)
);

if (config.useLocalStorage) {
  store.subscribe(debounce(() => {
    let state = store.getState()
    if (state.selectedOpsScheduleID && !state.preventDocumentSave) {
      console.log('***********Saving to Mongo**************')
      mongoService.saveOpsSchedule(state.selectedOpsScheduleID, opsScheduleHelper.getScheduleState(state))
    }
    // if (state.selectedOpsScheduleID) {
    //   saveState(state.selectedOpsScheduleID, state)
    // }
  }, 2000))
}

ReactDOM.render(
  <Provider store={store}>
    {/* <App loadedStateFromStorage={persistedState ? true : false} initOpsScheduleID={persistedSettings ? persistedSettings.selectedOpsScheduleID : undefined}/> */}
    <App loadedStateFromStorage={false} initOpsScheduleID={undefined}/>
  </Provider>
  , document.getElementById('app-root')
);
