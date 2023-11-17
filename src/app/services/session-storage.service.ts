import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SessionStorageService {
  constructor() {}

  /**
   * Setter method for local storage value
   * @param {string} key
   * @param {any} value
   * @returns {void}
   */
  set(key: string, value: any): void {
    if (!key && value === undefined) {
      return;
    }
    const validValue = JSON.stringify(value);
    sessionStorage.setItem(key, validValue);
  }

  /**
   * Getter method for local storage value
   * @param key
   * @returns {any}
   */
  get(key: string): any {
    if (!key) {
      return;
    }
    const value = sessionStorage.getItem(key);
    if (value !== undefined && value !== null) {
      return JSON.parse(value);
    } else {
      return value;
    }
  }

  /**
   * Remove item from local storage
   * @param key
   * @returns
   */
  remove(key: string) {
    if (!key) {
      return;
    }
    sessionStorage.removeItem(key);
  }

  /**
   * Remove all items from local storage
   */
  clear() {
    sessionStorage.clear();
  }
}
