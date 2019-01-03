import { Component, Input, OnInit } from '@angular/core';
import { IMultiTrip } from '../../types';

@Component({
  selector: 'app-multi-trip',
  templateUrl: './multi-trip.component.html',
  styleUrls: ['./multi-trip.component.scss']
})
export class MultiTripComponent implements OnInit {
  @Input() multiTrip: IMultiTrip;

  constructor() { }

  ngOnInit() { }
}
