import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on, Action, MetaReducer, ActionReducer } from '@ngrx/store';

import * as AuthActions from './auth.actions';
import { Tokens, UserInfo, AuthEntity } from './auth.models';

export const AUTH_FEATURE_KEY = 'auth';

export interface AuthState extends EntityState<AuthEntity> {
  selectedId?: string | number; // which Auth record has been selected
  loaded: boolean; // has the Auth list been loaded
  error?: any | null; // last known error (if any)
  loading: boolean;
  user: UserInfo | null;
  tokens: Tokens | null;
  permissions: string[]
}

export interface AuthPartialState {
  readonly [AUTH_FEATURE_KEY]: AuthState;
}

export const authAdapter: EntityAdapter<AuthEntity> =
  createEntityAdapter<AuthEntity>();

export const initialAuthState: AuthState =
  authAdapter.getInitialState({
    // set initial required properties
    loaded: false,
    loading: false,
    user: null,
    tokens: null,
    permissions: [],
  });

const reducer = createReducer(
  initialAuthState,
  on(AuthActions.initAuth, (state) => ({
    ...state,
    loaded: false,
    error: null,
  })),
  on(AuthActions.loadAuthSuccess, (state, { auth }) =>
    authAdapter.setAll(auth, { ...state, loaded: true })
  ),
  on(AuthActions.loadAuthFailure, (state, { error }) => ({
    ...state,
    error,
  })),

  on(AuthActions.userLogin, (state) => ({ ...state, loading: true })),
  on(AuthActions.userLoginSuccess, (state, { response }) => ({
    ...state,
    user: {...response.user, roleLower: response.user.role.toLowerCase().replace('_', '-')},
    tokens: response.tokens,
    permissions: response.permissions,
    loading             : false,
    error: null
  })),
  on(AuthActions.userLoginFailure, (state, { error }) => ({
    ...state,
    user: null,
    tokens: null,
    permissions: [],
    error,
    loading: false,
  })),
);

export function authReducer(
  state: AuthState | undefined,
  action: Action
) {
  return reducer(state, action);
}


export function clearStateMetaReducer(reducer: ActionReducer<any>): ActionReducer<any> {
  return (state, action) => {
    if (action.type === AuthActions.logoutSuccess.type) {
      // Setting state to undefined causes each reducer to return its initial state.
      state = undefined;
    }
    return reducer(state, action);
  };
}

// Optional: Export an array of meta reducers if you have more than one.
export const metaReducers: MetaReducer<any>[] = [clearStateMetaReducer];