import { SocketIoConfig } from "ngx-socket-io";
import { getAccessToken } from "../common/utils/local-storage.utl";

export const SocketConfigOptions: SocketIoConfig = {
  url: "http://localhost:3000",
  options: {
    extraHeaders: {
      Authorization: getAccessToken() || ""
    }
  }
}
