/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_ONCOURTS_API_ENDPOINT: process.env.NEXT_PUBLIC_ONCOURTS_API_ENDPOINT,
    NEXT_PUBLIC_ONCOURTS_CITIZEN_APP_ENDPOINT: process.env.NEXT_PUBLIC_ONCOURTS_CITIZEN_APP_ENDPOINT,
    NEXT_PUBLIC_ONCOURTS_EMPLOYEE_APP_ENDPOINT: process.env.NEXT_PUBLIC_ONCOURTS_EMPLOYEE_APP_ENDPOINT,
  },
};

module.exports = nextConfig;
