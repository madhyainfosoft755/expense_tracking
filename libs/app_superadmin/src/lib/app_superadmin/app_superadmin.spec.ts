import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppSuperadmin } from './app_superadmin';

describe('AppSuperadmin', () => {
  let component: AppSuperadmin;
  let fixture: ComponentFixture<AppSuperadmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppSuperadmin],
    }).compileComponents();

    fixture = TestBed.createComponent(AppSuperadmin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
