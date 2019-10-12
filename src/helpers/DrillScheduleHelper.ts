import padHelper from './pad-helper'
import { _Date, _G, _Number } from 'data-type-ext'
import { Pads, Wells, ScheduleType, Pad } from '../types';

class DrillScheduleHelper {
  private getAccumulator(datePart: DatePartScope, accumulationType: AccumulationType): Accumulator {
    return datePart === 'quarter' ? new QuarterAccumulator(accumulationType)
      : datePart === 'year' ? new YearAccumulator(accumulationType)
      : undefined
  }

  getYears(pads: Pads) {
    let years = []
    for (let pad of Object.values(pads)) {
      let startYear = _Date.getYear(pad.constructionStart)
      let endYear = _Date.getYear(pad.firstFlow)

      if (startYear && !years.includes(startYear)) {
        years.push(startYear)
      }
      if (endYear && !years.includes(endYear)) {
        years.push(endYear)
      }
    }
    years.sort()
    return years
  }
  getCost(pads: Pads, wells: Wells, datePartScope: DatePartScope, getNet: boolean = false) {
    let accumulator = this.getAccumulator(datePartScope, 'sum')
    for (let well of Object.values(wells)) {
      accumulator.accumulate(well.vertDrillStart, well.vertDrillCost, getNet ? well.workingInterest : 1)
      accumulator.accumulate(well.horzDrillEnd, well.horzDrillCost, getNet ? well.workingInterest : 1)
    }
    for (let pad of Object.values(pads)) {
      accumulator.accumulate(padHelper.getScheduleStartDate(pad, ScheduleType.Construction), padHelper.getScheduleCost(pad, ScheduleType.Construction, getNet))
      accumulator.accumulate(padHelper.getScheduleStartDate(pad, ScheduleType.Frac), padHelper.getScheduleCost(pad, ScheduleType.Frac, getNet))
      accumulator.accumulate(padHelper.getScheduleStartDate(pad, ScheduleType.DrillOut), padHelper.getScheduleCost(pad, ScheduleType.DrillOut, getNet))
      accumulator.accumulate(padHelper.getScheduleStartDate(pad, ScheduleType.Facilities), padHelper.getScheduleCost(pad, ScheduleType.Facilities, getNet))
      accumulator.accumulate(padHelper.getScheduleStartDate(pad, ScheduleType.Flowback), padHelper.getScheduleCost(pad, ScheduleType.Flowback, getNet))
    }
    return accumulator.result
  }
  getScheduleCost(pads: Pads, scheduleType: ScheduleType, datePartScope: DatePartScope, getNet: boolean = false) {
    let accumulator = this.getAccumulator(datePartScope, 'sum')
    for (let pad of Object.values(pads)) {
      let start = padHelper.getScheduleStartDate(pad, scheduleType)
      accumulator.accumulate(start, padHelper.getScheduleCost(pad, scheduleType, getNet))
    }
    return accumulator.result
  }
  getCompletionCost(pads: Pads, datePartScope: DatePartScope, getNet: boolean = false) {
    let accumulator = this.getAccumulator(datePartScope, 'sum')
    for (let pad of Object.values(pads)) {
      accumulator.accumulate(padHelper.getScheduleStartDate(pad, ScheduleType.DrillOut), padHelper.getScheduleCost(pad, ScheduleType.DrillOut, getNet))
      accumulator.accumulate(padHelper.getScheduleStartDate(pad, ScheduleType.Facilities), padHelper.getScheduleCost(pad, ScheduleType.Facilities, getNet))
      accumulator.accumulate(padHelper.getScheduleStartDate(pad, ScheduleType.Flowback), padHelper.getScheduleCost(pad, ScheduleType.Flowback, getNet))
    }
    return accumulator.result
  }
  getVertDrillCost = (wells: Wells, datePartScope: DatePartScope, getNet: boolean = false) => this.accumulate(wells, datePartScope, 'sum', 'vertDrillStart', 'vertDrillCost', getNet)
  getHorzDrillCost = (wells: Wells, datePartScope: DatePartScope, getNet: boolean = false) => this.accumulate(wells, datePartScope, 'sum', 'horzDrillStart', 'horzDrillCost', getNet)
  getPadsConstructed = (pads: Pads, datePartScope: DatePartScope, getNet: boolean = false) => this.accumulate(pads, datePartScope, 'count', 'constructionStart', undefined, getNet)
  getVertWellsDrilled = (wells: Wells, datePartScope: DatePartScope, getNet: boolean = false) => this.accumulate(wells, datePartScope, 'count', 'vertDrillStart', undefined, getNet)
  getHorzWellsDrilled = (wells: Wells, datePartScope: DatePartScope, getNet: boolean = false) => this.accumulate(wells, datePartScope, 'count', 'horzDrillStart', undefined, getNet)
  getWellsFraced = (wells: Wells, datePartScope: DatePartScope, getNet: boolean = false) => this.accumulate(wells, datePartScope, 'count', 'fracStart', undefined, getNet)
  getWellsCompleted = (wells: Wells, datePartScope: DatePartScope, getNet: boolean = false) => this.accumulate(wells, datePartScope, 'count', 'drillOutStart', undefined, getNet)
  getWellsTIL = (wells: Wells, datePartScope: DatePartScope, getNet: boolean = false) => this.accumulate(wells, datePartScope, 'count', 'facilitiesEnd', undefined, getNet)
  getAvgHorzDrilledLatLength = (wells: Wells, datePartScope: DatePartScope) => this.accumulate(wells, datePartScope, 'avg', 'horzDrillStart', 'lateralLength', false)
  getAvgFracedLatLength = (wells: Wells, datePartScope: DatePartScope) => this.accumulate(wells, datePartScope, 'avg', 'fracStart', 'lateralLength', false)

