import { async, TestBed } from '@angular/core/testing';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        HeaderComponent
      ],
      imports: [
        RouterTestingModule.withRoutes([{
          path: '',
          redirectTo: 'home',
          pathMatch: 'full'
        }]),
        FlexLayoutModule
      ]
    }).compileComponents();
  }));

  it('should create', () => {
    const appComponent = TestBed.createComponent(AppComponent),
      appComponentInstance = appComponent.debugElement.componentInstance;

    expect(appComponentInstance).toBeTruthy();
  });
});
