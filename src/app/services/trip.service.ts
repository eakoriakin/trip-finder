import { Injectable } from '@angular/core';
import * as tripDealsByCurrency from '../mocks/trip-deals.json';
import { ICostToCity, IMultiTrip, ITripDeal, ITripGraph, TripType } from '../types';

@Injectable({
  providedIn: 'root'
})
export class TripService {
  private getTripDealCost(tripDeal: ITripDeal, tripType: TripType) {
    let cost;

    if (tripType === TripType.Cheapest) {
      if (tripDeal.discount > 0) {
        cost = tripDeal.cost - tripDeal.cost * tripDeal.discount / 100;
      } else {
        cost = tripDeal.cost;
      }
    } else if (tripType === TripType.Fastest) {
      cost = tripDeal.duration.h * 60 + tripDeal.duration.m;
    }

    return cost;
  }

  // Finds an optimal trip deal given an array of deals.
  private getTripDeal(tripDeals: ITripDeal[], tripType: TripType): ITripDeal {
    if (!tripDeals || !tripDeals.length) {
      return null;
    }

    // If all deals have the same cost then the first deal takes priority.
    let optimalTripDeal = tripDeals[0];

    for (let index = 1; index < tripDeals.length; index++) {
      const tripDeal = tripDeals[index];

      if (this.getTripDealCost(tripDeal, tripType) < this.getTripDealCost(optimalTripDeal, tripType)) {
        optimalTripDeal = tripDeal;
      }
    }

    return optimalTripDeal;
  }

  // Finds an optimal city deal given an object of cities.
  private getTripCity(costTo: ICostToCity, processedCities, tripType: TripType): string {
    return Object.keys(costTo).reduce((optimalCity, city) => {
      if (
        (optimalCity === null || costTo[city].totalCost < costTo[optimalCity].totalCost) &&
        !processedCities.includes(city)
      ) {
        optimalCity = city;
      }

      return optimalCity;
    }, null);
  }

