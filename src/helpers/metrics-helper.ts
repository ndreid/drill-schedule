import { ConstructionMetrics, OHDrillMetrics, OKDrillMetrics, FracMetrics, DrillOutMetrics, Well, FacilitiesMetrics, FlowbackMetrics } from "../types";

const metricsHelper = {
  construction: {
    getConstructionCosts(constructionMetrics: ConstructionMetrics, wellCount: number) {
      return (constructionMetrics.costs.initialCost.padCost + constructionMetrics.costs.initialCost.roadCost) / wellCount
    },
    getDrillRehabCosts(constructionMetrics: ConstructionMetrics, wellCount: number) {
      return (constructionMetrics.costs.drillRehabCost.padRehabCost + constructionMetrics.costs.drillRehabCost.roadRehabCost) / wellCount
    },
    getCompletionsRehabCosts(constructionMetrics: ConstructionMetrics, wellCount: number) {
      return (constructionMetrics.costs.completionsRehabCost.padRehabCost + constructionMetrics.costs.completionsRehabCost.roadRehabCost) / wellCount
    },
    getWaterTransferCosts(constructionMetrics: ConstructionMetrics, wellCount: number) {
      return constructionMetrics.costs.waterTransferCost / wellCount
    }
  },
  drill: {
    getVertDrillDuration(drillMetrics: OHDrillMetrics | OKDrillMetrics, well: Well, stateCode: string) {
      switch (stateCode) {
        case 'OH':
          drillMetrics = drillMetrics as OHDrillMetrics
          return drillMetrics.timing.vertDuration
        case 'OK':
          drillMetrics = drillMetrics as OKDrillMetrics
          return well.formation && drillMetrics.timing.formations[well.formation]
            ? drillMetrics.timing.formations[well.formation].vertDuration
            : undefined
        default: return undefined
      }
    },
    getHorzDrillDuration(drillMetrics: OHDrillMetrics | OKDrillMetrics, well: Well, stateCode: string) {
      switch (stateCode) {
        case 'OH':
          drillMetrics = drillMetrics as OHDrillMetrics
          return drillMetrics.timing.horzDuration
        case 'OK':
          drillMetrics = drillMetrics as OKDrillMetrics
          return well.formation && drillMetrics.timing.formations[well.formation]
            ? drillMetrics.timing.formations[well.formation].horzDuration
            : undefined
        default: return undefined
      }
    },
    getVertDrillCost(drillMetrics: OHDrillMetrics | OKDrillMetrics, well: Well, stateCode: string) {
      switch (stateCode) {
        case 'OH':
          drillMetrics = drillMetrics as OHDrillMetrics
          return well.districtTownship && drillMetrics.costs.specifiedTownships.includes(well.districtTownship)
            ? drillMetrics.costs.specifiedTownshipVertFixedCost
            : drillMetrics.costs.defVertFixedCost
        case 'OK':
          drillMetrics = drillMetrics as OKDrillMetrics
          if (!well.tvd || !well.formation || !drillMetrics.costs.formations[well.formation]) { return undefined }
          let costMetrics = drillMetrics.costs.formations[well.formation]
          return (well.tvd + costMetrics.vertTvdDiff) * costMetrics.vertCostPerFt + drillMetrics.costs.moveCost
        default: return undefined
      }
    },
    getHorzDrillCost(drillMetrics: OHDrillMetrics | OKDrillMetrics, well: Well, stateCode: string) {
      switch (stateCode) {
        case 'OH':
          drillMetrics = drillMetrics as OHDrillMetrics
          if (!well.lateralLength) { return undefined }
          return (drillMetrics.costs.costPerFt * well.lateralLength) + drillMetrics.costs.totalFixedCost - (
            well.districtTownship && drillMetrics.costs.specifiedTownships.includes(well.districtTownship)
              ? drillMetrics.costs.specifiedTownshipVertFixedCost
              : drillMetrics.costs.defVertFixedCost
          )
        case 'OK':
          drillMetrics = drillMetrics as OKDrillMetrics
          if (!well.lateralLength || !well.formation || !drillMetrics.costs.formations[well.formation]) { return undefined }
          let costMetrics = drillMetrics.costs.formations[well.formation]
          return (well.lateralLength + costMetrics.horzLatLengthDiff) * costMetrics.horzCostPerFt
        default: return undefined
      }
    },
  },

  frac: {
    getFixedCosts(fracMetrics: FracMetrics) {
      if (!fracMetrics.costs.fixedCosts.locationPrep || !fracMetrics.costs.fixedCosts.toePrep || !fracMetrics.costs.fixedCosts.fracFixedCosts) { return undefined }
      return fracMetrics.costs.fixedCosts.locationPrep + fracMetrics.costs.fixedCosts.toePrep + fracMetrics.costs.fixedCosts.fracFixedCosts
    },
    getCostsPerStage(fracMetrics: FracMetrics) {
      if (!fracMetrics.costs.costsPerStage.wireline || !fracMetrics.costs.costsPerStage.plugs || !fracMetrics.costs.costsPerStage.isolationTool) { return undefined }
      return fracMetrics.costs.costsPerStage.wireline + fracMetrics.costs.costsPerStage.plugs + fracMetrics.costs.costsPerStage.isolationTool
    },
    getWaterCostPerBBL(fracMetrics: FracMetrics) {
      if (!fracMetrics.costs.waterCostPerBBL.freshWaterPct || !fracMetrics.costs.waterCostPerBBL.freshWaterCostPerBBL
        || !fracMetrics.costs.waterCostPerBBL.recycledWaterPct || !fracMetrics.costs.waterCostPerBBL.recycledWaterCostPerBBL
        || !fracMetrics.costs.waterCostPerBBL.totalDisposalPct || !fracMetrics.costs.waterCostPerBBL.saltWaterDisposalCostPerBBL) {
       return undefined
     }
     return fracMetrics.costs.waterCostPerBBL.freshWaterPct * fracMetrics.costs.waterCostPerBBL.freshWaterCostPerBBL
           + fracMetrics.costs.waterCostPerBBL.recycledWaterPct * fracMetrics.costs.waterCostPerBBL.recycledWaterCostPerBBL
           + fracMetrics.costs.waterCostPerBBL.totalDisposalPct * fracMetrics.costs.waterCostPerBBL.saltWaterDisposalCostPerBBL
    },
    getMatrixObj(fracMetrics: FracMetrics, tmd: number, avgSpacing: number) {
      if (!tmd || !avgSpacing) { return undefined }
      if (tmd < fracMetrics.timing.drillDepthThreshold) {
        if (avgSpacing < 800) return fracMetrics.matrix.underDrillDepthThreshold.spacingUnder800
        if (avgSpacing < 1200) return fracMetrics.matrix.underDrillDepthThreshold.spacingFrom800To1200
        if (avgSpacing < 1500) return fracMetrics.matrix.underDrillDepthThreshold.spacingFrom1200To1500
        return fracMetrics.matrix.underDrillDepthThreshold.spacingOver1500
      } else {
        if (avgSpacing < 800) return fracMetrics.matrix.overDrillDepthThreshold.spacingUnder800
        if (avgSpacing < 1200) return fracMetrics.matrix.overDrillDepthThreshold.spacingFrom800To1200
        if (avgSpacing < 1500) return fracMetrics.matrix.overDrillDepthThreshold.spacingFrom1200To1500
        return fracMetrics.matrix.overDrillDepthThreshold.spacingOver1500
      }
    },
    getCosts(fracMetrics: FracMetrics, tmd: number, avgSpacing: number, fracDuration: number, fracStages: number) {
      let matrixObj = this.getMatrixObj(fracMetrics, tmd, avgSpacing)
      let fixedCosts = this.getFixedCosts(fracMetrics)
      let durationCost = fracMetrics.costs.costPerDay * fracDuration
      let crewCost = matrixObj ? matrixObj.crewCostPerStage * fracStages : undefined
      let additionalCosts = this.getCostsPerStage(fracMetrics) * fracStages
      let waterCost = matrixObj ? matrixObj.bblsWaterPerStage * fracStages * this.getWaterCostPerBBL(fracMetrics) : undefined
      return fixedCosts + durationCost + crewCost + additionalCosts + waterCost
    }
  },

  drillOut: {
    getCosts(drillOutMetrics: DrillOutMetrics) {
      return drillOutMetrics.costs.fixedCosts
    }
  },

  facilities: {
    getCosts(facilitiesMetrics: FacilitiesMetrics, numWells: number, phaseWindow: string) {
      if (!numWells) { return undefined }
      let costSet: Record<string, number> = facilitiesMetrics.costs[Math.min(numWells, 6)]

      return costSet[phaseWindow ? phaseWindow.toUpperCase() : "DEFAULT"]
    },
  },

  flowback: {
    getCosts(flowbackMetrics: FlowbackMetrics) {
      return flowbackMetrics.costs.fixedCosts
    }
  }
}

export default metricsHelper