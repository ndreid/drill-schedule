import { ScheduleTypes } from '../Classes/DSClasses'
import padHelper from './pad-helper'
import { _Date, _G } from 'data-type-ext'

const drillScheduleHelper = {
  getYears(pads) {
    let years = []
    for (let pad of Object.values(pads)) {
      let startYear = _Date.getYear(pad.padConstructionStart)
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
  },
  getCostByYear(pads, wells, year, getNet = false) {
    return this.getScheduleCostByYear(pads, ScheduleTypes.PadConstruction, year, getNet)
      + this.getVertDrillingCostByYear(pads, wells, year, getNet)
      + this.getHorzDrillingCostByYear(pads, wells, year, getNet)
      + this.getScheduleCostByYear(pads, ScheduleTypes.Frac, year, getNet)
      + this.getCompletionCostByYear(pads, year, getNet)
  },
  getCostByQuarter(pads, wells, year, quarter, getNet = false) {
    return this.getScheduleCostByQuarter(pads, ScheduleTypes.PadConstruction, year, quarter, getNet)
      + this.getVertDrillingCostByQuarter(pads, wells, year, quarter, getNet)
      + this.getHorzDrillingCostByQuarter(pads, wells, year, quarter, getNet)
      + this.getScheduleCostByQuarter(pads, ScheduleTypes.Frac, year, quarter, getNet)
      + this.getCompletionCostByQuarter(pads, year, quarter, getNet)
  },
  getScheduleCostByYear(pads, scheduleType, year, getNet = false) {
    let cost = 0
    for (let pad of Object.values(pads)) {
      let start = padHelper.getScheduleStartDate(pad, scheduleType)
      if (_Date.getYear(start) === year) {
        cost += padHelper.getScheduleCost(pad, scheduleType, getNet)
      }
    }
    return cost;
  },
  getScheduleCostByQuarter(pads, scheduleType, year, quarter, getNet = false) {
    let cost = 0
    for (let pad of Object.values(pads)) {
      let start = padHelper.getScheduleStartDate(pad, scheduleType)
      if (_Date.getYear(start) === year && _Date.getQuarter(start) === quarter) {
        cost += padHelper.getScheduleCost(pad, scheduleType)
      }
    }
    return cost
  },
  getCompletionCostByYear(pads, year, getNet = false) {
    return this.getScheduleCostByYear(pads, ScheduleTypes.DrillOut, year, getNet)
      + this.getScheduleCostByYear(pads, ScheduleTypes.Facilities, year, getNet)
      + this.getScheduleCostByYear(pads, ScheduleTypes.Flowback, year, getNet)
  },
  getCompletionCostByQuarter(pads, year, quarter, getNet = false) {
    return this.getScheduleCostByQuarter(pads, ScheduleTypes.DrillOut, year, quarter, getNet)
      + this.getScheduleCostByQuarter(pads, ScheduleTypes.Facilities, year, quarter, getNet)
      + this.getScheduleCostByQuarter(pads, ScheduleTypes.Flowback, year, quarter, getNet)
  },
  getSum(objects, datePart, datePropName, getNet, valuePropName) {
    let result = {}
    let assigner = this.getDatePartAssigner(datePart)
    for (let obj of Object.values(objects)) {
      assigner(result, obj[datePropName], _G.coalesce(+obj[valuePropName], 1), getNet ? obj.workingInterest : 1)
    }
    return result
  },
  getAvg(objects, datePart, datePropName, getNet, valuePropName) {
    let result = {}
    let assigner = this.getDatePartAssigner(datePart)
    let counter = 0
    for (let obj of Object.values(objects)) {
      counter++
      assigner(result, obj[datePropName], _G.coalesce(+obj[valuePropName], 1), getNet ? obj.workingInterest : 1)
    }
  },
  getDatePartAssigner(datePart) {
    return datePart === 'quarter' ? this.quarterAssigner
      : datePart === 'year' ? this.yearAssigner
      : undefined
  },
  get quarterAssigner() {
    return {
      counter: 0,
      assign: (res, date, value, ratio = 1) => {
        
        let year = _Date.getYear(date)
        let quarter = _Date.getQuarter(date)
        if (!res.hasOwnProperty(year))
          res[year] = {}
        if (!res[year].hasOwnProperty(quarter))
          res[year][quarter] = 0
        res[year][quarter] += value * ratio
      },
    }
  },
  get yearAssigner() {
    return {
      counter: 0,
      assign: (res, date, ratio = 1) => {
        let year = _Date.getYear(date)
        if (!res.hasOwnProperty(year))
          res[year] = 0
        res[year] += value * ratio
      }
    }
  },
  getVertDrillingCost = (wells, datePartScope, getNet = false) => this.getSum(wells, datePartScope, 'vertSpudDate', getNet, 'vertDrillingCost'),
  getHorzDrillingCost = (wells, datePartScope, getNet = false) => this.getSum(wells, datePartScope, 'horzSpudDate', getNet, 'horzDrillingCost'),
  getPadsConstructed = (pads, datePartScope, getNet = false) => this.getSum(pads, datePartScope, 'padConstructionStart', getNet),
  getVertWellsDrilled = (wells, datePartScope, getNet = false) => this.getSum(wells, datePartScope, 'vertSpudDate', getNet),
  getHorzWellsDrilled = (wells, datePartScope, getNet = false) => this.getSum(wells, datePartScope, 'horzSpudDate', getNet),
  getWellsFraced = (wells, datePartScope, getNet = false) => this.getSum(wells, datePartScope, 'fracStart', getNet),
  getWellsCompleted = (wells, datePartScope, getNet = false) => this.getSum(wells, datePartScope, 'drillOutStart', getNet),
  getWellsTIL = (wells, datePartScope, getNet = false) => this.getSum(wells, datePartScope, 'facilitiesEnd', getNet),


  getProducingDays(wells, year, getNet = false) {
    let days = 0, endOfYear = year + '-12-31'
    for (let well of Object.values(wells)) {
      if (_Date.getYear(well.firstFlow) === year) {
        days += (_Date.diff(endOfYear, well.firstFlow, 'day') * (getNet ? well.workingInterest : 1))
        // console.log(days)
      }
    }
    return Math.round(days)
  },
  getRigCount(pads, year) {
    let rigCount = 0
    let usedKeys = []
    for (let pad of Object.values(pads)) {
      if (!pad.crews[ScheduleTypes.Rig] || _Date.getYear(pad.spudDate) !== year && _Date.getYear(pad.drillingEnd) !== year) {
        continue
      }

      let startMonth = _Date.getYear(pad.spudDate) < year ? 0 : _Date.getMonth(pad.spudDate)
      let endMonth = _Date.getYear(pad.drillingEnd) > year ? 11 : _Date.getMonth(pad.drillingEnd)
      for (let i = startMonth; i <= endMonth; i++) {
        let key = pad.crews[ScheduleTypes.Rig] + '-' + i
      
        if (usedKeys.includes(key)) {
          continue
        }
        usedKeys.push(key)
        rigCount++
      }
    }

    return Math.round(rigCount / 12)
  },
  getAvgHorzDrilledLatLength(wells, year) {
    let yearWells = Object.values(wells).filter(w => _Date.getYear(w.horzSpudDate) === year)
    return yearWells.length > 0 ? yearWells.reduce((sum, well) => sum + well.lateralLength, 0) / yearWells.length : 0
  },
  getAvgFracedLatLength(wells, year) {
    let yearWells = Object.values(wells).filter(w => _Date.getYear(w.fracStart) === year)
    return yearWells.length > 0 ? yearWells.reduce((sum, well) => sum + well.lateralLength, 0) / yearWells.length : 0
  },
  getJanuaryFracInventory(wells, year) {
    return Object.values(wells).filter(w =>
      _Date.getYear(w.horzDrillingEnd) < year && _Date.getYear(w.fracStart) >= year
    ).length
  }
}

export default drillScheduleHelper