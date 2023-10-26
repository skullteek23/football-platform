import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ILocationCity, ILocationState } from "@app/models/location.model";
import { Observable } from "rxjs";
import { environment } from "@environments/environment";
import { CountryStateCityUrl } from "@app/constant/api-constants";

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
        .get<ILocationState[]>(CountryStateCityUrl.commanUrl, {
            headers:new HttpHeaders({
                "X-CSCAPI-KEY": environment.locationApiKey.countryStateCityApiKey,
            })
        })
    }

    /**
     *  Return a array of objects of cities in a selected State
     */
    getCities(stateIso2: any): Observable<ILocationCity[]> {
        return this.http.get<ILocationCity[]>(CountryStateCityUrl.commanUrl + stateIso2 +"/cities", {
            headers: new HttpHeaders({
                "X-CSCAPI-KEY": environment.locationApiKey.countryStateCityApiKey,
            })
        })
    }

}