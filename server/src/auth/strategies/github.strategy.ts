import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-github2";
import { IGithubProfile } from "src/common/interfaces/github-profile.interface";

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService
  ) {
    super({
      clientID: configService.get<string>("GITHUB_CLIENT_ID", ""),
      clientSecret: configService.get<string>("GITHUB_CLIENT_SECRET", ""),
      callbackURL: "http://localhost:3000/api/auth/github/callback"
    })
  }

  async validate(accessToken: string, refreshToken: string, profile: any, done: any) {
    const { avatar_url, html_url, name, email, login } = profile._json;
    const user: IGithubProfile = {
      username: login,
      fullname: name,
      email,
      github: html_url,
      avatar: avatar_url
    }
    done(null, user);
  }
}