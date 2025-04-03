import { Controller, Get, Query, Res, Request } from '@nestjs/common';
import { Response } from 'express';
import { GoogleAuthService } from './google-auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly googleAuthService: GoogleAuthService) {}

  @Get('google')
  async googleAuth(@Res() res: Response) {
    const authUrl = this.googleAuthService.getAuthUrl();
    res.redirect(authUrl);
  }

  @Get('google/callback')
  async googleAuthCallback(@Query('code') code: string, @Res() res: Response) {
    try {
      console.log('googleAuthCallback', code);
      const user = await this.googleAuthService.getUserFromCode(code);
      // Here you can create a session or JWT token for the user
      return res.json({
        success: true,
        user,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
} 