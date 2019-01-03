export interface ITripDeal {
  transport?: string;
  departure?: string;
  arrival?: string;
  duration?: {
    h: number,
    m: number
  };
  cost?: number;
  discount?: number;
  reference?: string;
  discountedCost?: number;
  currency?: string;
}
