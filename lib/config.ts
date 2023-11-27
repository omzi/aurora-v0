import dotenv from 'dotenv';
dotenv.config({});

class Config {
  public NODE_ENV: string;
  public NEXTAUTH_SECRET: string;
  public NEXTAUTH_URL: string;
  public EDGE_STORE_ACCESS_KEY: string;
  public EDGE_STORE_SECRET_KEY: string;
  public GOOGLE_CLIENT_ID: string;
  public GOOGLE_CLIENT_SECRET: string;
  public PAYSTACK_TEST_PK: string;
  public PAYSTACK_TEST_SK: string;
  public DATABASE_URL: string;
  public RESEND_API_KEY: string;
  public IS_PRODUCTION: boolean;

  constructor() {
    this.NODE_ENV = process.env.NODE_ENV || '';
    this.NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET || '';
    this.NEXTAUTH_URL = process.env.NEXTAUTH_URL || '';
    this.EDGE_STORE_ACCESS_KEY = process.env.EDGE_STORE_ACCESS_KEY || '';
    this.EDGE_STORE_SECRET_KEY = process.env.EDGE_STORE_SECRET_KEY || '';
    this.GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';
    this.GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || '';
    this.PAYSTACK_TEST_PK = process.env.PAYSTACK_TEST_PK || '';
    this.PAYSTACK_TEST_SK = process.env.PAYSTACK_TEST_SK || '';
    this.DATABASE_URL = process.env.DATABASE_URL || '';
    this.RESEND_API_KEY = process.env.RESEND_API_KEY || '';
    this.IS_PRODUCTION = this.NODE_ENV === 'production';

    this.validateConfig();
  }

  public validateConfig(): void {
    for (const [key, value] of Object.entries(this)) {
      if (value === undefined || value === 0) {
        throw new Error(`Configuration ${key} is undefined.`);
      }
    }
  }
}

const config: Config = new Config();

export default config;
