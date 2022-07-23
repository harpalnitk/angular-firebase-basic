import * as AuthActions from './auth.actions';


export interface State {
isAuthenticated: boolean;
userId: string;

}

const initialState: State = {
  isAuthenticated: false,
  userId: null
}

export function authReducer(state= initialState, action: AuthActions.AuthActions){
switch (action.type){
  case AuthActions.AuthActionTypes.SET_AUTHENTICATED:
  return {
    userId: action.payload, isAuthenticated: true
  };
  case AuthActions.AuthActionTypes.SET_UNAUTHENTICATED:
  return {
    userId: action.payload, isAuthenticated: false
  }
  default:
    return state;

}
}

export const getIsAuth =  (state: State) => state.isAuthenticated;
export const getUserId =  (state: State) => state.userId;