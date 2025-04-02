import { Injectable } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';
import { IUser } from './interfaces/user.interface';

@Injectable()
export class GoogleAuthService {
  private client: OAuth2Client;

  constructor() {
    this.client = new OAuth2Client(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      'http://localhost:3000/auth/google/callback'
    );
  }

  async verifyToken(token: string): Promise<IUser> {
    try {
      const ticket = await this.client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();
      
      if (!payload) {
        throw new Error('Invalid token payload');
      }

      return {
        email: payload.email || '',
        firstName: payload.given_name || '',
        lastName: payload.family_name || '',
        picture: payload.picture,
      };
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  getAuthUrl(): string {
    return this.client.generateAuthUrl({
      access_type: 'offline',
      scope: [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email',
      ],
    });
  }
} 