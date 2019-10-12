import { PartialRecord, OpsSchedules, Pads, Wells,
  ScheduleType, ViewType, Metrics, ModalTypeName } from './'

export type StoreState = SettingsState & ScheduleState

export type SettingsState = {
  spinnerVisible: boolean
  selectedScheduleTypes: ScheduleType[]
  selectedViews: ViewType[]
  selectedStateCode: string
  selectedOpsScheduleID: number
  opsSchedules: OpsSchedules
  modal: {
    type: ModalTypeName
    props: {}
    callback?: Function
  }
  preventDocumentSave: boolean
}

export type ScheduleState = {
  dirty: boolean
  pads: Pads
  wells: Wells
  crews: PartialRecord<ScheduleType, Record<number, string>>
  metrics: Metrics
}