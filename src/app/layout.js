import './globals.css';

export const metadata = {
  title: 'Karkhana.shop',
  description: 'Business platform for subdomain-based eCommerce and team management.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
