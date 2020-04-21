import React, {useState, useContext} from 'react'
import {FileText, Map, BarChart2} from 'react-feather'

import theme from '../../../styles/theme'
import colors from '../../../styles/colors'

import {AppContext, ThemeContext} from '../../../pages'

import Scrollable from '../../scrollable'
import ReactMapGl from '../../react-map-gl'
import Drom from '../../react-map-gl/drom'
import MapSelector from '../../map-selector'

import CovidTestsMaps from './covid-tests-maps'

import CovidTestsInformations from './covid-tests-informations'
import CovidTestsStatistics from './covid-tests-statistics'
import CovidTestsMobileMap from './covid-tests-mobile-map'

export const CovidTestsContext = React.createContext()

const VIEWS = {
  map: <CovidTestsMobileMap />,
  stats: (
    <Scrollable>
      <CovidTestsStatistics />
    </Scrollable>
  ),
  informations: (
    <Scrollable>
      <CovidTestsInformations />
    </Scrollable>
  )
}

const MobileCovidTests = () => {
  const [selectedView, setSelectedView] = useState('stats')

  const app = useContext(AppContext)
  const theme = useContext(ThemeContext)

  const handleClick = view => {
    app.setSelectedLocation(null)
    setSelectedView(view)
  }

  return (
    <>
      <Scrollable>
        {VIEWS[selectedView]}
      </Scrollable>

      <div className='view-selector'>
        <div className={`${selectedView === 'stats' ? 'selected' : ''}`} onClick={() => handleClick('stats')}>
          <BarChart2 size={32} color={selectedView === 'stats' ? theme.primary : colors.black} />
        </div>
        <div className={`${selectedView === 'map' ? 'selected' : ''}`} onClick={() => handleClick('map')}>
          <Map size={32} color={selectedView === 'map' ? theme.primary : colors.black} />
        </div>
        <div className={`${selectedView === 'informations' ? 'selected' : ''}`} onClick={() => handleClick('informations')}>
          <FileText size={32} color={selectedView === 'informations' ? theme.primary : colors.black} />
        </div>
      </div>

      <style jsx>{`
        .view-selector {
          z-index: 1;
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          justify-content: center;
          align-items: center;
          background-color: #fff;
          box-shadow: 0 -1px 4px ${colors.lightGrey};
        }

        .view-selector > div {
          padding: 0.5em;
          margin: auto;
          margin-bottom: -4px;
        }

        .view-selector > div.selected {
          border-top: 4px solid ${theme.primary};
        }
      `}</style>
    </>
  )
}

const DesktopCovidTests = () => {
  const {selectedLocation} = useContext(AppContext)
  const {selectedMapIdx, setSelectedMapIdx} = useContext(CovidTestsContext)

  const {layers} = CovidTestsMaps[selectedMapIdx]

  return (
    <>
      <div className='menu'>
        <Scrollable>
          <>
            <CovidTestsStatistics />
            <CovidTestsInformations />
          </>
        </Scrollable>
      </div>

      <div className='map'>
        <div className='metropole'>
          <div className='map-selector'>
            <MapSelector mapIdx={selectedMapIdx} maps={CovidTestsMaps} selectMap={setSelectedMapIdx} />
          </div>
          <ReactMapGl code={selectedLocation || 'FR'} layers={layers} />
        </div>
        <div className='drom-container'>
          <Drom layers={layers} />
        </div>
      </div>

      <style jsx>{`
        .menu {
          z-index: 1;
          display: flex;
          flex-direction: column;
          max-width: ${theme.menuWidth};
          box-shadow: 0 1px 4px ${colors.lightGrey};
        }

        .map {
          display: flex;
          flex: 1;
          flex-direction: column;
          height: 100%;
        }

        .metropole {
          flex: 1;
        }

        .drom-container {
          display: flex;
          padding: 0.5em;
          height: 25%;
        }

        .map-selector {
          z-index: 3;
          position: absolute;
          background-color: #000000aa;
          color: #fff;
          border-radius: 4px;
          margin: 0.5em;
        }

        @media (max-width: 1000px) {
          .drom-container {
            height: 40%;
          }
        }

        @media (max-width: 800px) {
          .drom-container {
            height: 50%;
          }
        }
      `}</style>
    </>
  )
}

const CovidTests = props => {
  const {isMobileDevice} = useContext(AppContext)

  const [selectedMapIdx, setSelectedMapIdx] = useState(1)

  const Component = isMobileDevice ? MobileCovidTests : DesktopCovidTests

  return (
    <CovidTestsContext.Provider value={{selectedMapIdx, setSelectedMapIdx}}>
      <Component {...props} />
    </CovidTestsContext.Provider>
  )
}

export default CovidTests
