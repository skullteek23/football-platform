import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ILocationCity, ILocationState } from "@ballzo-ui/core/location";
import { Observable } from "rxjs";
import { environment } from "@environments/environment";
import { LOCATION_API_URL } from "@app/constant/api-constants";

@Injectable()
export class LocationService  {

    constructor(
        private http: HttpClient
    ) {}

    /**
     *  Return a array of objects of states of India
     */
    getStates(): Observable<ILocationState[]> {
        return this.http
        .get<ILocationState[]>(LOCATION_API_URL.countryStateCityCommonUrl, {
            headers:new HttpHeaders({
                [LOCATION_API_URL.locationApiHeader] : environment.locationApiKey.countryStateCityApiKey,
            })
        })
    }

    /**
     *  Return a array of objects of cities in a selected State
     */
    getCities(stateIso2: any): Observable<ILocationCity[]> {
        return this.http.get<ILocationCity[]>(LOCATION_API_URL.countryStateCityCommonUrl + stateIso2 +"/cities", {
            headers: new HttpHeaders({
                [LOCATION_API_URL.locationApiHeader] : environment.locationApiKey.countryStateCityApiKey,
            })
        })
    }

}