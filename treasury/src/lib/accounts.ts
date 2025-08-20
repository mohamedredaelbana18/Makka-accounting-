export type AccountCodes = {
  customers: string;
  suppliers: string;
  contractors: string;
  revenueRoot: string;
  expenseRoot: string;
  cashRoot: string;
};

export const DEFAULT_ACCOUNT_CODES: AccountCodes = {
  customers: '1100',
  suppliers: '2100',
  contractors: '2200',
  revenueRoot: '4000',
  expenseRoot: '5000',
  cashRoot: '1000',
};