  // Finds an optimal trip path based on Dijkstra algorithm.
  // Source https://hackernoon.com/how-to-implement-dijkstras-algorithm-in-javascript-abdfd1702d04.
  getMultiTrip(
    fromCity: string,
    toCity: string,
    tripType: TripType = TripType.Cheapest,
    tripGraph?: ITripGraph
  ): IMultiTrip {
    if (!fromCity || !toCity || fromCity === toCity) {
      return null;
    }

    const _tripGraph = tripGraph || this.tripDealsToGraph(this.getTripDeals()),
      processedCities = [],
      multiTrip: IMultiTrip = {
        departure: fromCity,
        arrival: toCity,
        cost: 0,
        discountedCost: 0,
        duration: { h: 0, m: 0 },
        trips: []
      },
      // Optimal cost to reach each city from start city.
      costTo: ICostToCity = {},
      // Parents to track the optimal path.
      parentOf: any = {};

    for (const childCity in _tripGraph[fromCity]) {
      if (_tripGraph[fromCity].hasOwnProperty(childCity)) {
        costTo[childCity] = {
          tripDeals: _tripGraph[fromCity][childCity]
        };
      }
    }

    for (const childCity in _tripGraph[fromCity]) {
      if (_tripGraph[fromCity].hasOwnProperty(childCity)) {
        parentOf[childCity] = { city: fromCity };
      }
    }

    let optimalCity = this.getTripCity(costTo, processedCities, tripType);

    while (optimalCity) {
      const optimalTripDeal = this.getTripDeal(costTo[optimalCity].tripDeals, tripType),
        childCities = _tripGraph[optimalCity];

      for (const childCity in childCities) {
        // Skip fromCity to avoid looping.
        if (childCities.hasOwnProperty(childCity) && childCity !== fromCity) {
          const childTripDeal = this.getTripDeal(childCities[childCity], tripType);
          let newTotalСostToCity;

          // Calculate cost to child city from start city.
          if (optimalTripDeal) {
            newTotalСostToCity = this.getTripDealCost(optimalTripDeal, tripType) +
              this.getTripDealCost(childTripDeal, tripType);
          } else {
            newTotalСostToCity += this.getTripDealCost(childTripDeal, tripType);
          }

          if (!costTo[childCity] || costTo[childCity].totalCost > newTotalСostToCity) {
            if (!costTo[childCity]) {
              costTo[childCity] = {
                totalCost: newTotalСostToCity
              };
            } else {
              costTo[childCity].totalCost = newTotalСostToCity;
            }

            // Keep track of parent to be able to recreate the full path later.
            parentOf[childCity] = {
              city: optimalCity,
              tripDeal: childTripDeal
            };
          }
        }
      }

      processedCities.push(optimalCity);
      optimalCity = this.getTripCity(costTo, processedCities, tripType);
    }

    // Create multi trip.
    let parent = parentOf[toCity];

    while (parent) {
      multiTrip.trips.push(parent);
      parent = parentOf[parent.city];
    }

    // From or to city doesn't exist.
    if (!multiTrip.trips.length) {
      return null;
    }

    multiTrip.trips.reverse();

    // First trip isn't set initially, so we set it after.
    // TOOD: Need to check the algorithm later and fix it.
    if (multiTrip.trips.length === 1) {
      multiTrip.trips[0].tripDeal = this.getTripDeal(costTo[toCity].tripDeals, tripType);
    } else if (multiTrip.trips.length > 1) {
      multiTrip.trips[0].tripDeal = this.getTripDeal(_tripGraph[fromCity][multiTrip.trips[1].city], tripType);
    }

    multiTrip.currency = multiTrip.trips[0].tripDeal.currency;

    // Calculate totals.
    multiTrip.trips.forEach(trip => {
      multiTrip.cost += trip.tripDeal.cost;
      multiTrip.discountedCost += this.getTripDealCost(trip.tripDeal, TripType.Cheapest);
      multiTrip.duration.h += trip.tripDeal.duration.h;
      multiTrip.duration.m += trip.tripDeal.duration.m;

      if (multiTrip.duration.m > 60) {
        const m = multiTrip.duration.m % 60;
        multiTrip.duration.h += (multiTrip.duration.m - m) / 60;
        multiTrip.duration.m = m;
      }
    }, 0);

    return multiTrip;
  }

  getTripDeals(): ITripDeal[] {
    return tripDealsByCurrency.deals.map((tripDeal: any) => {
      // Convert time to numbers for easier calculations later.
      tripDeal.duration.h = Number(tripDeal.duration.h);
      tripDeal.duration.m = Number(tripDeal.duration.m);
      tripDeal.currency = tripDealsByCurrency.currency;
      tripDeal.discountedCost = this.getTripDealCost(tripDeal, TripType.Cheapest);

      return tripDeal;
    });
  }

  tripDealsToGraph(tripDeals: ITripDeal[]): ITripGraph {
    if (!tripDeals || !tripDeals.length) {
      return null;
    }

    const tripGraph: ITripGraph = {};

    tripDeals.forEach(tripDeal => {
      const tripCity = tripGraph[tripDeal.departure] || {};
      tripCity[tripDeal.arrival] = tripCity[tripDeal.arrival] || [];

      const tripDealExists = tripCity[tripDeal.arrival].find(_tripDeal => {
        return _tripDeal.reference === tripDeal.reference;
      });

      if (!tripDealExists) {
        tripCity[tripDeal.arrival].push(tripDeal);
      }

      tripGraph[tripDeal.departure] = tripCity;
    });

    return tripGraph;
  }

  getCities(): string[] {
    const cities = [];

    this.getTripDeals().forEach(tripDeal => {
      if (!cities.includes(tripDeal.arrival)) {
        cities.push(tripDeal.arrival);
      }

      if (!cities.includes(tripDeal.departure)) {
        cities.push(tripDeal.departure);
      }
    });

    return cities;
  }
}
