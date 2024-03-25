const NODE_ENV = process.env.NODE_ENV || "example";

export const ConfigOptions = {
  isGlobal: true,
  envFilePath: `.env.${NODE_ENV}`
}