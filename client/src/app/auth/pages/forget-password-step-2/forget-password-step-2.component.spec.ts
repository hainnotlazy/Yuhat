import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForgetPasswordStep2Component } from './forget-password-step-2.component';

describe('ForgetPasswordStep2Component', () => {
  let component: ForgetPasswordStep2Component;
  let fixture: ComponentFixture<ForgetPasswordStep2Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ForgetPasswordStep2Component]
    });
    fixture = TestBed.createComponent(ForgetPasswordStep2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
