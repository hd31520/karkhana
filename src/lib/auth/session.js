import { getServerSession } from 'next-auth';
import { auth } from '@/lib/firebase/config';
import { signInWithCustomToken } from 'firebase/auth';

export async function getCurrentUser(req, res) {
  try {
    const session = await getServerSession(req, res, authOptions);
    
    if (!session) {
      return null;
    }

    // Verify user exists in our database
    const User = require('@/lib/db/models/User').default;
    await dbConnect();
    
    const user = await User.findOne({ firebaseUid: session.user.uid })
      .populate('tenantId')
      .populate('reportsTo', 'name email');
    
    return user;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

export async function requireAuth(handler, roles = []) {
  return async (req, res) => {
    const user = await getCurrentUser(req, res);
    
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    if (roles.length > 0 && !roles.includes(user.role)) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    
    req.user = user;
    return handler(req, res);
  };
}

export function getTenantIdFromSubdomain(subdomain) {
  // This will be implemented in the API routes
  return subdomain;
}