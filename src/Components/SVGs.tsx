import React from 'react'
import theme from '../theme.json'

export const MetricsSVG = () =>
  <svg viewBox="0 0 150 130">  
    <path className="highlightable-fill" fill={theme.secondary} d="M6,9 h130 a6,6 0 0 1 0,12 h-130 a6,6 0 0 1 0,-12"/>
    <path className="highlightable-fill" fill={theme.secondary} d="M6,59 h130 a6,6 0 0 1 0,12 h-130 a6,6 0 0 1 0,-12"/>
    <path className="highlightable-fill" fill={theme.secondary} d="M6,109 h130 a6,6 0 0 1 0,12 h-130 a6,6 0 0 1 0,-12"/>
    <rect className="highlightable-fill" fill={theme.secondary} x="90" y="0" rx="5" ry="5" width="30" height="30"/>
    <rect className="highlightable-fill" fill={theme.secondary} x="25" y="50" rx="5" ry="5" width="30" height="30"/>
    <rect className="highlightable-fill" fill={theme.secondary} x="70" y="100" rx="5" ry="5" width="30" height="30"/>
  </svg>

export const SingleScreenSVG = props =>
  <svg width={props.width} height={props.height} viewBox="0 0 100 100">
    <rect className="highlightable-fill" x="0" y="0" width="100" height="100" rx="10" ry="10" fill={theme.secondary}/>
    <path d="M10 20 v65 a5,5 0 0 0 5,5 h70 a5,5 0 0 0 5,-5 v-65" fill={theme.primary}/>
  </svg>

export const SplitScreenVertSVG = props =>
  <svg width={props.width} height={props.height} viewBox="0 0 100 100">
    <rect className="highlightable-fill" x="0" y="0" width="100" height="100" rx="10" ry="10" fill={theme.secondary}/>
    <path d="M10 20 v65 a5,5 0 0 0 5,5 h30 v-70" fill={theme.primary}/>
    <path d="M90 20 v65 a5,5 0 0 1 -5,5 h-30 v-70" fill={theme.primary}/>
  </svg>

export const SplitScreenHorzSVG = props =>
  <svg width={props.width} height={props.height} viewBox="0 0 100 100">
    <rect className="highlightable-fill" x="0" y="0" width="100" height="100" rx="10" ry="10" fill={theme.secondary}/>
    <path d="M10 20 v30 h80 v-30 h-80" fill={theme.primary}/>
    <path d="M10 60 v25 a5,5 0 0 0 5,5 h70 a5,5 0 0 0 5,-5 v-25" fill={theme.primary}/>
  </svg>

export const SummarySVG = () =>
  <div>
    <svg viewBox="0 0 400 360" xmlns="http://www.w3.org/2000/svg">
      <rect className="highlightable-fill" x="0" y="200" width="100" height="200" rx="20" ry="20" fill={theme.secondary}/>
      <rect className="highlightable-fill" x="130" y="0" width="100" height="400" rx="20" ry="20" fill={theme.secondary}/>
      <rect className="highlightable-fill" x="260" y="120" width="100" height="280" rx="20" ry="20" fill={theme.secondary}/>
    </svg>
  </div>

export const TableSVG = () =>
  <div>
    <svg viewBox="0 0 300 260" xmlns="http://www.w3.org/2000/svg">
      <rect className="highlightable-fill" width="300" height="260" rx="20" ry="20" fill={theme.secondary}/>
      <rect x="20" y="200" width="80" height="40" fill={theme.primary}/>
      <rect x="110" y="200" width="80" height="40" fill={theme.primary}/>
      <rect x="200" y="200" width="80" height="40" fill={theme.primary}/>
      <rect x="20" y="150" width="80" height="40" fill={theme.primary}/>
      <rect x="110" y="150" width="80" height="40" fill={theme.primary}/>
      <rect x="200" y="150" width="80" height="40" fill={theme.primary}/>
      <rect x="20" y="100" width="80" height="40" fill={theme.primary}/>
      <rect x="110" y="100" width="80" height="40" fill={theme.primary}/>
      <rect x="200" y="100" width="80" height="40" fill={theme.primary}/>
      <rect x="20" y="50" width="80" height="40" fill={theme.primary}/>
      <rect x="110" y="50" width="80" height="40" fill={theme.primary}/>
      <rect x="200" y="50" width="80" height="40" fill={theme.primary}/>
    </svg>
  </div>

