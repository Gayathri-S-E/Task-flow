import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useLogin } from "../../api/auth/hooks/useLogin";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { CheckSquare } from "lucide-react";
import toast from "react-hot-toast";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export const LoginView: React.FC = () => {
  const { login, isLoading } = useLogin();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      await login(data.email, data.password);
      toast.success("Welcome back! 👋");
      navigate("/");
    } catch (err: any) {
      toast.error(err.response?.data?.detail || "Invalid email or password.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center dark-gradient px-4">
      <div className="w-full max-w-md glass-panel rounded-3xl p-8 dark-glow relative overflow-hidden bg-dark-900 border border-dark-850">
        {/* Upper Glow Design Accent */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-brand-500 to-transparent" />

        {/* Brand Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="bg-brand-600 p-3 rounded-2xl text-white shadow-xl shadow-brand-500/25 mb-4">
            <CheckSquare className="h-8 w-8" />
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-wide">Welcome to TaskFlow</h2>
          <p className="text-xs text-dark-400 mt-1.5 font-normal">Sign in to manage your tasks &amp; collaborate</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="relative">
            <Input
              id="email"
              label="Email Address"
              type="email"
              placeholder="email@example.com"
              error={errors.email?.message}
              {...register("email")}
            />
          </div>

          <div className="relative">
            <Input
              id="password"
              label="Password"
              type="password"
              placeholder="Enter your password"
              error={errors.password?.message}
              {...register("password")}
            />
          </div>

          <Button type="submit" isLoading={isLoading} className="w-full mt-3">
            Sign In
          </Button>
        </form>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-dark-800/80 text-center text-xs text-dark-450">
          Don&apos;t have an account?{" "}
          <Link to="/register" className="text-brand-400 hover:text-brand-350 font-semibold hover:underline">
            Sign Up Free
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginView;
