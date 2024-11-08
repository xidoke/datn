"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  timezone: string;
  language: string;
  displayName: string;
}

export default function ProfileSettings() {
  const [profile, setProfile] = useState<UserProfile>({
    firstName: "Do",
    lastName: "Pham Dinh",
    email: "do.pd200154@sis.hust.edu.vn",
    role: "Product / Project Manager",
    timezone: "UTC",
    language: "English (US)",
    displayName: "do.pd200154",
  });

  const handleSave = () => {
    // Handle save profile changes
    console.log("Saving profile:", profile);
  };

  return (
    <div>
      {/* Cover Image */}
      <div className="relative h-48">
        <img
          src="/placeholder.svg?height=192&width=1024"
          alt="Cover"
          className="h-full w-full object-cover"
        />
        <Button variant="secondary" className="absolute bottom-4 right-4">
          Change cover
        </Button>
      </div>

      {/* Profile Form */}
      <div className="mx-auto max-w-4xl p-6">
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>
              Update your profile information and settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First name</Label>
                <Input
                  id="firstName"
                  value={profile.firstName}
                  onChange={(e) =>
                    setProfile({ ...profile, firstName: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last name</Label>
                <Input
                  id="lastName"
                  value={profile.lastName}
                  onChange={(e) =>
                    setProfile({ ...profile, lastName: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={profile.email}
                onChange={(e) =>
                  setProfile({ ...profile, email: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select
                value={profile.role}
                onValueChange={(value) =>
                  setProfile({ ...profile, role: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Product / Project Manager">
                    Product / Project Manager
                  </SelectItem>
                  <SelectItem value="Developer">Developer</SelectItem>
                  <SelectItem value="Designer">Designer</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Select
                  value={profile.timezone}
                  onValueChange={(value) =>
                    setProfile({ ...profile, timezone: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="UTC">UTC</SelectItem>
                    <SelectItem value="GMT+7">GMT+7</SelectItem>
                    <SelectItem value="GMT+8">GMT+8</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <Select
                  value={profile.language}
                  onValueChange={(value) =>
                    setProfile({ ...profile, language: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="English (US)">English (US)</SelectItem>
                    <SelectItem value="Vietnamese">Vietnamese</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="displayName">Display name</Label>
              <Input
                id="displayName"
                value={profile.displayName}
                onChange={(e) =>
                  setProfile({ ...profile, displayName: e.target.value })
                }
              />
            </div>

            <Button onClick={handleSave}>Save changes</Button>

            <Separator className="my-6" />

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium">Deactivate account</h3>
                <p className="text-sm text-muted-foreground">
                  Permanently remove your account and all of its contents from
                  the platform. This action is not reversible, so please
                  continue with caution.
                </p>
              </div>
              <Button variant="destructive">Deactivate account</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
