import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  collection: 'refresh-sessions',
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (doc, ret) => {
      delete ret._id;
      delete ret.__v;
    }
  },
  toObject: { virtuals: true }
})
export class RefreshTokenModel extends Document {
  @Prop( { required: true, trim: true })
  public userId: string;

  @Prop({ required: true, trim: true })
  public tokenId: string;

  @Prop({ required: true })
  public expiresIn: Date;

  @Prop()
  public createdAt: Date;
}

export const RefreshTokenSchema = SchemaFactory.createForClass(RefreshTokenModel);

RefreshTokenSchema.virtual('id').get(function() {
  return this._id.toHexString();
});
