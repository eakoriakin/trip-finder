import { browser, by, element, ElementFinder } from 'protractor';

export class HomePage {
  navigateTo() {
    return browser.get('/home');
  }

  getFromCityComponent() {
    return element(by.id('app-home-from-city'));
  }

  getToCityComponent() {
    return element(by.id('app-home-to-city'));
  }

  getSearchButton() {
    return element(by.id('app-home-search'));
  }

  getResetButton() {
    return element(by.id('app-home-reset'));
  }

  getTrips() {
    return element.all(by.className('app-multi-trip-card'));
  }

  getTripFromCity(tripCardElement: ElementFinder) {
    return tripCardElement.element(by.className('app-multi-trip-card-from'));
  }

  getTripToCity(tripCardElement: ElementFinder) {
    return tripCardElement.element(by.className('app-multi-trip-card-to'));
  }

  getTripDiscountedCost(tripCardElement: ElementFinder) {
    return tripCardElement.element(by.className('app-multi-trip-card-discounted-cost'));
  }

  getTripDuration(tripCardElement: ElementFinder) {
    return tripCardElement.element(by.className('app-multi-trip-card-duration'));
  }

  getTripReference(tripCardElement: ElementFinder) {
    return tripCardElement.element(by.className('app-multi-trip-card-reference'));
  }

  getTripTransport(tripCardElement: ElementFinder) {
    return tripCardElement.element(by.className('app-multi-trip-card-transport'));
  }
}
