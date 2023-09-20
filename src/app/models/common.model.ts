import { ConfirmationResult, User } from '@angular/fire/auth';
import { FirebaseError } from 'firebase/app';

// Classes
export class IListOption {
  viewValue: string = 'Label';
  value: any = null;
}

// Interfaces
export type IUser = User | null;
export type IConfirmationResult = ConfirmationResult | null;
export interface IUserProperties {
  displayName?: string | null;
  photoURL?: string | null;
}
export interface IAuthError extends FirebaseError {}
