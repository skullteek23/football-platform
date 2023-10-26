import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ILocationCity, ILocationState } from "@app/models/locationState.model";
import { Observable } from "rxjs";

@Injectable()
export class LocationService  {

    constructor(private http: HttpClient) {}

    /**
     *  Return a array of objects of states of India
     */
    getStates(): Observable<ILocationState[]> {
        return this.http
        .get<ILocationState[]>("https://api.countrystatecity.in/v1/countries/IN/states", {
            headers:new HttpHeaders({
                "X-CSCAPI-KEY": 'Rjc1ZmpjdGhCbWRrV2JnMHdnUGptaklVZjNhVWFpMlpnRUJFV1VpbQ=='
            })
        })
    }


    /**
     *  Return a array of objects of cities in a selected State
     */
    getCities(stateIso2: any): Observable<ILocationCity[]> {
        return this.http.get<ILocationCity[]>("https://api.countrystatecity.in/v1/countries/IN/states/"+ stateIso2 +"/cities", {
            headers: new HttpHeaders({
                "X-CSCAPI-KEY": 'Rjc1ZmpjdGhCbWRrV2JnMHdnUGptaklVZjNhVWFpMlpnRUJFV1VpbQ=='
            })
        })
    }


}