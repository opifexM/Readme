import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  collection: 'email-schedule',
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
export class EmailScheduleModel extends Document {
  @Prop({ required: true, trim: true })
  public lastPostDate: Date;

  public id?: string;
}

export const EmailScheduleSchema = SchemaFactory.createForClass(EmailScheduleModel);

EmailScheduleSchema.virtual('id').get(function() {
  return this._id.toHexString();
});
