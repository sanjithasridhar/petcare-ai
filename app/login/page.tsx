import { AuthForm } from "@/app/components/auth-form";
import { safeReturnPath } from "@/lib/auth-redirect";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string | string[] }>;
}) {
  const { callbackUrl } = await searchParams;
  return <AuthForm callbackUrl={safeReturnPath(callbackUrl)} mode="login" />;
}