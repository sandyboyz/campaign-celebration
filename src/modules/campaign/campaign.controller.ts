import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ValidatePhotoDto } from './campaign.dto';
import { CampaignService } from './campaign.service';

@Controller('campaigns')
export class CampaignController {
  constructor(private campaignService: CampaignService) {}

  @Get('/check-customer/:id')
  checkCustomerEligible(@Param('id') id: string) {
    return this.campaignService.checkCustomerEligible(parseInt(id));
  }

  @Post('/validate-photo')
  validatePhotoSubmission(@Body() body: ValidatePhotoDto) {
    return this.campaignService.validatePhotoSubmission(
      body.voucherId,
      body.customerId,
      body.photoValid,
    );
  }
}
