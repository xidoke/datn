"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useAuthStore } from "@/stores/authStore";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { PasswordInput } from "@/components/ui/password-input";

export default function SecuritySettings() {
  const [twoFactor, setTwoFactor] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const { changePassword } = useAuthStore();
  const { toast } = useToast();

  const handleChangePassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setPasswordError("");

    const formData = new FormData(e.currentTarget);
    const oldPassword = formData.get("current-password") as string;
    const newPassword = formData.get("new-password") as string;
    const confirmPassword = formData.get("confirm-password") as string;

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match.");
      setIsLoading(false);
      return;
    }

    try {
      await changePassword(oldPassword, newPassword);
      toast({
        title: "Password changed",
        description: "Your password has been successfully updated.",
        variant: "default",
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
          <CardDescription>
            Ensure your account is using a long, random password to stay secure.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">Current Password</Label>
              <PasswordInput
                id="current-password"
                name="current-password"
                type="password"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <PasswordInput
                id="new-password"
                name="new-password"
                type="password"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <PasswordInput
                id="confirm-password"
                name="confirm-password"
                type="password"
                required
              />
            </div>
            {passwordError && (
              <p className="text-sm font-medium text-destructive">
                {passwordError}
              </p>
            )}
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Changing Password
                </>
              ) : (
                "Change Password"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Two-Factor Authentication</CardTitle>
          <CardDescription>
            Add additional security to your account using two-factor
            authentication.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <Switch
              id="two-factor"
              checked={twoFactor}
              onCheckedChange={setTwoFactor}
            />
            <Label htmlFor="two-factor">Enable two-factor authentication</Label>
          </div>
          {twoFactor && (
            <div className="mt-4">
              <p className="mb-2 text-sm text-muted-foreground">
                Two-factor authentication is now enabled. We recommend you save
                your recovery codes.
              </p>
              <Button variant="outline">View Recovery Codes</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
