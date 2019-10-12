import React, { Component } from 'react'
import { connect } from 'react-redux'
import memoize from 'memoize-one'
import { DragDropArea, Table } from 'react-omni-table'
import { _Number, _Array } from 'data-type-ext'
import DrillScheduleHelper from '../helpers/DrillScheduleHelper'
import { zipObject } from 'lodash'
import MultiselectDropdown from './MultiselectDropdown/MultiselectDropdown'
import { Pads, Wells, StoreState, ScheduleType } from '../types';

const quarters = {
  q1: 'Q1',
  q2: 'Q2',
  q3: 'Q3',
  q4: 'Q4'
}
const operations = {
  construction: 'Construction',
  vertDrill: 'Vert Drill',
  horzDrill: 'Horz Drill',
  frac: 'Frac',
  drillOut: 'Drill Out',
  facilities: 'Facilities',
  flowback: 'Flowback',
}
const quartersCategoriesMap = {
  q1: ['capexQ1', 'capex'],
  q2: ['capexQ2', 'capex'],
  q3: ['capexQ3', 'capex'],
  q4: ['capexQ4', 'capex'],
}
const operationsCategoriesMap = {
  construction: [
    'grossPadsConstructed',
    'netPadsConstructed',
    'padConstructionCapex',
  ],
  vertDrill: [
    'rigCount',
    'grossVertWellsDrilled',
    'netVertWellsDrilled',
    'vertDrillCapex',
  ],
  horzDrill: [
    'rigCount',
    'grossHorzWellsDrilled',
    'netHorzWellsDrilled',
    'horzDrilledLatLength',
    'horzDrillCapex',
  ],
  frac: [
    'fracInventory',
    'grossWellsFraced',
    'netWellsFraced',
    'fracedLatLength',
    'fracCapex',
  ],
  drillOut: [
    'completionsCapex',
  ],
  facilities: [
    'grossWellsCompleted',
    'netWellsCompleted',
    'completionsCapex',
  ],
  flowback: [
    'grossWellsTIL',
    'netWellsTIL',
    'grossProducingDays',
    'netProducingDays',
    'completionsCapex',
  ]
}
const categories = {
  grossPadsConstructed: 'Gross Pads Constructed',
  netPadsConstructed: 'Net Pads Constructed',
  rigCount: 'Rig Count',
  grossVertWellsDrilled: 'Gross Vert Wells Drilled',
  netVertWellsDrilled: 'Net Vert Wells Drilled',
  grossHorzWellsDrilled: 'Gross Horz Wells Drilled',
  netHorzWellsDrilled: 'Gross Horz Wells Drilled',
  horzDrilledLatLength: 'Avg Horz Drilled Lat Length',
  fracInventory: 'Jan Frac Inventory',
  grossWellsFraced: 'Gross Wells Fraced',
  netWellsFraced: 'Net Wells Fraced',
  fracedLatLength: 'Avg Fraced Lat Length',
  grossWellsCompleted: 'Gross Wells Completed',
  netWellsCompleted: 'Net Wells Completed',
  grossWellsTIL: 'Gross Wells TIL',
  netWellsTIL: 'Net Wells TIL',
  grossProducingDays: 'Gross Producing Days',
  netProducingDays: 'Net Producing Days',
  padConstructionCapex: 'Pad Construction Capex',
  vertDrillCapex: 'Vert Drill Capex',
  horzDrillCapex: 'Horz Drill Capex',
  fracCapex: 'Frac Capex',
  completionsCapex: 'Completions Capex',
  capexQ1: 'Capex Q1',
  capexQ2: 'Capex Q2',
  capexQ3: 'Capex Q3',
  capexQ4: 'Capex Q4',
  capex: 'Capex',
}

interface StateProps {
  pads: Pads
  wells: Wells
}
interface State {
  selectedQuarters: string[]
  selectedOperations: string[]
  selectedCategories: string[]
  selectedYears: number[]
}

class SummaryView extends Component<StateProps, State> {
  constructor(props) {
    super(props)

    let currentYear = new Date().getFullYear()

    this.state = {
      selectedQuarters: [...Object.keys(quarters)],
      selectedOperations: [...Object.keys(operations)],
      selectedCategories: [...Object.keys(categories)],
      selectedYears: this.years.filter(y => y >= currentYear),
    }

    this.handleQuartersChange = this.handleQuartersChange.bind(this)
    this.handleOperationsChange = this.handleOperationsChange.bind(this)
    this.handleCategoriesChange = this.handleCategoriesChange.bind(this)
  }
  drillScheduleHelper = new DrillScheduleHelper()

