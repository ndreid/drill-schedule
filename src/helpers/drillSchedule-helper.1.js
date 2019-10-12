import { ScheduleTypes } from '../Classes/DSClasses'
import padHelper from './pad-helper'
import { _Date } from 'data-type-ext'

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
  getVertDrillingCostByYear(pads, wells, year, getNet = false) {
    let vertDrillingCost = 0
    for (let pad of Object.values(pads)) {
      for (let well of Object.values(wells)) {
        if (well.padID === pad.padID && _Date.getYear(well.vertSpudDate) === year) {
          vertDrillingCost += well.vertDrillingCost
        }
      }
    }
    return vertDrillingCost
  },
  getVertDrillingCostByQuarter(pads, wells, year, quarter, getNet = false) {
    let vertDrillingCost = 0
    for (let pad of Object.values(pads)) {
      for (let well of Object.values(wells)) {
        if (well.padID === pad.padID && _Date.getYear(well.vertSpudDate) === year && _Date.getQuarter(well.vertSpudDate) === quarter) {
          vertDrillingCost += well.vertDrillingCost
        }
      }
    }
    return vertDrillingCost
  },
  getHorzDrillingCostByYear(pads, wells, year, getNet = false) {
    let horzDrillingCost = 0
    for (let pad of Object.values(pads)) {
      for (let well of Object.values(wells)) {
        if (well.padID === pad.padID && _Date.getYear(well.horzSpudDate) === year) {
          horzDrillingCost += well.horzDrillingCost
        }
      }
    }
    return horzDrillingCost
  },
  getHorzDrillingCostByQuarter(pads, wells, year, quarter, getNet = false) {
    let horzDrillingCost = 0
    for (let pad of Object.values(pads)) {
      for (let well of Object.values(wells)) {
        if (well.padID === pad.padID && _Date.getYear(well.horzSpudDate) === year && _Date.getQuarter(well.horzSpudDate) === quarter) {
          horzDrillingCost += well.horzDrillingCost
        }
      }
    }
    return horzDrillingCost
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
  getPadsConstructed(pads, year, getNet = false) {
    let padsConstructed = 0, wiSum = 0
    for (let pad of Object.values(pads)) {
      if (_Date.getYear(pad.padConstructionStart) === year) {
        padsConstructed++
        wiSum += pad.workingInterest
      }
    }
    return getNet ? (padsConstructed === 0 ? 0 : wiSum) : padsConstructed
  },
  getVertWellsDrilled(wells, year, getNet = false) {
    let wellsDrilled = 0, wiSum = 0
    for (let well of Object.values(wells)) {
      if (_Date.getYear(well.vertSpudDate) === year) {
        wellsDrilled++
        wiSum += well.workingInterest
      }
    }
    return getNet ? (wellsDrilled === 0 ? 0 : wiSum) : wellsDrilled
  },
  getHorzWellsDrilled(wells, year, getNet = false) {
    let wellsDrilled = 0, wiSum = 0
    for (let well of Object.values(wells)) {
      if (_Date.getYear(well.horzSpudDate) === year) {
        wellsDrilled++
        wiSum += well.workingInterest
      }
    }
    return getNet ? (wellsDrilled === 0 ? 0 : wiSum) : wellsDrilled
  },
  getWellsFraced(wells, year, getNet = false) {
    let wellsFraced = 0, wiSum = 0
    for (let well of Object.values(wells)) {
      if (_Date.getYear(well.fracStart) === year) {
        wellsFraced++
        wiSum += well.workingInterest
      }
    }
    return getNet ? (wellsFraced === 0 ? 0 : wiSum) : wellsFraced
  },
  getWellsCompleted(wells, year, getNet = false) {
    let wellsCompleted = 0, wiSum = 0
    for (let well of Object.values(wells)) {
      if (_Date.getYear(well.drillOutStart) === year) {
        wellsCompleted++
        wiSum += well.workingInterest
      }
    }
    return getNet ? (wellsCompleted === 0 ? 0 : wiSum) : wellsCompleted
  },
  getWellsTIL(wells, year, getNet = false) {
    let wellsTIL = 0, wiSum = 0
    for (let well of Object.values(wells)) {
      if (_Date.getYear(well.facilitiesEnd) === year) {
        wellsTIL++
        wiSum += well.workingInterest
      }
    }
    return getNet ? (wellsTIL === 0 ? 0 : wiSum) : wellsTIL
  },
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