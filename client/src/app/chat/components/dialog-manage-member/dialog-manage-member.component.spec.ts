import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogManageMemberComponent } from './dialog-manage-member.component';

describe('DialogManageMemberComponent', () => {
  let component: DialogManageMemberComponent;
  let fixture: ComponentFixture<DialogManageMemberComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DialogManageMemberComponent]
    });
    fixture = TestBed.createComponent(DialogManageMemberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
