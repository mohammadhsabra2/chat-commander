// Mock data for the Chatbot Management Portal

export interface Tenant {
  id: string;
  name: string;
  domain: string;
  assistantsCount: number;
  usersCount: number;
  status: "active" | "suspended";
  createdAt: string;
}

export interface AIAssistant {
  id: string;
  name: string;
  tenantId: string;
  tenantName: string;
  status: "active" | "draft";
  conversations30d: number;
  avgSatisfaction: number;
  knowledgeReady: number;
  knowledgeProcessing: number;
  knowledgeError: number;
  lastModified: string;
  description: string;
  instructions: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "moderator" | "employee" | "guest";
  organization: string;
  tenantId: string;
  totalConversations: number;
  lastActive: string;
  status: "active" | "restricted" | "deactivated";
  emailVerified: boolean;
  mobileVerified: boolean;
}

export interface Conversation {
  id: string;
  userId: string;
  userName: string;
  userRole: string;
  organization: string;
  assistantId: string;
  assistantName: string;
  channel: "website" | "teams" | "whatsapp" | "telegram";
  status: "active" | "ended";
  moderated: boolean;
  satisfactionScore: number | null;
  timestamp: string;
  messagesCount: number;
}

export interface KnowledgeItem {
  id: string;
  name: string;
  type: "file" | "url" | "sharepoint" | "onedrive" | "gdrive";
  assistantId: string;
  assistantName: string;
  status: "ready" | "processing" | "error";
  accessLevel: "public" | "employee" | "executive";
  lastModified: string;
}

export interface Role {
  id: string;
  name: string;
  scope: "global" | "tenant";
  usersAssigned: number;
  description: string;
  permissions: Record<string, boolean>;
}

// Tenants
export const tenants: Tenant[] = [
  { id: "t1", name: "Acme Corporation", domain: "acme.com", assistantsCount: 5, usersCount: 150, status: "active", createdAt: "2024-01-15" },
  { id: "t2", name: "TechStart Inc", domain: "techstart.io", assistantsCount: 3, usersCount: 45, status: "active", createdAt: "2024-02-20" },
  { id: "t3", name: "Global Finance Ltd", domain: "globalfinance.com", assistantsCount: 8, usersCount: 320, status: "active", createdAt: "2024-01-05" },
  { id: "t4", name: "HealthCare Plus", domain: "healthcareplus.org", assistantsCount: 4, usersCount: 89, status: "active", createdAt: "2024-03-10" },
  { id: "t5", name: "RetailMax", domain: "retailmax.com", assistantsCount: 2, usersCount: 67, status: "suspended", createdAt: "2024-02-01" },
  { id: "t6", name: "EduLearn Systems", domain: "edulearn.edu", assistantsCount: 6, usersCount: 234, status: "active", createdAt: "2024-01-20" },
];

// AI Assistants
export const assistants: AIAssistant[] = [
  { id: "a1", name: "Customer Support Bot", tenantId: "t1", tenantName: "Acme Corporation", status: "active", conversations30d: 1250, avgSatisfaction: 4.2, knowledgeReady: 45, knowledgeProcessing: 3, knowledgeError: 1, lastModified: "2024-03-15", description: "Handles customer inquiries", instructions: "Be helpful and professional" },
  { id: "a2", name: "Sales Assistant", tenantId: "t1", tenantName: "Acme Corporation", status: "active", conversations30d: 890, avgSatisfaction: 4.5, knowledgeReady: 32, knowledgeProcessing: 0, knowledgeError: 0, lastModified: "2024-03-14", description: "Helps with sales queries", instructions: "Focus on product benefits" },
  { id: "a3", name: "HR Helper", tenantId: "t1", tenantName: "Acme Corporation", status: "draft", conversations30d: 0, avgSatisfaction: 0, knowledgeReady: 12, knowledgeProcessing: 5, knowledgeError: 0, lastModified: "2024-03-18", description: "Internal HR assistant", instructions: "Be confidential and accurate" },
  { id: "a4", name: "Tech Support Bot", tenantId: "t2", tenantName: "TechStart Inc", status: "active", conversations30d: 567, avgSatisfaction: 3.9, knowledgeReady: 28, knowledgeProcessing: 2, knowledgeError: 2, lastModified: "2024-03-12", description: "Technical troubleshooting", instructions: "Provide step-by-step solutions" },
  { id: "a5", name: "Onboarding Assistant", tenantId: "t2", tenantName: "TechStart Inc", status: "active", conversations30d: 234, avgSatisfaction: 4.7, knowledgeReady: 18, knowledgeProcessing: 0, knowledgeError: 0, lastModified: "2024-03-16", description: "Helps new users get started", instructions: "Be welcoming and clear" },
  { id: "a6", name: "Financial Advisor Bot", tenantId: "t3", tenantName: "Global Finance Ltd", status: "active", conversations30d: 2100, avgSatisfaction: 4.3, knowledgeReady: 89, knowledgeProcessing: 4, knowledgeError: 1, lastModified: "2024-03-17", description: "Investment guidance", instructions: "Provide accurate financial information" },
  { id: "a7", name: "Loan Calculator", tenantId: "t3", tenantName: "Global Finance Ltd", status: "active", conversations30d: 1560, avgSatisfaction: 4.1, knowledgeReady: 25, knowledgeProcessing: 0, knowledgeError: 0, lastModified: "2024-03-10", description: "Loan calculations and info", instructions: "Be precise with numbers" },
  { id: "a8", name: "Patient Care Bot", tenantId: "t4", tenantName: "HealthCare Plus", status: "active", conversations30d: 445, avgSatisfaction: 4.6, knowledgeReady: 67, knowledgeProcessing: 8, knowledgeError: 0, lastModified: "2024-03-18", description: "Patient support and scheduling", instructions: "Be compassionate and clear" },
];

