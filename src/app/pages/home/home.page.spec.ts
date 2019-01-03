import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule, MatButtonModule, MatButtonToggleModule, MatFormFieldModule, MatIconModule, MatInputModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { TripService } from '../../services';
import { HomePage } from './home.page';

describe('HomePage', () => {
  let component: HomePage,
    fixture: ComponentFixture<HomePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        HomePage
      ],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA
      ],
      imports: [
        BrowserAnimationsModule,
        RouterTestingModule.withRoutes([{
          path: '',
          redirectTo: 'home',
          pathMatch: 'full'
        }]),
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatAutocompleteModule,
        MatButtonToggleModule,
        MatButtonModule,
        MatIconModule
      ],
      providers: [
        TripService
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // it('should create the app', () => {
  //   const appComponent = TestBed.createComponent(AppComponent),
  //     appComponentInstance = appComponent.debugElement.componentInstance;

  //   expect(appComponentInstance).toBeTruthy();
  // });

  // it('should render title in h1 tag', () => {
  //   const appComponent = TestBed.createComponent(AppComponent);
  //   appComponent.detectChanges();
  //   const element = appComponent.debugElement.nativeElement;

  //   expect(element.querySelector('h1').textContent).toContain('TripFinder');
  // });
});
