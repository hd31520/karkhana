import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="md:col-span-2">
            <Link href="/" className="text-2xl font-bold text-white mb-4 inline-block">
              Karkhana.shop
            </Link>
            <p className="text-gray-400 mb-4 max-w-md">
              Empowering businesses with custom subdomains, product showcases, and team management tools. 
              Start your online journey today.
            </p>
            <div className="flex space-x-4">
              <SocialIcon href="#" label="Facebook" />
              <SocialIcon href="#" label="Twitter" />
              <SocialIcon href="#" label="LinkedIn" />
              <SocialIcon href="#" label="Instagram" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><FooterLink href="/#features">Features</FooterLink></li>
              <li><FooterLink href="/#pricing">Pricing</FooterLink></li>
              <li><FooterLink href="/about">About Us</FooterLink></li>
              <li><FooterLink href="/contact">Contact</FooterLink></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li><FooterLink href="/help">Help Center</FooterLink></li>
              <li><FooterLink href="/privacy">Privacy Policy</FooterLink></li>
              <li><FooterLink href="/terms">Terms of Service</FooterLink></li>
              <li><FooterLink href="/contact">Contact Support</FooterLink></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Karkhana.shop. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

// Updated FooterLink component - now returns just the Link, not an li
function FooterLink({ href, children }) {
  return (
    <Link href={href} className="text-gray-400 hover:text-white transition-colors">
      {children}
    </Link>
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