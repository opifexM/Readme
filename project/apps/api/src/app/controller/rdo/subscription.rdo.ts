import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class SubscriptionRdo {
  @Expose()
  @ApiProperty({
    description: 'A list of subscription IDs the user is currently subscribed to.',
    type: [String],
  })
  public subscriptionIds: string[];
}
