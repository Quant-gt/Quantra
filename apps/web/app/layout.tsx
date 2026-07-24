import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SigmaSpire | Zero-Latency Systematic Trading Terminal India",
  description: "SigmaSpire is the institutional-grade systematic trading platform for Indian retail traders. Build, backtest & deploy zero-latency quant strategies on the NSE.",
  verification: {
    google: "6Zqx3liPNQvjN1kCU-oacdy0ux2GLXtK8ocw2bmUbNU",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script async src="https://www.googletagmanager.com/gtag/js?id=G-Z8MV34ZXT5" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-Z8MV34ZXT5');
          `}
        </Script>
      </head>
      <body suppressHydrationWarning className={`${inter.className} bg-[#0D1117] text-white`}>
        {children}
        <Toaster theme="dark" position="bottom-right" richColors />
      </body>
    </html>
  );
}

