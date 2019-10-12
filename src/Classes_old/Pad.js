// import '../Extensions'
// import 'babel-polyfill'
// import moment from 'moment'
import { ScheduleTypes } from './ScheduleTypes'
// import { DateTypes } from './DateTypes'

export class Pad {
  constructor(padJSON, metrics, allPads) {
    this._pads = allPads
    this.orig = {}
    this.padID = padJSON['PadID']
    this.gisPadID = padJSON['GISPadID']
    this.padName = padJSON['PadName']

    this.crews = {}
    this.manualDates = {}
    this.defaultDates = {}
    this.dates = {}
    this.predecessors = {}
    this.successors = {}

    this._padConstructionStart = undefined
    this._padConstructionEnd = undefined
    this._spudDate = undefined
    this._drillingEnd = undefined
    this._fracStart = undefined
    this._fracEnd = undefined
    this._drillOutStart = undefined
    this._drillOutEnd = undefined
    this._facilitiesStart = undefined
    this._facilitiesEnd = undefined
    this._til = undefined
    this._firstFlowDate = undefined

    this._padConstructionCost = undefined
    this._vertDrillingCost = undefined
    this._horzDrillingCost = undefined
    this._fracCost = undefined
    this._drillOutCost = undefined
    this._facilitiesCost = undefined
    this._flowbackCost = undefined

    this.metrics = metrics

    this.wells = {}
  }

  /**********
  ** DATES **
  **********/
  // getScheduleStartDate(scheduleType) {
  //   switch (scheduleType) {
  //     case ScheduleTypes.PadConstruction: return this.padConstructionStart
  //     case ScheduleTypes.Rig: return this.spudDate
  //     case ScheduleTypes.Frac: return this.fracStart
  //     case ScheduleTypes.DrillOut: return this.drillOutStart
  //     case ScheduleTypes.Facilities: return this.facilitiesStart
  //     case ScheduleTypes.Flowback: return this.firstFlowDate
  //     default: throw new Error('Pad.js getStartDate() is not configured to handle ScheduleType ' + scheduleType)
  //   }
  // }

  // getScheduleEndDate(scheduleType) {
  //   switch (scheduleType) {
  //     case ScheduleTypes.PadConstruction: return this.padConstructionEnd
  //     case ScheduleTypes.Rig: return this.drillingEnd
  //     case ScheduleTypes.Frac: return this.fracEnd
  //     case ScheduleTypes.DrillOut: return this.drillOutEnd
  //     case ScheduleTypes.Facilities: return this.facilitiesEnd
  //     default: throw new Error('Pad.js getEndDate() is not configured to handle ScheduleType ' + scheduleType)
  //   }
  // }

  emptyScheduleDates(scheduleType) {
    switch (scheduleType) {
      case ScheduleTypes.PadConstruction: this.padConstructionStart = undefined; break
      case ScheduleTypes.Rig: this.spudDate = undefined; break
      case ScheduleTypes.Frac: this.fracStart = undefined; break
      case ScheduleTypes.DrillOut: this.drillOutStart = undefined; break
      case ScheduleTypes.Facilities: this.facilitiesStart = undefined; break
      case ScheduleTypes.Flowback: this.firstFlowDate = undefined; break
      default: throw new Error('Pad.js emptyScheduleDates() is not configured to handle ScheduleType ' + scheduleType)
    }
  }

  // calcStartDate(dateType, scheduleType, scheduleMetrics, endDateAttrName) {
  //   if (this.manualDates.hasOwnProperty(dateType)) {
  //     return this.manualDates[dateType]
  //   }
  //   if (this.predecessors.hasOwnProperty(scheduleType)) {
  //     var predPad = this._pads[this.predecessors[scheduleType]]
  //     return moment(predPad[endDateAttrName]).add(scheduleMetrics.timing.moveTime || 0, 'day')
  //   }
  //   return undefined
  // }

