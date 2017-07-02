import developmentConfig from './config.development';
import productionConfig from './config.production';

let config;
if(process.env.NODE_ENV === "development")
  config = developmentConfig;
else
  config = productionConfig;

export default config;