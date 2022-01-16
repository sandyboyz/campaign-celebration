import { ApiProperty } from '@nestjs/swagger';

export class ValidatePhotoDto {
  @ApiProperty()
  voucherId: number;

  @ApiProperty()
  customerId: number;

  @ApiProperty()
  photoValid?: boolean;
}
