import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on, Action } from '@ngrx/store';

import * as AppSuperadminActions from './app-superadmin.actions';
import { AppSuperadminEntity } from './app-superadmin.models';

export const APP_SUPERADMIN_FEATURE_KEY = 'appSuperadmin';

export interface AppSuperadminState extends EntityState<AppSuperadminEntity> {
  selectedId?: string | number; // which AppSuperadmin record has been selected
  loaded: boolean; // has the AppSuperadmin list been loaded
  error?: string | null; // last known error (if any)
}

export interface AppSuperadminPartialState {
  readonly [APP_SUPERADMIN_FEATURE_KEY]: AppSuperadminState;
}

export const appSuperadminAdapter: EntityAdapter<AppSuperadminEntity> =
  createEntityAdapter<AppSuperadminEntity>();

export const initialAppSuperadminState: AppSuperadminState =
  appSuperadminAdapter.getInitialState({
    // set initial required properties
    loaded: false,
  });

const reducer = createReducer(
  initialAppSuperadminState,
  on(AppSuperadminActions.initAppSuperadmin, (state) => ({
    ...state,
    loaded: false,
    error: null,
  })),
  on(
    AppSuperadminActions.loadAppSuperadminSuccess,
    (state, { appSuperadmin }) =>
      appSuperadminAdapter.setAll(appSuperadmin, { ...state, loaded: true })
  ),
  on(AppSuperadminActions.loadAppSuperadminFailure, (state, { error }) => ({
    ...state,
    error,
  }))
);

export function appSuperadminReducer(
  state: AppSuperadminState | undefined,
  action: Action
) {
  return reducer(state, action);
}
