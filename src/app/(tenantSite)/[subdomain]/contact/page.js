import ContactForm from '@/components/public/ContactForm';
import ContactInfo from '@/components/public/ContactInfo';

async function getTenantContactInfo(subdomain) {
  try {
    const response = await fetch(
      `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/public/${subdomain}/contact`,
      { next: { revalidate: 60 } }
    );
    
    if (!response.ok) {
      return null;
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching contact info:', error);
    return null;
  }
}

export default async function ContactPage({ params }) {
  const { subdomain } = await params;
  const contactData = await getTenantContactInfo(subdomain);

  if (!contactData || !contactData.success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Business Not Found</h1>
          <p className="text-gray-600">The requested business site could not be found.</p>
        </div>
      </div>
    );
  }

  const { tenant } = contactData;

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Contact Us
          </h1>
          <p className="text-xl text-gray-600">
            Get in touch with {tenant.businessName}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Information */}
          <div>
            <ContactInfo tenant={tenant} />
          </div>

          {/* Contact Form */}
          <div>
            <ContactForm subdomain={subdomain} />
          </div>
        </div>
      </div>
    </div>
  );
}