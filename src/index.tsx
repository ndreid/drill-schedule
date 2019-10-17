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
import { service } from './services'
import opsScheduleHelper from './helpers/opsScheduleHelper'
import state from './services/state.json'

let wells = Object.values(state.wells)

for (let well of wells) {
  state.wells[well.wellID] = {
    ...well,
    afes: {
      construction: Math.floor(Math.random() * 2000000) + 500000,
      drillRehab: Math.floor(Math.random() * 2000000) + 500000,
      completionsRehab: Math.floor(Math.random() * 2000000) + 500000,
      waterTransfer: Math.floor(Math.random() * 2000000) + 500000,
      vertDrill: Math.floor(Math.random() * 2000000) + 500000,
      horzDrill: Math.floor(Math.random() * 2000000) + 500000,
      frac: Math.floor(Math.random() * 2000000) + 500000,
      drillOut: Math.floor(Math.random() * 2000000) + 500000,
      facilities: Math.floor(Math.random() * 2000000) + 500000,
      flowback: Math.floor(Math.random() * 2000000) + 500000,
    },
    "lateralID": Math.floor(Math.random() * 200000) + 100000,
    "gpWellNo": Math.floor(Math.random() * 10000) + 1000,
    "workingInterest": Math.random(),
    "lateralLength": Math.floor(Math.random() * 20000) + 3000,
    "tvd": Math.floor(Math.random() * 20000) + 3000,
    "tmd": Math.floor(Math.random() * 25000) + 20000,
    "spacingLeft": Math.floor(Math.random() * 9000) + 1000,
    "spacingRight": Math.floor(Math.random() * 9000) + 1000,
    "phaseWindow": "DRY GAS",
    "formation": "MOUNTAIN",
    "districtTownship": "FRANKLIN",
    "surfaceLocation": null,
    "lateralSite": "B",
    "unitID": Math.floor(Math.random() * 300000) + 200000,
    "unit": "BETTINGER FRK MN",
    "section": Math.floor(Math.random() * 99) + 1,
    "townshipRange": "" + (Math.floor(Math.random() * 8) + 1) + "N" + (Math.floor(Math.random() * 8) + 1) + "W",
  }
}

// const persistedSettings = config.useLocalStorage ? loadSettingsState() : undefined
// const persistedState = persistedSettings && persistedSettings.selectedOpsScheduleID ? loadScheduleState(persistedSettings.selectedOpsScheduleID) : undefined
for (let well of Object.values(state.wells).filter(w => !w.padID)) {
  console.log(well.wellName)
}
const composeEnhancers = window['__REDUX_DEVTOOLS_EXTENSION_COMPOSE__'] || compose
const store: Store<StoreState> = createStore<StoreState, any, any, any>(
  reducers,
  //@ts-ignore
  state, // Object.assign({}, persistedState, persistedSettings),
  composeEnhancers(applyMiddleware(batchedThunk))
);

ReactDOM.render(
  <Provider store={store}>
    {/* <App loadedStateFromStorage={persistedState ? true : false} initOpsScheduleID={persistedSettings ? persistedSettings.selectedOpsScheduleID : undefined}/> */}
    <App loadedStateFromStorage={true} initOpsScheduleID={1}/>
  </Provider>
  , document.getElementById('app-root')
);

