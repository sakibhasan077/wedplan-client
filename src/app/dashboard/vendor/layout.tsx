import { requiredRole } from '@/lib/core/server-session';
import React from 'react';


const VendorDashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  await requiredRole('vendor');
  return children;
};

export default VendorDashboardLayout;
