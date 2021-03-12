import React, { useState, useEffect } from 'react'

import './App.css';

function App() {
  const [loading, setLoading] = useState(true)
  const [searchStr, setSearchStr] = useState('')
  const [cities, setCities] = useState([])
  const [selectedCitiesObj, setSelectedCitiesObj] = useState({})
  const [selectedCitiesArr, setSelectedCitiesArr] = useState([])

  useEffect(() => {
    setLoading(true)
    const url = 'http://localhost:3030/cities?filter=' + searchStr
    fetch(url)
      .then(response => response.json())
      .then(json => {
        setCities(json.data)
        setLoading(false)
      })
       .catch(err => {console.error(` Error: ${err}`)})
  }, [searchStr])

  const handleCheck = city => {
    const geonameid = city.geonameid
    const newSelectedCitiesObj = {...selectedCitiesObj}
    let newSelectedCitiesArr
    if (selectedCitiesObj[geonameid]) {
      delete newSelectedCitiesObj[geonameid]
      // newSelectedCitiesObj[geonameid] = false
      newSelectedCitiesArr = selectedCitiesArr.filter(city => city.geonameid != geonameid)
    } else {
      newSelectedCitiesObj[geonameid] = true
      newSelectedCitiesArr = [...selectedCitiesArr, city]
    }
    setSelectedCitiesObj(newSelectedCitiesObj)
    setSelectedCitiesArr(newSelectedCitiesArr)
    const url = 'http://localhost:3030/preferences/cities'
    fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newSelectedCitiesObj)
    })
  }

  const length = selectedCitiesArr.length
  return (
    <div className="App">
      <div className="head">
        {length ?
          selectedCitiesArr.map((city, index) => {
            const {geonameid, name, subcountry} = city
            return (<span key={geonameid}>{name} ({subcountry})
            {index < length-1 ? ' * ' : null}</span>)
          })
          : <span>Select your favorite cities</span>
        }
      </div>
      <input type="text" value={searchStr} onChange={e => setSearchStr(e.target.value)} />
      {loading ?
        <p>Loading...</p>
      :
        cities ?
          cities.length ?
            <div className="cities">
              {cities.map(city => {
                const {geonameid, name, subcountry, country} = city
                return (
                  <div key={geonameid} className="citybox">
                    <input type="checkbox" checked={selectedCitiesObj[geonameid] ? true : false} onChange={() => handleCheck(city)} ></input>
                    <div className="city">{name}<br /><span className="small">{subcountry} - {country}</span></div>
                  </div>
                )
              })}
            </div>
          : <p>No cities were found</p>
        : <p>Request failed, please retry.</p>
      }
    </div>
  );
}

export default App;
