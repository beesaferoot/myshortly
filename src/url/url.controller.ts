import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Res,
} from '@nestjs/common'
import { Response } from 'express'
import { UrlService } from './url.service'

@Controller('url')
export class UrlController {
  constructor(private readonly urlService: UrlService) {}

  @Post('data/shorten')
  async shortenUrl(@Body() body: { longUrl: string }) {
    const { longUrl } = body

    if (!longUrl) {
      throw new HttpException('longUrl is required', HttpStatus.BAD_REQUEST)
    }

    try {
      const shortUrl = await this.urlService.shortenUrl(longUrl)
      return {
        shortUrl: `${process.env.BASE_URL || 'http://localhost:3000/url'}/${shortUrl.shortURL}`,
      }
    } catch (error) {
      console.error('Failed to shorten URL: ', error)
      throw new HttpException(
        'Failed to shorten URL',
        HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }
  }

  /**
   * Redirect to the original URL based on the short URL
   * GET api/v1/:shortUrl
   */
  @Get(':shortUrl')
  async redirectUrl(@Param('shortUrl') shortUrl: string, @Res() res: Response) {
    try {
      const urlRecord = await this.urlService.resolveShortUrl(shortUrl)

      if (!urlRecord) {
        throw new HttpException('Short URL not found', HttpStatus.NOT_FOUND)
      }

      return res.redirect(urlRecord.longURL)
    } catch (error) {
      console.error('Failed to resolve URL: ', error)
      throw new HttpException(
        'Failed to resolve URL',
        HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }
  }
}
