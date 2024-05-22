import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  collection: 'email-subscribers',
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
export class EmailSubscriberModel extends Document {
  @Prop({ required: true, trim: true })
  public email: string;

  @Prop({ required: true, trim: true })
  public firstName: string;

  @Prop({ required: true, trim: true })
  public lastName: string;

  public id?: string;
}

export const EmailSubscriberSchema = SchemaFactory.createForClass(EmailSubscriberModel);

EmailSubscriberSchema.virtual('id').get(function() {
  return this._id.toHexString();
});
