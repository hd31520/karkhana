import DashboardLayoutWrapper from '@/components/dashboard/DashboardLayoutWrapper';

export default function DashboardLayout({ children, params }) {
  return (
    <DashboardLayoutWrapper params={params}>
      {children}
    </DashboardLayoutWrapper>
  );
}