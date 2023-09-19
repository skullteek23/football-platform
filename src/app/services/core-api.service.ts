import { Injectable } from '@angular/core';
import { Functions, httpsCallable } from '@angular/fire/functions';
@Injectable({
  providedIn: 'root',
})
export class CoreApiService {
  constructor(private cloudFn: Functions) {}

  /**
   * Calls cloud function on the firebase backend
   * @param functionName
   * @param data
   * @returns
   */
  callCloudFn(functionName: string, data: any = {}): Promise<any> {
    if (data !== null && data !== undefined) {
      const callable = httpsCallable(this.cloudFn, functionName);
      return callable(data);
    }
    return Promise.reject('Data is null or undefined');
  }
}
