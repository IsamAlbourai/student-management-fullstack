import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideRouter } from '@angular/router';

import { App } from './app';
import { AuthService } from './services/auth.service';

describe('App', () => {
  let component: App;
  let fixture: ComponentFixture<App>;

  const mockAuthService = {
    isLoggedIn: () => false,

    isAdmin: () => false,

    getUsername: () => null,

    getRole: () => null,

    logout: () => {},
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],

      providers: [
        provideRouter([]),

        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(App);

    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should display the application title', () => {
    const element: HTMLElement = fixture.nativeElement;

    expect(element.textContent).toContain('Student Management System');
  });

  it('should display public navigation when logged out', () => {
    const element: HTMLElement = fixture.nativeElement;

    expect(element.textContent).toContain('About');

    expect(element.textContent).toContain('Sign In');

    expect(element.textContent).not.toContain('Dashboard');

    expect(element.textContent).not.toContain('Students');

    expect(element.textContent).not.toContain('Add Student');
  });
});
