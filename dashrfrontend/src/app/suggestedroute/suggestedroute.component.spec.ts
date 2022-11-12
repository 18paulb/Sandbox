import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuggestedrouteComponent } from './suggestedroute.component';

describe('SuggestedrouteComponent', () => {
  let component: SuggestedrouteComponent;
  let fixture: ComponentFixture<SuggestedrouteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SuggestedrouteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuggestedrouteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
