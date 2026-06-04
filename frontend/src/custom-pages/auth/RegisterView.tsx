import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRegister } from "../../api/auth/hooks/useRegister";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { CheckSquare } from "lucide-react";
import toast from "react-hot-toast";

const registerSchema = z
  .object({
    full_name: z
      .string()
      .min(2, "Full name must be at least 2 characters")
      .max(100, "Full name must be less than 100 characters"),
    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .max(30, "Username must be at most 30 characters")
      .regex(
        /^[a-zA-Z0-9_]+$/,
        "Username can only contain letters, numbers, and underscores"
      ),
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirm_password: z.string().min(1, "Please confirm your password"),
    role: z.enum(["manager", "employee"]),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

export const RegisterView: React.FC = () => {
  const { register: registerUser, isLoading } = useRegister();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: "employee",
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      const payload = {
        full_name: data.full_name.trim(),
        username: data.username.trim(),
        email: data.email.trim(),
        password: data.password,
        confirm_password: data.confirm_password,
        role: data.role,
      };
      await registerUser(payload);
      toast.success("Account created! Please sign in.");
      navigate("/login");
    } catch (err: any) {
      const detail = err.response?.data?.detail || "";
      if (detail.toLowerCase().includes("email")) {
        setError("email", { message: "This email is already registered." });
      } else if (detail.toLowerCase().includes("username")) {
        setError("username", { message: "This username is already taken." });
      } else {
        toast.error(detail || "Registration failed. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center dark-gradient px-4 py-10">
      <div className="w-full max-w-md glass-panel rounded-3xl p-8 dark-glow relative overflow-hidden bg-dark-900 border border-dark-850">
        {/* Upper Glow Design Accent */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-brand-500 to-transparent" />

        {/* Brand Header */}
        <div className="flex flex-col items-center mb-6">
          <div className="bg-brand-600 p-3 rounded-2xl text-white shadow-xl shadow-brand-500/25 mb-4">
            <CheckSquare className="h-8 w-8" />
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-wide">Create Account</h2>
          <p className="text-xs text-dark-400 mt-1.5 font-normal">Join TaskFlow and start organizing</p>
        </div>

        {/* Register Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            id="full_name"
            label="Full Name"
            placeholder="e.g. John Doe"
            error={errors.full_name?.message}
            {...register("full_name")}
          />

          <Input
            id="username"
            label="Username"
            placeholder="e.g. johndoe_99"
            error={errors.username?.message}
            {...register("username")}
          />

          <Input
            id="email"
            label="Email Address"
            type="email"
            placeholder="email@example.com"
            error={errors.email?.message}
            {...register("email")}
          />

          <Input
            id="password"
            label="Password"
            type="password"
            placeholder="At least 6 characters"
            error={errors.password?.message}
            {...register("password")}
          />

          <Input
            id="confirm_password"
            label="Confirm Password"
            type="password"
            placeholder="Re-enter your password"
            error={errors.confirm_password?.message}
            {...register("confirm_password")}
          />

          <div className="flex flex-col space-y-1.5">
            <label htmlFor="role" className="text-xs font-semibold uppercase tracking-wider text-dark-450">
              Account Role
            </label>
            <select
              id="role"
              className="glass-input cursor-pointer"
              {...register("role")}
            >
              <option value="employee">Employee</option>
              <option value="manager">Manager (Admin)</option>
            </select>
            {errors.role && (
              <span className="text-xs text-red-450 font-medium mt-0.5">{errors.role.message}</span>
            )}
          </div>

          <Button type="submit" isLoading={isLoading} className="w-full mt-4">
            Create Account
          </Button>
        </form>

        {/* Footer */}
        <div className="mt-6 pt-5 border-t border-dark-800/80 text-center text-xs text-dark-450">
          Already have an account?{" "}
          <Link to="/login" className="text-brand-400 hover:text-brand-350 font-semibold hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterView;
