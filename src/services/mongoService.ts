import { ScheduleState } from '../types/index.js';
import { ScheduleDocInfo } from '../models/mongo';
import ServiceBase from './ServiceBase';

class MongoService extends ServiceBase {
  getOpsSchedule = (opsScheduleID: number) =>
    // this.sendGet(this.baseUrl + 'mongo/ops-schedule/' + opsScheduleID).then(res => this.getJSON<ScheduleState>(res))
    this.sendGet(this.baseUrl + 'mongo/ops-schedule/' + opsScheduleID).then(res => {
      if (res.status < 200 || res.status >= 300) {
        console.log(res.status, res.statusText)
        throw Error(res.status + ' (' + res.statusText + ') ')
      }
      if (res.status === 204)
        return null
      console.log(res, res.status)
      let str = JSON.stringify(res.body)
      console.log('res body', str)
      return res.json()//.catch(() => [])      
    })

    

  getOpsSchedules = (stateCode: string) =>
    this.sendGet(this.baseUrl + 'mongo/ops-schedules/' + stateCode).then(res => this.getJSON<ScheduleDocInfo[]>(res))

  saveOpsSchedule = (opsScheduleID, schedule: ScheduleState) =>
    this.sendPost(this.baseUrl + 'mongo/ops-schedule', { opsScheduleID, schedule }).then(res => this.getJSON<number>(res))
}

export default new MongoService()