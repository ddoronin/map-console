import {Coordinate} from './MapBox'
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject'

export class LocationModel {
    public location$ = new BehaviorSubject<Coordinate[]| null>(null)
}

export const locationModel = new LocationModel();