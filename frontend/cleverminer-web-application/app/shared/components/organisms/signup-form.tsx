import { cn } from '@/lib/utils';
import { Button } from '@/shared/components/ui/atoms/button';
import { Card, CardContent } from '@/shared/components/ui/molecules/card';
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from '@/shared/components/ui/atoms/field';
import { Input } from '@/shared/components/ui/atoms/input';
import { type ComponentProps } from 'react';
import { useRegister } from '@/modules/auth/api/mutations/auth.mutations';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

export const registerSchema = z
  .object({
    email: z.email('Please enter a valid email'),
    username: z.string().min(3, 'Username must be at least 3 characters'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number'),
    confirmPassword: z.string().min(1, 'Confirm password is required'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  });

type SignupFormValues = z.infer<typeof registerSchema>;

export function SignupForm({ className, ...props }: ComponentProps<'div'>) {
  const { mutate: signUp, isPending } = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(registerSchema),
  });

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="">
          <form className="p-6 md:p-8" onSubmit={handleSubmit((data) => signUp(data))}>
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Create your account</h1>
                <p className="text-muted-foreground text-sm text-balance">
                  Enter your email below to create your account
                </p>
              </div>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  {...register('email')}
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
                )}
                <FieldDescription>Email is used to identify your account.</FieldDescription>
              </Field>
              <Field>
                <FieldLabel htmlFor="email">Username</FieldLabel>
                <Input
                  id="username"
                  placeholder="MartinExample"
                  required
                  {...register('username')}
                />
                {errors.username && (
                  <p className="mt-1 text-xs text-red-500">{errors.username.message}</p>
                )}
                <FieldDescription>
                  Username is used for your presence on the platform.
                </FieldDescription>
              </Field>
              <Field>
                <Field className="grid grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <Input id="password" type="password" required {...register('password')} />
                    {errors.password && (
                      <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
                    )}
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="confirm-password">Confirm Password</FieldLabel>
                    <Input
                      id="confirm-password"
                      type="password"
                      required
                      {...register('confirmPassword')}
                    />
                    {errors.confirmPassword && (
                      <p className="mt-1 text-xs text-red-500">{errors.confirmPassword.message}</p>
                    )}
                  </Field>
                </Field>
                <FieldDescription>Must be at least 8 characters long.</FieldDescription>
              </Field>
              <Field>
                <Button type="submit" disabled={isPending}>
                  Create Account
                </Button>
              </Field>
              <FieldDescription className="text-center">
                Already have an account? <a href="/login">Sign in</a>
              </FieldDescription>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our <a href="#">Terms of Service</a> and{' '}
        <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
  );
}
