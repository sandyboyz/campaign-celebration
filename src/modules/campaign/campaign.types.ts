export enum VoucherStatus {
  'REDEEMED' = 'REDEEMED',
  'PRE-REDEEMED' = 'PRE-REDEEMED',
}

export interface VoucherPreRedeemJobData {
  customerId: number;
  voucherId: number;
}
