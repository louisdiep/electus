import dotenv from 'dotenv'

dotenv.config();

interface Config {
    port: number;
    nodeEnv: string
}

// This is the PORT the server will run on.
// Loads in variables from .env file
const config: Config = {
    port: Number(process.env.PORT) || 3000,
    nodeEnv: process.env.NODE_ENV || 'development',
  };
  
  export default config;