import '../../styles/globals.css';
import { ReactNode } from 'react';
import Nav from '@/components/nav';
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <title>Mythic Media</title>
      <body><Nav />{children}</body>
    </html>
  );
}