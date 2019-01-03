import { HomePage } from './home.po';

describe('workspace-project App', () => {
  let page: HomePage;

  beforeEach(() => {
    page = new HomePage();
  });

  it('should search cheapest trip London - Moscow', () => {
    page.navigateTo();

    // Search for a trip.
    page.getFromCityComponent().sendKeys('London');
    page.getToCityComponent().sendKeys('Moscow');
    page.getSearchButton().click();

    // Check the trip.
    let tripCards = page.getTrips();
    expect(tripCards.count()).toEqual(5);

    expect(page.getTripFromCity(tripCards.get(0)).getText()).toEqual('London');
    expect(page.getTripToCity(tripCards.get(0)).getText()).toEqual('Amsterdam');
    expect(page.getTripDiscountedCost(tripCards.get(0)).getText()).toEqual('€30.00');
    expect(page.getTripTransport(tripCards.get(0)).getText()).toEqual('bus');
    expect(page.getTripReference(tripCards.get(0)).getText()).toEqual('BLA0745');
    expect(page.getTripDuration(tripCards.get(0)).getText()).toEqual('7h 45m');

    expect(page.getTripFromCity(tripCards.get(1)).getText()).toEqual('Amsterdam');
    expect(page.getTripToCity(tripCards.get(1)).getText()).toEqual('Warsaw');
    expect(page.getTripDiscountedCost(tripCards.get(1)).getText()).toEqual('€30.00');
    expect(page.getTripTransport(tripCards.get(1)).getText()).toEqual('bus');
    expect(page.getTripReference(tripCards.get(1)).getText()).toEqual('BAW0515');
    expect(page.getTripDuration(tripCards.get(1)).getText()).toEqual('5h 15m');

    expect(page.getTripFromCity(tripCards.get(2)).getText()).toEqual('Warsaw');
    expect(page.getTripToCity(tripCards.get(2)).getText()).toEqual('Stockholm');
    expect(page.getTripDiscountedCost(tripCards.get(2)).getText()).toEqual('€20.00');
    expect(page.getTripTransport(tripCards.get(2)).getText()).toEqual('bus');
    expect(page.getTripReference(tripCards.get(2)).getText()).toEqual('BWS0515');
    expect(page.getTripDuration(tripCards.get(2)).getText()).toEqual('5h 15m');

    expect(page.getTripFromCity(tripCards.get(3)).getText()).toEqual('Stockholm');
    expect(page.getTripToCity(tripCards.get(3)).getText()).toEqual('Moscow');
    expect(page.getTripDiscountedCost(tripCards.get(3)).getText()).toEqual('€30.00');
    expect(page.getTripTransport(tripCards.get(3)).getText()).toEqual('bus');
    expect(page.getTripReference(tripCards.get(3)).getText()).toEqual('BSM0530');
    expect(page.getTripDuration(tripCards.get(3)).getText()).toEqual('5h 30m');

    expect(page.getTripFromCity(tripCards.get(4)).getText()).toEqual('Total');
    expect(page.getTripDiscountedCost(tripCards.get(4)).getText()).toEqual('€110.00');
    expect(page.getTripDuration(tripCards.get(4)).getText()).toEqual('23h 45m');

    // Reset search.
    page.getResetButton().click();

    // Check that search form and trip deals have been cleaned.
    tripCards = page.getTrips();
    expect(tripCards.count()).toEqual(0);
    expect(page.getFromCityComponent().getText()).toEqual('');
    expect(page.getToCityComponent().getText()).toEqual('');
  });
});
