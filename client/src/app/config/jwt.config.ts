import { getAccessToken } from "../common/utils/local-storage.utl";

export const JwtConfigOptions = {
  config: {
    tokenGetter: getAccessToken,
    allowedDomains: ["http://localhost:3000"]
  }
}
