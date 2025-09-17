import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SiteAdmin } from './site_admin';

describe('SiteAdmin', () => {
  let component: SiteAdmin;
  let fixture: ComponentFixture<SiteAdmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SiteAdmin],
    }).compileComponents();

    fixture = TestBed.createComponent(SiteAdmin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
