import { Action } from '@ngrx/store';

import * as AppSuperadminActions from './app-superadmin.actions';
import { AppSuperadminEntity } from './app-superadmin.models';
import {
  AppSuperadminState,
  initialAppSuperadminState,
  appSuperadminReducer,
} from './app-superadmin.reducer';

describe('AppSuperadmin Reducer', () => {
  const createAppSuperadminEntity = (
    id: string,
    name = ''
  ): AppSuperadminEntity => ({
    id,
    name: name || `name-${id}`,
  });

  describe('valid AppSuperadmin actions', () => {
    it('loadAppSuperadminSuccess should return the list of known AppSuperadmin', () => {
      const appSuperadmin = [
        createAppSuperadminEntity('PRODUCT-AAA'),
        createAppSuperadminEntity('PRODUCT-zzz'),
      ];
      const action = AppSuperadminActions.loadAppSuperadminSuccess({
        appSuperadmin,
      });

      const result: AppSuperadminState = appSuperadminReducer(
        initialAppSuperadminState,
        action
      );

      expect(result.loaded).toBe(true);
      expect(result.ids.length).toBe(2);
    });
  });

  describe('unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as Action;

      const result = appSuperadminReducer(initialAppSuperadminState, action);

      expect(result).toBe(initialAppSuperadminState);
    });
  });
});