  handleQuartersChange(selectedQuarters: string[]) {
    let newQuarters: string[] = _Array.diff(selectedQuarters, this.state.selectedQuarters)
    let newCategories = newQuarters.reduce((cats, o) => _Array.merge(cats, quartersCategoriesMap[o]), [])

    let selectableCategories = this.getCategories(this.state.selectedOperations, selectedQuarters)
    let selectedCategories = _Array.same(selectableCategories, this.state.selectedCategories)
    selectedCategories = _Array.merge(selectedCategories, newCategories)
    this.setState({ selectedQuarters: [...selectedQuarters], selectedCategories })
  }

  handleOperationsChange(selectedOperations: string[]) {
    let newOperations: string[] = _Array.diff(selectedOperations, this.state.selectedOperations)
    let newCategories = newOperations.reduce((cats, o) => _Array.merge(cats, operationsCategoriesMap[o]),[])

    let selectableCategories = this.getCategories(selectedOperations, this.state.selectedQuarters)
    let selectedCategories = _Array.same(selectableCategories, this.state.selectedCategories)
    selectedCategories = _Array.merge(selectedCategories, newCategories)
    this.setState({ selectedOperations: [...selectedOperations], selectedCategories })
  }

  handleCategoriesChange(selectedCategories: string[]) {
    this.setState({ selectedCategories: [...selectedCategories] })
  }

  getCategories(operations: string[], quarters: string[]) {
    return operations.reduce((cats, o) => _Array.merge(cats, operationsCategoriesMap[o]),
    quarters.reduce((cats, q) => _Array.merge(cats, quartersCategoriesMap[q]), [])
    )
  }

  get years() { return this.get_years(this.props.pads) }
  get_years = memoize((pads: Pads) => this.drillScheduleHelper.getYears(pads))

  get rawData() { return this.get_rawData(this.props.pads, this.props.wells) }
  get_rawData = memoize((pads: Pads, wells: Wells) => ({
    grossPadsConstructed: this.drillScheduleHelper.getPadsConstructed(pads, 'quarter'),
    netPadsConstructed: this.drillScheduleHelper.getPadsConstructed(pads, 'quarter', true),
    rigCount: this.drillScheduleHelper.getRigCount(pads, 'quarter'),
    grossVertWellsDrilled: this.drillScheduleHelper.getVertWellsDrilled(wells, 'quarter'),
    netVertWellsDrilled: this.drillScheduleHelper.getVertWellsDrilled(wells, 'quarter', true),
    grossHorzWellsDrilled: this.drillScheduleHelper.getHorzWellsDrilled(wells, 'quarter'),
    netHorzWellsDrilled: this.drillScheduleHelper.getHorzWellsDrilled(wells, 'quarter', true),
    horzDrilledLatLength: this.drillScheduleHelper.getAvgHorzDrilledLatLength(wells, 'quarter'),
    fracInventory: this.drillScheduleHelper.getJanuaryFracInventory(wells),
    grossWellsFraced: this.drillScheduleHelper.getWellsFraced(wells, 'quarter'),
    netWellsFraced: this.drillScheduleHelper.getWellsFraced(wells, 'quarter', true),
    fracedLatLength: this.drillScheduleHelper.getAvgFracedLatLength(wells, 'quarter'),
    grossWellsCompleted: this.drillScheduleHelper.getWellsCompleted(wells, 'quarter'),
    netWellsCompleted: this.drillScheduleHelper.getWellsCompleted(wells, 'quarter', true),
    grossWellsTIL: this.drillScheduleHelper.getWellsTIL(wells, 'quarter'),
    netWellsTIL: this.drillScheduleHelper.getWellsTIL(wells, 'quarter', true),
    grossProducingDays: this.drillScheduleHelper.getProducingDays(wells, 'quarter'),
    netProducingDays: this.drillScheduleHelper.getProducingDays(wells, 'quarter', true),
    padConstructionCapex: this.drillScheduleHelper.getScheduleCost(pads, ScheduleType.Construction, 'quarter'),
    vertDrillCapex: this.drillScheduleHelper.getVertDrillCost(wells, 'quarter'),
    horzDrillCapex: this.drillScheduleHelper.getHorzDrillCost(wells, 'quarter'),
    fracCapex: this.drillScheduleHelper.getScheduleCost(pads, ScheduleType.Frac, 'quarter'),
    completionsCapex: this.drillScheduleHelper.getCompletionCost(pads, 'quarter'),
    capex: this.drillScheduleHelper.getCost(pads, wells, 'quarter'),
  }))

