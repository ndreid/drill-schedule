export interface Metrics {
  construction: ConstructionMetrics
  drill: OHDrillMetrics | OKDrillMetrics
  frac: FracMetrics
  drillOut: DrillOutMetrics
  facilities: FacilitiesMetrics
  flowback: FlowbackMetrics
}

export interface ScheduleMetricsBase {
  timing: {
    moveTime: number
  }
  costs: {}
}

export interface ConstructionMetrics extends ScheduleMetricsBase {
  timing: {
    defConstructionBeforeRigSpud: number
    defDuration: number
    moveTime: number
  }
  costs: {
    initialCost: {
      padCost: number
      roadCost: number
    }
    drillRehabCost: {
      padRehabCost: number
      roadRehabCost: number
    }
    completionsRehabCost: {
      padRehabCost: number
      roadRehabCost: number
    },
    waterTransferCost: number
  }
}

export interface OHDrillMetrics extends ScheduleMetricsBase {
  timing: {
    moveTime: number
    vertDuration: number
    horzDuration: number
  }
  costs: {
    specifiedTownships: string[]
    specifiedTownshipVertFixedCost: number
    defVertFixedCost: number
    totalFixedCost: number
    costPerFt: number
  }
}

export interface OKDrillMetrics extends ScheduleMetricsBase {
  timing: {
    moveTime: number
    formations: Record<string, {
      vertDuration: number,
      horzDuration: number
    }>
  }
  costs: {
    moveCost: number
    formations: Record<string, {
      vertTvdDiff: number
      horzLatLengthDiff: number
      vertCostPerFt: number
      horzCostPerFt
    }>
  }
}

export interface FracMetrics extends ScheduleMetricsBase {
  timing: {
    moveTime: number
    minDrillToFrac: number
    defDrillToFrac: number
    stageLength: number
    winterStagesPerDayDelay: number
    drillDepthThreshold: number
  }
  costs: {
    costPerDay: number
    fixedCosts: {
      locationPrep: number
      toePrep: number
      fracFixedCosts: number
    }
    costsPerStage: {
      wireline: number
      plugs: number
      isolationTool: number
    }
    waterCostPerBBL: {
      freshWaterPct: number
      freshWaterCostPerBBL: number
      recycledWaterPct: number
      recycledWaterCostPerBBL: number
      totalDisposalPct: number
      saltWaterDisposalCostPerBBL: number
    }
  }
  matrix: EfficiencyMatrix
}

export interface EfficiencyMatrix {
  underDrillDepthThreshold: MatrixSpacing
  overDrillDepthThreshold: MatrixSpacing
}

interface MatrixSpacing {
  spacingUnder800: MatrixData
  spacingFrom800To1200: MatrixData
  spacingFrom1200To1500: MatrixData
  spacingOver1500: MatrixData
}
interface MatrixData {
  baseStagesPerDay: number
  fracDesign: string
  bblsWaterPerStage: number
  crewCostPerStage: number
}

export interface DrillOutMetrics {
  timing: {
    moveTime: number
    defFracToDrillOut: number
    defDuration: number
  }
  costs: {
    fixedCosts: number
  }
}

export interface FacilitiesMetrics {
  timing: {
    moveTime: number
    defDrillOutToFacilities: number
    durationUnder4Wells: number
    defDuration: number
  }
  costs: {
    1: Record<string, number>
    2: Record<string, number>
    3: Record<string, number>
    4: Record<string, number>
    5: Record<string, number>
    6: Record<string, number>
  }
}

export interface FlowbackMetrics {
  timing: {
    defFacilitiesToFlowback: number
  }
  costs: {
    fixedCosts: number
  }
}