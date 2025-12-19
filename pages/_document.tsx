import Document, { Html, Head, Main, NextScript } from "next/document";
import { GA_MEASUREMENT_ID } from "../lib/constants";

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <meta charSet="UTF-8" />
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
          <meta name="robots" content="noindex, nofollow" />
          <link
            href="https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;700&family=Raleway:wght@400;700&display=swap"
            rel="stylesheet"
          />
          {/* Google Analytics */}
          <script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          ></script>
          <script
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_MEASUREMENT_ID}');
              `,
            }}
          />
          {/* Inline fallback script */}
          <script
            dangerouslySetInnerHTML={{
              __html: `
                if (typeof window.globalConfigs === 'undefined') {
                  window.globalConfigs = (function () {
                    var stateTenantId = "kl";
                    var centralInstanceEnabled = false;
                    var localeRegion = "IN";
                    var localeDefault = "en";
                    var mdmsContext = "mdms-v2";

                    var getConfig = function (key) {
                      if (key === "STATE_LEVEL_TENANT_ID") return stateTenantId;
                      if (key === "ENABLE_SINGLEINSTANCE") return centralInstanceEnabled;
                      if (key === "LOCALE_REGION") return localeRegion;
                      if (key === "LOCALE_DEFAULT") return localeDefault;
                      if (key === "MDMS_CONTEXT_PATH") return mdmsContext;
                    };
                    return { getConfig };
                  })();
                }
              `,
            }}
          />

        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