  sumQuarters(object, includedYears: number[], includedQuarters: string[], formatFunc: Function, decimals = 0) {
    let years = {}
    for (let [year, qtrs] of Object.entries(object)) {
      if (!includedYears.includes(+year))
        continue
      years[year] = formatFunc(
          (includedQuarters.includes('q1') ? qtrs['1'] || 0 : 0)
        + (includedQuarters.includes('q2') ? qtrs['2'] || 0 : 0)
        + (includedQuarters.includes('q3') ? qtrs['3'] || 0 : 0)
        + (includedQuarters.includes('q4') ? qtrs['4'] || 0 : 0)
        , decimals)
    }
    return years
  }

  filterYears(object, includedYears: number[]) {
    let newObj = {...object}
    for (let year of Object.keys(newObj)) {
      if (!includedYears.includes(+year))
        delete newObj[year]
    }
    return newObj
  }

  get newData() { return this.get_newData(this.rawData, this.state.selectedYears, this.state.selectedQuarters, ) }
  get_newData = memoize((rawData, years: number[], quarters: string[]) => [
    { id: 'grossPadsConstructed',  category: 'Gross Pads Constructed',      ...this.sumQuarters(rawData.grossPadsConstructed, years, quarters, _Number.toFixed) },
    { id: 'netPadsConstructed',    category: 'Net Pads Constructed',        ...this.sumQuarters(rawData.netPadsConstructed, years, quarters, _Number.toFixed) },
    { id: 'rigCount',              category: 'Rig Count',                   ...this.sumQuarters(rawData.rigCount, years, quarters, _Number.toFixed, 2) },
    { id: 'grossVertWellsDrilled', category: 'Gross Vert Wells Drilled',    ...this.sumQuarters(rawData.grossVertWellsDrilled, years, quarters, _Number.toFixed) },
    { id: 'netVertWellsDrilled',   category: 'Net Vert Wells Drilled',      ...this.sumQuarters(rawData.netVertWellsDrilled, years, quarters, _Number.toFixed) },
    { id: 'grossHorzWellsDrilled', category: 'Gross Horz Wells Drilled',    ...this.sumQuarters(rawData.grossHorzWellsDrilled, years, quarters, _Number.toFixed) },
    { id: 'netHorzWellsDrilled',   category: 'Net Horz Wells Drilled',      ...this.sumQuarters(rawData.netHorzWellsDrilled, years, quarters, _Number.toFixed) },
    { id: 'horzDrilledLatLength',  category: 'Avg Horz Drilled Lat Length', ...this.sumQuarters(rawData.horzDrilledLatLength, years, quarters, _Number.toFixed) },
    { id: 'fracInventory',         category: 'Jan Frac Inventory',          ...this.filterYears(rawData.fracInventory, years) },
    { id: 'grossWellsFraced',      category: 'Gross Wells Fraced',          ...this.sumQuarters(rawData.grossWellsFraced, years, quarters, _Number.toFixed) },
    { id: 'netWellsFraced',        category: 'Net Wells Fraced',            ...this.sumQuarters(rawData.netWellsFraced, years, quarters, _Number.toFixed) },
    { id: 'fracedLatLength',       category: 'Avg Fraced Lat Length',       ...this.sumQuarters(rawData.fracedLatLength, years, quarters, _Number.toFixed) },
    { id: 'grossWellsCompleted',   category: 'Gross Wells Completed',       ...this.sumQuarters(rawData.grossWellsCompleted, years, quarters, _Number.toFixed) },
    { id: 'netWellsCompleted',     category: 'Net Wells Completed',         ...this.sumQuarters(rawData.netWellsCompleted, years, quarters, _Number.toFixed) },
    { id: 'grossWellsTIL',         category: 'Gross Wells TIL',             ...this.sumQuarters(rawData.grossWellsTIL, years, quarters, _Number.toFixed) },
    { id: 'netWellsTIL',           category: 'Net Wells TIL',               ...this.sumQuarters(rawData.netWellsTIL, years, quarters, _Number.toFixed) },
    { id: 'grossProducingDays',    category: 'Gross Producing Days',        ...this.sumQuarters(rawData.grossProducingDays, years, quarters, _Number.toFixed) },
    { id: 'netProducingDays',      category: 'Net Producing Days',          ...this.sumQuarters(rawData.netProducingDays, years, quarters, _Number.toFixed) },
    { id: 'padConstructionCapex',  category: 'Pad Construction Capex',      ...this.sumQuarters(rawData.padConstructionCapex, years, quarters, _Number.toCurrency) },
    { id: 'vertDrillCapex',        category: 'Vert Drill Capex',            ...this.sumQuarters(rawData.vertDrillCapex, years, quarters, _Number.toCurrency) },
    { id: 'horzDrillCapex',        category: 'Horz Drill Capex',            ...this.sumQuarters(rawData.horzDrillCapex, years, quarters, _Number.toCurrency) },
    { id: 'fracCapex',             category: 'Frac Capex',                  ...this.sumQuarters(rawData.fracCapex, years, quarters, _Number.toCurrency) },
    { id: 'completionsCapex',      category: 'Completions Capex',           ...this.sumQuarters(rawData.completionsCapex, years, quarters, _Number.toCurrency) },
    quarters.includes('q1') ? { id: 'capexQ1', category: 'Capex Q1',        ...this.sumQuarters(rawData.capex, years, ['q1'], _Number.toCurrency) } : undefined,
    quarters.includes('q2') ? { id: 'capexQ2', category: 'Capex Q2',        ...this.sumQuarters(rawData.capex, years, ['q2'], _Number.toCurrency) } : undefined,
    quarters.includes('q3') ? { id: 'capexQ3', category: 'Capex Q3',        ...this.sumQuarters(rawData.capex, years, ['q3'], _Number.toCurrency) } : undefined,
    quarters.includes('q4') ? { id: 'capexQ4', category: 'Capex Q4',        ...this.sumQuarters(rawData.capex, years, ['q4'], _Number.toCurrency) } : undefined,
    { id: 'capex',                 category: 'Capex',                       ...this.sumQuarters(rawData.capex, years, quarters, _Number.toCurrency) },
  ].filter(Boolean))

