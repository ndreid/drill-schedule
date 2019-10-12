export class Metrics {
  constructor(stateCode) {
    this.PadConstruction = new PadConstructionMetrics(stateCode)
    this.Rig = new DrillingMetrics(stateCode)
    this.Frac = new FracMetrics(stateCode)
    this.DrillOut = new DrillOutMetrics(stateCode)
    this.Facilities = new FacilitiesMetrics(stateCode)
    this.Flowback = new FlowbackMetrics(stateCode)
  }
}

export class PadConstructionMetrics {
  constructor(stateCode) {
    this.timing = {
      defPadConstructionBeforeRigSpud: undefined,
      defDuration: undefined
    }
  
    this.costs = {
      initialCost: {
        padCost: undefined,
        roadCost: undefined,
      },
      drillingRehabCost: {
        padRehabCost: undefined,
        roadRehabCost: undefined,
      },
      constructionRehabCost: {
        padRehabCost: undefined,
        roadRehabCost: undefined,
      },
      waterTransferCost: undefined,
    }
  }
}

export class DrillingMetrics {
  constructor(stateCode) {
    if (stateCode === 'OH') {
      this.timing = {
        moveTime: undefined,
        drillDepthThreshold: undefined,
        vertDurationUnderThreshold: undefined,
        vertDurationOverThreshold: undefined,
        horzDurationUnderThreshold: undefined,
        horzDurationOverThreshold: undefined
      }
    
      this.costs = {
        specifiedTownships: [],
        specifiedTownshipVertFixedCost: undefined,
        defVertFixedCost: undefined,
        totalFixedCost: undefined,
        costPerFt: undefined
      }
    }
    
    if (stateCode === 'OK') {
      this.timing = {
        moveTime: undefined,
        drillDepthThreshold: undefined,
        formations: {}
      }

      this.costs = {
        moveCost: undefined,
        formations: {}
      }
    }
  }
}

export class FracMetrics {
  constructor(stateCode) {
    this.timing = {
      moveTime: undefined,
      minDrillToFrac: undefined,
      defDrillToFrac: undefined,
      stageLength: undefined,
      winterStagesPerDayDelay: undefined,
    }
  
    this.costs = {
      costPerDay: undefined,
      fixedCosts: {
        locationPrep: undefined,
        toePrep: undefined,
        fracFixedCosts: undefined
      },
      costsPerStage: {
        wireline: undefined,
        plugs: undefined,
        isolationTool: undefined
      },
      waterCostPerBBL: {
        freshWaterPct: undefined,
        freshWaterCostPerBBL: undefined,
        recycledWaterPct: undefined,
        recycledWaterCostPerBBL: undefined,
        totalDisposalPct: undefined,
        saltWaterDisposalCostPerBBL: undefined
      }
    }
  
    this.matrix = {
      underDrillDepthThreshold: {
        spacingUnder800: {
          baseStagesPerDay: undefined,
          fracDesign: undefined,
          bblsWaterPerStage: undefined,
          crewCostPerStage: undefined
        },
        spacingFrom800To1200: {
          baseStagesPerDay: undefined,
          fracDesign: undefined,
          bblsWaterPerStage: undefined,
          crewCostPerStage: undefined
        },
        spacingFrom1200To1500: {
          baseStagesPerDay: undefined,
          fracDesign: undefined,
          bblsWaterPerStage: undefined,
          crewCostPerStage: undefined
        },
        spacingOver1500: {
          baseStagesPerDay: undefined,
          fracDesign: undefined,
          bblsWaterPerStage: undefined,
          crewCostPerStage: undefined
        }
      },
  
      overDrillDepthThreshold: {
        spacingUnder800: {
          baseStagesPerDay: undefined,
          fracDesign: undefined,
          bblsWaterPerStage: undefined,
          crewCostPerStage: undefined
        },
        spacingFrom800To1200: {
          baseStagesPerDay: undefined,
          fracDesign: undefined,
          bblsWaterPerStage: undefined,
          crewCostPerStage: undefined
        },
        spacingFrom1200To1500: {
          baseStagesPerDay: undefined,
          fracDesign: undefined,
          bblsWaterPerStage: undefined,
          crewCostPerStage: undefined
        },
        spacingOver1500: {
          baseStagesPerDay: undefined,
          fracDesign: undefined,
          bblsWaterPerStage: undefined,
          crewCostPerStage: undefined
        }
      }
    }
  }
}

export class DrillOutMetrics {
  constructor(stateCode) {
    this.timing = {
      moveTime: undefined,
      defFracToDrillOut: undefined,
      defDuration: undefined
    }
  
    this.costs = {
      fixedCosts: undefined
    }
  }
  
}

export class FacilitiesMetrics {
  constructor(stateCode) {
    this.timing = {
      moveTime: undefined,
      defDrillOutToFacilities: undefined,
      durationUnder4Wells: undefined,
      defDuration: undefined
    }
  
    this.costs = {
      oneWell: {},
      twoWells: {},
      threeWells: {},
      fourWells: {},
      fiveWells: {},
      sixPlusWells: {},
    }
  }
}

export class FlowbackMetrics {
  constructor(stateCode) {
    this.timing = {
      defFacilitiesToFlowback: undefined,
      // defDuration: undefined
    }

    this.costs = {
      fixedCosts: undefined
    }
  }
}