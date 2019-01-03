import { async, TestBed } from '@angular/core/testing';
import { ITripGraph, TripType } from '../types';
import { TripService } from './';

describe('TripService', () => {
  const tripGraph: ITripGraph = {
    London: {
      Paris: [{
        transport: 'train', departure: 'London', arrival: 'Paris',
        duration: { h: 5, m: 30 }, cost: 100, discount: 5, reference: ''
      }, {
        transport: 'bus', departure: 'London', arrival: 'Paris',
        duration: { h: 8, m: 45 }, cost: 80, discount: 0, reference: 'BLP0845'
      }],
      Amsterdam: [{
        transport: 'train', departure: 'London', arrival: 'Amsterdam',
        duration: { h: 3, m: 15 }, cost: 75, discount: 20, reference: 'TLA0315'
      }]
    },
    Paris: {
      Stockholm: [{
        transport: 'train', departure: 'Paris', arrival: 'Stockholm',
        duration: { h: 6, m: 20 }, cost: 80, discount: 0, reference: ''
      }],
      Berlin: [{
        transport: 'train', departure: 'Paris', arrival: 'Berlin',
        duration: { h: 4, m: 30 }, cost: 40, discount: 0, reference: 'TPB0430'
      }],
      London: [{
        transport: 'train', departure: 'Paris', arrival: 'London',
        duration: { h: 5, m: 0 }, cost: 160, discount: 0, reference: ''
      }],
    },
    Amsterdam: {
      Paris: [{
        transport: 'train', departure: 'Amsterdam', arrival: 'Paris',
        duration: { h: 5, m: 0 }, cost: 160, discount: 0, reference: ''
      }],
      Berlin: [{
        transport: 'train', departure: 'Amsterdam', arrival: 'Berlin',
        duration: { h: 5, m: 0 }, cost: 140, discount: 0, reference: ''
      }],
      Stockholm: [{
        transport: 'train', departure: 'Amsterdam', arrival: 'Stockholm',
        duration: { h: 5, m: 0 }, cost: 120, discount: 0, reference: ''
      }, {
        transport: 'car', departure: 'Amsterdam', arrival: 'Stockholm',
        duration: { h: 4, m: 30 }, cost: 120, discount: 0, reference: 'CAS0430'
      }]
    },
    Stockholm: {
      Berlin: [{
        transport: 'train', departure: 'Stockholm', arrival: 'Berlin',
        duration: { h: 5, m: 0 }, cost: 120, discount: 0, reference: ''
      }],
      Moscow: [{
        transport: 'train', departure: 'Stockholm', arrival: 'Moscow',
        duration: { h: 5, m: 0 }, cost: 60, discount: 0, reference: ''
      }]
    },
    Berlin: {
      Moscow: [{
        transport: 'train', departure: 'Berlin', arrival: 'Moscow',
        duration: { h: 5, m: 0 }, cost: 40, discount: 0, reference: ''
      }, {
        transport: 'car', departure: 'Berlin', arrival: 'Moscow',
        duration: { h: 16, m: 15 }, cost: 40, discount: 10, reference: 'CBM1615'
      }]
    }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({}).compileComponents();
  }));

  it('should be created', () => {
    const tripService: TripService = TestBed.get(TripService);

    expect(tripService).toBeTruthy();
  });

  it('should return null if fromCity and toCity are the same', () => {
    const tripService: TripService = TestBed.get(TripService);

    expect(tripService.getMultiTrip('London', 'London', TripType.Cheapest, tripGraph)).toBeNull();
  });

  it('should return null if fromCity or toCity does not exist', () => {
    const tripService: TripService = TestBed.get(TripService);

    expect(tripService.getMultiTrip('London', 'Vladivostok', TripType.Cheapest, tripGraph)).toBeNull();
    expect(tripService.getMultiTrip('Vladivostok', 'London', TripType.Cheapest, tripGraph)).toBeNull();
  });

  it('should return null if fromCity or toCity is not set', () => {
    const tripService: TripService = TestBed.get(TripService);

    expect(tripService.getMultiTrip('', 'Moscow', TripType.Fastest, tripGraph)).toBeNull();
    expect(tripService.getMultiTrip('London', '', TripType.Fastest, tripGraph)).toBeNull();
    expect(tripService.getMultiTrip(null, 'Moscow', TripType.Fastest, tripGraph)).toBeNull();
    expect(tripService.getMultiTrip('London', null, TripType.Fastest, tripGraph)).toBeNull();
    expect(tripService.getMultiTrip(undefined, 'Moscow', TripType.Fastest, tripGraph)).toBeNull();
    expect(tripService.getMultiTrip('London', undefined, TripType.Fastest, tripGraph)).toBeNull();
  });

  it('should get cheapest trip London - Moscow on test graph', () => {
    const tripService: TripService = TestBed.get(TripService),
      multiTrip = tripService.getMultiTrip('London', 'Moscow', TripType.Cheapest, tripGraph);

    expect(multiTrip.cost).toEqual(160);
    expect(multiTrip.discountedCost).toEqual(156);
    expect(multiTrip.duration.h).toEqual(29);
    expect(multiTrip.duration.m).toEqual(30);
    expect(multiTrip.trips.length).toEqual(3);
    expect(multiTrip.trips[0].city).toEqual('London');
    expect(multiTrip.trips[0].tripDeal.reference).toEqual('BLP0845');
    expect(multiTrip.trips[1].city).toEqual('Paris');
    expect(multiTrip.trips[1].tripDeal.reference).toEqual('TPB0430');
    expect(multiTrip.trips[2].city).toEqual('Berlin');
    expect(multiTrip.trips[2].tripDeal.reference).toEqual('CBM1615');
  });

  it('should get fastest trip London - Stockholm on test graph', () => {
    const tripService: TripService = TestBed.get(TripService),
      multiTrip = tripService.getMultiTrip('London', 'Stockholm', TripType.Fastest, tripGraph);

    expect(multiTrip.cost).toEqual(195);
    expect(multiTrip.discountedCost).toEqual(180);
    expect(multiTrip.duration.h).toEqual(7);
    expect(multiTrip.duration.m).toEqual(45);
    expect(multiTrip.trips.length).toEqual(2);
    expect(multiTrip.trips[0].city).toEqual('London');
    expect(multiTrip.trips[0].tripDeal.reference).toEqual('TLA0315');
    expect(multiTrip.trips[1].city).toEqual('Amsterdam');
    expect(multiTrip.trips[1].tripDeal.reference).toEqual('CAS0430');
  });

  it('should get fastest trip London - Moscow', () => {
    const tripService: TripService = TestBed.get(TripService),
      _tripGraph = tripService.tripDealsToGraph(tripService.getTripDeals()),
      multiTrip = tripService.getMultiTrip('London', 'Moscow', TripType.Fastest, _tripGraph);

    expect(multiTrip.cost).toEqual(560);
    expect(multiTrip.discountedCost).toEqual(560);
    expect(multiTrip.duration.h).toEqual(16);
    expect(multiTrip.duration.m).toEqual(30);
    expect(multiTrip.trips.length).toEqual(4);
    expect(multiTrip.trips[0].city).toEqual('London');
    expect(multiTrip.trips[0].tripDeal.reference).toEqual('CLA0445');
    expect(multiTrip.trips[1].city).toEqual('Amsterdam');
    expect(multiTrip.trips[1].tripDeal.reference).toEqual('CAB0430');
    expect(multiTrip.trips[2].city).toEqual('Brussels');
    expect(multiTrip.trips[2].tripDeal.reference).toEqual('TBP0300');
    expect(multiTrip.trips[3].city).toEqual('Prague');
    expect(multiTrip.trips[3].tripDeal.reference).toEqual('TPM0415');
  });

  it('should get cheapest trip London - Moscow', () => {
    const tripService: TripService = TestBed.get(TripService),
      _tripGraph = tripService.tripDealsToGraph(tripService.getTripDeals()),
      multiTrip = tripService.getMultiTrip('London', 'Moscow', TripType.Cheapest, _tripGraph);

    expect(multiTrip.cost).toEqual(160);
    expect(multiTrip.discountedCost).toEqual(110);
    expect(multiTrip.duration.h).toEqual(23);
    expect(multiTrip.duration.m).toEqual(45);
    expect(multiTrip.trips.length).toEqual(4);
    expect(multiTrip.trips[0].city).toEqual('London');
    expect(multiTrip.trips[0].tripDeal.reference).toEqual('BLA0745');
    expect(multiTrip.trips[1].city).toEqual('Amsterdam');
    expect(multiTrip.trips[1].tripDeal.reference).toEqual('BAW0515');
    expect(multiTrip.trips[2].city).toEqual('Warsaw');
    expect(multiTrip.trips[2].tripDeal.reference).toEqual('BWS0515');
    expect(multiTrip.trips[3].city).toEqual('Stockholm');
    expect(multiTrip.trips[3].tripDeal.reference).toEqual('BSM0530');
  });

  it('should get cheapest trip London - Amsterdam', () => {
    const tripService: TripService = TestBed.get(TripService),
      _tripGraph = tripService.tripDealsToGraph(tripService.getTripDeals()),
      multiTrip = tripService.getMultiTrip('London', 'Amsterdam', TripType.Cheapest, _tripGraph);

    expect(multiTrip.cost).toEqual(40);
    expect(multiTrip.discountedCost).toEqual(30);
    expect(multiTrip.duration.h).toEqual(7);
    expect(multiTrip.duration.m).toEqual(45);
    expect(multiTrip.trips.length).toEqual(1);
    expect(multiTrip.trips[0].city).toEqual('London');
    expect(multiTrip.trips[0].tripDeal.reference).toEqual('BLA0745');
  });

  it('should convert trip deals to graph', () => {
    const tripService: TripService = TestBed.get(TripService),
      _tripGraph = tripService.tripDealsToGraph(tripService.getTripDeals());

    expect(_tripGraph.Amsterdam.Brussels.length).toEqual(3);
    expect(_tripGraph.Amsterdam.Brussels[0].reference).toEqual('TAB0530');
    expect(_tripGraph.Amsterdam.Brussels[1].reference).toEqual('BAB0545');
    expect(_tripGraph.Amsterdam.Brussels[2].reference).toEqual('CAB0430');

    expect(_tripGraph.Moscow.Prague.length).toEqual(3);
    expect(_tripGraph.Moscow.Prague[0].reference).toEqual('TMP0330');
    expect(_tripGraph.Moscow.Prague[1].reference).toEqual('BMP0500');
    expect(_tripGraph.Moscow.Prague[2].reference).toEqual('CMP0530');
  });
});
