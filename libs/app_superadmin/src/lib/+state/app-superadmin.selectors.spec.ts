import { AppSuperadminEntity } from './app-superadmin.models';
import {
  appSuperadminAdapter,
  AppSuperadminPartialState,
  initialAppSuperadminState,
} from './app-superadmin.reducer';
import * as AppSuperadminSelectors from './app-superadmin.selectors';

describe('AppSuperadmin Selectors', () => {
  const ERROR_MSG = 'No Error Available';
  const getAppSuperadminId = (it: AppSuperadminEntity) => it.id;
  const createAppSuperadminEntity = (id: string, name = '') =>
    ({
      id,
      name: name || `name-${id}`,
    } as AppSuperadminEntity);

  let state: AppSuperadminPartialState;

  beforeEach(() => {
    state = {
      appSuperadmin: appSuperadminAdapter.setAll(
        [
          createAppSuperadminEntity('PRODUCT-AAA'),
          createAppSuperadminEntity('PRODUCT-BBB'),
          createAppSuperadminEntity('PRODUCT-CCC'),
        ],
        {
          ...initialAppSuperadminState,
          selectedId: 'PRODUCT-BBB',
          error: ERROR_MSG,
          loaded: true,
        }
      ),
    };
  });

  describe('AppSuperadmin Selectors', () => {
    it('selectAllAppSuperadmin() should return the list of AppSuperadmin', () => {
      const results = AppSuperadminSelectors.selectAllAppSuperadmin(state);
      const selId = getAppSuperadminId(results[1]);

      expect(results.length).toBe(3);
      expect(selId).toBe('PRODUCT-BBB');
    });

    it('selectEntity() should return the selected Entity', () => {
      const result = AppSuperadminSelectors.selectEntity(
        state
      ) as AppSuperadminEntity;
      const selId = getAppSuperadminId(result);

      expect(selId).toBe('PRODUCT-BBB');
    });

    it('selectAppSuperadminLoaded() should return the current "loaded" status', () => {
      const result = AppSuperadminSelectors.selectAppSuperadminLoaded(state);

      expect(result).toBe(true);
    });

    it('selectAppSuperadminError() should return the current "error" state', () => {
      const result = AppSuperadminSelectors.selectAppSuperadminError(state);

      expect(result).toBe(ERROR_MSG);
    });
  });
});
