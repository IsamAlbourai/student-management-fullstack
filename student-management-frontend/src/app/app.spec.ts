import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { App } from './app';

describe('App', () => {
  let component: App;
  let fixture: ComponentFixture<App>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter([])],
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

  it('should display the navigation links', () => {
    const element: HTMLElement = fixture.nativeElement;

    expect(element.textContent).toContain('Dashboard');
    expect(element.textContent).toContain('Students');
    expect(element.textContent).toContain('Add Student');
    expect(element.textContent).toContain('About');
  });
});
