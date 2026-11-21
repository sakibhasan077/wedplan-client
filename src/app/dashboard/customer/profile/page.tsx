import type { Metadata } from "next";
import ProfileSettingsForm from "@/components/profile/ProfileSettingsForm";

export const metadata: Metadata = {
  title: "Profile Settings - WedPlan",
  description: "Manage your personal account details and profile image.",
};

const ProfileSettingPage = async () => {
  return (
    <main className="px-6 pt-5">
      <header>
        <h1 className="font-heading text-[30px] leading-tight font-semibold">
          Profile Settings
        </h1>
        <p className="mt-1 text-[14px] leading-5 text-muted-foreground">
          Keep your details up to date so customers can recognise you.
        </p>
      </header>

      <ProfileSettingsForm />
    </main>
  );
};

export default ProfileSettingPage;