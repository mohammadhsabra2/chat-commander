import { useState } from "react";
import { motion } from "framer-motion";
import { Shield, Plus, Pencil, Copy, Trash2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { roles } from "@/data/mockData";

const permissionCategories = [
  {
    name: "Tenants",
    permissions: ["View tenants", "Create/edit tenants", "Suspend tenants"],
  },
  {
    name: "AI Assistants",
    permissions: ["View assistants", "Create/edit assistants", "Archive assistants", "Manage channels"],
  },
  {
    name: "Knowledge",
    permissions: ["View knowledge", "Add knowledge", "Edit metadata", "Delete knowledge", "Set access levels"],
  },
  {
    name: "Conversations",
    permissions: ["View logs", "View transcripts", "Export chats", "Moderate chats", "Flag conversations"],
  },
  {
    name: "Users",
    permissions: ["View users", "Invite users", "Restrict users", "Delete user data", "Export users"],
  },
  {
    name: "Analytics",
    permissions: ["View global analytics", "View tenant analytics", "View assistant analytics"],
  },
];

export default function RolesPage() {
  const [selectedRole, setSelectedRole] = useState(roles[4]); // Admin

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="page-header">
        <div>
          <h1 className="page-title">Roles & Permissions</h1>
          <p className="page-description">Manage access control and permission levels</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Role
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Roles List */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Roles</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {roles.map((role) => (
                <button
                  key={role.id}
                  onClick={() => setSelectedRole(role)}
                  className={`w-full px-4 py-3 text-left transition-colors hover:bg-muted/50 ${
                    selectedRole.id === role.id ? "bg-muted" : ""
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{role.name}</p>
                      <p className="text-xs text-muted-foreground">{role.scope} • {role.usersAssigned} users</p>
                    </div>
                    <Shield className="h-4 w-4 text-muted-foreground" />
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Permission Matrix */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base">{selectedRole.name}</CardTitle>
              <p className="text-sm text-muted-foreground">{selectedRole.description}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm"><Copy className="mr-2 h-3 w-3" />Duplicate</Button>
              <Button variant="outline" size="sm"><Pencil className="mr-2 h-3 w-3" />Edit</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {permissionCategories.map((category) => (
                <div key={category.name}>
                  <h4 className="mb-3 text-sm font-medium text-muted-foreground">{category.name}</h4>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {category.permissions.map((permission) => (
                      <div key={permission} className="flex items-center gap-2">
                        <Checkbox checked={selectedRole.name === "Admin"} />
                        <span className="text-sm">{permission}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 flex gap-2">
              <Button>Save Changes</Button>
              <Button variant="outline">Reset Defaults</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
