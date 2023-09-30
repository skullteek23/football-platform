import { Injectable } from '@angular/core';
import { CoreApiService } from './core-api.service';
import { Player } from '@app/models/user.model';
import { convertFirestoreDataArray } from '@app/utils/objects-utility';
import { map, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private apiService: CoreApiService
  ) { }

  /**
   * Adds the user details in firestore
   * @param data
   * @param uid
   * @returns
   */
  addUserDetails(data: Player, uid: string) {
    return this.apiService.addDocument('players', data, uid);
  }

  /**
   * Returns the list of users
   * @returns
   */
  getUsers() {
    return this.apiService.getCollectionWithIds('players')
      .pipe(
        map(response => convertFirestoreDataArray(response, Player)),
      );
  }

}
