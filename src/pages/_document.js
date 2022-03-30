/* eslint-disable max-len */
import React from "react";
import Document, { NextScript, Html, Main, Head } from "next/document";

const scriptTxt = `
(function () {
  const { pathname } = window.location;
  const ipfsMatch = /.*\\/Qm\\w{44}\\//.exec(pathname); 
  const base = document.createElement('base') 
  base.href = ipfsMatch ? ipfsMatch[0] : '/';
  document.head.append(base); 
})();
`;

const gaScriptTxt = `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());

gtag('config', 'UA-194369113-3');
`;

class MyDocument extends Document {
  getPreloadFontsLinks() {
    const fontSizes = [400, 600, 700, 800, 900];
    return fontSizes.map((size) => (
      <link
        rel="preload"
        key={size}
        as="font"
        href={`/fonts/inter-${size}.woff2`}
        type="font/woff2"
        crossOrigin=""
      />
    ));
  }

  render() {
    return (
      <Html lang="en">
        <Head>
          <script dangerouslySetInnerHTML={{ __html: scriptTxt }} />
          <script
            async
            src="https://www.googletagmanager.com/gtag/js?id=UA-194369113-3"
          ></script>
          <script dangerouslySetInnerHTML={{ __html: gaScriptTxt }} />
          <link
            rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
          />
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900"
          ></link>
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=Raleway"
          ></link>
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=Roboto"
          ></link>
          {this.getPreloadFontsLinks()}
          {/* ipfs next.js fix */}
          <style
            dangerouslySetInnerHTML={{
              __html: `
            @font-face {
              font-family: "inter";
              font-display: swap;
              src: url("./fonts/inter-400.woff2") format("woff2"),
              url("./fonts/inter-400.woff") format("woff");
              font-weight: normal;
              font-style: normal;
            } 
          
            @font-face {
              font-family: "inter";
              font-display: swap;
              src: url("./fonts/inter-600.woff2") format("woff2"),
              url("./fonts/inter-600.woff") format("woff");
              font-weight: 600;
              font-style: normal;
            }
            
            @font-face {
              font-family: "inter";
              font-display: swap;
              src: url("./fonts/inter-700.woff2") format("woff2"),
                url("./fonts/inter-700.woff") format("woff");
              font-weight: 700;
              font-style: normal;
            }
          
            @font-face {
              font-family: "inter";
              font-display: swap;
              src: url("./fonts/inter-800.woff2") format("woff2"),
                url("./fonts/inter-800.woff") format("woff");
              font-weight: 800;
              font-style: normal;
            }
            
            @font-face {
              font-family: "inter";
              font-display: swap;
              src: url("./fonts/inter-900.woff2") format("woff2"),
                url("./fonts/inter-900.woff") format("woff");
              font-weight: 900;
              font-style: normal;
            }

            @font-face {
              font-family: "Internal Rainbows";
              src: url("./fonts/Internal Rainbows.otf");
              font-weight: 400;
            }

            @font-face {
              font-family: "Gilroy";
              src: url("./fonts/Gilroy-Light.otf");
              font-weight: 400;
            }
            
            @font-face {
              font-family: "Gilroy";
              src: url("./fonts/Gilroy-ExtraBold.otf");
              font-weight: 700;
            }
            
            @font-face {
              font-family: "Gilroy";
              src: url("./fonts/Gilroy-ExtraBold.otf");
              font-weight: 900;
            }
            @font-face {
              font-family: "Armata";
              src: url("./fonts/Armata-Regular.ttf");
              font-weight: 400;
            }
            @font-face {
              font-family: "Animosa";
              src: url("./fonts/Animosa-Regular.otf");
              font-weight: 400;
            }
            @font-face {
              font-family: "Faction Personal";
              src: url("./fonts/Faction_Outline.otf");
              font-weight: 400;
            }
            @font-face {
              font-family: "THIS FONT IS EMPTY1";
              src: url("./fonts/THIS FONT IS EMPTY1.ttf");
              font-weight: 400;
            }
            @font-face {
              font-family: "Babycakes";
              src: url("./fonts/BABYCAKES.ttf");
              font-weight: 400;
            }
            @font-face {
              font-family: "Fashionism";
              src: url("./fonts/fashl954.ttf");
              font-weight: 400;
            }
            @font-face {
              font-family: "Redmond Fashion";
              src: url("./fonts/RedmondFashion.ttf");
              font-weight: 400;
            }
            @font-face {
              font-family: "Punk Fashion";
              src: url("./fonts/CFPunkFashionPERSONAL-Regul.ttf");
              font-weight: 400;
            }
            @font-face {
              font-family: "Regular Fashion";
              src: url("./fonts/regularfashionDEMO.otf");
              font-weight: 400;
            }
            @font-face {
              font-family: "Just Old Fashion";
              src: url("./fonts/JustOldFashion.ttf");
              font-weight: 400;
            }
            @font-face {
              font-family: "Modular Amplitude";
              src: url("./fonts/Modular Amplitude.otf");
              font-weight: 400;
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
