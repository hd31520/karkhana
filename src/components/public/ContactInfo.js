export default function ContactInfo({ tenant }) {
  const contactInfo = tenant.contactInfo || {};

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Get In Touch</h2>
      
      <div className="space-y-6">
        {contactInfo.email && (
          <ContactItem
            icon="📧"
            title="Email"
            content={contactInfo.email}
            link={`mailto:${contactInfo.email}`}
          />
        )}
        
        {contactInfo.phone && (
          <ContactItem
            icon="📞"
            title="Phone"
            content={contactInfo.phone}
            link={`tel:${contactInfo.phone}`}
          />
        )}
        
        {contactInfo.address && (
          <ContactItem
            icon="📍"
            title="Address"
            content={contactInfo.address}
          />
        )}
        
        {/* Business Hours */}
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-blue-600">🕒</span>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">Business Hours</h3>
            <div className="text-gray-600 space-y-1">
              <div className="flex justify-between">
                <span>Monday - Friday:</span>
                <span>9:00 AM - 6:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span>Saturday:</span>
                <span>10:00 AM - 4:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span>Sunday:</span>
                <span>Closed</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Social Media Links */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <h3 className="font-semibold text-gray-900 mb-4">Follow Us</h3>
        <div className="flex space-x-4">
          <SocialLink href="#" platform="Facebook" />
          <SocialLink href="#" platform="Twitter" />
          <SocialLink href="#" platform="Instagram" />
          <SocialLink href="#" platform="LinkedIn" />
        </div>
      </div>
    </div>
  );
}

function ContactItem({ icon, title, content, link }) {
  const contentElement = link ? (
    <a href={link} className="text-blue-600 hover:text-blue-700 transition-colors">
      {content}
    </a>
  ) : (
    <span>{content}</span>
  );

  return (
    <div className="flex items-start space-x-4">
      <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
        <span className="text-blue-600">{icon}</span>
      </div>
      <div>
        <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
        <p className="text-gray-600">{contentElement}</p>
      </div>
    </div>
  );
}

function SocialLink({ href, platform }) {
  const icons = {
    Facebook: '📘',
    Twitter: '🐦',
    Instagram: '📷',
    LinkedIn: '💼'
  };

  return (
    <a
      href={href}
      className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-blue-100 transition-colors"
      aria-label={platform}
    >
      <span className="text-lg">{icons[platform]}</span>
    </a>
  );
}