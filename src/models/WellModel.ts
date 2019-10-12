export type WellModel = {
  wellID: number
  opsScheduleID: number
  padID: number
  predecessorWellID: number
  lateralID: number
  gpWellNo: number
  wellName: string
  workingInterest: number
  lateralLength: number
  tvd: number
  tmd: number
  spacingLeft: number
  spacingRight: number
  phaseWindow: string
  formation: string
  districtTownship: string
  surfaceLocation: number
  lateralSite: string
  unitID: number
  unit: string
  section: number
  townshipRange: string
}