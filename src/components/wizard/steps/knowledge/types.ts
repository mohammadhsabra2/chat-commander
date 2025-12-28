export interface KnowledgeFile {
  id: string;
  name: string;
  size: number;
  type: string;
  status: "pending" | "uploading" | "scraping" | "extracting" | "topic_generation" | "ready" | "indexed" | "error";
}

export interface KnowledgeTopic {
  id: string;
  name: string;
  confidence: number;
  sourceFiles: string[];
  snippetPreview: string;
  selected: boolean;
}

export interface KnowledgeBatch {
  id: string;
  name: string;
  description: string;
  type: "documents" | "website";
  accessLevel: "public" | "employee" | "executive" | "custom";
  customRoles?: string[];
  tags: string[];
  files: KnowledgeFile[];
  topics: KnowledgeTopic[];
  status: "uploading" | "processing" | "awaiting_approval" | "embedding" | "ready" | "error";
  createdAt: string;
  url?: string;
  crawlSubpages?: boolean;
  pageLimit?: number;
}

export const SAMPLE_FILES: KnowledgeFile[] = [
  { id: "f1", name: "Employee_Handbook_2024.pdf", size: 2456000, type: "pdf", status: "ready" },
  { id: "f2", name: "Leave_Policy.docx", size: 345000, type: "docx", status: "ready" },
  { id: "f3", name: "Onboarding_Checklist.xlsx", size: 128000, type: "xlsx", status: "ready" },
  { id: "f4", name: "Org_Chart.png", size: 567000, type: "png", status: "ready" },
  { id: "f5", name: "Code_of_Conduct.pptx", size: 1890000, type: "pptx", status: "ready" },
];

export const SAMPLE_TOPICS: KnowledgeTopic[] = [
  // Good topics
  { id: "t1", name: "Leave & PTO Policy", confidence: 0.92, sourceFiles: ["Leave_Policy.docx"], snippetPreview: "Employees are entitled to 20 days of annual leave. Unused leave can be carried over up to 5 days...", selected: true },
  { id: "t2", name: "Work Hours & Attendance", confidence: 0.88, sourceFiles: ["Employee_Handbook_2024.pdf"], snippetPreview: "Standard work hours are 9:00 AM to 5:30 PM with a 30-minute lunch break. Flexible hours may be arranged...", selected: true },
  { id: "t3", name: "Code of Conduct", confidence: 0.95, sourceFiles: ["Code_of_Conduct.pptx"], snippetPreview: "All employees are expected to maintain professional behavior and adhere to company values...", selected: true },
  { id: "t4", name: "Onboarding Steps", confidence: 0.90, sourceFiles: ["Onboarding_Checklist.xlsx"], snippetPreview: "Day 1: Complete paperwork, IT setup, badge access. Day 2-3: Team introductions, system training...", selected: true },
  { id: "t5", name: "Organization Structure", confidence: 0.86, sourceFiles: ["Org_Chart.png"], snippetPreview: "The company is organized into 5 main divisions: Engineering, Sales, Marketing, Operations, HR...", selected: true },
  // Garbage topics
  { id: "t6", name: "Table of Contents", confidence: 0.40, sourceFiles: ["Employee_Handbook_2024.pdf"], snippetPreview: "Chapter 1...........1\nChapter 2...........15\nChapter 3...........32", selected: false },
  { id: "t7", name: "Page Footer Text", confidence: 0.25, sourceFiles: ["Employee_Handbook_2024.pdf", "Leave_Policy.docx"], snippetPreview: "Confidential - Internal Use Only | Page XX of YY | Last Updated: December 2024", selected: false },
  { id: "t8", name: "Image Metadata", confidence: 0.18, sourceFiles: ["Org_Chart.png"], snippetPreview: "EXIF Data: Camera Model, Date Taken, Resolution 1920x1080, Color Profile sRGB...", selected: false },
  { id: "t9", name: "Slide Theme Colors", confidence: 0.12, sourceFiles: ["Code_of_Conduct.pptx"], snippetPreview: "Theme: Office Theme, Accent1: #4472C4, Accent2: #ED7D31, Background: #FFFFFF", selected: false },
  { id: "t10", name: "Random OCR Noise", confidence: 0.09, sourceFiles: ["Org_Chart.png"], snippetPreview: "||||| _____ ||| 0o0 |||| === |||", selected: false },
];

export const DUMMY_BATCHES: KnowledgeBatch[] = [
  {
    id: "BATCH-1042",
    name: "HR Policies v1",
    description: "Core HR documentation",
    type: "documents",
    accessLevel: "employee",
    tags: ["HR", "policies", "onboarding"],
    files: SAMPLE_FILES,
    topics: SAMPLE_TOPICS.filter(t => t.selected),
    status: "ready",
    createdAt: "2024-03-18T10:30:00Z",
  },
  {
    id: "BATCH-1047",
    name: "Pricing FAQ",
    description: "Product pricing documentation",
    type: "documents",
    accessLevel: "public",
    tags: ["pricing", "FAQ"],
    files: [
      { id: "f6", name: "Pricing_Guide.pdf", size: 890000, type: "pdf", status: "ready" },
      { id: "f7", name: "FAQ_Document.docx", size: 234000, type: "docx", status: "ready" },
    ],
    topics: [],
    status: "processing",
    createdAt: "2024-03-18T14:00:00Z",
  },
  {
    id: "WEB-009",
    name: "Website: acme.com/help",
    description: "Help center crawl",
    type: "website",
    accessLevel: "public",
    tags: ["help", "support"],
    files: [],
    topics: [
      { id: "wt1", name: "Getting Started Guide", confidence: 0.94, sourceFiles: ["acme.com/help/start"], snippetPreview: "Welcome to Acme! Here's how to get started...", selected: true },
      { id: "wt2", name: "Troubleshooting", confidence: 0.91, sourceFiles: ["acme.com/help/troubleshoot"], snippetPreview: "Common issues and their solutions...", selected: true },
    ],
    status: "ready",
    createdAt: "2024-03-17T09:15:00Z",
    url: "https://acme.com/help",
    crawlSubpages: true,
    pageLimit: 50,
  },
];
