import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { hot } from 'jasmine-marbles';
import { Observable } from 'rxjs';

import * as AppSuperadminActions from './app-superadmin.actions';
import { AppSuperadminEffects } from './app-superadmin.effects';

describe('AppSuperadminEffects', () => {
  let actions: Observable<Action>;
  let effects: AppSuperadminEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        AppSuperadminEffects,
        provideMockActions(() => actions),
        provideMockStore(),
      ],
    });

    effects = TestBed.inject(AppSuperadminEffects);
  });

  describe('init$', () => {
    it('should work', () => {
      actions = hot('-a-|', { a: AppSuperadminActions.initAppSuperadmin() });

      const expected = hot('-a-|', {
        a: AppSuperadminActions.loadAppSuperadminSuccess({ appSuperadmin: [] }),
      });

      expect(effects.init$).toBeObservable(expected);
    });
  });
});
