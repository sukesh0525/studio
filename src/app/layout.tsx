import type {Metadata} from 'next';
import { Manrope } from 'next/font/google'
import { Toaster } from "@/components/ui/toaster"
import './globals.css';

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-sans',
})

export const metadata: Metadata = {
  title: 'GovConnect',
  description: 'Connecting students and companies with government opportunities.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${manrope.variable} font-sans antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
