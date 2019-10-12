import { CrewModel, MetricsModel, OpsScheduleModel, PadCrewModel, PadModel, PadOverrideModel, PadPredecessorModel, WellModel, WellOverrideModel, DBScheduleModel } from '../models'
import ServiceBase from './ServiceBase';

class SQLService extends ServiceBase {

  getOpsSchedules = (stateCode: string) => {
    return fetch(this.baseUrl + 'ops-schedules/' + stateCode, {
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
    }).then(res => {
      // if (res.status < 200 || res.status >= 300) {
      //   console.log(res.status, res.statusText)
      //   throw Error(res.status + ' (' + res.statusText + ') ')
      // }
      return res.json()
    })
  }
  // getOpsSchedules = (stateCode: string) =>
  //   this.sendGet(this.baseUrl + 'ops-schedules/' + stateCode)
  //   .then(res => {
  //     let test = res;
  //     console.log(res)
  //     return this.getJSON<OpsScheduleModel[]>(res)
  //   })
  //   .catch(err => { throw Error('An error occurred while getting OpsSchedules: \n  ' + err.message) })

  getNextCrewID = () =>
    fetch(this.baseUrl + 'crews/nextid')
    .then(res => this.getJSON<number>(res))
    .catch(err => { throw Error('An error occurred while getting next CrewID: \n ' + err.message) })

  getCrews = (opsScheduleID: number) =>
    this.sendGet(this.baseUrl + 'crews/' + opsScheduleID)
    .then(res => this.getJSON<CrewModel[]>(res))
    .catch(err => { throw Error('An error occurred while getting Crews: \n  ' + err.message) })

  getNextPadID = () =>
    this.sendGet(this.baseUrl + 'pads/nextid')
    .then(res => this.getJSON<number>(res))
    .catch(err => { throw Error('An error occurred while getting next PadID: \n ' + err.message) })

  getPads = (opsScheduleID: number) =>
    this.sendGet(this.baseUrl + 'pads/' + opsScheduleID)
    .then(res => this.getJSON<PadModel[]>(res))
    .catch(err => { throw Error('An error occurred while getting Pads: \n  ' + err.message) })
  
  getPadCrews = (opsScheduleID: number) =>
    this.sendGet(this.baseUrl + 'pads/crews/' + opsScheduleID)
    .then(res => this.getJSON<PadCrewModel[]>(res))
    .catch(err => { throw Error('An error occurred while getting Pad Crews: \n  ' + err.message) })
  
  getPadOverrides = (opsScheduleID: number) =>
    this.sendGet(this.baseUrl + 'pads/overrides/' + opsScheduleID)
    .then(res => this.getJSON<PadOverrideModel[]>(res))
    .catch(err => { throw Error('An error occurred while getting Pad Overrides: \n ' + err.message) })
  
  getPadPredecessors = (opsScheduleID: number) =>
    this.sendGet(this.baseUrl + 'pads/predecessors/' + opsScheduleID)
    .then(res => this.getJSON<PadPredecessorModel[]>(res))
    .catch(err => { throw Error('An error occurred while getting Pad Predecessors: \n  ' + err.message) })

  getNextWellID = () =>
    this.sendGet(this.baseUrl + 'wells/nextid')
    .then(res => this.getJSON<number>(res))
    .catch(err => { throw Error('An error occurred while getting next WellID: \n ' + err.message) })
  
  getWells = (opsScheduleID: number) =>
    this.sendGet(this.baseUrl + 'wells/' + opsScheduleID)
    .then(res => this.getJSON<WellModel[]>(res))
    .catch(err => { throw Error('An error occurred while getting Wells: \n  ' + err.message) })

  getWellOverrides = (opsScheduleID: number) =>
    this.sendGet(this.baseUrl + 'wells/overrides/' + opsScheduleID)
    .then(res => this.getJSON<WellOverrideModel[]>(res))
    .catch(err => { throw Error('An error occurred while getting Well Overrides: \n ' + err.message) })
  
  getMetrics = (opsScheduleID: number) =>
    this.sendGet(this.baseUrl + 'metrics/' + opsScheduleID)
    .then(res => this.getJSON<MetricsModel[]>(res))
    .catch(err => { throw Error('An error occurred while getting Metrics: \n  ' + err.message) })

  saveOpsSchedule = (opsScheduleID, dbSchedule: DBScheduleModel) =>
    this.sendPost(this.baseUrl + 'ops-schedules/save', { opsScheduleID, dbSchedule }).then(res => this.getJSON<number>(res))

  saveOpsScheduleAs = (opsScheduleName: string, stateCode: string, dbSchedule: DBScheduleModel) =>
    this.sendPost(this.baseUrl + 'ops-schedules/save-as', { opsScheduleName, stateCode, dbSchedule }).then(res => this.getJSON<number>(res))

  saveOpsScheduleTo = (opsScheduleID: number, dbSchedule: DBScheduleModel) =>
    this.sendPost(this.baseUrl + 'ops-schedules/save-to', { opsScheduleID, dbSchedule }).then(res => this.getJSON<number>(res))

  deleteOpsSchedule = (opsScheduleID: number) =>
    this.sendDelete(this.baseUrl + 'ops-schedules', { opsScheduleID }).then(res => this.getJSON<number>(res))
}

export default new SQLService()


