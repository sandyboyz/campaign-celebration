import { Injectable } from '@nestjs/common';

@Injectable()
export class CampaignConfig {
  public MAXIMAL_CAMPAIGN_SUBMISSION_TIMEOUT = 10 * 60 * 1000; // 10 Minutes
}
