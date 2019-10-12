import { CrewModel } from './CrewModel'
import { MetricsModel } from './MetricsModel'
import { PadCrewModel} from './PadCrewModel'
import { PadModel } from './PadModel'
import { PadOverrideModel } from './PadOverrideModel'
import { PadPredecessorModel } from './PadPredecessorModel'
import { WellModel } from './WellModel'
import { WellOverrideModel } from './WellOverrideModel'

export type DBScheduleModel = {
  pads: PadModel[]
  wells: WellModel[]
  crews: CrewModel[]
  padPredecessors: PadPredecessorModel[]
  padCrews: PadCrewModel[]
  metrics: MetricsModel[]
  padOverrides: PadOverrideModel[]
  wellOverrides: WellOverrideModel[]
}