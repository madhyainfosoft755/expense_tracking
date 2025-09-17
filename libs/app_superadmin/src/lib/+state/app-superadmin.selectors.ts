import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  APP_SUPERADMIN_FEATURE_KEY,
  AppSuperadminState,
  appSuperadminAdapter,
} from './app-superadmin.reducer';

// Lookup the 'AppSuperadmin' feature state managed by NgRx
export const selectAppSuperadminState =
  createFeatureSelector<AppSuperadminState>(APP_SUPERADMIN_FEATURE_KEY);

const { selectAll, selectEntities } = appSuperadminAdapter.getSelectors();

export const selectAppSuperadminLoaded = createSelector(
  selectAppSuperadminState,
  (state: AppSuperadminState) => state.loaded
);

export const selectAppSuperadminError = createSelector(
  selectAppSuperadminState,
  (state: AppSuperadminState) => state.error
);

export const selectAllAppSuperadmin = createSelector(
  selectAppSuperadminState,
  (state: AppSuperadminState) => selectAll(state)
);

export const selectAppSuperadminEntities = createSelector(
  selectAppSuperadminState,
  (state: AppSuperadminState) => selectEntities(state)
);

export const selectSelectedId = createSelector(
  selectAppSuperadminState,
  (state: AppSuperadminState) => state.selectedId
);

export const selectEntity = createSelector(
  selectAppSuperadminEntities,
  selectSelectedId,
  (entities, selectedId) => (selectedId ? entities[selectedId] : undefined)
);