// Users
export const users: User[] = [
  { id: "u1", name: "John Smith", email: "john.smith@acme.com", role: "admin", organization: "Acme Corporation", tenantId: "t1", totalConversations: 45, lastActive: "2024-03-18", status: "active", emailVerified: true, mobileVerified: true },
  { id: "u2", name: "Sarah Johnson", email: "sarah.j@acme.com", role: "employee", organization: "Acme Corporation", tenantId: "t1", totalConversations: 128, lastActive: "2024-03-18", status: "active", emailVerified: true, mobileVerified: false },
  { id: "u3", name: "Mike Chen", email: "mike.chen@techstart.io", role: "admin", organization: "TechStart Inc", tenantId: "t2", totalConversations: 67, lastActive: "2024-03-17", status: "active", emailVerified: true, mobileVerified: true },
  { id: "u4", name: "Emily Davis", email: "emily.d@globalfinance.com", role: "moderator", organization: "Global Finance Ltd", tenantId: "t3", totalConversations: 234, lastActive: "2024-03-18", status: "active", emailVerified: true, mobileVerified: true },
  { id: "u5", name: "Alex Wilson", email: "alex.w@healthcareplus.org", role: "employee", organization: "HealthCare Plus", tenantId: "t4", totalConversations: 89, lastActive: "2024-03-16", status: "restricted", emailVerified: true, mobileVerified: false },
  { id: "u6", name: "Guest User 1", email: "guest1@email.com", role: "guest", organization: "External", tenantId: "t1", totalConversations: 5, lastActive: "2024-03-15", status: "active", emailVerified: false, mobileVerified: false },
  { id: "u7", name: "David Brown", email: "david.b@acme.com", role: "employee", organization: "Acme Corporation", tenantId: "t1", totalConversations: 56, lastActive: "2024-03-14", status: "deactivated", emailVerified: true, mobileVerified: true },
  { id: "u8", name: "Lisa Park", email: "lisa.p@edulearn.edu", role: "admin", organization: "EduLearn Systems", tenantId: "t6", totalConversations: 178, lastActive: "2024-03-18", status: "active", emailVerified: true, mobileVerified: true },
];

// Conversations
export const conversations: Conversation[] = [
  { id: "c1", userId: "u2", userName: "Sarah Johnson", userRole: "employee", organization: "Acme Corporation", assistantId: "a1", assistantName: "Customer Support Bot", channel: "website", status: "ended", moderated: false, satisfactionScore: 4, timestamp: "2024-03-18T14:30:00", messagesCount: 12 },
  { id: "c2", userId: "u2", userName: "Sarah Johnson", userRole: "employee", organization: "Acme Corporation", assistantId: "a2", assistantName: "Sales Assistant", channel: "teams", status: "active", moderated: false, satisfactionScore: null, timestamp: "2024-03-18T15:45:00", messagesCount: 5 },
  { id: "c3", userId: "u4", userName: "Emily Davis", userRole: "moderator", organization: "Global Finance Ltd", assistantId: "a6", assistantName: "Financial Advisor Bot", channel: "website", status: "ended", moderated: true, satisfactionScore: 5, timestamp: "2024-03-18T10:15:00", messagesCount: 18 },
  { id: "c4", userId: "u6", userName: "Guest User 1", userRole: "guest", organization: "External", assistantId: "a1", assistantName: "Customer Support Bot", channel: "whatsapp", status: "ended", moderated: false, satisfactionScore: 3, timestamp: "2024-03-17T09:20:00", messagesCount: 8 },
  { id: "c5", userId: "u5", userName: "Alex Wilson", userRole: "employee", organization: "HealthCare Plus", assistantId: "a8", assistantName: "Patient Care Bot", channel: "website", status: "ended", moderated: true, satisfactionScore: 2, timestamp: "2024-03-17T16:00:00", messagesCount: 15 },
  { id: "c6", userId: "u3", userName: "Mike Chen", userRole: "admin", organization: "TechStart Inc", assistantId: "a4", assistantName: "Tech Support Bot", channel: "telegram", status: "active", moderated: false, satisfactionScore: null, timestamp: "2024-03-18T11:30:00", messagesCount: 3 },
];

