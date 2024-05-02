import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Profile, Strategy, VerifyCallback } from "passport-google-oauth20";
import { ConfigService } from "@nestjs/config";
import { IGoogleProfile } from "src/common/interfaces/google-profile.interface";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
  ) {
    super({
      clientID: configService.get<string>("GOOGLE_CLIENT_ID", ""),
      clientSecret: configService.get<string>("GOOGLE_CLIENT_SECRET", ""),
      callbackURL: "http://localhost:3000/api/auth/google/callback",
      scope: ["profile", "email"]
    })
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback) {
    const { name, picture, email } = profile._json;
    
    const user: IGoogleProfile = {
      fullname: name,
      email,
      avatar: picture
    }
    done(null, user);
  }
}