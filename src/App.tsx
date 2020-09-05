import React, {useEffect, useState} from 'react';
import './App.css';
import { useRxAjax } from '@reonomy/reactive-hooks';
import { ajax } from 'rxjs/ajax';
import { map } from 'rxjs/operators'
import { MapBox, Coordinate } from './MapBox'
import { locationModel } from './LocationModel';

interface Activity {
  date: number
  locations: CLLocation[]
}

interface CLLocation {
  date: number,
  latitude: number,
  longitude: number,
  speed: number
}

const fetchData = () => {
  return ajax('https://solerunner-alpha.firebaseio.com/activities.json')
    .pipe(map(res => {
      const activities = (res.response as {[k: string]: Activity})
      const dates = Object.keys(activities).reverse();

      return dates.map(date => activities[date]);
    }));
}


interface ActivityProps {
  activity: Activity
}

function Activity({activity}: ActivityProps) {
  return <div className="container">
  <div>{new Date(activity.date).toLocaleString()}</div>
  {activity.locations.map((loc, i) => 
    <div className="row" key={i}>
      <div>{new Date(loc.date).toLocaleTimeString()}</div>
      <div>{loc.speed.toFixed(1)} {'m/s'}</div>
    </div>
  )}
  </div>
}

function App() {
  const [res, req] = useRxAjax(fetchData);
  const [expandedDate, setExpandedDate] = useState<number>(-1);

  useEffect(() => {
    req({});
  }, [])

  return (
    <div className="App">
      <div className="left">
      {res && res.res?.map(activity => 
      <React.Fragment key={activity.date}>
        <div className="clickable" onClick={() => {
          setExpandedDate(activity.date)
          locationModel.location$.next(activity.locations.map(_ => [_.longitude, _.latitude]));
          }}>{new Date(activity.date).toLocaleString()}</div>
        {expandedDate === activity.date && <Activity key={activity.date} activity={activity}/>}
        </React.Fragment>
      )}
      </div>
      <div className="right"><MapBox/></div>
    </div>
  );
}

export default App;
