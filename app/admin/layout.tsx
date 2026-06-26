import AdminLayout from '@/components/AdminLayout'

export const metadata = {
  title: 'Admin Dashboard - ADs',
  description: 'Manage your ADs store',
}

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AdminLayout>{children}</AdminLayout>
}
