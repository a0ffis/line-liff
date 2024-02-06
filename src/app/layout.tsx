import React, { useEffect, useState, useContext, createContext } from "react";
import { Fragment_Mono, Inter } from "next/font/google";
import "./globals.css";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { Fragment } from "react";

const inter = Inter({ subsets: ["latin"] });

function RootLayout({ children }: React.PropsWithChildren) {
  // const [liffObject, setLiffObject] = useState<Liff | null>(null);
  // const [liffError, setLiffError] = useState<string | null>(null);
  // useEffect(() => {
  //   // to avoid `window is not defined` error
  //   import("@line/liff")
  //     .then((liff) => liff.default)
  //     .then((liff) => {
  //       console.log("LIFF init...");
  //       liff
  //         .init({ liffId: "2003144401-M3Wvm39p" })
  //         .then(() => {
  //           console.log("LIFF init succeeded.");
  //           setLiffObject(liff);
  //
  //           // liff.getProfile().then((profile) => {
  //           //   console.log("LIFF getProfile succeeded.");
  //           //   console.log(profile);
  //           // });
  //         })
  //         .catch((error: Error) => {
  //           console.log("LIFF init failed.");
  //           setLiffError(error.toString());
  //         });
  //     });
  // }, []);

  // pageProps.liff = liffObject;
  // pageProps.lifferror = liffError;
  return (
    <html lang="en">
      <body className={inter.className} style={{ scrollBehavior: "smooth" }}>
        <AntdRegistry>{children}</AntdRegistry>
      </body>
    </html>
  );
}
export default RootLayout;
