import { CampaignService } from './campaign.service';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { CampaignController } from './campaign.controller';
import { PrismaClient } from '@prisma/client';
import { CampaignConsumer } from './campaign.consumers';
import { BullModule } from '@nestjs/bull';
import { CampaignConfig } from './campaign.config';

@Module({
  imports: [
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST,
        port: +process.env.REDIS_PORT,
      },
    }),
    BullModule.registerQueue({
      name: process.env.REDIS_QUEUE_VOUCHER_PRE_REDEEM,
    }),
  ],
  controllers: [CampaignController],
  providers: [CampaignService, PrismaClient, CampaignConsumer, CampaignConfig],
})
export class CampaignModule {}
