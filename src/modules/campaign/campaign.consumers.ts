import { Process, Processor } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { Job } from 'bull';
import { VoucherPreRedeemJobData, VoucherStatus } from './campaign.types';

@Injectable()
@Processor('voucher-pre-redeem')
export class CampaignConsumer {
  constructor(private client: PrismaClient) {}
  @Process()
  async checkAfter10Minutes(job: Job<VoucherPreRedeemJobData>) {
    // Check voucher if voucher already redeem
    const voucherRedeem = await this.client.voucher.findFirst({
      where: {
        id: job.data.voucherId,
        claimBy: job.data.customerId,
        status: VoucherStatus.REDEEMED,
      },
    });

    if (voucherRedeem) {
      return true;
    }

    // Undo voucher because customer not redeem
    await this.client.voucher.update({
      data: {
        status: null,
        claimBy: null,
        version: 0,
      },
      where: {
        id: job.data.voucherId,
      },
    });

    return false;
  }
}
