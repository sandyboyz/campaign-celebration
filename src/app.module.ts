import { CampaignModule } from './modules/campaign/campaign.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [CampaignModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
