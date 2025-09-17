import { createAction, props } from '@ngrx/store';
import { AppSuperadminEntity } from './app-superadmin.models';

export const initAppSuperadmin = createAction('[AppSuperadmin Page] Init');

export const loadAppSuperadminSuccess = createAction(
  '[AppSuperadmin/API] Load AppSuperadmin Success',
  props<{ appSuperadmin: AppSuperadminEntity[] }>()
);

export const loadAppSuperadminFailure = createAction(
  '[AppSuperadmin/API] Load AppSuperadmin Failure',
  props<{ error: any }>()
);
