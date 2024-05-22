import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  collection: 'files',
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
export class FileModel extends Document {
  @Prop({ required: true, trim: true, unique: true })
  public hashName: string;

  @Prop({ required: true, trim: true })
  public originalName: string;

  @Prop({ required: true, trim: true })
  public subDirectory: string;

  @Prop({ required: true, trim: true })
  public mimetype: string;

  @Prop({ required: true, trim: true })
  public path: string;

  @Prop({ required: true })
  public size: number;

  public id?: string;

  public createdAt: Date;

  public updatedAt: Date;
}

export const FileSchema = SchemaFactory.createForClass(FileModel);

FileSchema.virtual('id').get(function() {
  return this._id.toHexString();
});
