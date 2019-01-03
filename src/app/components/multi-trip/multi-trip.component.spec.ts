import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatCardModule, MatIconModule } from '@angular/material';
import { MultiTripComponent } from './multi-trip.component';

describe('MultiTripComponent', () => {
  let component: MultiTripComponent,
    fixture: ComponentFixture<MultiTripComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        MultiTripComponent
      ],
      imports: [
        MatCardModule,
        MatIconModule,
        FlexLayoutModule
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiTripComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