  // get padConstructionStart() {
  //   if (!this._padConstructionStart) {
  //     this._padConstructionStart = this.calcStartDate(DateTypes.PadConstruction.Start, ScheduleTypes.PadConstruction, this.metrics.PadConstruction, 'padConstructionEnd')
  //       || moment(this.spudDate).subtract(this.metrics.PadConstruction.defPadConstructionBeforeRigSpud, 'day')
  //   }
  //   return this._padConstructionStart
  // }

  // set padConstructionStart(value) {
  //   this._padConstructionStart = value
  //   this._padConstructionEnd = undefined
  // }
  // get padConstructionEnd() {
  //   if (!this._padConstructionEnd) {
  //     this._padConstructionEnd = this.manualDates.hasOwnProperty(DateTypes.PadConstruction.End)
  //       ? this.manualDates[DateTypes.PadConstruction.End].dateValue
  //       : moment(this.padConstructionStart).add(this.metrics.PadConstruction.timing.defDuration, 'day')
  //   }
  //   return this._padConstructionEnd
  // }
  // set padConstructionEnd(value) {
  //   this._padConstructionEnd = value
  // }

  // get spudDate() {
  //   if (!this._spudDate) {
  //     this._spudDate = this.calcStartDate(DateTypes.Rig.Start, ScheduleTypes.Rig, this.metrics.Rig, 'drillingEnd')
  //   }
  //   return this._spudDate
  // }
  // set spudDate(value) {
  //   this._spudDate = value
  //   this.drillingEnd = undefined
  //   this.padConstructionStart = undefined
  // }

  // get drillingEnd() {
  //   if (!this._drillingEnd) {
  //     this._drillingEnd = this.manualDates.hasOwnProperty(DateTypes.Rig.End)
  //       ? this.manualDates[DateTypes.Rig.End].dateValue
  //       : this.spudDate ?
  //         moment(this.spudDate).add(this.drillDuration, 'day')
  //         : undefined
  //   }
  //   return this._drillingEnd
  // }
  // set drillingEnd(value) {
  //   this._drillingEnd = value
  //   this.fracStart = undefined
  // }

  // get fracStart() {
  //   if (!this._fracStart) {
  //     this._fracStart = this.calcStartDate(DateTypes.Frac.Start, ScheduleTypes.Frac, this.metrics.Frac, 'fracEnd')
  //       || moment(this.drillingEnd).add(this.metrics.Frac.timing.defDrillToFrac || 0, 'day')
  //   }
  //   return this._fracStart
  // }
  // set fracStart(value) {
  //   this._fracStart = value
  //   this.fracEnd = undefined
  // }

  // get fracEnd() {
  //   if (!this._fracEnd) {
  //     this._fracEnd = this.manualDates.hasOwnProperty(DateTypes.Frac.End)
  //       ? this.manualDates[DateTypes.Frac.End].dateValue
  //       : moment(this.fracStart).add(this.fracDuration, 'day')
  //   }
  //   return this._fracEnd
  // }
  // set fracEnd(value) {
  //   this._fracEnd = value
  //   this.drillOutStart = undefined
  //   this._fracCost = undefined
  // }

  // get drillOutStart() {
  //   if (!this._drillOutStart) {
  //     this._drillOutStart = this.calcStartDate(DateTypes.DrillOut.Start, ScheduleTypes.DrillOut, this.metrics.DrillOut, 'drillOutEnd')
  //       || moment(this.fracEnd).add(this.metrics.DrillOut.timing.defFracToDrillOut || 0, 'day')
  //   }
  //   return this._drillOutStart
  // }
  // set drillOutStart(value) {
  //   this._drillOutStart = value
  //   this.drillOutEnd = undefined
  // }

  // get drillOutEnd() {
  //   if (!this._drillOutEnd) {
  //     this._drillOutEnd = this.manualDates.hasOwnProperty(DateTypes.DrillOut.End)
  //       ? this.manualDates[DateTypes.DrillOut.End].dateValue
  //       : moment(this.drillOutStart).add(this.drillOutDuration, 'day')
  //   }
  //   return this._drillOutEnd
  // }
  // set drillOutEnd(value) {
  //   this._drillOutEnd = value
  //   this.facilitiesStart = undefined
  // }

