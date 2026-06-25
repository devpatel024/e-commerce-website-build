import AdminLayout from '@/components/AdminLayout'

export const metadata = {
  title: 'Admin Dashboard - LUXE',
  description: 'Manage your LUXE store',
}

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AdminLayout>{children}</AdminLayout>
}
