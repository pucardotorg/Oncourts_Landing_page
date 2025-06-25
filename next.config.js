/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_ONCOURTS_API_ENDPOINT:
      process.env.NEXT_PUBLIC_ONCOURTS_API_ENDPOINT,
    NEXT_PUBLIC_ONCOURTS_CITIZEN_APP_ENDPOINT: `${process.env.NEXT_PUBLIC_ONCOURTS_API_ENDPOINT}/ui/citizen/login`,
    NEXT_PUBLIC_ONCOURTS_EMPLOYEE_APP_ENDPOINT: `${process.env.NEXT_PUBLIC_ONCOURTS_API_ENDPOINT}/ui/employee/login`,
    NEXT_PUBLIC_ONCOURTS_CITIZEN_DRISTI_ENDPOINT: `${process.env.NEXT_PUBLIC_ONCOURTS_API_ENDPOINT}/ui/citizen/dristi/home/login`,
    NEXT_PUBLIC_ONCOURTS_EMPLOYEE_USER_ENDPOINT: `${process.env.NEXT_PUBLIC_ONCOURTS_API_ENDPOINT}/ui/employee/user/login`,
  },
  async rewrites() {
    const apiEndpoint = process.env.NEXT_PUBLIC_ONCOURTS_API_ENDPOINT;
    return [
      // Proxy API routes to avoid CORS issues
      {
        source: "/api/scheduler/:path*",
        destination: `${apiEndpoint}/scheduler/:path*`,
      },
      {
        source: "/api/openapi/:path*",
        destination: `${apiEndpoint}/openapi/:path*`,
      },
      {
        source: "/api/egov-mdms-service/:path*",
        destination: `${apiEndpoint}/egov-mdms-service/:path*`,
      },
      {
        source: "/egov-mdms-service/v1/_search/:path*",
        destination: `${apiEndpoint}/egov-mdms-service/v1/_search/:path*`,
      },
      {
        source: "/localization/messages/v1/_search/:path*",
        destination: `${apiEndpoint}/localization/messages/v1/_search/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