  // get facilitiesStart() {
  //   if (!this._facilitiesStart) {
  //     this._facilitiesStart = this.calcStartDate(DateTypes.Facilities.Start, ScheduleTypes.Facilities, this.metrics.Facilities, 'facilitiesEnd')
  //       || moment(this.drillOutEnd).add(this.metrics.Facilities.defDrillOutToFacilities || 0, 'day')
  //   }
  //   return this._facilitiesStart
  // }
  // set facilitiesStart(value) {
  //   this._facilitiesStart = value
  //   this.facilitiesEnd = undefined
  // }

  // get facilitiesEnd() {
  //   if (!this._facilitiesEnd) {
  //     this._facilitiesEnd = this.manualDates.hasOwnProperty(DateTypes.Facilities.End)
  //     ? this.manualDates[DateTypes.Facilities.End].dateValue
  //     : moment(this.facilitiesStart).add(this.facilitiesDuration, 'day')
  //   }
  //   return this._facilitiesEnd
  // }
  // set facilitiesEnd(value) {
  //   this._facilitiesEnd = value
  //   this.firstFlowDate = undefined
  // }

  // get til() {
  //   if (!this._til & this.manualDates.hasOwnProperty(DateTypes.Flowback.TIL)) {
  //       this._til = this.manualDates[DateTypes.Flowback.TIL].dateValue
  //   }
  //   return this._til
  // }
  // set til(value) {
  //   this._til = value
  //   this.firstFlowDate = undefined
  // }

  // get firstFlowDate() {
  //   if (!this._firstFlowDate) {
  //     this._firstFlowDate = this.manualDates.hasOwnProperty(DateTypes.Flowback.FirstFlow)
  //       ? this.manualDates[DateTypes.Flowback.FirstFlow].dateValue
  //       : (this.til && (!this.facilitiesEnd || this.facilitiesEnd.isBefore(this.til)))
  //       ? this.til
  //       : this.facilitiesEnd
  //   }
  //   return this._firstFlowDate
  // }
  // set firstFlowDate(value) {
  //   this._firstFlowDate = value
  // }

  /**********
  ** COSTS **
  **********/
  // emptyScheduleCosts(scheduleType) {
  //   switch (scheduleType) {
  //     case ScheduleTypes.PadConstruction: this._padConstructionCost = undefined; break
  //     case ScheduleTypes.Rig: this._vertDrillingCost = this._horzDrillingCost = undefined; break
  //     case ScheduleTypes.Frac: this._fracCost = undefined; break
  //     case ScheduleTypes.DrillOut: this._drillOutCost = undefined; break
  //     case ScheduleTypes.Facilities: this._facilitiesCost = undefined; break
  //     case ScheduleTypes.Flowback: this._flowbackCost = undefined; break
  //     default: throw new Error('Pad.js emptyScheduleDates() is not configured to handle ScheduleType ' + scheduleType)
  //   }
  // }

  // getScheduleCost(scheduleType, getNet = false) {
  //   let cost = 0
  //   switch (scheduleType) {
  //     case ScheduleTypes.PadConstruction: cost = this.padConstructionCost; break
  //     case ScheduleTypes.Rig: cost = this.vertDrillingCost + this.horzDrillingCost; break
  //     case ScheduleTypes.Frac: cost = this.fracCost; break
  //     case ScheduleTypes.DrillOut: cost = this.drillOutCost; break
  //     case ScheduleTypes.Facilities: cost = this.facilitiesCost; break
  //     case ScheduleTypes.Flowback: cost = this.flowbackCost; break
  //     default: throw new Error('Pad.js getStartDate() is not configured to handle ScheduleType ' + scheduleType)
  //   }
  //   return getNet ? cost * this.workingInterest : cost
  // }

  // get padConstructionCost() {
  //   if (!this._padConstructionCost) {
  //     this._padConstructionCost = 0
  //     this._padConstructionCost = this.metrics.PadConstruction.costs.padCost + this.metrics.PadConstruction.costs.roadCost
  //   }
  //   return this._padConstructionCost
  // }

