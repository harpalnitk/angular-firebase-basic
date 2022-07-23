import { Action } from "@ngrx/store";


export enum AuthActionTypes {
  SET_AUTHENTICATED = '[Auth] Set Authenticated',
  SET_UNAUTHENTICATED = '[Auth] Set Unauthenticated',
}


export class SetAuthenticated implements Action {
  readonly type = AuthActionTypes.SET_AUTHENTICATED;
  constructor(public payload: string){}
}

export class SetUnauthenticated implements Action {
  readonly type = AuthActionTypes.SET_UNAUTHENTICATED;
  constructor(public payload: string){}
}


export type AuthActions =
SetAuthenticated |
SetUnauthenticated;
