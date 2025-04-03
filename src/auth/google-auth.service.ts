import { Injectable } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';
import { IUser } from './interfaces/user.interface';

interface GoogleUserInfo {
  email: string;
  given_name: string;
  family_name: string;
  picture: string;
}

@Injectable()
export class GoogleAuthService {
  private client: OAuth2Client;

  constructor() {
    this.client = new OAuth2Client(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      'http://localhost:3000/auth/google/callback',
    );
  }

  getAuthUrl(): string {
    return this.client.generateAuthUrl({
      // redirect_uri: 'http://localhost:3000/auth/google/callback',
      scope: [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email',
      ],
      access_type: 'offline',
      response_type: 'code',
      prompt: 'consent',
    });
  }

  async getUserFromCode(code: string): Promise<IUser> {
    try {
      const { tokens } = await this.client.getToken(code);
      this.client.setCredentials(tokens);

      const response = await this.client.request({
        url: 'https://www.googleapis.com/oauth2/v3/userinfo',
      });

      return response.data as IUser;
    } catch (error) {
      throw new Error('Failed to authenticate with Google');
    }
  }
} 