import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClientAdmin } from './client_admin';

describe('ClientAdmin', () => {
  let component: ClientAdmin;
  let fixture: ComponentFixture<ClientAdmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientAdmin],
    }).compileComponents();

    fixture = TestBed.createComponent(ClientAdmin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