  render() {
    const years = this.state.selectedYears// this.getYears().filter(y => this.state.selectedYears.includes(y))
    const columns = [
      {
        name: 'Category',
        dataIndex: 'category',
        dataType: 'string',
        style: { width: '15rem'}
      },
      ...years.map(y => ({
        name: String(y),
        dataIndex: String(y),
        dataType: 'number',
        style: { width: '10rem', align: 'right' },
      }))
    ]
    let data = this.newData.filter(row => this.state.selectedCategories.includes(row.id))

    const settings = {
      dragEnabled: false,
      tierColors: [
        { color: 'black', backgroundColor: 'white' }  
      ]
    }

    let selectableCategories = this.getCategories(this.state.selectedOperations, this.state.selectedQuarters)

    return (
      <div style={{ display:'flex', flexDirection:'column', height:'100%', maxHeight:'100%' }}>
        <div style={{ display: 'flex', flex: '0 0 auto', marginBottom: '.5rem' }}>
          <MultiselectDropdown title='Quarters' onSelectionChange={this.handleQuartersChange}>
            {Object.entries(quarters).map(([id, q]) =>
              <MultiselectDropdown.Item key={id} id={id} selected={this.state.selectedQuarters.includes(id)}>{q}</MultiselectDropdown.Item>
            )}
          </MultiselectDropdown>
          <MultiselectDropdown title='Operations' onSelectionChange={this.handleOperationsChange}>
            {Object.entries(operations).map(([id, o]) =>
              <MultiselectDropdown.Item key={id} id={id} selected={this.state.selectedOperations.includes(id)}>{o}</MultiselectDropdown.Item>
            )}
          </MultiselectDropdown>
          <MultiselectDropdown title='Categories' onSelectionChange={this.handleCategoriesChange}>
            {Object.entries(categories).map(([id, c]) =>
              <MultiselectDropdown.Item key={id} id={id} selected={this.state.selectedCategories.includes(id)} hidden={!selectableCategories.includes(id)}>{c}</MultiselectDropdown.Item>
            ).filter(Boolean)}
          </MultiselectDropdown>
        </div>
        <div style={{height: 'calc(100% - 48px', display: 'flex'}}>
          <DragDropArea>
            <Table tableId='summary' columns={columns} data={data} rowHeight={26} settings={settings}/>
          </DragDropArea>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state: StoreState) => ({
  pads: state.pads,
  wells: state.wells
})

export default connect<StateProps>(mapStateToProps)(SummaryView)
