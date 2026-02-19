import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <SignIn
        appearance={{
          elements: {
            rootBox: "mx-auto",
          },
        }}
        afterSignInUrl="/get-started"
        fallbackRedirectUrl="/get-started"
        signUpUrl="/sign-up"
      />
    </div>
  );
}
