import Link from 'next/link';

export default function PublicFooter({ subdomain }) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Business Info */}
          <div className="md:col-span-2">
            <Link href={`/${subdomain}`} className="text-2xl font-bold text-white mb-4 inline-block">
              {subdomain}.karkhana.shop
            </Link>
            <p className="text-gray-400 mb-4 max-w-md">
              Professional business website powered by Karkhana.shop - Your complete business solution platform.
            </p>
            <div className="flex space-x-4">
              <SocialIcon href="#" label="Facebook" />
              <SocialIcon href="#" label="Twitter" />
              <SocialIcon href="#" label="Instagram" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href={`/${subdomain}`} className="text-gray-400 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href={`/${subdomain}/products`} className="text-gray-400 hover:text-white transition-colors">
                  Products
                </Link>
              </li>
              <li>
                <Link href={`/${subdomain}/contact`} className="text-gray-400 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href={`/${subdomain}/login`} className="text-gray-400 hover:text-white transition-colors">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Platform Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Powered By</h3>
            <ul className="space-y-2">
              <li>
                <Link href="https://karkhana.shop" className="text-gray-400 hover:text-white transition-colors">
                  Karkhana.shop
                </Link>
              </li>
              <li>
                <Link href="https://karkhana.shop/features" className="text-gray-400 hover:text-white transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link href="https://karkhana.shop/pricing" className="text-gray-400 hover:text-white transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="https://karkhana.shop/contact" className="text-gray-400 hover:text-white transition-colors">
                  Support
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>
            &copy; {currentYear} {subdomain}.karkhana.shop. All rights reserved. 
            {' '}Powered by <a href="https://karkhana.shop" className="text-blue-400 hover:text-blue-300">Karkhana.shop</a>
          </p>
        </div>
      </div>
    </footer>
  );
}

function SocialIcon({ href, label }) {
  return (
    <a 
      href={href} 
      className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors"
      aria-label={label}
    >
      <span className="text-sm font-semibold">{label[0]}</span>
    </a>
  );
}