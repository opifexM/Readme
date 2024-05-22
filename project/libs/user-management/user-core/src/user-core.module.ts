import { Module } from '@nestjs/common';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RefreshTokenFactory } from './entity/refresh-token/refresh-token.factory';
import { RefreshTokenModel, RefreshTokenSchema } from './entity/refresh-token/refresh-token.model';
import { UserFactory } from './entity/user/user.factory';
import { UserModel, UserSchema } from './entity/user/user.model';
import { RefreshTokenMongodbRepository } from './repository/refresh-token/refresh-token-mongodb.repository';
import { UserMongodbRepository } from './repository/user/user-mongodb.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: UserModel.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: RefreshTokenModel.name, schema: RefreshTokenSchema }])
  ],
  providers: [
    {
      provide: 'UserRepository',
      useFactory: (userFactory: UserFactory, userModel: Model<UserModel>) =>
        new UserMongodbRepository(userFactory, userModel),
      inject: [UserFactory, getModelToken(UserModel.name)]
    },
    UserFactory,
    {
      provide: 'RefreshTokenRepository',
      useFactory: (refreshTokenFactory: RefreshTokenFactory, refreshTokenModel: Model<RefreshTokenModel>) =>
        new RefreshTokenMongodbRepository(refreshTokenFactory, refreshTokenModel),
      inject: [RefreshTokenFactory, getModelToken(RefreshTokenModel.name)]
    },
    RefreshTokenFactory
  ],
  exports: [
    'UserRepository',
    'RefreshTokenRepository'
  ]
})

export class UserCoreModule {
}
