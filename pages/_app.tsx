import type { AppProps } from "next/app";
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from "../components/Layout";
import '../styles/globals.css'
import "react-datepicker/dist/react-datepicker.css";
import "../styles/datepicker.css";
import Head from "next/head";
import { pageview } from '../lib/gtag';
import { QueryClient, QueryClientProvider } from "react-query";
// import { initLibraries } from "../libraries/index"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 15 * 60 * 1000,
      cacheTime: 50 * 60 * 1000,
      retry: false,
      // retryDelay: () => Infinity,
      /*
        enable this to have auto retry incase of failure
        retryDelay: attemptIndex => Math.min(1000 * 3 ** attemptIndex, 60000)
       */
    },
  },
});

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      pageview(url);
    };

    router.events.on('routeChangeComplete', handleRouteChange);

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router]);

  useEffect(() => {
    async function fetchData() {
      const lib = await import("../libraries/index");
      await lib.initLibraries(); // only runs on client
    }

    fetchData();
  }, []);


  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <QueryClientProvider client={queryClient}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </QueryClientProvider>
    </>
  );
}
