export type WellOverrideModel = {
  wellID: number
  vertDrillOrder?: number
  horzDrillOrder?: number
  vertDrillDuration?: number
  horzDrillDuration?: number
  constructionAFE?: number
  drillRehabAFE?: number
  completionsRehabAFE?: number
  waterTransferAFE?: number
  vertDrillAFE?: number
  horzDrillAFE?: number
  fracAFE?: number
  drillOutAFE?: number
  facilitiesAFE?: number
  flowbackAFE?: number
}