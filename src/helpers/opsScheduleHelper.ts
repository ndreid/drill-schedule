import { StoreState, ScheduleState } from '../types';

const opsScheduleHelper = {
  getScheduleState(state: StoreState): ScheduleState {
    return {
      dirty: state.dirty,
      pads: state.pads,
      wells: state.wells,
      crews: state.crews,
      metrics: state.metrics,
    }
  }
}

export default opsScheduleHelper