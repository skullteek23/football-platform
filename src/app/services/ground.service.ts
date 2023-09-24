import { Injectable } from '@angular/core';
import { CoreApiService } from './core-api.service';

@Injectable({
  providedIn: 'root'
})
export class GroundService {

  constructor(
    private apiService: CoreApiService
  ) { }

  getGrounds() {
    // this.
  }
}
