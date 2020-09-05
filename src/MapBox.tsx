import React, { useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import {locationModel} from './LocationModel';
 
// @ts-ignore
mapboxgl.accessToken = 'pk.eyJ1IjoiZGRvcm9uaW4iLCJhIjoiY2p6em1iZWJ2MGN3NzNwcDczNW1oZ2k5NSJ9.UJrYnECy1aixaoHgvd_jTg';

export type Coordinate = [number, number];
export function MapBox() {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (ref.current) {
            const mbox = new mapboxgl.Map({
                container: ref.current,
                style: 'mapbox://styles/mapbox/dark-v10', // stylesheet location
                center: [-73.97423377316557, 40.75416764191794], // starting position [lng, lat]
                zoom: 14 // starting zoom
            });

            mbox.on('load', function() {

                locationModel.location$.subscribe((coordinates) => {

                    if (mbox.getLayer('route')) {
                        mbox.removeLayer('route')
                    }

                    if (mbox.getSource('route')) {
                        mbox.removeSource('route')
                    }

                        if (coordinates) {
                            mbox.addSource('route', {
                                'type': 'geojson',
                                'data': {
                                'type': 'Feature',
                                'properties': {},
                                'geometry': {
                                'type': 'LineString',
                                'coordinates': coordinates}
                                }
                            });
    
                            mbox.addLayer({
                                'id': 'route',
                                'type': 'line',
                                'source': 'route',
                                'layout': {
                                'line-join': 'round',
                                'line-cap': 'round'
                                },
                                'paint': {
                                'line-color': '#06d80e',
                                'line-width': 2
                                }
                            });
                        }
                    
                });
            });
        }
    }, []);
   
    return (
        <div ref={ref} className="mapContainer"/>
    )
}