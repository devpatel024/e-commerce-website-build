import { redirect } from 'next/navigation'

export default function SignInPage() {
  // Redirect to the unified auth page
  redirect('/auth/login')
}
