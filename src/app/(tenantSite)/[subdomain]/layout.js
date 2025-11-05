import PublicLayoutWrapper from '@/components/public/PublicLayoutWrapper';

export default function PublicTenantLayout({ children, params }) {
  return (
    <PublicLayoutWrapper params={params}>
      {children}
    </PublicLayoutWrapper>
  );
}