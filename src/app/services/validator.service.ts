import { Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ValidatorService {
  constructor() { }

  static isCityInOrEmpty(cities: string[]) {
    return (formControl: AbstractControl) => {
      const error = {
        isCityIn: {
          given: formControl.value
        }
      };

      let isValid = true;

      if (formControl.value) {
        isValid = cities.includes(formControl.value);
      }

      return isValid ? null : error;
    };
  }
}
