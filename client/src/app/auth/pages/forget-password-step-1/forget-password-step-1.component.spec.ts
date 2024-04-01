import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForgetPasswordStep1Component } from './forget-password-step-1.component';

describe('ForgetPasswordStep1Component', () => {
  let component: ForgetPasswordStep1Component;
  let fixture: ComponentFixture<ForgetPasswordStep1Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ForgetPasswordStep1Component]
    });
    fixture = TestBed.createComponent(ForgetPasswordStep1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
