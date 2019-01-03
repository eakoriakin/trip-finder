
import { ITripDeal } from './trip-deal.interface';

// Costs of the immediate neighbor cities of a given city.
export interface ICostToCity {
  [k: string]: {
    // Total cost to reach a given city from start city.
    // This can be a sum of train, bus and car cost.
    // It can be in minutes if we calculate fastest path.
    totalCost?: number;
    tripDeals?: ITripDeal[];
  };
}
