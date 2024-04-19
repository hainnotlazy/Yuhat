import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogCreateGroupChatComponent } from './dialog-create-group-chat.component';

describe('DialogCreateGroupChatComponent', () => {
  let component: DialogCreateGroupChatComponent;
  let fixture: ComponentFixture<DialogCreateGroupChatComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DialogCreateGroupChatComponent]
    });
    fixture = TestBed.createComponent(DialogCreateGroupChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
