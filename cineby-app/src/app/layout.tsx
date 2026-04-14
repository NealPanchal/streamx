import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ErrorBoundary from "@/components/ErrorBoundary";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Cineby - Stream Movies & TV Shows",
    template: "%s | Cineby"
  },
  description: "Discover and stream your favorite movies and TV shows with Cineby",
  keywords: ["movies", "tv shows", "streaming", "watch online", "entertainment"],
  authors: [{ name: "Cineby" }],
  creator: "Cineby",
  publisher: "Cineby",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://cineby.vercel.app'),
  openGraph: {
    title: "Cineby - Stream Movies & TV Shows",
    description: "Discover and stream your favorite movies and TV shows with Cineby",
    type: "website",
    locale: "en_US",
    siteName: "Cineby",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cineby - Stream Movies & TV Shows",
    description: "Discover and stream your favorite movies and TV shows with Cineby",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </body>
    </html>
  );
}
