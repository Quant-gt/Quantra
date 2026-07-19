import { redirect } from 'next/navigation';

export default function SignupRedirectPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  // Preserve tracking query parameters for the new auth page
  const params = new URLSearchParams();
  params.set('mode', 'signup');
  
  if (searchParams.source) {
    params.set('source', String(searchParams.source));
  }
  if (searchParams.reason) {
    params.set('reason', String(searchParams.reason));
  }

  // Perform server-side redirect to the unified auth page
  redirect(`/auth?${params.toString()}`);
}
