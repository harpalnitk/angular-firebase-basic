import { ActionReducerMap, createFeatureSelector
    ,createSelector } from '@ngrx/store';
    import * as fromAuth from './pages/auth/store/auth.reducer';
    
    export interface State {
    
      auth: fromAuth.State;
    }
    
    export const reducers: ActionReducerMap<State> = {
      auth: fromAuth.authReducer
    };
    
    //UI VARIABLES
    
    //AUTH VARIABLES
    export const getAuthState = createFeatureSelector<fromAuth.State>('auth');
    export const getIsAuth =  createSelector(getAuthState, fromAuth.getIsAuth);
    export const getUserId =  createSelector(getAuthState, fromAuth.getUserId);
    
    