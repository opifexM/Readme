import { IsNumber, IsString, Max, Min, validateOrReject } from 'class-validator';
import { MongodbConfig } from '../mongodb.config';

const MONGO_MIN_PORT = 0;
const MONGO_MAX_PORT = 65535;

export class MongoDbConfiguration implements MongodbConfig {
  @IsString()
  authBase: string;

  @IsString()
  host: string;

  @IsString()
  name: string;

  @IsString()
  password: string;

  @IsNumber()
  @Min(MONGO_MIN_PORT)
  @Max(MONGO_MAX_PORT)
  port: number;

  @IsString()
  user: string;

  public async validate(): Promise<void> {
    await validateOrReject(this);
  }
}
