import "./globals.css";
import type { AppProps } from "next/app";


export default function RootLayout({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
