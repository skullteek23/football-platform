import { ConfirmationResult, User } from '@angular/fire/auth';
import { FirebaseError } from 'firebase/app';
import { FunctionsErrorCode } from 'firebase/functions';

// Interfaces
export type IUser = User | null;
export type IConfirmationResult = ConfirmationResult | null;

export interface IApiError extends FirebaseError { }
export type CloudFnErrorCode = FunctionsErrorCode;
export type IUserRole = { user: IUser, role: string };
/**
 * Defines the position of a player.
 * DO NOT CHANGE THE ORDER OF THE ENUM VALUES.
 * This list is also stored in the cloud functions
 */

export class UserWallet {
  amount: number = 0;
  disabled = false;
}
