import { SignupForm } from '@/shared/components/organisms/signup-form';

export default function RegisterPage() {
  return (
    <div className="bg-cleverminer-three flex w-full items-center justify-center py-10">
      <div className="w-full max-w-sm md:max-w-4xl">
        <SignupForm />
      </div>
    </div>
  );
}
