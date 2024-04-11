import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveSearchComponent } from './live-search.component';

describe('LiveSearchComponent', () => {
  let component: LiveSearchComponent;
  let fixture: ComponentFixture<LiveSearchComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LiveSearchComponent]
    });
    fixture = TestBed.createComponent(LiveSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
