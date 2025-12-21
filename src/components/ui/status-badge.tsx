import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: "active" | "draft" | "suspended" | "ready" | "processing" | "error" | "ended" | "restricted" | "deactivated";
  className?: string;
}

const statusStyles: Record<string, string> = {
  active: "badge-status-active",
  draft: "badge-status-draft",
  suspended: "badge-status-suspended",
  ready: "badge-status-ready",
  processing: "badge-status-processing",
  error: "badge-status-error",
  ended: "bg-muted text-muted-foreground",
  restricted: "bg-warning/10 text-warning",
  deactivated: "bg-muted text-muted-foreground",
};

const statusLabels: Record<string, string> = {
  active: "Active",
  draft: "Draft",
  suspended: "Suspended",
  ready: "Ready",
  processing: "Processing",
  error: "Error",
  ended: "Ended",
  restricted: "Restricted",
  deactivated: "Deactivated",
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span className={cn("badge-status", statusStyles[status], className)}>
      {statusLabels[status]}
    </span>
  );
}

interface AccessLevelBadgeProps {
  level: "public" | "employee" | "executive";
  className?: string;
}

const accessStyles: Record<string, string> = {
  public: "bg-chart-2/10 text-chart-2",
  employee: "bg-chart-1/10 text-chart-1",
  executive: "bg-chart-4/10 text-chart-4",
};

export function AccessLevelBadge({ level, className }: AccessLevelBadgeProps) {
  return (
    <span className={cn("badge-status capitalize", accessStyles[level], className)}>
      {level}
    </span>
  );
}

interface ChannelBadgeProps {
  channel: "website" | "teams" | "whatsapp" | "telegram";
  className?: string;
}

const channelStyles: Record<string, string> = {
  website: "bg-chart-1/10 text-chart-1",
  teams: "bg-chart-4/10 text-chart-4",
  whatsapp: "bg-chart-2/10 text-chart-2",
  telegram: "bg-chart-3/10 text-chart-3",
};

export function ChannelBadge({ channel, className }: ChannelBadgeProps) {
  return (
    <span className={cn("badge-status capitalize", channelStyles[channel], className)}>
      {channel}
    </span>
  );
}

interface RoleBadgeProps {
  role: "admin" | "moderator" | "employee" | "guest" | "executive";
  className?: string;
}

const roleStyles: Record<string, string> = {
  admin: "bg-destructive/10 text-destructive",
  moderator: "bg-warning/10 text-warning",
  employee: "bg-chart-1/10 text-chart-1",
  guest: "bg-muted text-muted-foreground",
  executive: "bg-chart-4/10 text-chart-4",
};

export function RoleBadge({ role, className }: RoleBadgeProps) {
  return (
    <span className={cn("badge-status capitalize", roleStyles[role], className)}>
      {role}
    </span>
  );
}
