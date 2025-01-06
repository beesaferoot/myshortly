import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Url } from 'src/schemas/url.schema'
import idGenerator from 'src/utils/idGen'

@Injectable()
export class UrlService {
  constructor(@InjectModel(Url.name) private urlModel: Model<Url>) {}

  /**
   * Stores a URL in the database and returns the shortened version.
   */
  async shortenUrl(originalUrl: string): Promise<Url> {
    // Check if the URL already exists
    const existingUrl = await this.getShortURL(originalUrl)
    if (existingUrl) {
      return existingUrl
    }

    // Generate a unique short ID
    const shortId = idGenerator.generateId()

    // Store in the database
    const newUrl = new this.urlModel({
      longURL: originalUrl,
      shortURL: shortId,
      createdAt: new Date(),
    })
    return await newUrl.save()
  }

  /**
   * Retrieves a URL document based on its original URL.
   */
  private async getShortURL(originalUrl: string): Promise<null | Url> {
    return await this.urlModel.findOne({ originalUrl }).exec()
  }

  /**
   * Resolves a shortened URL back to its original URL.
   */
  async resolveShortUrl(url: string): Promise<null | Url> {
    return await this.urlModel.findOne({ shortURL: url }).exec()
  }
}
