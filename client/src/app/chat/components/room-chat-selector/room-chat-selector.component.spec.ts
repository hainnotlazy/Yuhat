import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomChatSelectorComponent } from './room-chat-selector.component';

describe('RoomChatSelectorComponent', () => {
  let component: RoomChatSelectorComponent;
  let fixture: ComponentFixture<RoomChatSelectorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RoomChatSelectorComponent]
    });
    fixture = TestBed.createComponent(RoomChatSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
