import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomChatInfoComponent } from './room-chat-info.component';

describe('RoomChatInfoComponent', () => {
  let component: RoomChatInfoComponent;
  let fixture: ComponentFixture<RoomChatInfoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RoomChatInfoComponent]
    });
    fixture = TestBed.createComponent(RoomChatInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