  private accumulate(objects: object, datePart: DatePartScope, accumulationType: AccumulationType, datePropName: string, valuePropName: string, getNet: boolean) {
    let accumulator = this.getAccumulator(datePart, accumulationType)
    for (let obj of Object.values(objects)) {
      accumulator.accumulate(obj[datePropName], _G.coalesce(+obj[valuePropName], 1), getNet ? obj.workingInterest : 1)
    }
    return accumulator.result
  }

  getProducingDays(wells: Wells, datePartScope: DatePartScope, getNet: boolean = false) {
    let accumulator = this.getAccumulator(datePartScope, 'sum')
    for (let well of Object.values(wells)) {
      let year = _Date.getYear(well.firstFlow)
      let endOfYear = year + '-12-31'
      accumulator.accumulate(well.firstFlow, _Date.diff(endOfYear, well.firstFlow, 'day'), getNet ? well.workingInterest : 1)
    }
    return accumulator.result
  }
  getRigCount(pads: Pads, datePartScope: DatePartScope) {
    let padsArr: Pad[] = Object.values(pads)
    let accumulator = this.getAccumulator(datePartScope, 'sum')
    let rigIds: number[] = padsArr.reduce((arr: number[], pad: any) => {
      if (!isNaN(pad.crews[ScheduleType.Drill]) && !arr.includes(pad.crews[ScheduleType.Drill]))
        arr.push(pad.crews[ScheduleType.Drill])
      return arr
    }, [])
    for (let rigId of rigIds) {
      let rigPads = padsArr.filter(p => p.crews[ScheduleType.Drill] === rigId)
      let startDate: Date = new Date(Math.min(...rigPads.map(p => new Date(p.drillStart).valueOf())))
      let endDate  : Date = new Date(Math.max(...rigPads.map(p => new Date(p.drillStart).valueOf())))
      let startQ = startDate.getFullYear() + (_Date.getQuarter(startDate) - 1) / 4
      let endQ = endDate.getFullYear() + (_Date.getQuarter(endDate) - 1) / 4
      let quarterCount = (endQ - startQ) * 4
      let startQuarter = _Date.startOfQuarter(startDate)
      for (let i = 0; i <= quarterCount; i++) {
        let date = _Date.addMonths(startQuarter, i * 3)
        let value = 1
        if (i === 0) {
          let startQuarterEnd = _Date.addMonths(startQuarter, 3)
          value = _Date.diff(startQuarterEnd, startDate) / _Date.diff(startQuarterEnd, startQuarter)
        }
        if (i === quarterCount) {
          value = _Date.diff(endDate, date) / _Date.diff(_Date.addMonths(date, 3), date)
        }
        accumulator.accumulate(date, value)
      }
    }
    return accumulator.result
  }
  getJanuaryFracInventory(wells: Wells) {
    let accumulator = this.getAccumulator('year', 'count')
    for (let well of Object.values(wells)) {
      let year = _Date.getYear(well.horzDrillEnd)
      let fracYear = _Date.getYear(well.fracStart)
      while (year <= fracYear) {
        accumulator.accumulate(`1/1/${year}`)
        year++
      }
    }
    return accumulator.result
  }
}

class Accumulator {
  protected formula: AccumulateFormula
  protected count: number
  public accumulate: AccumulateFunction
  public result: Record<number, any>
  constructor(accumulationType: AccumulationType) {
    this.formula = accumulateFormulas[accumulationType]
    this.count = 0
    this.result = {}
  }
}

class QuarterAccumulator extends Accumulator {
  public result: Record<number, Record<number,number>>
  constructor(accumulationType: AccumulationType) {
    super(accumulationType)
    this.result = {}
  }
  accumulate = (date: Date | string, value: number = 0, ratio: number = 1): void => {
    this.count++
    let year = _Date.getYear(date)
    let quarter = _Date.getQuarter(date)
    if (!this.result.hasOwnProperty(year))
      this.result[year] = { [quarter]: 0 }
    else if (!this.result[year].hasOwnProperty(quarter))
      this.result[year][quarter] = 0
    this.result[year][quarter] = this.formula(this.result[year][quarter], ratio, value, this.count)
  }
}
class YearAccumulator extends Accumulator {
  public result: Record<number, number>
  constructor(accumulationType: AccumulationType) {
    super(accumulationType)
    this.result = {}
  }
  accumulate = (date: Date | string, value: number = 0, ratio: number = 1): void => {
    this.count++
    let year = _Date.getYear(date)
    if (!this.result.hasOwnProperty(year))
      this.result[year] = 0
    this.result[year] = this.formula(this.result[year], ratio, value, this.count)
  }
}

interface AccumulateFunction {
  (date: Date | string, value?: number, ratio?: number): void
}

type AccumulationType = 'count' | 'sum' | 'avg'
type DatePartScope = 'year' | 'quarter'

const accumulateFormulas = {
  count: (sum, ratio) => sum + 1 * ratio,
  sum:   (sum, ratio, value) => sum + value * ratio,
  avg:   (sum, ratio, value, count) => (value * ratio - sum) / count,
}

interface AccumulateFormula {
  (sum: number, ratio: number, value: number, count: number)
}

export default DrillScheduleHelper