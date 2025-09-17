import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClientSuperadmin } from './client_superadmin';

describe('ClientSuperadmin', () => {
  let component: ClientSuperadmin;
  let fixture: ComponentFixture<ClientSuperadmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientSuperadmin],
    }).compileComponents();

    fixture = TestBed.createComponent(ClientSuperadmin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
