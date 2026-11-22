import { requiredRole } from '@/lib/core/server-session';
import React from 'react';


const CustomerDashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  await requiredRole('customer');
  return children;
};

export default CustomerDashboardLayout;