// Knowledge Items
export const knowledgeItems: KnowledgeItem[] = [
  { id: "k1", name: "Product Manual v2.pdf", type: "file", assistantId: "a1", assistantName: "Customer Support Bot", status: "ready", accessLevel: "public", lastModified: "2024-03-15" },
  { id: "k2", name: "FAQ Database.xlsx", type: "file", assistantId: "a1", assistantName: "Customer Support Bot", status: "ready", accessLevel: "public", lastModified: "2024-03-14" },
  { id: "k3", name: "Internal Policies.docx", type: "sharepoint", assistantId: "a3", assistantName: "HR Helper", status: "processing", accessLevel: "employee", lastModified: "2024-03-18" },
  { id: "k4", name: "https://docs.acme.com/api", type: "url", assistantId: "a4", assistantName: "Tech Support Bot", status: "ready", accessLevel: "public", lastModified: "2024-03-12" },
  { id: "k5", name: "Executive Reports Q1", type: "onedrive", assistantId: "a6", assistantName: "Financial Advisor Bot", status: "ready", accessLevel: "executive", lastModified: "2024-03-10" },
  { id: "k6", name: "Training Videos", type: "gdrive", assistantId: "a5", assistantName: "Onboarding Assistant", status: "error", accessLevel: "employee", lastModified: "2024-03-16" },
];

// Roles
export const roles: Role[] = [
  { id: "r1", name: "Guest/Anonymous", scope: "global", usersAssigned: 45, description: "Public access only", permissions: { viewPublicKnowledge: true } },
  { id: "r2", name: "Employee", scope: "global", usersAssigned: 520, description: "Standard employee access", permissions: { viewPublicKnowledge: true, viewEmployeeKnowledge: true, startConversations: true } },
  { id: "r3", name: "Executive", scope: "global", usersAssigned: 35, description: "Executive-level access", permissions: { viewPublicKnowledge: true, viewEmployeeKnowledge: true, viewExecutiveKnowledge: true, startConversations: true } },
  { id: "r4", name: "Moderator", scope: "global", usersAssigned: 12, description: "Can moderate conversations", permissions: { viewPublicKnowledge: true, viewEmployeeKnowledge: true, moderateChats: true, viewLogs: true } },
  { id: "r5", name: "Admin", scope: "global", usersAssigned: 8, description: "Full administrative access", permissions: { all: true } },
  { id: "r6", name: "Tenant Admin", scope: "tenant", usersAssigned: 24, description: "Tenant-level administration", permissions: { manageTenantUsers: true, manageTenantAssistants: true, viewTenantAnalytics: true } },
];

// Dashboard metrics
export const dashboardMetrics = {
  totalTenants: 6,
  totalAssistants: 8,
  totalUsers: 905,
  totalConversations: 15234,
  totalMessages: 89567,
  avgSatisfaction: 4.2,
  flaggedConversations: 23,
  knowledgeReady: 316,
  knowledgeProcessing: 22,
  knowledgeError: 4,
};

// Chart data
export const conversationsPerDay = [
  { date: "Mar 12", count: 245 },
  { date: "Mar 13", count: 312 },
  { date: "Mar 14", count: 289 },
  { date: "Mar 15", count: 356 },
  { date: "Mar 16", count: 198 },
  { date: "Mar 17", count: 423 },
  { date: "Mar 18", count: 387 },
];

export const messagesPerDay = [
  { date: "Mar 12", count: 1456 },
  { date: "Mar 13", count: 1823 },
  { date: "Mar 14", count: 1654 },
  { date: "Mar 15", count: 2134 },
  { date: "Mar 16", count: 1234 },
  { date: "Mar 17", count: 2567 },
  { date: "Mar 18", count: 2345 },
];

export const channelDistribution = [
  { name: "Website", value: 45, color: "hsl(var(--chart-1))" },
  { name: "Teams", value: 28, color: "hsl(var(--chart-2))" },
  { name: "WhatsApp", value: 18, color: "hsl(var(--chart-3))" },
  { name: "Telegram", value: 9, color: "hsl(var(--chart-4))" },
];

export const mostActiveAssistants = [
  { name: "Financial Advisor Bot", tenant: "Global Finance Ltd", conversations: 2100, avgScore: 4.3 },
  { name: "Loan Calculator", tenant: "Global Finance Ltd", conversations: 1560, avgScore: 4.1 },
  { name: "Customer Support Bot", tenant: "Acme Corporation", conversations: 1250, avgScore: 4.2 },
  { name: "Sales Assistant", tenant: "Acme Corporation", conversations: 890, avgScore: 4.5 },
];

export const recentFlaggedConversations = [
  { id: "f1", chatId: "c5", tenant: "HealthCare Plus", reason: "Low satisfaction", status: "pending" },
  { id: "f2", chatId: "c12", tenant: "Acme Corporation", reason: "Inappropriate content", status: "reviewed" },
  { id: "f3", chatId: "c18", tenant: "TechStart Inc", reason: "Misinformation", status: "pending" },
];
