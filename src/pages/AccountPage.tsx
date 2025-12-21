import { motion } from "framer-motion";
import { User, Mail, Lock, Shield, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AccountPage() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="page-header">
        <div>
          <h1 className="page-title">Account</h1>
          <p className="page-description">Manage your profile and security settings</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <User className="h-4 w-4" /> Member Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label>Name</Label>
              <Input defaultValue="Admin User" />
            </div>
            <div className="grid gap-2">
              <Label>Email</Label>
              <Input defaultValue="admin@chatbothub.com" type="email" />
            </div>
            <div className="grid gap-2">
              <Label>Password</Label>
              <div className="flex gap-2">
                <Input defaultValue="••••••••••••" type="password" disabled className="flex-1" />
                <Button variant="outline">Change Password</Button>
              </div>
            </div>
            <Button>Save Changes</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Shield className="h-4 w-4" /> Role & Access
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border border-border bg-muted/30 p-4">
              <p className="text-sm font-medium">Current Role</p>
              <p className="text-2xl font-semibold text-primary">Global Admin</p>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>Last login: Today at 9:45 AM</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>Active sessions: 2 devices</span>
              </div>
            </div>
            <Button variant="outline" className="w-full">Sign out of other sessions</Button>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
