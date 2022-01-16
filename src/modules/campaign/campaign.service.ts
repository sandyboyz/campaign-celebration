/*
https://docs.nestjs.com/providers#services
*/

import { InjectQueue } from '@nestjs/bull';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { Queue } from 'bull';
import { sub } from 'date-fns';
import { CampaignConfig } from './campaign.config';
import { VoucherStatus } from './campaign.types';

@Injectable()
export class CampaignService {
  constructor(
    private client: PrismaClient,
    @InjectQueue('voucher-pre-redeem') private voucherPreClaimQueue: Queue,
    private campaignConfig: CampaignConfig,
  ) {}

  async checkCustomerEligible(customerId: number) {
    const customer = await this.client.customer.findFirst({
      where: { id: customerId },
    });

    if (!customer) {
      throw new HttpException(
        `Customer ${customerId} does not exist`,
        HttpStatus.NOT_FOUND,
      );
    }

    // Check customer is already in pre-claim queue
    const customerPreRedeemVoucher = await this.client.voucher.findFirst({
      where: {
        claimBy: customer.id,
        status: VoucherStatus['PRE-REDEEMED'],
      },
    });

    if (customerPreRedeemVoucher) {
      return {
        message: 'You eligible for the campaign',
        voucherId: customerPreRedeemVoucher.id,
      };
    }

    // Customer completed 3 purchase transaction within the last 30 days
    const customerCompletedTransactions =
      await this.client.purchaseTransaction.findMany({
        where: {
          customerId: customer.id,
          transactionAt: { gte: sub(new Date(), { days: 30 }) },
        },
      });

    if (customerCompletedTransactions.length < 3) {
      throw new HttpException(
        'You is not eligible for the campaign',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Total transaction equal or more than $100
    const totalTransaction = customerCompletedTransactions.reduce(
      (sum, transaction) => transaction.totalSpent + sum,
      0,
    );

    if (totalTransaction < 100) {
      throw new HttpException(
        'You is not eligible for the campaign',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Customer already redeem the voucher
    const customerRedeemedVoucher = await this.client.voucher.findFirst({
      where: { claimBy: customer.id, status: VoucherStatus['REDEEMED'] },
    });

    if (customerRedeemedVoucher) {
      throw new HttpException(
        `You already redeemed the voucher`,
        HttpStatus.BAD_REQUEST,
      );
    }

    // Lock voucher to customer with status pre-redeem
    const voucher = await this.client.voucher.findFirst({
      where: { claimBy: null },
    });

    if (!voucher) {
      throw new HttpException('No voucher available', HttpStatus.NOT_FOUND);
    }

    // Optimistic Concurrency Control to make sure only one customer can pre-claim the voucher
    const updatedVoucher = await this.client.voucher.updateMany({
      data: {
        claimBy: customer.id,
        status: VoucherStatus['PRE-REDEEMED'],
        version: { increment: 1 },
      },

      where: {
        id: voucher.id,
        version: voucher.version,
      },
    });

    if (updatedVoucher.count === 0) {
      throw new HttpException(
        'Voucher is already claimed',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Pre-Claim the voucher
    await this.voucherPreClaimQueue.add(
      {
        customerId: customer.id,
        voucherId: voucher.id,
      },
      {
        jobId: `${voucher.id}-${customer.id}`,
        delay: this.campaignConfig.MAXIMAL_CAMPAIGN_SUBMISSION_TIMEOUT,
      }, // 10 Minutes will check the status of the voucher,
    );

    return {
      message:
        'You are eligible for the campaign please submit photo in 10 minutes',
      voucherId: voucher.id,
    };
  }

  async validatePhotoSubmission(
    voucherId: number,
    customerId: number,
    validPhoto = true,
  ) {
    const voucher = await this.client.voucher.findFirst({
      where: {
        id: voucherId,
        claimBy: customerId,
        status: VoucherStatus['PRE-REDEEMED'],
      },
    });

    if (!voucher) {
      return new HttpException(
        'Voucher not found or already get voucher',
        HttpStatus.NOT_FOUND,
      );
    }

    if (validPhoto) {
      await this.client.voucher.update({
        data: { status: VoucherStatus['REDEEMED'] },
        where: { id: voucher.id },
      });
    } else {
      await this.voucherPreClaimQueue.removeJobs(
        `${voucher.id}-${voucher.claimBy}`,
      );
      await this.client.voucher.update({
        data: { claimBy: null, status: null },
        where: { id: voucher.id },
      });

      throw new HttpException('Invalid photo', HttpStatus.BAD_REQUEST);
    }

    return {
      message: 'Voucher redeemed, you got cash bonus',
    };
  }
}
