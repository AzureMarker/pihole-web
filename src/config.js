import developmentConfig from './config.development';
import productionConfig from './config.production';

let config;
if(process.env.NODE_ENV === "development")
  config = developmentConfig;
else
  config = productionConfig;

if(process.env.REACT_APP_FAKE_API)
  config.fakeAPI = true;

export default config;