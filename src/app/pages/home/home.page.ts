import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { TripService, ValidatorService } from '../../services';
import { IMultiTrip, TripType } from '../../types';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage implements OnInit {
  fromCityControl: FormControl;
  toCityControl: FormControl;
  tripTypeControl: FormControl;
  form: FormGroup;
  cities: string[];
  filteredFromCities: Observable<string[]>;
  filteredToCities: Observable<string[]>;
  multiTrip: IMultiTrip;

  constructor(
    private formBuilder: FormBuilder,
    private tripService: TripService
  ) { }

  ngOnInit() {
    this.cities = this.tripService.getCities();
    this.fromCityControl = this.formBuilder.control(null, [
      Validators.required,
      ValidatorService.isCityInOrEmpty(this.cities)
    ]);
    this.toCityControl = this.formBuilder.control(null, [
      Validators.required,
      ValidatorService.isCityInOrEmpty(this.cities)
    ]);
    this.tripTypeControl = this.formBuilder.control(TripType.Cheapest);
    this.form = this.formBuilder.group({
      fromCity: this.fromCityControl,
      toCity: this.toCityControl,
      tripType: this.tripTypeControl
    });
    this.filteredFromCities = this.fromCityControl.valueChanges.pipe(
      startWith(''),
      map(searchText => {
        return this.filterCities(searchText);
      })
    );
    this.filteredToCities = this.toCityControl.valueChanges.pipe(
      startWith(''),
      map(searchText => {
        return this.filterCities(searchText);
      })
    );
  }

  private filterCities(searchText: string): string[] {
    searchText = (searchText || '').toLowerCase();

    return this.cities.filter(city => city.toLowerCase().includes(searchText));
  }

  search() {
    this.fromCityControl.markAsTouched();
    this.fromCityControl.updateValueAndValidity();
    this.toCityControl.markAsTouched();
    this.toCityControl.updateValueAndValidity();

    if (this.form.valid) {
      this.multiTrip = this.tripService.getMultiTrip(
        this.fromCityControl.value,
        this.toCityControl.value,
        this.tripTypeControl.value
      );
    }
  }

  reset() {
    this.form.reset();
    this.tripTypeControl.setValue(TripType.Cheapest);
    this.multiTrip = null;
  }
}
