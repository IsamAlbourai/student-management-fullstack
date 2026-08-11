import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvalidField } from './invalid-field';

@Component({
  selector: 'app-test-host',
  imports: [InvalidField],
  template: ` <input appInvalidField type="text" /> `,
})
class TestHost {}

describe('InvalidField', () => {
  let fixture: ComponentFixture<TestHost>;
  let input: HTMLInputElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHost],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();

    input = fixture.nativeElement.querySelector('input');
  });

  it('should create the input with the directive', () => {
    expect(input).toBeTruthy();
  });

  it('should add a red border when the empty input loses focus', () => {
    input.value = '';

    input.dispatchEvent(new Event('blur'));

    fixture.detectChanges();

    expect(input.style.border).toContain('2px solid red');
    expect(input.style.backgroundColor).toBe('rgb(255, 245, 245)');
  });

  it('should remove the warning when the user enters text', () => {
    input.value = '';

    input.dispatchEvent(new Event('blur'));

    input.value = 'Sam';

    input.dispatchEvent(new Event('input'));

    fixture.detectChanges();

    expect(input.style.border).toBe('');
    expect(input.style.backgroundColor).toBe('');
  });
});
