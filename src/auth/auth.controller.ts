import { Controller, Get, Post, Body, Res } from '@nestjs/common';
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

  @Post('google/verify')
  async verifyGoogleToken(@Body('token') token: string) {
    try {
      const user = await this.googleAuthService.verifyToken(token);
      return {
        success: true,
        user,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }
} 