export const TimelineSVG = () =>
  <div>
    <svg viewBox="0 0 180 180" xmlns="http://www.w3.org/2000/svg">
      <path className="highlightable-fill" fill={theme.secondary} d= "M10,10 v160 a10,10 0 0 0 10,10 h160 a5,5 0 0 0 0,-10 h-158 a2,2 0 0 1 -2,-2 v-158 a5,5 0 0 0 -10,0 M50,25 h30 a9,9 0 0 1 0,18 h-30 a9,9 0 0 1 0,-18 M40,60 h100 a9,9 0 0 1 0,18 h-100 a9,9 0 0 1 0,-18 M80,95 h80 a9,9 0 0 1 0,18 h-80 a9,9 0 0 1 0,-18 M60,130 h60 a9,9 0 0 1 0,18 h-60 a9,9 0 0 1 0,-18"/>
    </svg>
  </div>

export const LateralsSVG = () =>
  <div>
    <svg viewBox="0 0 110 200" xmlns="http://www.w3.org/2000/svg">
       {/*border*/}
      <line className="highlightable-stroke" x1="30" y1="10" x2="80" y2="10" stroke={theme.secondary} strokeWidth="10" strokeLinecap="round"/>
      <line className="highlightable-stroke" x1="10" y1="190" x2="100" y2="190" stroke={theme.secondary} strokeWidth="10" strokeLinecap="round"/>
      <line className="highlightable-stroke" x1="30" y1="10" x2="10" y2="190" stroke={theme.secondary} strokeWidth="10" strokeLinecap="round"/>
      <line className="highlightable-stroke" x1="80" y1="10" x2="100" y2="190" stroke={theme.secondary} strokeWidth="10" strokeLinecap="round"/>
       {/*cross*/}
      <line className="highlightable-stroke" x1="30" y1="10" x2="85" y2="70" stroke={theme.secondary} strokeWidth="10" strokeLinecap="round"/>
      <line className="highlightable-stroke" x1="80" y1="10" x2="25" y2="70" stroke={theme.secondary} strokeWidth="10" strokeLinecap="round"/>
      <line className="highlightable-stroke" x1="25" y1="70" x2="90" y2="130" stroke={theme.secondary} strokeWidth="10" strokeLinecap="round"/>
      <line className="highlightable-stroke" x1="85" y1="70" x2="20" y2="130" stroke={theme.secondary} strokeWidth="10" strokeLinecap="round"/>
      <line className="highlightable-stroke" x1="20" y1="130" x2="100" y2="190" stroke={theme.secondary} strokeWidth="10" strokeLinecap="round"/>
      <line className="highlightable-stroke" x1="90" y1="130" x2="10" y2="190" stroke={theme.secondary} strokeWidth="10" strokeLinecap="round"/>
      {/*horizontal*/}
      <line className="highlightable-stroke" x1="25" y1="70" x2="85" y2="70" stroke={theme.secondary} strokeWidth="10" strokeLinecap="round"/>
      <line className="highlightable-stroke" x1="20" y1="130" x2="90" y2="130" stroke={theme.secondary} strokeWidth="10" strokeLinecap="round"/>
    </svg>
  </div>

export const AfeSVG = () =>
  <div>
    <svg viewBox="0 0 500 560" xmlns="http://www.w3.org/2000/svg">
      <path className="highlightable-stroke" d="m 145,430 c -7,-6 26,25 99,27 78, 1 113,-34 109,-101 -6,-58 -62,-73 -106,-79 -48,-17 -99,-25 -99,-95 0,-48 32,-79 99,-78 60,0 97,25 85,18" 
            fill="none" stroke={theme.secondary} strokeWidth="60" strokeLinecap="round"
      />
      <line className="highlightable-stroke" x1="245" y1="50" x2="245" y2="70" strokeWidth="80" strokeLinecap="round" stroke={theme.secondary} />
      <line className="highlightable-stroke" x1="245" y1="510" x2="245" y2="490" strokeWidth="80" strokeLinecap="round" stroke={theme.secondary} />
    </svg> 
  </div>

