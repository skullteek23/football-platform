import { Injectable } from '@angular/core';
import { CoreApiService } from './core-api.service';
import { Player, PlayerStats } from '@app/models/user.model';
import { convertFirestoreData, convertFirestoreDataArray } from '@app/utils/objects-utility';
import { Observable, map, tap } from 'rxjs';

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
  getUsers(): Observable<Player[]> {
    return this.apiService.getCollectionWithIds('players')
      .pipe(
        map(response => convertFirestoreDataArray(response, Player)),
      );
  }

  /**
   * Returns the user details by uid
   * @param uid
   * @returns
   */
  getUser(uid: string): Observable<Player> {
    return this.apiService.getDocument('players', uid)
      .pipe(
        map(response => convertFirestoreData(response, Player))
      )
  }

  /**
   * Gets the user stats
   * @param uid
   * @returns
   */
  getUserStats(uid: string): Observable<PlayerStats> {
    return this.apiService.getDocument('user-stats', uid)
      .pipe(
        map(response => convertFirestoreData(response, PlayerStats))
      )
  }
}