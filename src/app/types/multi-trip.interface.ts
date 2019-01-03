import { ITripDeal } from './trip-deal.interface';

export interface IMultiTrip {
  cost?: number;
  discountedCost?: number;
  duration?: {
    h: number;
    m: number;
  };
  departure?: string;
  arrival?: string;
  trips: {
    city: string;
    tripDeal?: ITripDeal;
  }[];
  currency?: string;
}