export const CrewSVG = () =>
  <svg viewBox="0 0 240 240">
    <rect className="highlightable-fill" x="30" y="190" width="180" height="30" fill={theme.secondary}/>
    <path className="highlightable-fill" d="M 30 190 A 90 70 0 0 1 210 190" fill={theme.secondary}/>
    <line x1="70" y1="120" x2="70" y2="220" stroke={theme.primary} strokeWidth="12" strokeLinecap="butt"/>
    <line x1="170" y1="120" x2="170" y2="220" stroke={theme.primary} strokeWidth="12" strokeLinecap="butt"/>
    <ellipse cx="120" cy="125" rx="40" ry="20" fill={theme.primary}/>
    <circle className="highlightable-fill" cx="120" cy="70" r="50" fill={theme.secondary} />
    <line className="highlightable-stroke" x1="65" y1="60" x2="175" y2="60" stroke={theme.secondary} strokeWidth="10" strokeLinecap="round"/>
    <line x1="95" y1="20" x2="95" y2="55" stroke={theme.primary} strokeWidth="10" strokeLinecap="butt"/>
    <line x1="120" y1="20" x2="120" y2="55" stroke={theme.primary} strokeWidth="10" strokeLinecap="butt"/>
    <line x1="145" y1="20" x2="145" y2="55" stroke={theme.primary} strokeWidth="10" strokeLinecap="butt"/>
    <line x1="65" y1="69" x2="175" y2="69" stroke={theme.primary} strokeWidth="8" strokeLinecap="round"/>
  </svg>

export const DatabaseSVG = () =>
  <svg viewBox="0 0 200 200">
    <path className="highlightable-stroke" d="M 20 40 a 80 20 0 0 1 160 0 l 0 120 a 80 20 0 0 1 -160 0 l 0 -120 a 80 20 0 0 0 160 0 m -160 40 a 80 20 0 0 0 160 0 m -160 40 a 80 20 0 0 0 160 0"
          fill="none" stroke={theme.secondary} strokeWidth="14"
    />
    <circle cx="170" cy="120" r="27" fill={theme.primary}/>
    <line x1="117.8" y1="175.8" x2="152.8" y2="140.8" strokeWidth="30" stroke={theme.primary} strokeLinecap="round"/>
    <path className="highlightable-stroke" d="M 178 102 l -10 10 l 2 8 l 8 2 l 10 -10 a 20 20 0 0 1 -24 27 l -40 40 a 5 5 0 0 1 -10 -10 l 40 -40 a 20 20 0 0 1 24 -27 z"
          fill="none" stroke={theme.secondary} strokeWidth="7"/>
  </svg>

export const SettingsSVG = () =>
  <svg viewBox="0 0 200 200">
    <g fill={theme.secondary} className="highlightable-fill">
      <rect x="80" y="10" width="40" height="180" rx="10"/>
      <rect x="80" y="10" width="40" height="180" rx="10" transform="rotate(45 100 100)"/>
      <rect x="80" y="10" width="40" height="180" rx="10" transform="rotate(90 100 100)"/>
      <rect x="80" y="10" width="40" height="180" rx="10" transform="rotate(135 100 100)"/>
      <circle cx="100" cy="100" r="70"/>
      <circle cx="100" cy="100" r="35" fill={theme.primary} />
    </g>
  </svg>

export const UpSVG = ({color = theme.secondary}: { color?: string}) =>
  <svg width="10" height="8" viewBox="0 0 200 141">
    <path d="M100 0 L0 141 L200 141" fill={color}/>
  </svg>
  
export const DownSVG = ({color = theme.secondary}: { color?: string}) =>
  <svg width="10" height="8" viewBox="0 0 200 141">
    <path d="M0 0 L200 0 L 100 141" fill={color}/>
  </svg>