  // get vertDrillingCost() {
  //   if (!this._vertDrillingCost) {
  //     this._vertDrillingCost = 0
  //     for (let well of Object.values(this.wells)) { this._vertDrillingCost += well.vertDrillingCost }
  //   }    
  //   return this._vertDrillingCost
  // }

  // get horzDrillingCost() {
  //   if (!this._horzDrillingCost) {
  //     this._horzDrillingCost = 0
  //     for (let well of Object.values(this.wells)) { this._horzDrillingCost += well.horzDrillingCost }
  //   }    
  //   return this._horzDrillingCost
  // }

  // get fracCost() {
  //   if (!this._fracCost) {
  //     this._fracCost = 0
  //     for (let well of Object.values(this.wells)) { this._fracCost += well.fracCost }
  //   }
  //   return this._fracCost
  // }

  // get drillOutCost() {
  //   if (!this._drillOutCost) {
  //     this._drillOutCost = 0
  //     for (let well of Object.values(this.wells)) { this._drillOutCost += well.drillOutCost }
  //   }
  //   return this._drillOutCost
  // }

  // get facilitiesCost() {
  //   if (!this._facilitiesCost) {
  //     this._facilitiesCost = 0
  //     for (let well of Object.values(this.wells)) { this._facilitiesCost += this.metrics.Facilities.getCosts(Object.keys(this.wells).length, well.phaseWindow) }
  //   }
  //   return this._facilitiesCost
  // }

  // get flowbackCost() {
  //   if (!this._flowbackCost) {
  //     this._flowbackCost = this.metrics.Flowback.costs.fixedCosts * Object.keys(this.wells).length
  //   }
  //   return this._flowbackCost
  // }

  /**********
  ** OTHER **
  **********/
  // get fracStages() {
  //   let sum = 0
  //   for (let well of Object.values(this.wells)) {
  //     sum += well.fracStages
  //   }
  //   return sum
  // }

  // get lateralLength() {
  //   let sum = 0
  //   for (let well of Object.values(this.wells)) {
  //     sum += well.lateralLength
  //   }
  //   return sum
  // }

  // get workingInterest() {
  //   let count = 0, sum = 0
  //   for (let well of Object.values(this.wells)) {
  //     count++
  //     sum += well.workingInterest
  //   }
  //   return count === 0 ? undefined : sum / count
  // }

  // get padConstructionDuration() {
  //   return this.metrics.PadConstruction.timing.defDuration
  // }

  // get drillDuration() {
  //   let sum = 0
  //   for (let well of Object.values(this.wells)) {
  //     sum += well.vertDrillDuration
  //     sum += well.horzDrillDuration
  //   }
  //   return sum || undefined
  // }

  // get fracDuration() {
  //   let sum = 0
  //   for (let well of Object.values(this.wells)) { sum += well.fracDuration }
  //   return sum || undefined
  // }

  // get drillOutDuration() {
  //   let sum = 0
  //   for (let well of Object.values(this.wells)) { sum += well.drillOutDuration }
  //   return sum || undefined
  // }

  // get facilitiesDuration() {
  //   let wellCount = Object.keys(this.wells).length
  //   if (wellCount === 0) { return undefined }
  //   return wellCount < 3 ? this.metrics.Facilities.timing.durationUnder4Wells : this.metrics.Facilities.timing.defDuration
  // }

  getScheduleDuration(scheduleType) {
    switch (scheduleType) {
      case ScheduleTypes.PadConstruction: return this.padConstructionDuration
      case ScheduleTypes.Rig: return this.drillDuration
      case ScheduleTypes.Frac: return this.fracDuration
      case ScheduleTypes.DrillOut: return this.drillOutDuration
      case ScheduleTypes.Facilities: return this.facilitiesDuration
      default: throw Error('Pad.js getScheduleDuration() is not configured to hand ScheduleTypes ' + scheduleType)
    }
  }
}