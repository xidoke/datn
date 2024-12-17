import { FC } from "react";
import { Shield, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import Link from "next/link";

const AdminAccessRequired: FC = () => {
  return (
    <div className="flex min-h-screen items-center justify-center ">
      <Card className="w-[350px] text-center">
        <CardHeader>
          <div className="mb-4 flex justify-center">
            <Shield className="h-12 w-12 text-yellow-500" />
          </div>
          <CardTitle className="text-2xl font-bold">
            Admin Access Required
          </CardTitle>
          <CardDescription>
            You need to be an admin to view this page.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm">
            If you believe you should have access to this page, please contact
            your system administrator.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Link href="/" passHref>
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AdminAccessRequired;
