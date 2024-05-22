import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { UserNotificationType, UserType } from '@project/shared-core';
import mongoose, { Document } from 'mongoose';

@Schema({
  collection: 'users',
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (doc, ret) => {
      ret.subscriptionIds = ret.subscriptionIds.map(id => id.toString());
      delete ret._id;
      delete ret.__v;
    }
  },
  toObject: { virtuals: true }
})
export class UserModel extends Document {

  @Prop({ required: true, trim: true, unique: true })
  public email: string;

  @Prop({ required: true, trim: true })
  public firstName: string;

  @Prop({ required: true, trim: true })
  public lastName: string;

  @Prop({ required: true })
  public dateOfBirth: Date;

  @Prop({ required: true, type: String, enum: UserType })
  public userType: UserType;

  @Prop({ required: true, trim: true })
  public passwordHash: string;

  @Prop({ required: true, trim: true })
  public avatarId: string;

  @Prop({ required: true })
  public registeredAt: Date;

  @Prop({ required: true, type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'UserModel' }] })
  public subscriptionIds: mongoose.Types.ObjectId[];

  @Prop({ required: true })
  public followerCount: number;

  @Prop({ required: true })
  public postCount: number;

  @Prop({ required: true, type: String, enum: UserNotificationType })
  public notificationType: UserNotificationType;
}

export const UserSchema = SchemaFactory.createForClass(UserModel);

UserSchema.virtual('id').get(function() {
  return this._id.toHexString();
});
