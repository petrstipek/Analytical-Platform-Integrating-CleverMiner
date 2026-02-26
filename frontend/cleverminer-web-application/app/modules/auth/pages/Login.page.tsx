import { LoginForm } from '@/shared/components/organisms/login-form';

export default function LoginPage() {
  return (
    <div className="bg-cleverminer-three/90 flex w-full items-center justify-center py-10">
      <div className="w-full max-w-sm md:max-w-4xl">
        <LoginForm />
      </div>
    </div>
  );
}
