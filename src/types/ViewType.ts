export const ViewType: Record<ViewTypeKeys, ViewType> = Object.freeze({
  Timeline: 'timeline',
  Table: 'table',
  Summary: 'summary',
  Metrics: 'metrics',
  AFE: 'afe',
  Crew: 'crew',
  SourceData: 'sourceData',
  Settings: 'settings',
})

export type ViewType = 'timeline' | 'table' | 'summary' | 'metrics' | 'afe' | 'crew' | 'sourceData' | 'settings'
type ViewTypeKeys = 'Timeline' | 'Table' | 'Summary' | 'Metrics' | 'AFE' | 'Crew' | 'SourceData' | 'Settings'