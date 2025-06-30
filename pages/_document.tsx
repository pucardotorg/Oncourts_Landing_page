import Document, { Html, Head, Main, NextScript } from "next/document";
import { GA_MEASUREMENT_ID, GLOBAL_CONFIG_URL } from "../lib/constants";

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <meta charSet="UTF-8" />
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
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
          <script
            src={GLOBAL_CONFIG_URL}
            defer
            onError={() => {
              console.warn("External globalconfig.js failed, falling back to local config");
            }}
          />
          {/* Inline fallback script */}
          <script
            dangerouslySetInnerHTML={{
              __html: `
              window.addEventListener('load', function () {
                // If external script didn't load globalConfigs, define fallback
                if (typeof globalConfigs === 'undefined') {
                  window.globalConfigs = (function () {
                    var stateTenantId = "kl";
                    var centralInstanceEnabled = false;
                    var localeRegion = "IN";
                    var localeDefault = "en";
                    var mdmsContext = "mdms-v2";
                    
                    var getConfig = function (key) {
                      if (key === "STATE_LEVEL_TENANT_ID") {
                        return stateTenantId;
                      } else if (key === "ENABLE_SINGLEINSTANCE") {
                        return centralInstanceEnabled;
                      } else if (key === "LOCALE_REGION") {
                        return localeRegion;
                      } else if (key === "LOCALE_DEFAULT") {
                        return localeDefault;
                      } else if (key === "MDMS_CONTEXT_PATH") {
                        return mdmsContext;
                      }
                    };
                    return {
                      getConfig,
                    };
                  })();
                }
              });
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
