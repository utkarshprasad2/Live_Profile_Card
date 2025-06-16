interface Config {
  tiktok: {
    clientKey: string;
    clientSecret: string;
    accessToken: string | null;
    refreshToken: string | null;
  };
}

const config: Config = {
  tiktok: {
    clientKey: process.env.NEXT_PUBLIC_TIKTOK_CLIENT_KEY || '',
    clientSecret: process.env.TIKTOK_CLIENT_SECRET || '',
    accessToken: process.env.TIKTOK_ACCESS_TOKEN || null,
    refreshToken: process.env.TIKTOK_REFRESH_TOKEN || null,
  },
};

export default config; 