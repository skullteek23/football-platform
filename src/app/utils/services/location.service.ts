import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ILocationCity, ILocationState } from "@ballzo-ui/core";
import { Observable } from "rxjs";
import { environment } from "@environments/environment";
import { Constants } from "@ballzo-ui/core";

@Injectable()
export class LocationService {

  constructor(
    private http: HttpClient
  ) { }

  /**
   *  Return a array of objects of states of India
   */
  getStates(): Observable<ILocationState[]> {
    return this.http
      .get<ILocationState[]>(Constants.LOCATION_API_URL.countryStateCityCommonUrl, {
        headers: new HttpHeaders({
          [Constants.LOCATION_API_URL.locationApiHeader]: environment.locationApiKey.countryStateCityApiKey,
        })
      })
  }

  /**
   *  Return a array of objects of cities in a selected State
   */
  getCities(stateIso2: any): Observable<ILocationCity[]> {
    return this.http.get<ILocationCity[]>(Constants.LOCATION_API_URL.countryStateCityCommonUrl + stateIso2 + "/cities", {
      headers: new HttpHeaders({
        [Constants.LOCATION_API_URL.locationApiHeader]: environment.locationApiKey.countryStateCityApiKey,
      })
    })
  }

}
