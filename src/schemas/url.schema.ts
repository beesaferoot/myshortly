import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'

export type UrlDocument = HydratedDocument<Url>

@Schema({ collection: 'urls' })
export class Url {
  @Prop({ required: true })
  shortURL: string
  @Prop({ required: true })
  longURL: string
}

export const UrlSchema = SchemaFactory.createForClass(Url)
