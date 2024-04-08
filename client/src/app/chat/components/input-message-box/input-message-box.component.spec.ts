import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputMessageBoxComponent } from './input-message-box.component';

describe('InputMessageBoxComponent', () => {
  let component: InputMessageBoxComponent;
  let fixture: ComponentFixture<InputMessageBoxComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InputMessageBoxComponent]
    });
    fixture = TestBed.createComponent(InputMessageBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
