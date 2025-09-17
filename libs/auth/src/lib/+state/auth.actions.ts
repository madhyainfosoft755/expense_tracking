import { createAction, props } from '@ngrx/store';
import { AuthEntity, userLoginPayload, userLoginResponse } from './auth.models';

export const initAuth = createAction('[Auth Page] Init');

export const loadAuthSuccess = createAction(
  '[Auth/API] Load Auth Success',
  props<{ auth: AuthEntity[] }>()
);

export const loadAuthFailure = createAction(
  '[Auth/API] Load Auth Failure',
  props<{ error: any }>()
);

export const setLoading = createAction(
  '[Auth] Set loading',
  props<{ loading: boolean }>()
)

export const setAccessToken = createAction(
  '[Auth] Set Access Token',
  props<{ access: string }>()
)

export const setRefreshToken = createAction(
  '[Auth] Set Refresh Token',
  props<{ refresh: string }>()
)

export const logoutSuccess = createAction('[Auth] Logout Success');

export const userLogin = createAction('[Auth] userLogin',props<{userLoginPayload: userLoginPayload}>());

export const userLoginSuccess = createAction('[Auth] userLogin Success',props<{response: userLoginResponse}>());

export const userLoginFailure = createAction('[Auth] userLogin Failure',props<{error:any }>());
