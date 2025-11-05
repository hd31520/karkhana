import './globals.css';

export const metadata = {
  title: 'Karkhana.shop - Your Business Platform',
  description: 'Create your own subdomain and manage your business efficiently',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}