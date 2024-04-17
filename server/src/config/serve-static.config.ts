import { join } from "path";

export const ServeStaticOptions = {
  rootPath: join(__dirname, "..", "..", "resources"),
  serveRoot: "/public"  
}