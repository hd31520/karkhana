export default function TenantHero({ tenant }) {
  return (
    <section className="bg-gradient-to-br from-blue-600 to-purple-700 text-white py-20 px-4">
      <div className="container mx-auto text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Welcome to {tenant.businessName}
        </h1>
        <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
          {tenant.contactInfo?.description || 'Your trusted partner for quality products and services'}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a
            href="#products"
            className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors inline-block"
          >
            View Our Products
          </a>
          <a
            href="/contact"
            className="border border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-blue-600 transition-colors inline-block"
          >
            Contact Us
          </a>
        </div>

        {/* Business Info Cards */}
        {tenant.contactInfo && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 max-w-4xl mx-auto">
            {tenant.contactInfo.email && (
              <InfoCard
                icon="📧"
                title="Email Us"
                content={tenant.contactInfo.email}
              />
            )}
            {tenant.contactInfo.phone && (
              <InfoCard
                icon="📞"
                title="Call Us"
                content={tenant.contactInfo.phone}
              />
            )}
            {tenant.contactInfo.address && (
              <InfoCard
                icon="📍"
                title="Visit Us"
                content={tenant.contactInfo.address}
              />
            )}
          </div>
        )}
      </div>
    </section>
  );
}

function InfoCard({ icon, title, content }) {
  return (
    <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-6">
      <div className="text-3xl mb-3">{icon}</div>
      <h3 className="font-semibold mb-2">{title}</h3>
      <p className="opacity-90">{content}</p>
    </div>
  );
}