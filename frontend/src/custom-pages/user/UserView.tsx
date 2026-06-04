import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Navbar from "../../components/layout/Navbar";
import Sidebar from "../../components/layout/Sidebar";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import ImageUpload from "../../components/ui/image-upload";
import { useProfile } from "../../api/user/hooks/useProfile";
import {
  User as UserIcon,
  Mail,
  AtSign,
  Shield,
  Calendar,
  CheckCircle,
  Edit3,
  X,
  Copy,
  Check,
} from "lucide-react";
import { formatFullDateTime } from "../../utils/formatDate";
import toast from "react-hot-toast";

const profileSchema = z.object({
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
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface CopyableFieldProps {
  label: string;
  value?: string | null;
  icon?: any;
}

const CopyableField: React.FC<CopyableFieldProps> = ({ label, value, icon: Icon }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(value || "");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col space-y-1">
      <span className="text-xs font-semibold uppercase tracking-wider text-dark-450">
        {label}
      </span>
      <div className="flex items-center space-x-2 bg-dark-800/40 border border-dark-750 rounded-lg px-3 py-2.5 group">
        {Icon && <Icon className="h-4 w-4 text-dark-500 flex-shrink-0" />}
        <span className="flex-1 text-sm text-dark-200 truncate">{value || "—"}</span>
        <button
          onClick={handleCopy}
          title="Copy"
          className="opacity-0 group-hover:opacity-100 transition-opacity text-dark-500 hover:text-brand-400"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-green-400" /> : <Copy className="h-3.5 w-3.5" />}
        </button>
      </div>
    </div>
  );
};

export const UserView: React.FC = () => {
  const { user, fetchProfile, updateProfile, isLoading: isUpdating } = useProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [avatarBase64, setAvatarBase64] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    reset,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
  });

  // Sync form with user data
  useEffect(() => {
    if (user) {
      reset({
        full_name: user.full_name || "",
        username: user.username || "",
        email: user.email || "",
      });
      setAvatarBase64(user.profile_picture || null);
    } else {
      fetchProfile();
    }
  }, [user, reset]);

  const onSubmit = async (data: ProfileFormValues) => {
    try {
      const payload: any = {
        full_name: data.full_name.trim(),
        username: data.username.trim(),
        email: data.email.trim(),
      };
      if (avatarBase64) {
        payload.profile_picture = avatarBase64;
      }
      await updateProfile(payload);
      toast.success("Profile updated successfully! ✓");
      setIsEditing(false);
    } catch (err: any) {
      const detail = err.response?.data?.detail || "";
      if (detail.toLowerCase().includes("username")) {
        setError("username", { message: "This username is already taken." });
      } else if (detail.toLowerCase().includes("email")) {
        setError("email", { message: "This email is already registered." });
      } else {
        toast.error(detail || "Failed to update profile.");
      }
    }
  };

  const handleCancelEdit = () => {
    reset({
      full_name: user?.full_name || "",
      username: user?.username || "",
      email: user?.email || "",
    });
    setAvatarBase64(user?.profile_picture || null);
    setIsEditing(false);
  };

  const initials = ((user?.full_name || user?.username || "U")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .substring(0, 2)
    .toUpperCase());

  const roleBadgeClass =
    user?.role === "manager"
      ? "bg-brand-500/20 text-brand-400 border border-brand-500/30"
      : "bg-dark-700/60 text-dark-350 border border-dark-700";

  return (
    <div className="min-h-screen bg-dark-950 flex flex-col font-sans">
      <Navbar />

      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 p-6 md:p-8 space-y-6 overflow-y-auto">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center space-x-3">
              <UserIcon className="h-8 w-8 text-brand-500" />
              <span>My Profile</span>
            </h1>
            <p className="text-sm text-dark-400 mt-1.5 font-normal">
              View and manage your personal account information.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Left: Profile Card */}
            <div className="glass-panel rounded-3xl p-6 border border-dark-850 flex flex-col items-center text-center space-y-5">
              {isEditing ? (
                <ImageUpload
                  value={avatarBase64}
                  onChange={setAvatarBase64}
                  initials={initials}
                />
              ) : (
                <div className="relative group">
                  <div className="h-24 w-24 rounded-full overflow-hidden border-2 border-brand-500/40 shadow-xl shadow-brand-500/10">
                    {user?.profile_picture ? (
                      <img
                        src={user.profile_picture}
                        alt="Profile"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full bg-gradient-to-tr from-brand-600 to-indigo-600 flex items-center justify-center text-white font-extrabold text-2xl">
                        {initials}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Name & username */}
              <div>
                <h3 className="text-lg font-bold text-white tracking-wide">
                  {user?.full_name || "No Name Set"}
                </h3>
                <p className="text-sm text-dark-450 mt-0.5">@{user?.username}</p>
              </div>

              {/* Role badge */}
              <span
                className={`text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full ${roleBadgeClass}`}
              >
                {user?.role}
              </span>

              {/* Details */}
              <div className="w-full border-t border-dark-800/80 pt-4 space-y-3 text-left">
                <div className="flex items-start space-x-2.5 text-xs text-dark-400">
                  <Mail className="h-4 w-4 text-dark-500 mt-0.5 flex-shrink-0" />
                  <span className="break-all">{user?.email}</span>
                </div>
                <div className="flex items-center space-x-2.5 text-xs text-dark-400">
                  <Calendar className="h-4 w-4 text-dark-500 flex-shrink-0" />
                  <span>Joined {user?.created_at ? formatFullDateTime(user.created_at) : ""}</span>
                </div>
                <div className="flex items-center space-x-2.5 text-xs text-dark-400">
                  <CheckCircle className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                  <span>Account {user?.is_active ? "Active" : "Inactive"}</span>
                </div>
              </div>

              {/* Edit toggle button (card version) */}
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="w-full mt-1 flex items-center justify-center space-x-2 text-xs font-semibold text-brand-400 hover:text-brand-350 border border-brand-500/30 hover:border-brand-400/50 rounded-xl py-2.5 transition-all duration-200 hover:bg-brand-500/5"
                >
                  <Edit3 className="h-3.5 w-3.5" />
                  <span>Edit Profile</span>
                </button>
              )}
            </div>

            {/* Right: View or Edit Panel */}
            <div className="lg:col-span-2 glass-panel rounded-3xl border border-dark-850 overflow-hidden">
              {/* Panel header */}
              <div className="flex items-center justify-between px-6 md:px-8 py-5 border-b border-dark-800/80">
                <h3 className="text-lg font-bold text-white tracking-wide">
                  {isEditing ? "Edit Profile" : "Account Details"}
                </h3>
                <div className="flex items-center space-x-2">
                  {isEditing ? (
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="flex items-center space-x-1.5 text-xs text-dark-400 hover:text-white border border-dark-700 hover:border-dark-600 rounded-lg px-3 py-1.5 transition-all"
                    >
                      <X className="h-3.5 w-3.5" />
                      <span>Cancel</span>
                    </button>
                  ) : (
                    <Button
                      onClick={() => setIsEditing(true)}
                      className="!py-1.5 !px-4 !text-xs"
                    >
                      <Edit3 className="h-3.5 w-3.5 mr-1.5" />
                      Edit Profile
                    </Button>
                  )}
                </div>
              </div>

              <div className="p-6 md:p-8">
                {isEditing ? (
                  /* Edit Mode */
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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

                    <div className="pt-4 border-t border-dark-800/80 flex items-center justify-end space-x-3">
                      <button
                        type="button"
                        onClick={handleCancelEdit}
                        className="text-sm text-dark-400 hover:text-white border border-dark-700 hover:border-dark-600 rounded-xl px-5 py-2.5 transition-all"
                      >
                        Cancel
                      </button>
                      <Button type="submit" isLoading={isUpdating} className="min-w-[120px]">
                        Save Changes
                      </Button>
                    </div>
                  </form>
                ) : (
                  /* View Mode */
                  <div className="space-y-4">
                    <CopyableField label="Full Name" value={user?.full_name} icon={UserIcon} />
                    <CopyableField label="Username" value={user?.username ? `@${user.username}` : ""} icon={AtSign} />
                    <CopyableField label="Email Address" value={user?.email} icon={Mail} />

                    {/* Role — non-copyable, just display */}
                    <div className="flex flex-col space-y-1">
                      <span className="text-xs font-semibold uppercase tracking-wider text-dark-450">
                        Role
                      </span>
                      <div className="flex items-center space-x-2 bg-dark-800/40 border border-dark-750 rounded-lg px-3 py-2.5">
                        <Shield className="h-4 w-4 text-dark-500" />
                        <span className="text-sm text-dark-200 capitalize">{user?.role}</span>
                        <span
                          className={`ml-auto text-xs font-semibold uppercase tracking-widest px-2.5 py-0.5 rounded-full ${roleBadgeClass}`}
                        >
                          {user?.role}
                        </span>
                      </div>
                    </div>

                    {/* Created at */}
                    <div className="flex flex-col space-y-1">
                      <span className="text-xs font-semibold uppercase tracking-wider text-dark-450">
                        Account Created
                      </span>
                      <div className="flex items-center space-x-2 bg-dark-800/40 border border-dark-750 rounded-lg px-3 py-2.5">
                        <Calendar className="h-4 w-4 text-dark-500" />
                        <span className="text-sm text-dark-200">
                          {user?.created_at ? formatFullDateTime(user.created_at) : ""}
                        </span>
                      </div>
                    </div>

                    {/* Last updated */}
                    {user?.updated_at && (
                      <div className="flex flex-col space-y-1">
                        <span className="text-xs font-semibold uppercase tracking-wider text-dark-450">
                          Last Updated
                        </span>
                        <div className="flex items-center space-x-2 bg-dark-800/40 border border-dark-750 rounded-lg px-3 py-2.5">
                          <CheckCircle className="h-4 w-4 text-dark-500" />
                          <span className="text-sm text-dark-200">
                            {formatFullDateTime(user.updated_at)}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserView;
