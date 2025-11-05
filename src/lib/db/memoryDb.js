// Simple in-memory database for development

// Initialize empty arrays for our data
const users = [];
const tenants = [];
const products = [];
const attendance = [];

// Add demo data directly
tenants.push({
  _id: 'tenant_1',
  subdomain: 'demo',
  businessName: 'Demo Business',
  ownerUid: 'demo-owner',
  subscriptionStatus: 'active',
  contactInfo: {
    email: 'hello@demobusiness.com',
    phone: '+880 1234-567890',
    address: '123 Business Street, Dhaka, Bangladesh'
  },
  createdAt: new Date(),
  updatedAt: new Date(),
  expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
});

products.push({
  _id: 'product_1',
  tenantId: 'tenant_1',
  name: 'Premium Product One',
  description: 'High-quality product with excellent features and reliable performance.',
  price: 2999,
  imageUrl: '',
  category: 'Electronics',
  stock: 50,
  isActive: true,
  features: ['Wireless', 'Bluetooth', 'Long Battery Life'],
  createdAt: new Date(),
  updatedAt: new Date()
});

products.push({
  _id: 'product_2',
  tenantId: 'tenant_1',
  name: 'Business Solution Package',
  description: 'Complete business solution package for small to medium enterprises.',
  price: 14999,
  imageUrl: '',
  category: 'Services',
  stock: 10,
  isActive: true,
  features: ['24/7 Support', 'Customization', 'Training Included'],
  createdAt: new Date(),
  updatedAt: new Date()
});

console.log('Memory database initialized with demo data');

// Simple database methods
export const memoryDb = {
  // Users methods
  users: {
    find: (query = {}) => {
      let results = [...users];
      if (query.email) {
        results = results.filter(user => user.email === query.email);
      }
      if (query.tenantId) {
        results = results.filter(user => user.tenantId === query.tenantId);
      }
      if (query.firebaseUid) {
        results = results.filter(user => user.firebaseUid === query.firebaseUid);
      }
      return {
        populate: () => ({ select: () => results, sort: () => results }),
        select: () => results,
        sort: () => results
      };
    },
    
    findOne: (query) => {
      const results = memoryDb.users.find(query).select();
      return results[0] || null;
    },
    
    create: (data) => {
      const newUser = {
        _id: `user_${users.length + 1}`,
        ...data,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      users.push(newUser);
      return newUser;
    },
    
    findOneAndUpdate: (query, updates, options = {}) => {
      const user = memoryDb.users.findOne(query);
      if (user) {
        Object.assign(user, updates, { updatedAt: new Date() });
        if (options.new) return user;
      }
      return user;
    },
    
    countDocuments: (query = {}) => {
      return memoryDb.users.find(query).select().length;
    }
  },

  // Tenants methods
  tenants: {
    find: (query = {}) => {
      let results = [...tenants];
      if (query.subdomain) {
        results = results.filter(tenant => tenant.subdomain === query.subdomain);
      }
      if (query.ownerUid) {
        results = results.filter(tenant => tenant.ownerUid === query.ownerUid);
      }
      return results;
    },
    
    findOne: (query) => {
      const results = memoryDb.tenants.find(query);
      return results[0] || null;
    },
    
    create: (data) => {
      const newTenant = {
        _id: `tenant_${tenants.length + 1}`,
        ...data,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      tenants.push(newTenant);
      return newTenant;
    },
    
    findByIdAndUpdate: (id, updates, options = {}) => {
      const tenant = tenants.find(t => t._id === id);
      if (tenant) {
        Object.assign(tenant, updates, { updatedAt: new Date() });
        if (options.new) return tenant;
      }
      return tenant;
    },
    
    countDocuments: (query = {}) => {
      return memoryDb.tenants.find(query).length;
    }
  },

  // Products methods
  products: {
    find: (query = {}) => {
      let results = [...products];
      if (query.tenantId) {
        results = results.filter(product => product.tenantId === query.tenantId);
      }
      if (query.isActive !== undefined) {
        results = results.filter(product => product.isActive === query.isActive);
      }
      return results;
    },
    
    findOne: (query) => {
      const results = memoryDb.products.find(query);
      return results[0] || null;
    },
    
    create: (data) => {
      const newProduct = {
        _id: `product_${products.length + 1}`,
        ...data,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      products.push(newProduct);
      return newProduct;
    },
    
    findOneAndUpdate: (query, updates, options = {}) => {
      const product = memoryDb.products.findOne(query);
      if (product) {
        Object.assign(product, updates, { updatedAt: new Date() });
        if (options.new) return product;
      }
      return product;
    },
    
    countDocuments: (query = {}) => {
      return memoryDb.products.find(query).length;
    }
  }
};