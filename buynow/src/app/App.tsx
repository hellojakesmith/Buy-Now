import { useState, type ReactNode } from "react";
import {
  Home, Users, GitBranch, Plus, MoreHorizontal, Bell, Search,
  ChevronRight, ChevronLeft, Phone, Mail, FileText, Layout,
  ShoppingBag, Package, Tag, BarChart2, Settings, CheckCircle,
  DollarSign, TrendingUp, Share2, Copy, Edit3, Trash2,
  GripVertical, X, Eye, Globe, CreditCard, Upload,
  QrCode, MessageSquare, ShoppingCart, Zap
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip
} from "recharts";
import { buildApiUrl } from "./lib/api";
import { useAppData, type LeadUI, type OpportunityUI, type ProductUI, type OrderUI, type NotificationUI, type AnalyticsPoint, type BackendForm } from "./lib/useAppData";

// ── Types ──────────────────────────────────────────────────────────────────────
type Screen =
  | "home" | "leads" | "lead-detail" | "pipeline" | "opp-detail"
  | "more" | "analytics" | "orders" | "notifications" | "settings"
  | "forms" | "form-templates" | "form-editor" | "form-published"
  | "landing-templates" | "product-create" | "checkout-preview" | "products";

type Tab = "home" | "leads" | "pipeline" | "more";

type LandingTemplateKey = "hero" | "consultation" | "creator-brand" | "local";

type LandingThemeKey = "violet" | "midnight" | "sunset";

type LandingTemplate = {
  key: LandingTemplateKey;
  name: string;
  category: string;
  headline: string;
  description: string;
  ctaLabel: string;
  highlights: string[];
  colors: [string, string];
};

type LandingDraft = {
  templateKey: LandingTemplateKey;
  pageName: string;
  creatorName: string;
  headline: string;
  subheadline: string;
  ctaLabel: string;
  proofLine: string;
  themeKey: LandingThemeKey;
  formId: string | null;
};

const LANDING_THEMES: Array<{ key: LandingThemeKey; label: string; colors: [string, string]; surface: string; text: string }> = [
  { key: "violet", label: "Violet", colors: ["#7448F6", "#0325D9"], surface: "#EEE9FF", text: "#0325D9" },
  { key: "midnight", label: "Midnight", colors: ["#111827", "#374151"], surface: "#EEF0F5", text: "#111111" },
  { key: "sunset", label: "Sunset", colors: ["#FF8A00", "#FF5C7A"], surface: "#FFF3E5", text: "#D97706" },
];

const LANDING_TEMPLATES: LandingTemplate[] = [
  {
    key: "hero",
    name: "Modern Agency",
    category: "Lead Generation",
    headline: "Capture high-intent leads fast",
    description: "A sharp, modern landing page for agencies and service businesses that need a clean conversion path.",
    ctaLabel: "Book a Call",
    highlights: ["Strong hero section", "Simple CTA", "Works great with forms"],
    colors: ["#0325D9", "#7448F6"],
  },
  {
    key: "consultation",
    name: "Service Business",
    category: "Consultation",
    headline: "Turn visits into booked consultations",
    description: "Built for mobile-first visitors who need a fast, trust-building page with one clear next step.",
    ctaLabel: "Request Consultation",
    highlights: ["Trust-first layout", "Fast to complete", "Lead form built in"],
    colors: ["#16B879", "#0B36E5"],
  },
  {
    key: "launch",
    name: "Creator Brand",
    category: "Personal Brand",
    headline: "Launch an offer with confidence",
    description: "A bold, polished template for creators, coaches, and personal brands selling a new offer.",
    ctaLabel: "Join the List",
    highlights: ["Big visual impact", "Email capture", "Great for launches"],
    colors: ["#7448F6", "#FF8A00"],
  },
  {
    key: "local",
    name: "Local Business",
    category: "Contact Page",
    headline: "Make it easy to get in touch",
    description: "A straightforward template for local businesses that want a beautiful contact page on mobile.",
    ctaLabel: "Contact Us",
    highlights: ["Fast and simple", "Mobile friendly", "Perfect for a contact form"],
    colors: ["#FF8A00", "#0325D9"],
  },
];

// ── Sample Data ────────────────────────────────────────────────────────────────
const LEADS = [
  { id: 1, name: "Sarah Johnson", email: "sarah@email.com", phone: "(512) 555-1234", source: "Website Lead Form", status: "Qualified", time: "Today · 10:42 AM", interest: "Website Design", initials: "SJ" },
  { id: 2, name: "Mike Rodriguez", email: "mike@email.com", phone: "(512) 555-5678", source: "Lead Magnet", status: "New", time: "Today · 9:18 AM", interest: "Marketing", initials: "MR" },
  { id: 3, name: "Jessica Smith", email: "jessica@email.com", phone: "(512) 555-9012", source: "Consultation Form", status: "Contacted", time: "Yesterday", interest: "Consultation", initials: "JS" },
  { id: 4, name: "David Chen", email: "david@email.com", phone: "(512) 555-3456", source: "Website", status: "Qualified", time: "2 days ago", interest: "App Development", initials: "DC" },
  { id: 5, name: "Emma Wilson", email: "emma@email.com", phone: "(512) 555-7890", source: "Referral", status: "New", time: "3 days ago", interest: "Website Design", initials: "EW" },
];

const OPPS = [
  { id: 1, name: "Sarah Johnson", title: "Website Project", value: 4500, stage: "Qualified", close: "Aug 28", source: "Website Form" },
  { id: 2, name: "David Chen", title: "Mobile App Dev", value: 12000, stage: "Proposal", close: "Sep 5", source: "Referral" },
  { id: 3, name: "Mike Rodriguez", title: "Marketing Campaign", value: 3200, stage: "New", close: "Aug 22", source: "Lead Form" },
  { id: 4, name: "Jessica Smith", title: "Brand Strategy", value: 5500, stage: "Contacted", close: "Sep 1", source: "Consultation" },
  { id: 5, name: "Tom Baker", title: "E-commerce Store", value: 8900, stage: "Won", close: "Aug 15", source: "Website" },
];

const ANALYTICS = [
  { day: "Mon", visitors: 420, leads: 38 },
  { day: "Tue", visitors: 380, leads: 32 },
  { day: "Wed", visitors: 510, leads: 48 },
  { day: "Thu", visitors: 465, leads: 42 },
  { day: "Fri", visitors: 590, leads: 55 },
  { day: "Sat", visitors: 340, leads: 28 },
  { day: "Sun", visitors: 290, leads: 22 },
];

const STAGES = ["New", "Contacted", "Qualified", "Proposal", "Won"];

const STATUS_COLOR: Record<string, string> = {
  New: "#0325D9", Contacted: "#FF8A00", Qualified: "#7448F6",
  Proposal: "#16B879", Won: "#16B879", Customer: "#16B879",
};
const STATUS_BG: Record<string, string> = {
  New: "#E9EDFF", Contacted: "#FFF3E5", Qualified: "#EEE9FF",
  Proposal: "#E8F8F1", Won: "#E8F8F1", Customer: "#E8F8F1",
};

// ── Shared Components ──────────────────────────────────────────────────────────
function Badge({ label }: { label: string }) {
  return (
    <span
      className="px-2 py-0.5 rounded-full text-[11px] font-semibold"
      style={{ color: STATUS_COLOR[label] ?? "#6B7280", background: STATUS_BG[label] ?? "#F7F8FC" }}
    >
      {label}
    </span>
  );
}

function Avatar({ initials, size = 40 }: { initials: string; size?: number }) {
  return (
    <div
      className="flex items-center justify-center rounded-full flex-shrink-0 text-white font-bold"
      style={{
        width: size, height: size,
        background: "linear-gradient(135deg, #0325D9, #7448F6)",
        fontSize: size * 0.35,
      }}
    >
      {initials}
    </div>
  );
}

function ScreenHeader({ title, onBack, right }: { title: string; onBack: () => void; right?: ReactNode }) {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-[#EEF0F5] flex-shrink-0">
      <button
        onClick={onBack}
        className="w-9 h-9 flex items-center justify-center rounded-full bg-[#F7F8FC]"
      >
        <ChevronLeft size={18} color="#111111" />
      </button>
      <span className="font-bold text-[17px] text-[#111111]">{title}</span>
      <div className="w-9 flex justify-end">{right}</div>
    </div>
  );
}

// ── Bottom Nav ─────────────────────────────────────────────────────────────────
function BottomNav({ active, onTab, onCreate }: { active: Tab; onTab: (t: Tab) => void; onCreate: () => void }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 flex-shrink-0 border-t border-[#EEF0F5] bg-white/95 pb-[max(0.5rem,env(safe-area-inset-bottom))] backdrop-blur">
      <div className="mx-auto flex max-w-3xl items-center justify-around pt-1">
        {(["home", "leads"] as Tab[]).map((id) => {
          const Icon = id === "home" ? Home : Users;
          const label = id === "home" ? "Home" : "Leads";
          return (
            <button key={id} onClick={() => onTab(id)} className="flex flex-col items-center gap-0.5 py-1 px-4">
              <Icon size={22} color={active === id ? "#0325D9" : "#9CA3AF"} strokeWidth={active === id ? 2.5 : 1.75} />
              <span className="text-[10px] font-semibold" style={{ color: active === id ? "#0325D9" : "#9CA3AF" }}>{label}</span>
            </button>
          );
        })}

        <button onClick={onCreate} className="flex flex-col items-center -mt-4">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #0325D9, #7448F6)", boxShadow: "0 8px 24px rgba(3,37,217,0.35)" }}
          >
            <Plus size={24} color="white" strokeWidth={2.5} />
          </div>
          <span className="text-[10px] font-semibold text-[#9CA3AF] mt-0.5">Create</span>
        </button>

        {(["pipeline", "more"] as Tab[]).map((id) => {
          const Icon = id === "pipeline" ? GitBranch : MoreHorizontal;
          const label = id === "pipeline" ? "Pipeline" : "More";
          return (
            <button key={id} onClick={() => onTab(id)} className="flex flex-col items-center gap-0.5 py-1 px-4">
              <Icon size={22} color={active === id ? "#0325D9" : "#9CA3AF"} strokeWidth={active === id ? 2.5 : 1.75} />
              <span className="text-[10px] font-semibold" style={{ color: active === id ? "#0325D9" : "#9CA3AF" }}>{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Create Bottom Sheet ────────────────────────────────────────────────────────
function CreateSheet({ onClose, navigate }: { onClose: () => void; navigate: (s: Screen) => void }) {
  const items = [
    { icon: FileText, title: "Lead Form", desc: "Capture leads and customer information", color: "#0325D9", bg: "#E9EDFF", screen: "form-templates" as Screen },
    { icon: Layout, title: "Landing Page", desc: "Create a simple marketing page", color: "#7448F6", bg: "#EEE9FF", screen: "landing-templates" as Screen },
    { icon: ShoppingBag, title: "Buy Now Page", desc: "Sell a product with checkout", color: "#16B879", bg: "#E8F8F1", screen: "product-create" as Screen },
    { icon: Package, title: "Product", desc: "Create a product to sell", color: "#FF8A00", bg: "#FFF3E5", screen: "product-create" as Screen },
  ];

  return (
    <div className="fixed inset-0 z-50" style={{ background: "rgba(0,0,0,0.5)" }} onClick={onClose}>
      <div
        className="absolute bottom-0 left-0 right-0 rounded-t-[28px] bg-white p-5 pb-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-5" />
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[20px] font-black text-[#111111]">Create Something</h3>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-[#F7F8FC]">
            <X size={16} color="#6B7280" />
          </button>
        </div>
        <div className="space-y-2.5">
          {items.map(({ icon: Icon, title, desc, color, bg, screen }) => (
            <button
              key={title}
              onClick={() => navigate(screen)}
              className="w-full flex items-center gap-4 p-4 rounded-2xl border border-[#EEF0F5] bg-[#FAFBFF] text-left"
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: bg }}>
                <Icon size={22} color={color} />
              </div>
              <div className="flex-1">
                <div className="font-bold text-[15px] text-[#111111]">{title}</div>
                <div className="text-[12px] text-[#6B7280]">{desc}</div>
              </div>
              <ChevronRight size={16} color="#9CA3AF" className="flex-shrink-0" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Home Screen ────────────────────────────────────────────────────────────────
function HomeScreen({ navigate, setShowCreate, leads, opportunities, workspaceName, userName, summary }: {
  navigate: (s: Screen) => void;
  setShowCreate: (v: boolean) => void;
  leads: any[];
  opportunities: any[];
  workspaceName: string;
  userName: string;
  summary: { counts: { contacts: number; opportunities: number; orders: number; submissions: number; products: number; pages: number; notifications: number }; revenue: number };
}) {
  return (
    <div className="px-4 pb-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between pt-2">
        <div>
          <div className="text-[22px] font-black text-[#111111]">Good morning, {userName.split(" ")[0] ?? "there"} 👋</div>
          <div className="text-[13px] text-[#6B7280]">{"Here's what's happening today."}</div>
        </div>
        <button
          onClick={() => navigate("notifications")}
          className="w-10 h-10 rounded-full flex items-center justify-center relative border border-[#EEF0F5] bg-[#F7F8FC]"
        >
          <Bell size={17} color="#111111" />
          <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#EF4444]" />
        </button>
      </div>

      {/* Hero metric card */}
        <div
        className="rounded-[20px] p-5 text-white"
        style={{ background: "linear-gradient(135deg, #0325D9 0%, #7448F6 100%)" }}
      >
        <div className="text-[13px] font-medium opacity-75 mb-1">Total Leads</div>
        <div className="text-[44px] font-black leading-none mb-2">{summary.counts.contacts.toLocaleString()}</div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-white/20 rounded-full px-2 py-0.5">
            <TrendingUp size={11} color="white" />
            <span className="text-[11px] font-semibold">+12.5%</span>
          </div>
          <span className="text-[12px] opacity-60">this month</span>
        </div>
      </div>

      {/* Metrics grid */}
        <div className="grid grid-cols-2 gap-3">
          {([
          { label: "New Leads", value: `+${summary.counts.contacts}`, Icon: Users, color: "#0325D9", bg: "#E9EDFF" },
          { label: "Pipeline Value", value: `$${summary.revenue.toLocaleString()}`, Icon: DollarSign, color: "#7448F6", bg: "#EEE9FF" },
          { label: "Conversions", value: `${Math.max(1, Math.round((summary.counts.submissions / Math.max(summary.counts.contacts, 1)) * 100))}%`, Icon: TrendingUp, color: "#16B879", bg: "#E8F8F1" },
          { label: "Orders", value: `${summary.counts.orders}`, Icon: ShoppingBag, color: "#FF8A00", bg: "#FFF3E5" },
        ] as const).map(({ label, value, Icon, color, bg }) => (
          <div key={label} className="rounded-[16px] p-4 bg-white border border-[#EEF0F5]">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[12px] font-medium text-[#6B7280]">{label}</span>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: bg }}>
                <Icon size={14} color={color} />
              </div>
            </div>
            <div className="text-[24px] font-black text-[#111111]">{value}</div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div>
        <div className="text-[15px] font-bold text-[#111111] mb-3">Quick Actions</div>
        <div className="grid grid-cols-2 gap-3">
          {([
            { Icon: FileText, label: "Lead Form", sub: "Capture", color: "#0325D9", bg: "#E9EDFF", screen: "form-templates" },
            { Icon: Layout, label: "Landing Page", sub: "Pages", color: "#7448F6", bg: "#EEE9FF", screen: "landing-templates" },
            { Icon: Package, label: "Product", sub: "Sell", color: "#FF8A00", bg: "#FFF3E5", screen: "product-create" },
            { Icon: Users, label: "Add Lead", sub: "CRM", color: "#16B879", bg: "#E8F8F1", screen: "leads" },
          ] as const).map(({ Icon, label, sub, color, bg, screen }) => (
            <button
              key={label}
              onClick={() => navigate(screen as Screen)}
              className="flex items-center gap-3 p-3.5 rounded-[16px] border border-[#EEF0F5] bg-white text-left"
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: bg }}>
                <Icon size={18} color={color} />
              </div>
              <div>
                <div className="text-[13px] font-bold text-[#111111]">{label}</div>
                <div className="text-[11px] text-[#6B7280]">{sub}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Recent leads */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="text-[15px] font-bold text-[#111111]">Recent Leads</div>
          <button onClick={() => navigate("leads")} className="text-[13px] font-semibold text-[#0325D9]">See all</button>
        </div>
        <div className="space-y-2">
          {leads.slice(0, 3).map((lead) => (
            <div key={lead.id} className="flex items-center gap-3 p-3 rounded-[14px] border border-[#EEF0F5] bg-white">
              <Avatar initials={lead.initials} size={38} />
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-[14px] text-[#111111] truncate">{lead.name}</div>
                <div className="text-[12px] text-[#6B7280] truncate">{lead.interest}</div>
              </div>
              <div className="text-right flex-shrink-0">
                <Badge label={lead.status} />
                <div className="text-[10px] text-[#9CA3AF] mt-0.5">{lead.time.split("·")[0]?.trim()}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pipeline overview */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="text-[15px] font-bold text-[#111111]">Pipeline Overview</div>
          <button onClick={() => navigate("pipeline")} className="text-[13px] font-semibold text-[#0325D9]">View all</button>
        </div>
        <div className="rounded-[16px] p-4 border border-[#EEF0F5] bg-white">
          <div className="flex gap-1.5 mb-3">
            {STAGES.map((stage, i) => (
              <div
                key={stage}
                className="flex-1 h-2 rounded-full"
                style={{
                  background: i === 0 ? "#0325D9" : i === 1 ? "#0B36E5" : i === 2 ? "#7448F6" : i === 3 ? "#16B879" : "#E8F8F1",
                  opacity: i < 4 ? 1 : 0.5
                }}
              />
            ))}
          </div>
          <div className="flex gap-1.5">
            {STAGES.map((stage) => (
              <div key={stage} className="flex-1">
                <div className="text-[9px] font-semibold text-[#6B7280] truncate">{stage}</div>
                <div className="text-[12px] font-black text-[#111111]">
                  {OPPS.filter((o) => o.stage === stage).length}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Leads Screen ───────────────────────────────────────────────────────────────
function LeadsScreen({ leads, filterTab, setFilterTab, onSelect, onCreateLead }: {
  leads: typeof LEADS;
  filterTab: string;
  setFilterTab: (f: string) => void;
  onSelect: (l: (typeof LEADS)[0]) => void;
  onCreateLead: () => Promise<void>;
}) {
  const filters = ["All", "New", "Contacted", "Qualified", "Customer"];
  const filtered = filterTab === "All" ? leads : leads.filter((l) => l.status === filterTab);

  return (
    <div className="pb-4">
      <div className="px-4 pt-2 pb-3">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-[22px] font-black text-[#111111]">Leads</h1>
          <div className="flex gap-2">
            <button className="w-9 h-9 flex items-center justify-center rounded-full border border-[#EEF0F5] bg-[#F7F8FC]">
              <Search size={16} color="#111111" />
            </button>
            <button onClick={() => void onCreateLead()} className="w-9 h-9 flex items-center justify-center rounded-full bg-[#0325D9]">
              <Plus size={16} color="white" />
            </button>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-[#F7F8FC] border border-[#EEF0F5]">
          <Search size={14} color="#9CA3AF" />
          <span className="text-[14px] text-[#9CA3AF]">Search leads...</span>
        </div>
      </div>

      <div className="flex gap-2 px-4 pb-3 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilterTab(f)}
            className="flex-shrink-0 px-3.5 py-1.5 rounded-full text-[13px] font-semibold"
            style={{ background: filterTab === f ? "#0325D9" : "#F7F8FC", color: filterTab === f ? "white" : "#6B7280" }}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="px-4 space-y-2">
        <div className="text-[12px] font-semibold text-[#9CA3AF] mb-1">
          {filtered.length} {filterTab === "All" ? "total" : filterTab.toLowerCase()} leads
        </div>
        {filtered.map((lead) => (
          <button
            key={lead.id}
            onClick={() => onSelect(lead)}
            className="w-full flex items-center gap-3 p-3.5 rounded-[16px] border border-[#EEF0F5] bg-white text-left"
          >
            <Avatar initials={lead.initials} size={44} />
            <div className="flex-1 min-w-0">
              <div className="font-bold text-[15px] text-[#111111] truncate">{lead.name}</div>
              <div className="text-[12px] text-[#6B7280] truncate">{lead.email}</div>
              <div className="text-[12px] text-[#9CA3AF] mt-0.5 truncate">{lead.interest}</div>
            </div>
            <div className="flex flex-col items-end gap-1 flex-shrink-0">
              <Badge label={lead.status} />
              <div className="text-[10px] text-[#9CA3AF]">{lead.time.split("·")[0]?.trim()}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Lead Detail Screen ─────────────────────────────────────────────────────────
function LeadDetailScreen({ lead, goBack }: { lead: (typeof LEADS)[0]; goBack: () => void }) {
  const timeline = [
    { action: "Lead created", time: "10:42 AM", Icon: CheckCircle, color: "#16B879" },
    { action: "Form submitted", time: "10:42 AM", Icon: FileText, color: "#0325D9" },
    { action: "Status changed to Qualified", time: "11:03 AM", Icon: Tag, color: "#7448F6" },
    { action: "Note added", time: "11:10 AM", Icon: MessageSquare, color: "#FF8A00" },
  ];

  return (
    <div className="pb-8">
      <ScreenHeader
        title="Lead Profile"
        onBack={goBack}
        right={
          <button className="w-9 h-9 flex items-center justify-center rounded-full bg-[#F7F8FC]">
            <MoreHorizontal size={16} color="#111111" />
          </button>
        }
      />
      <div className="px-4 pt-5 pb-4 space-y-5">
        {/* Profile */}
        <div className="flex flex-col items-center text-center">
          <Avatar initials={lead.initials} size={64} />
          <h2 className="text-[22px] font-black text-[#111111] mt-3">{lead.name}</h2>
          <div className="mt-1.5"><Badge label={lead.status} /></div>
          <div className="text-[13px] text-[#6B7280] mt-1">{lead.interest}</div>
          <div className="flex gap-3 mt-4">
            {[
              { Icon: Phone, label: "Call", color: "#0325D9", bg: "#E9EDFF" },
              { Icon: Mail, label: "Email", color: "#7448F6", bg: "#EEE9FF" },
            ].map(({ Icon, label, color, bg }) => (
              <button key={label} className="flex flex-col items-center gap-1.5 px-6 py-3 rounded-xl" style={{ background: bg }}>
                <Icon size={18} color={color} />
                <span className="text-[11px] font-semibold" style={{ color }}>{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="rounded-[16px] border border-[#EEF0F5] overflow-hidden">
          {[
            { label: "Email", value: lead.email },
            { label: "Phone", value: lead.phone },
            { label: "Source", value: lead.source },
            { label: "Created", value: "August 15, 2026" },
          ].map(({ label, value }, i) => (
            <div key={label} className={`flex items-center justify-between px-4 py-3.5 ${i > 0 ? "border-t border-[#EEF0F5]" : ""}`}>
              <span className="text-[13px] text-[#6B7280]">{label}</span>
              <span className="text-[13px] font-semibold text-[#111111]">{value}</span>
            </div>
          ))}
        </div>

        {/* Activity timeline */}
        <div>
          <div className="text-[15px] font-bold text-[#111111] mb-3">Activity</div>
          <div className="space-y-3">
            {timeline.map(({ action, time, Icon, color }, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ background: color + "22" }}>
                  <Icon size={14} color={color} />
                </div>
                <div className="flex-1 pt-1">
                  <div className="text-[13px] font-medium text-[#111111]">{action}</div>
                  <div className="text-[11px] text-[#9CA3AF]">{time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pipeline strip */}
        <div>
          <div className="text-[15px] font-bold text-[#111111] mb-3">Pipeline</div>
          <div className="p-4 rounded-[16px] border border-[#EEF0F5] bg-[#FAFBFF]">
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="font-bold text-[14px] text-[#111111]">Website Project</div>
                <div className="text-[12px] text-[#6B7280]">$4,500</div>
              </div>
              <Badge label="Qualified" />
            </div>
            <div className="flex gap-1">
              {STAGES.map((s, i) => (
                <div key={s} className="flex-1 h-1.5 rounded-full"
                  style={{ background: i <= 2 ? "#0325D9" : "#EEF0F5" }} />
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2">
          {[
            { label: "Move Stage", Icon: GitBranch, color: "#0325D9", bg: "#E9EDFF" },
            { label: "Add Note", Icon: Edit3, color: "#7448F6", bg: "#EEE9FF" },
            { label: "Add Task", Icon: CheckCircle, color: "#16B879", bg: "#E8F8F1" },
          ].map(({ label, Icon, color, bg }) => (
            <button key={label} className="w-full flex items-center gap-3 p-4 rounded-[14px] border border-[#EEF0F5] bg-white">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: bg }}>
                <Icon size={16} color={color} />
              </div>
              <span className="font-semibold text-[14px] text-[#111111]">{label}</span>
              <ChevronRight size={14} color="#9CA3AF" className="ml-auto" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Pipeline Screen ────────────────────────────────────────────────────────────
function PipelineScreen({ opportunities, stage, setStage, onSelect, onCreateOpportunity }: {
  opportunities: typeof OPPS;
  stage: number;
  setStage: (n: number) => void;
  onSelect: (o: (typeof OPPS)[0]) => void;
  onCreateOpportunity: () => Promise<void>;
}) {
  const currentStage = STAGES[stage];
  const stageOpps = opportunities.filter((o) => o.stage === currentStage);
  const totalValue = opportunities.reduce((s, o) => s + o.value, 0);

  return (
    <div className="pb-4">
      <div className="px-4 pt-2 pb-4">
        <div className="flex items-center justify-between mb-1">
          <h1 className="text-[22px] font-black text-[#111111]">Pipeline</h1>
          <button onClick={() => void onCreateOpportunity()} className="w-9 h-9 flex items-center justify-center rounded-full bg-[#0325D9]">
            <Plus size={16} color="white" />
          </button>
        </div>
        <div className="text-[14px] font-semibold text-[#6B7280]">
          ${totalValue.toLocaleString()} Total Value
        </div>
      </div>

      {/* Stage selector */}
      <div className="px-4 pb-4">
        <div className="flex items-center gap-3 p-3 rounded-[16px] bg-[#F7F8FC] border border-[#EEF0F5]">
          <button
            onClick={() => setStage(Math.max(0, stage - 1))}
            className="w-8 h-8 flex items-center justify-center rounded-full"
            style={{ background: stage > 0 ? "#0325D9" : "#EEF0F5" }}
          >
            <ChevronLeft size={16} color={stage > 0 ? "white" : "#9CA3AF"} />
          </button>
          <div className="flex-1 text-center">
            <div className="font-black text-[17px] text-[#111111]">{currentStage}</div>
            <div className="text-[12px] text-[#6B7280]">
              {stageOpps.length} {stageOpps.length === 1 ? "Opportunity" : "Opportunities"}
            </div>
          </div>
          <button
            onClick={() => setStage(Math.min(STAGES.length - 1, stage + 1))}
            className="w-8 h-8 flex items-center justify-center rounded-full"
            style={{ background: stage < STAGES.length - 1 ? "#0325D9" : "#EEF0F5" }}
          >
            <ChevronRight size={16} color={stage < STAGES.length - 1 ? "white" : "#9CA3AF"} />
          </button>
        </div>
        <div className="flex justify-center gap-1.5 mt-2">
          {STAGES.map((_, i) => (
            <button
              key={i}
              onClick={() => setStage(i)}
              className="h-1.5 rounded-full transition-all"
              style={{ width: i === stage ? 20 : 6, background: i === stage ? "#0325D9" : "#EEF0F5" }}
            />
          ))}
        </div>
      </div>

      {/* Opportunities */}
      <div className="px-4 space-y-3">
        {stageOpps.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-3 bg-[#F7F8FC]">
              <GitBranch size={28} color="#9CA3AF" />
            </div>
            <div className="font-bold text-[16px] text-[#111111] mb-1">No opportunities here</div>
            <div className="text-[13px] text-[#6B7280] mb-4">Add your first {currentStage.toLowerCase()} opportunity</div>
            <button onClick={() => void onCreateOpportunity()} className="px-5 py-2.5 rounded-xl text-[14px] font-semibold text-white bg-[#0325D9]">
              Add Opportunity
            </button>
          </div>
        ) : stageOpps.map((opp) => (
          <button
            key={opp.id}
            onClick={() => onSelect(opp)}
            className="w-full p-4 rounded-[16px] border border-[#EEF0F5] bg-white text-left"
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="font-bold text-[15px] text-[#111111]">{opp.name}</div>
                <div className="text-[13px] text-[#6B7280]">{opp.title}</div>
              </div>
              <Badge label={opp.stage} />
            </div>
            <div className="flex items-center justify-between">
              <div className="text-[22px] font-black text-[#0325D9]">${opp.value.toLocaleString()}</div>
              <div className="text-[12px] text-[#9CA3AF]">Close {opp.close}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Opportunity Detail ─────────────────────────────────────────────────────────
function OppDetailScreen({ opp, goBack }: { opp: (typeof OPPS)[0]; goBack: () => void }) {
  const stageIdx = STAGES.indexOf(opp.stage);
  return (
    <div className="pb-8">
      <ScreenHeader title="Opportunity" onBack={goBack} />
      <div className="px-4 pt-5 space-y-5">
        <div className="rounded-[20px] p-5 text-white"
          style={{ background: "linear-gradient(135deg, #0325D9, #7448F6)" }}>
          <div className="text-white/70 text-[13px] mb-1">{opp.title}</div>
          <div className="text-white font-black text-[36px] leading-none">${opp.value.toLocaleString()}</div>
          <div className="mt-2"><Badge label={opp.stage} /></div>
        </div>

        <div className="flex gap-2">
          {[
            { label: "Move Stage", color: "#0325D9", bg: "#E9EDFF" },
            { label: "Add Note", color: "#7448F6", bg: "#EEE9FF" },
            { label: "Add Task", color: "#16B879", bg: "#E8F8F1" },
          ].map(({ label, color, bg }) => (
            <button key={label} className="flex-1 py-2.5 rounded-xl text-[12px] font-semibold" style={{ background: bg, color }}>
              {label}
            </button>
          ))}
        </div>

        <div className="rounded-[16px] border border-[#EEF0F5] overflow-hidden">
          {[
            { label: "Contact", value: opp.name },
            { label: "Value", value: `$${opp.value.toLocaleString()}` },
            { label: "Expected Close", value: opp.close },
            { label: "Source", value: opp.source },
          ].map(({ label, value }, i) => (
            <div key={label} className={`flex justify-between px-4 py-3.5 ${i > 0 ? "border-t border-[#EEF0F5]" : ""}`}>
              <span className="text-[13px] text-[#6B7280]">{label}</span>
              <span className="text-[13px] font-semibold text-[#111111]">{value}</span>
            </div>
          ))}
        </div>

        <div>
          <div className="text-[15px] font-bold text-[#111111] mb-3">Stage Progress</div>
          <div className="space-y-3">
            {STAGES.map((s, i) => {
              const done = i <= stageIdx;
              const current = s === opp.stage;
              return (
                <div key={s} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: done ? "#0325D9" : "#EEF0F5" }}>
                    {done && <CheckCircle size={14} color="white" />}
                  </div>
                  <span className="text-[14px] font-medium flex-1" style={{ color: done ? "#111111" : "#9CA3AF" }}>{s}</span>
                  {current && <Badge label="Current" />}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── More Screen ────────────────────────────────────────────────────────────────
function MoreScreen({ navigate, summary, forms, products, notifications, orders, workspaceName, userName, userEmail }: {
  navigate: (s: Screen) => void;
  summary: { counts: { contacts: number; opportunities: number; orders: number; submissions: number; products: number; pages: number; notifications: number }; revenue: number };
  forms: BackendForm[];
  products: ProductUI[];
  notifications: NotificationUI[];
  orders: OrderUI[];
  workspaceName: string;
  userName: string;
  userEmail: string;
}) {
  const items = [
    { Icon: BarChart2, label: "Analytics", desc: `${summary.counts.contacts} contacts · ${summary.counts.submissions} submissions`, screen: "analytics", color: "#0325D9", bg: "#E9EDFF" },
    { Icon: FileText, label: "Forms", desc: forms.length ? `${forms.length} form${forms.length === 1 ? "" : "s"} created` : "No forms yet", screen: "forms", color: "#0325D9", bg: "#E9EDFF" },
    { Icon: ShoppingCart, label: "Orders", desc: `${summary.counts.orders} orders · $${summary.revenue.toLocaleString()} revenue`, screen: "orders", color: "#16B879", bg: "#E8F8F1" },
    { Icon: Layout, label: "Pages", desc: `${summary.counts.pages} published landing pages`, screen: "landing-templates", color: "#7448F6", bg: "#EEE9FF" },
    { Icon: Package, label: "Products", desc: `${summary.counts.products} active products`, screen: "products", color: "#FF8A00", bg: "#FFF3E5" },
    { Icon: Bell, label: "Notifications", desc: `${notifications.filter((item) => item.unread).length} unread alerts`, screen: "notifications", color: "#0325D9", bg: "#E9EDFF" },
    { Icon: Settings, label: "Settings", desc: "Account, billing, team", screen: "settings", color: "#6B7280", bg: "#F7F8FC" },
  ] as const;

  return (
    <div className="pb-4">
      <div className="px-4 pt-4 pb-5 border-b border-[#EEF0F5]">
        <div className="flex items-center gap-3">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center text-white font-black text-[18px]"
            style={{ background: "linear-gradient(135deg, #0325D9, #7448F6)" }}
          >
            {userName.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase()}
          </div>
          <div className="flex-1">
            <div className="font-black text-[17px] text-[#111111]">{workspaceName}</div>
            <div className="text-[13px] text-[#6B7280]">{userEmail}</div>
            <span className="mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold inline-block bg-[#EEE9FF] text-[#7448F6]">
              Pro Plan
            </span>
          </div>
          <ChevronRight size={16} color="#9CA3AF" />
        </div>
      </div>
      <div className="px-4 pt-4 space-y-2">
        {items.map(({ Icon, label, desc, screen, color, bg }) => (
          <button
            key={label}
            onClick={() => navigate(screen)}
            className="w-full flex items-center gap-3 p-4 rounded-[16px] border border-[#EEF0F5] bg-white text-left"
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: bg }}>
              <Icon size={18} color={color} />
            </div>
            <div className="flex-1">
              <div className="font-semibold text-[14px] text-[#111111]">{label}</div>
              <div className="text-[12px] text-[#6B7280]">{desc}</div>
            </div>
            <ChevronRight size={14} color="#9CA3AF" />
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Analytics Screen ───────────────────────────────────────────────────────────
function AnalyticsScreen({ data, goBack, summary }: { data: AnalyticsPoint[]; summary: { counts: { contacts: number; opportunities: number; orders: number; submissions: number; products: number; pages: number; notifications: number }; revenue: number }; goBack: () => void }) {
  const [period, setPeriod] = useState("7 Days");
  const leadConversion = Math.max(1, Math.round((summary.counts.submissions / Math.max(summary.counts.contacts, 1)) * 100));
  return (
    <div className="pb-8">
      <ScreenHeader title="Analytics" onBack={goBack} />
      <div className="px-4 pt-5 space-y-5">
        <div className="flex gap-2">
          {["7 Days", "30 Days", "90 Days"].map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className="flex-1 py-2 rounded-xl text-[13px] font-semibold"
              style={{ background: period === p ? "#0325D9" : "#F7F8FC", color: period === p ? "white" : "#6B7280" }}
            >
              {p}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "Visitors", value: `${data.reduce((sum, point) => sum + point.visitors, 0).toLocaleString()}`, change: "+live" },
            { label: "Leads", value: `${summary.counts.contacts.toLocaleString()}`, change: "+live" },
            { label: "Conversion", value: `${leadConversion}%`, change: "+live" },
            { label: "Revenue", value: `$${summary.revenue.toLocaleString()}`, change: "+live" },
          ].map(({ label, value, change }) => (
            <div key={label} className="p-4 rounded-[16px] border border-[#EEF0F5] bg-white">
              <div className="text-[12px] text-[#6B7280] mb-1">{label}</div>
              <div className="text-[22px] font-black text-[#111111]">{value}</div>
              <div className="text-[11px] font-semibold text-[#16B879]">{change}</div>
            </div>
          ))}
        </div>

        <div className="p-4 rounded-[16px] border border-[#EEF0F5] bg-white">
          <div className="text-[14px] font-bold text-[#111111] mb-4">Visitors & Leads</div>
          <ResponsiveContainer width="100%" height={150}>
            <AreaChart data={data} margin={{ top: 0, right: 0, left: -24, bottom: 0 }}>
              <defs>
                <linearGradient id="gV" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0325D9" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#0325D9" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gL" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7448F6" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#7448F6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ borderRadius: 10, border: "1px solid #EEF0F5", fontSize: 12 }}
              />
              <Area type="monotone" dataKey="visitors" stroke="#0325D9" strokeWidth={2} fill="url(#gV)" />
              <Area type="monotone" dataKey="leads" stroke="#7448F6" strokeWidth={2} fill="url(#gL)" />
            </AreaChart>
          </ResponsiveContainer>
          <div className="flex gap-4 mt-2">
            {[{ color: "#0325D9", label: "Visitors" }, { color: "#7448F6", label: "Leads" }].map(({ color, label }) => (
              <div key={label} className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full" style={{ background: color }} />
                <span className="text-[11px] text-[#6B7280]">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Forms Screen ────────────────────────────────────────────────────────────────
function FormsScreen({ goBack, navigate, forms, onSelect }: {
  goBack: () => void;
  navigate: (s: Screen) => void;
  forms: BackendForm[];
  onSelect: (form: BackendForm) => void;
}) {
  const statusStyle: Record<string, { color: string; bg: string; label: string }> = {
    published: { color: "#16B879", bg: "#E8F8F1", label: "Published" },
    draft: { color: "#FF8A00", bg: "#FFF3E5", label: "Draft" },
    archived: { color: "#6B7280", bg: "#F7F8FC", label: "Archived" },
  };

  return (
    <div className="pb-8">
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#EEF0F5]">
        <button onClick={goBack} className="w-9 h-9 flex items-center justify-center rounded-full bg-[#F7F8FC]">
          <ChevronLeft size={18} color="#111111" />
        </button>
        <span className="font-bold text-[17px] text-[#111111]">Forms</span>
        <button onClick={() => navigate("form-templates")} className="w-9 h-9 flex items-center justify-center rounded-full bg-[#0325D9]">
          <Plus size={16} color="white" />
        </button>
      </div>

      {forms.length === 0 ? (
        <div className="px-4 pt-16 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-[18px] flex items-center justify-center mb-4" style={{ background: "linear-gradient(135deg, #E9EDFF, #EEE9FF)" }}>
            <FileText size={26} color="#0325D9" />
          </div>
          <div className="font-bold text-[16px] text-[#111111]">No forms yet</div>
          <div className="text-[13px] text-[#6B7280] mt-1 mb-5 max-w-[240px]">Create your first lead form to start capturing submissions.</div>
          <button
            onClick={() => navigate("form-templates")}
            className="px-5 py-3 rounded-[14px] text-[14px] font-semibold text-white bg-[#0325D9]"
          >
            Create a Form
          </button>
        </div>
      ) : (
        <div className="px-4 pt-4 space-y-3">
          {forms.map((form) => {
            const status = statusStyle[form.status ?? "draft"] ?? statusStyle.draft;
            return (
              <button
                key={form._id}
                onClick={() => onSelect(form)}
                className="w-full p-4 rounded-[16px] border border-[#EEF0F5] bg-white text-left"
              >
                <div className="flex items-start gap-3">
                  <div className="w-11 h-11 rounded-[12px] flex items-center justify-center flex-shrink-0"
                    style={{ background: "linear-gradient(135deg, #E9EDFF, #EEE9FF)" }}>
                    <FileText size={20} color="#0325D9" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <div className="font-bold text-[14px] text-[#111111] truncate">{form.name}</div>
                      <span className="flex-shrink-0 text-[11px] font-semibold px-2 py-0.5 rounded-full" style={{ color: status.color, background: status.bg }}>
                        {status.label}
                      </span>
                    </div>
                    {form.publishSettings?.path && (
                      <div className="text-[12px] text-[#6B7280] truncate mt-0.5">{form.publishSettings.path}</div>
                    )}
                    <div className="flex items-center gap-3 mt-2 text-[12px] text-[#9CA3AF]">
                      <span>{form.fields?.length ?? 0} fields</span>
                      <span>·</span>
                      <span>{form.stats?.submissions ?? 0} submissions</span>
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Orders Screen ──────────────────────────────────────────────────────────────
function OrdersScreen({ goBack, orders, summary }: { goBack: () => void; orders: OrderUI[]; summary: { counts: { orders: number }; revenue: number } }) {
  const sColor: Record<string, string> = { Paid: "#16B879", Pending: "#FF8A00", Refunded: "#6B7280", Failed: "#EF4444" };
  const sBg: Record<string, string> = { Paid: "#E8F8F1", Pending: "#FFF3E5", Refunded: "#F7F8FC", Failed: "#FEECEC" };

  return (
    <div className="pb-8">
      <ScreenHeader title="Orders" onBack={goBack} />
      <div className="px-4 pt-5 space-y-5">
        <div className="rounded-[20px] p-5 text-white" style={{ background: "linear-gradient(135deg, #0325D9, #7448F6)" }}>
          <div className="text-white/70 text-[12px] mb-1">Total Revenue</div>
          <div className="text-white font-black text-[36px] leading-none mb-3">${summary.revenue.toLocaleString()}</div>
          <div className="flex gap-6">
            <div><div className="text-white/70 text-[11px]">Orders</div><div className="text-white font-bold text-[16px]">{summary.counts.orders}</div></div>
            <div><div className="text-white/70 text-[11px]">Avg. Order</div><div className="text-white font-bold text-[16px]">${Math.round(summary.revenue / Math.max(summary.counts.orders, 1))}</div></div>
          </div>
        </div>
        <div className="space-y-2">
          {orders.map(({ id, product, amount, customer, status, time }) => (
            <div key={id} className="p-4 rounded-[16px] border border-[#EEF0F5] bg-white">
              <div className="flex items-start justify-between mb-1.5">
                <div>
                  <div className="text-[11px] font-semibold text-[#9CA3AF]">{id}</div>
                  <div className="font-bold text-[14px] text-[#111111]">{product}</div>
                </div>
                <div className="text-right">
                  <div className="font-black text-[16px] text-[#111111]">${amount}</div>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
                    style={{ color: sColor[status], background: sBg[status] }}>{status}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[12px] text-[#6B7280]">{customer}</span>
                <span className="text-[11px] text-[#9CA3AF]">{time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Notifications Screen ───────────────────────────────────────────────────────
function NotificationsScreen({ goBack, notifications, onRead }: { goBack: () => void; notifications: NotificationUI[]; onRead: (id: string) => void }) {

  return (
    <div className="pb-8">
      <ScreenHeader title="Notifications" onBack={goBack} />
      <div className="px-4 pt-4 space-y-2">
        {notifications.map(({ id, title, body, time, color, bg, icon, unread }, i) => {
          const Icon = icon === "payment" ? DollarSign : icon === "pipeline" ? GitBranch : Users;
          return (
          <button
            key={id}
            onClick={() => unread && onRead(id)}
            className="flex w-full gap-3 rounded-[16px] border p-4 text-left"
            style={{ background: unread ? "#FAFBFF" : "#FFFFFF", borderColor: unread ? "#D4DEFF" : "#EEF0F5" }}
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: bg }}>
              <Icon size={18} color={color} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-[14px] text-[#111111]">{title}</div>
              <div className="text-[12px] text-[#6B7280] mt-0.5">{body}</div>
              <div className="text-[11px] text-[#9CA3AF] mt-1">{time}</div>
            </div>
            {unread && <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0 bg-[#0325D9]" />}
          </button>
        )})}
      </div>
    </div>
  );
}

// ── Settings Screen ────────────────────────────────────────────────────────────
function SettingsScreen({ goBack }: { goBack: () => void }) {
  const groups = [
    { label: "Account", items: ["Profile", "Password", "Email"] },
    { label: "Workspace", items: ["General", "Team", "Domains", "Integrations"] },
    { label: "Payments", items: ["Stripe", "PayPal", "Billing"] },
    { label: "Notifications", items: ["Push Notifications", "Email Alerts"] },
    { label: "Subscription", items: ["Current Plan · Pro", "Upgrade", "Billing History"] },
  ];

  return (
    <div className="pb-8">
      <ScreenHeader title="Settings" onBack={goBack} />
      <div className="px-4 pt-4 space-y-5">
        {groups.map(({ label, items }) => (
          <div key={label}>
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#9CA3AF] mb-2">{label}</div>
            <div className="rounded-[16px] border border-[#EEF0F5] overflow-hidden">
              {items.map((item, i) => (
                <div key={item} className={`flex items-center justify-between px-4 py-3.5 ${i > 0 ? "border-t border-[#EEF0F5]" : ""} bg-white`}>
                  <span className="text-[14px] text-[#111111]">{item}</span>
                  <ChevronRight size={14} color="#9CA3AF" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Form Templates Screen ──────────────────────────────────────────────────────
function FormTemplatesScreen({ goBack, onCreateDraft }: { goBack: () => void; onCreateDraft: (template?: string) => Promise<void> }) {
  const templates = [
    { name: "Consultation Request", category: "Consultation", fields: ["Name", "Email", "Phone", "What can we help with?", "Preferred date"] },
    { name: "Lead Generation", category: "Lead Generation", fields: ["First Name", "Last Name", "Email", "Company"] },
    { name: "Contact Us", category: "Contact", fields: ["Name", "Email", "Message"] },
    { name: "Event Registration", category: "Event", fields: ["Name", "Email", "Phone", "Event Date"] },
  ];

  return (
    <div className="pb-8">
      <ScreenHeader title="Choose Template" onBack={goBack} />
      <div className="px-4 pt-4 space-y-4">
        <div className="text-[14px] text-[#6B7280]">Start with a template or build from scratch</div>

        <button
          onClick={() => void onCreateDraft()}
          className="w-full p-4 rounded-[16px] border-2 border-dashed border-[#0325D9] flex items-center gap-3 text-left"
        >
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#E9EDFF]">
            <Plus size={18} color="#0325D9" />
          </div>
          <span className="font-bold text-[15px] text-[#0325D9]">Start Blank</span>
        </button>

        <div className="space-y-3">
          {templates.map(({ name, category, fields }) => (
            <button
              key={name}
              onClick={() => void onCreateDraft(name)}
              className="w-full p-4 rounded-[16px] border border-[#EEF0F5] bg-white text-left"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="font-bold text-[15px] text-[#111111]">{name}</div>
                  <div className="text-[12px] text-[#6B7280]">{category}</div>
                </div>
                <span className="px-3 py-1.5 rounded-xl text-[12px] font-semibold text-white bg-[#0325D9]">Use</span>
              </div>
              <div className="p-3 rounded-xl bg-[#F7F8FC] space-y-2">
                {fields.slice(0, 3).map((f) => (
                  <div key={f} className="h-8 rounded-lg flex items-center px-3 text-[12px] bg-white border border-[#EEF0F5] text-[#9CA3AF]">
                    {f}
                  </div>
                ))}
                {fields.length > 3 && (
                  <div className="text-[11px] text-[#9CA3AF]">+{fields.length - 3} more fields</div>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Form Editor Screen ─────────────────────────────────────────────────────────
function FormEditorScreen({
  goBack,
  onSave,
  onPublish,
  form,
}: {
  goBack: () => void;
  onSave: () => Promise<void>;
  onPublish: () => Promise<void>;
  form: { name: string; slug: string; status?: string; fields?: Array<{ label: string; type: string; required?: boolean }> } | null;
}) {
  const fields = form?.fields?.map((field) => ({
    label: field.label,
    type: field.type,
    required: Boolean(field.required),
  })) ?? [
    { label: "First Name", type: "Short Text", required: true },
    { label: "Last Name", type: "Short Text", required: true },
    { label: "Email", type: "Email", required: true },
    { label: "Phone", type: "Phone", required: false },
    { label: "What are you interested in?", type: "Multiple Choice", required: false },
  ];

  return (
    <div className="pb-8">
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#EEF0F5] flex-shrink-0">
        <button onClick={goBack} className="w-9 h-9 flex items-center justify-center rounded-full bg-[#F7F8FC]">
          <ChevronLeft size={18} color="#111111" />
        </button>
        <span className="font-bold text-[16px] text-[#111111]">{form?.name ?? "New Lead Form"}</span>
        <div className="flex gap-2">
          <button onClick={() => void onSave()} className="px-3 py-1.5 rounded-xl text-[13px] font-semibold bg-[#F7F8FC] text-[#111111]">Save</button>
          <button onClick={() => void onPublish()} className="px-3 py-1.5 rounded-xl text-[13px] font-semibold text-white bg-[#0325D9]">
            Publish
          </button>
        </div>
      </div>

      <div className="px-4 pt-4 space-y-5">
        <div className="p-4 rounded-[16px] bg-[#F7F8FC] border border-[#EEF0F5]">
          <div className="text-[17px] font-bold text-[#111111] mb-0.5">{"Let's get started"}</div>
          <div className="text-[13px] text-[#6B7280]">Tell us a little about yourself.</div>
        </div>

        <div>
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#9CA3AF] mb-2">Fields</div>
          <div className="space-y-2">
            {fields.map(({ label, type, required }) => (
              <div key={label} className="flex items-center gap-3 p-3.5 rounded-[14px] border border-[#EEF0F5] bg-white">
                <GripVertical size={14} color="#9CA3AF" className="flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-[14px] text-[#111111] truncate">{label}</div>
                  <div className="text-[11px] text-[#9CA3AF]">{type}{required ? " · Required" : ""}</div>
                </div>
                <div className="flex gap-1.5">
                  <button className="w-7 h-7 flex items-center justify-center rounded-lg bg-[#F7F8FC]">
                    <Edit3 size={12} color="#6B7280" />
                  </button>
                  <button className="w-7 h-7 flex items-center justify-center rounded-lg bg-[#FFF3E5]">
                    <Trash2 size={12} color="#FF8A00" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button className="w-full py-3.5 rounded-[14px] border-2 border-dashed border-[#0325D9] flex items-center justify-center gap-2">
          <Plus size={16} color="#0325D9" />
          <span className="font-semibold text-[14px] text-[#0325D9]">Add Field</span>
        </button>

        <div>
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#9CA3AF] mb-2">Field Types</div>
          <div className="grid grid-cols-3 gap-2">
            {["Short Text", "Email", "Phone", "Number", "Dropdown", "Checkboxes"].map((ft) => (
              <button key={ft} className="py-2.5 px-2 rounded-xl text-[11px] font-semibold text-center bg-[#F7F8FC] text-[#6B7280] border border-[#EEF0F5]">
                {ft}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Form Published Screen ──────────────────────────────────────────────────────
function FormPublishedScreen({ goBack, shareUrl }: { goBack: () => void; shareUrl: string }) {
  const [copied, setCopied] = useState(false);

  const copyShareUrl = async () => {
    if (!shareUrl) {
      return;
    }

    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="pb-8">
      <ScreenHeader title="Form Published" onBack={goBack} />
      <div className="px-4 pt-8 flex flex-col items-center text-center space-y-5">
        <div className="w-20 h-20 rounded-full flex items-center justify-center"
          style={{ background: "linear-gradient(135deg, #0325D9, #7448F6)" }}>
          <CheckCircle size={36} color="white" />
        </div>
        <div>
          <div className="text-[24px] font-black text-[#111111]">{"Your form is ready 🎉"}</div>
          <div className="text-[14px] text-[#6B7280] mt-1">Share it with your audience to start capturing leads</div>
        </div>

        <div className="w-full p-4 rounded-[16px] bg-[#F7F8FC] border border-[#EEF0F5] text-left">
          <div className="text-[11px] font-semibold text-[#9CA3AF] mb-1">Form URL</div>
          <div className="break-all text-[13px] font-semibold text-[#0325D9]">{shareUrl || "No share link available"}</div>
        </div>

        <div className="w-full grid grid-cols-2 gap-3">
          {[
            { Icon: Copy, label: copied ? "Copied" : "Copy Link", color: "#0325D9", bg: "#E9EDFF", onClick: copyShareUrl },
            { Icon: Share2, label: "Share", color: "#7448F6", bg: "#EEE9FF" },
            { Icon: Eye, label: "Preview", color: "#16B879", bg: "#E8F8F1" },
            { Icon: Edit3, label: "Edit Form", color: "#FF8A00", bg: "#FFF3E5" },
          ].map(({ Icon, label, color, bg, onClick }) => (
            <button key={label} onClick={onClick} className="flex items-center gap-2.5 p-3.5 rounded-[14px]" style={{ background: bg }}>
              <Icon size={16} color={color} />
              <span className="font-semibold text-[13px]" style={{ color }}>{label}</span>
            </button>
          ))}
        </div>

        <div className="w-full p-4 rounded-[16px] border border-[#EEF0F5] bg-white">
          <div className="text-[14px] font-bold text-[#111111] mb-3">QR Code</div>
          <div className="w-28 h-28 mx-auto rounded-xl flex items-center justify-center bg-[#F7F8FC] border border-[#EEF0F5]">
            <QrCode size={52} color="#0325D9" />
          </div>
          <button className="mt-3 text-[13px] font-semibold text-[#0325D9]">Download QR Code</button>
        </div>

        <button onClick={copyShareUrl} className="w-full font-bold text-[16px] text-white rounded-xl bg-[#0325D9]"
          style={{ height: 52, boxShadow: "0 8px 24px rgba(3,37,217,0.25)" }}>
          {copied ? "Link Copied" : "Share Form"}
        </button>
      </div>
    </div>
  );
}

// ── Landing Templates Screen ───────────────────────────────────────────────────
function LandingTemplatesScreen({
  goBack,
  navigate,
  forms,
  onUseTemplate,
}: {
  goBack: () => void;
  navigate: (s: Screen) => void;
  forms: BackendForm[];
  onUseTemplate: (templateKey: LandingTemplateKey, formId: string | null) => Promise<void>;
}) {
  const [selectedTemplateKey, setSelectedTemplateKey] = useState<LandingTemplateKey>("hero");
  const [selectedFormId, setSelectedFormId] = useState<string | null>(forms[0]?._id ?? null);

  const selectedTemplate = LANDING_TEMPLATES.find((template) => template.key === selectedTemplateKey) ?? LANDING_TEMPLATES[0];
  const selectedForm = forms.find((form) => form._id === selectedFormId) ?? forms[0] ?? null;

  return (
    <div className="pb-28">
      <ScreenHeader
        title="Landing Pages"
        onBack={goBack}
        right={
          <button onClick={() => navigate("forms")} className="text-[12px] font-semibold text-[#0325D9]">
            Forms
          </button>
        }
      />

      <div className="px-4 pt-4 space-y-4">
        <div className="rounded-[24px] p-5 text-white shadow-[0_16px_32px_rgba(3,37,217,0.18)]"
          style={{ background: `linear-gradient(135deg, ${selectedTemplate.colors[0]}, ${selectedTemplate.colors[1]})` }}>
          <div className="text-[12px] font-semibold text-white/75 uppercase tracking-[0.18em]">Mobile-first builder</div>
          <div className="text-[24px] font-black leading-tight mt-2">{selectedTemplate.headline}</div>
          <div className="text-[13px] text-white/80 mt-2">{selectedTemplate.description}</div>
          <div className="flex flex-wrap gap-2 mt-4">
            {selectedTemplate.highlights.map((item) => (
              <span key={item} className="rounded-full bg-white/16 px-3 py-1 text-[11px] font-semibold text-white">
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="rounded-[20px] border border-[#EEF0F5] bg-white p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-[14px] font-bold text-[#111111]">Attach a form</div>
              <div className="text-[12px] text-[#6B7280]">Use one of your existing forms on the page.</div>
            </div>
            <button onClick={() => navigate("forms")} className="text-[12px] font-semibold text-[#0325D9]">
              Manage
            </button>
          </div>
          {selectedForm ? (
            <div className="rounded-[16px] border border-[#DCE5FF] bg-[#F7F8FF] p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-[13px] font-bold text-[#111111] truncate">{selectedForm.name}</div>
                  <div className="text-[12px] text-[#6B7280] truncate">
                    {selectedForm.fields?.length ?? 0} fields · {selectedForm.publishSettings?.path ?? "No share link yet"}
                  </div>
                </div>
                <button onClick={() => setSelectedFormId(null)} className="text-[11px] font-semibold text-[#0325D9]">
                  Clear
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => navigate("forms")}
              className="w-full rounded-[16px] border-2 border-dashed border-[#0325D9] bg-[#F4F6FF] px-4 py-4 text-left"
            >
              <div className="text-[14px] font-bold text-[#0325D9]">Choose or create a form</div>
              <div className="text-[12px] text-[#6B7280] mt-1">A form makes the landing page ready to collect leads immediately.</div>
            </button>
          )}
        </div>

        <div className="space-y-3">
          <div>
            <div className="text-[14px] font-bold text-[#111111]">Pick a template</div>
            <div className="text-[12px] text-[#6B7280]">Each one is optimized for mobile, with a clear action and clean layout.</div>
          </div>
          {LANDING_TEMPLATES.map((template) => {
            const isActive = template.key === selectedTemplateKey;
            return (
              <button
                key={template.key}
                onClick={() => setSelectedTemplateKey(template.key)}
                className="w-full rounded-[22px] border bg-white p-3 text-left transition-transform active:scale-[0.99]"
                style={{ borderColor: isActive ? "#0325D9" : "#EEF0F5", boxShadow: isActive ? "0 12px 28px rgba(3,37,217,0.10)" : "none" }}
              >
                <div className="flex items-center gap-3">
                  <div className="relative h-24 w-[104px] flex-shrink-0 overflow-hidden rounded-[18px]"
                    style={{ background: `linear-gradient(135deg, ${template.colors[0]}, ${template.colors[1]})` }}>
                    <div className="absolute left-3 top-3 h-1.5 w-8 rounded-full bg-white/40" />
                    <div className="absolute inset-x-3 top-8 h-2 rounded-full bg-white/82" />
                    <div className="absolute inset-x-3 top-12 h-2 rounded-full bg-white/62" />
                    <div className="absolute bottom-3 left-3 right-3 h-7 rounded-xl bg-white/92" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="text-[14px] font-black text-[#111111]">{template.name}</div>
                        <div className="text-[12px] text-[#6B7280]">{template.category}</div>
                      </div>
                      {isActive && (
                        <div className="rounded-full bg-[#E9EDFF] px-2.5 py-1 text-[11px] font-semibold text-[#0325D9]">
                          Selected
                        </div>
                      )}
                    </div>
                    <div className="mt-2 text-[12px] text-[#6B7280] line-clamp-2">{template.description}</div>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {template.highlights.slice(0, 2).map((item) => (
                        <span key={item} className="rounded-full bg-[#F7F8FC] px-2.5 py-1 text-[10px] font-semibold text-[#6B7280]">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-[#EEF0F5] bg-white/96 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center gap-3">
          <div className="min-w-0 flex-1">
            <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#9CA3AF]">Create page</div>
            <div className="truncate text-[13px] font-bold text-[#111111]">
              {selectedTemplate.name}{selectedForm ? ` · ${selectedForm.name}` : " · no form attached"}
            </div>
          </div>
          <button
            onClick={() => void onUseTemplate(selectedTemplateKey, selectedForm?._id ?? null)}
            className="rounded-[16px] bg-[#0325D9] px-4 py-3 text-[14px] font-semibold text-white shadow-[0_10px_24px_rgba(3,37,217,0.24)]"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Product Create Screen ──────────────────────────────────────────────────────
function ProductCreateScreen({
  goBack,
  onSaveProduct,
  onCreatePage,
}: {
  goBack: () => void;
  onSaveProduct: (product: { name: string; price: number; description: string; inventory: number; status: string }) => Promise<void>;
  onCreatePage: () => Promise<void>;
}) {
  const [name, setName] = useState("Premium Consultation");
  const [price, setPrice] = useState("299");
  const [description, setDescription] = useState("Get a personalized consultation designed to help you grow your business.");
  const [inventory, setInventory] = useState("0");

  return (
    <div className="pb-8">
      <ScreenHeader title="Create Product" onBack={goBack} />
      <div className="px-4 pt-5 space-y-4">
        <button onClick={() => void onCreatePage()} className="w-full h-36 rounded-[16px] border-2 border-dashed border-[#0325D9] bg-[#F4F6FF] flex flex-col items-center justify-center gap-2">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-[#E9EDFF]">
            <Upload size={20} color="#0325D9" />
          </div>
          <span className="text-[13px] font-semibold text-[#0325D9]">Upload Product Photo</span>
        </button>

        {[
          { label: "Product Name", value: name, setter: setName, placeholder: "Enter product name" },
          { label: "Price", value: price, setter: setPrice, placeholder: "$49.00" },
        ].map(({ label, value, setter, placeholder }) => (
          <div key={label}>
            <div className="text-[13px] font-semibold text-[#333333] mb-1.5">{label}</div>
            <input
              value={value}
              onChange={(event) => setter(event.target.value)}
              placeholder={placeholder}
              className="h-[52px] w-full rounded-xl border border-[#E5E7EB] bg-[#F7F8FC] px-4 text-[14px] text-[#111111] outline-none"
            />
          </div>
        ))}

        <div>
          <div className="text-[13px] font-semibold text-[#333333] mb-1.5">Description</div>
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            className="h-24 w-full rounded-xl border border-[#E5E7EB] bg-[#F7F8FC] px-4 py-3 text-[14px] text-[#111111] outline-none"
            placeholder="Describe your product..."
          />
        </div>

        <div className="p-4 rounded-[16px] bg-[#F7F8FC] border border-[#EEF0F5]">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#9CA3AF] mb-2">Optional</div>
          <div className="space-y-2">
            <div className="flex items-center justify-between py-2.5 border-b border-[#EEF0F5]">
              <span className="text-[13px] text-[#6B7280]">Inventory</span>
              <input value={inventory} onChange={(event) => setInventory(event.target.value)} className="w-24 rounded-lg border border-[#E5E7EB] bg-white px-3 py-1 text-right text-[13px] text-[#111111] outline-none" />
            </div>
            <div className="flex items-center justify-between py-2.5 border-b border-[#EEF0F5]">
              <span className="text-[13px] text-[#6B7280]">Product Category</span>
              <ChevronRight size={14} color="#9CA3AF" />
            </div>
          </div>
        </div>

        <button
          onClick={() => void onSaveProduct({ name, price: Number(price) || 0, description, inventory: Number(inventory) || 0, status: "active" })}
          className="w-full font-bold text-[16px] text-white rounded-xl"
          style={{ height: 52, background: "linear-gradient(135deg, #0325D9, #7448F6)", boxShadow: "0 8px 24px rgba(3,37,217,0.25)" }}
        >
          Create Buy Now Page
        </button>
        <button onClick={() => void onSaveProduct({ name, price: Number(price) || 0, description, inventory: Number(inventory) || 0, status: "draft" })} className="w-full font-bold text-[15px] text-[#111111] rounded-xl bg-[#F7F8FC]" style={{ height: 48 }}>
          Save Product
        </button>
      </div>
    </div>
  );
}

// ── Checkout Preview Screen ────────────────────────────────────────────────────
function CheckoutPreviewScreen({ goBack, product }: { goBack: () => void; product: { name: string; price: number; description?: string } | null }) {
  return (
    <div className="pb-8">
      <ScreenHeader title="Checkout Preview" onBack={goBack} />
      <div className="pb-4">
        <div className="h-48 mx-4 mt-4 rounded-[16px] flex items-center justify-center"
          style={{ background: "linear-gradient(135deg, #E9EDFF, #EEE9FF)" }}>
          <Package size={56} color="#0325D9" />
        </div>
        <div className="px-4 pt-4 space-y-5">
          <div>
            <div className="text-[22px] font-black text-[#111111]">{product?.name ?? "Premium Consultation"}</div>
            <div className="text-[28px] font-black text-[#0325D9] mt-1">${(product?.price ?? 299).toLocaleString()}</div>
            <div className="text-[14px] text-[#6B7280] mt-2">
              {product?.description ?? "Get a personalized consultation designed to help you grow your business."}
            </div>
          </div>

          <div>
            <div className="text-[14px] font-bold text-[#111111] mb-3">Your Information</div>
            <div className="space-y-3">
              {["Name", "Email", "Phone"].map((f) => (
                <div key={f} className="h-[52px] px-4 rounded-xl flex items-center text-[14px] text-[#9CA3AF] bg-[#F7F8FC] border border-[#E5E7EB]">
                  {f}
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="text-[14px] font-bold text-[#111111] mb-3">Payment</div>
            <div className="space-y-3">
              <div className="h-[52px] px-4 rounded-xl flex items-center justify-between bg-[#F7F8FC] border border-[#E5E7EB]">
                <span className="text-[14px] text-[#9CA3AF]">Card number</span>
                <CreditCard size={16} color="#9CA3AF" />
              </div>
              <div className="flex gap-3">
                <div className="flex-1 h-[52px] px-4 rounded-xl flex items-center text-[14px] text-[#9CA3AF] bg-[#F7F8FC] border border-[#E5E7EB]">
                  MM / YY
                </div>
                <div className="w-24 h-[52px] px-4 rounded-xl flex items-center text-[14px] text-[#9CA3AF] bg-[#F7F8FC] border border-[#E5E7EB]">
                  CVC
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between py-3 border-t border-[#EEF0F5]">
            <span className="font-bold text-[15px] text-[#111111]">Total</span>
            <span className="font-black text-[22px] text-[#111111]">$299</span>
          </div>

          <button
            className="w-full font-black text-[18px] text-white rounded-xl"
            style={{ height: 56, background: "#0325D9", boxShadow: "0 10px 28px rgba(3,37,217,0.35)" }}
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Products Screen ────────────────────────────────────────────────────────────
function ProductsScreen({ goBack, navigate, products }: { goBack: () => void; navigate: (s: Screen) => void; products: ProductUI[] }) {

  return (
    <div className="pb-8">
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#EEF0F5]">
        <button onClick={goBack} className="w-9 h-9 flex items-center justify-center rounded-full bg-[#F7F8FC]">
          <ChevronLeft size={18} color="#111111" />
        </button>
        <span className="font-bold text-[17px] text-[#111111]">Products</span>
        <button onClick={() => navigate("product-create")} className="w-9 h-9 flex items-center justify-center rounded-full bg-[#0325D9]">
          <Plus size={16} color="white" />
        </button>
      </div>
      <div className="px-4 pt-4 space-y-3">
        {products.map(({ id, name, price, sales, status, description }) => (
          <div key={id} className="p-4 rounded-[16px] border border-[#EEF0F5] bg-white">
            <div className="flex items-start gap-3">
              <div className="w-14 h-14 rounded-[12px] flex items-center justify-center flex-shrink-0"
                style={{ background: "linear-gradient(135deg, #E9EDFF, #EEE9FF)" }}>
                <Package size={22} color="#0325D9" />
              </div>
              <div className="flex-1">
                <div className="font-bold text-[14px] text-[#111111]">{name}</div>
                <div className="text-[22px] font-black text-[#0325D9]">${price}</div>
                {description && <div className="text-[12px] text-[#6B7280] mt-1 line-clamp-2">{description}</div>}
                <div className="flex items-center justify-between mt-1">
                  <span className="text-[12px] text-[#6B7280]">{sales} Sales</span>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
                    style={{ color: status === "Active" ? "#16B879" : "#6B7280", background: status === "Active" ? "#E8F8F1" : "#F7F8FC" }}>
                    {status}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex gap-2 mt-3 pt-3 border-t border-[#EEF0F5]">
              {["Edit", "View Page", "Share"].map((a) => (
                <button key={a} className="flex-1 py-2 rounded-xl text-[12px] font-semibold bg-[#F7F8FC] text-[#6B7280]">{a}</button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Root App ───────────────────────────────────────────────────────────────────
export default function App() {
  const data = useAppData();
  const [screen, setScreen] = useState<Screen>("home");
  const [activeTab, setActiveTab] = useState<Tab>("home");
  const [showCreate, setShowCreate] = useState(false);
  const [selectedLead, setSelectedLead] = useState<LeadUI | null>(null);
  const [selectedOpp, setSelectedOpp] = useState<OpportunityUI | null>(null);
  const [selectedForm, setSelectedForm] = useState<{ _id: string; name: string; slug: string; fields?: Array<{ label: string; type: string; required?: boolean }>; publishSettings?: { path?: string } } | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<{ name: string; price: number; description?: string } | null>(null);
  const [pipelineStage, setPipelineStage] = useState(0);
  const [filterTab, setFilterTab] = useState("All");

  const DETAIL_SCREENS: Screen[] = [
    "lead-detail", "opp-detail", "analytics", "orders", "notifications",
    "settings", "forms", "form-templates", "form-editor", "form-published",
    "landing-templates", "product-create", "checkout-preview", "products",
  ];

  const navigate = (s: Screen) => {
    setScreen(s);
    setShowCreate(false);
    if (!DETAIL_SCREENS.includes(s)) setActiveTab(s as Tab);
  };

  const goBack = () => {
    if (screen === "lead-detail") { setScreen("leads"); setActiveTab("leads"); }
    else if (screen === "opp-detail") { setScreen("pipeline"); setActiveTab("pipeline"); }
    else if (["analytics", "orders", "notifications", "settings", "products", "forms"].includes(screen)) { setScreen("more"); setActiveTab("more"); }
    else if (screen === "form-templates" || screen === "form-editor" || screen === "form-published") { setScreen("forms"); setActiveTab("more"); }
    else { setScreen("home"); setActiveTab("home"); }
  };

  const tabNav = (tab: Tab) => { setActiveTab(tab); setScreen(tab as Screen); };

  const showNav = !DETAIL_SCREENS.includes(screen);
  const currentLead = selectedLead ?? data.leads[0];
  const currentOpp = selectedOpp ?? data.opportunities[0];
  const currentForm = selectedForm ?? (data.forms[0] ? {
    _id: data.forms[0]._id,
    name: data.forms[0].name,
    slug: data.forms[0].slug,
    fields: data.forms[0].fields?.map((field) => ({ label: field.label, type: field.type, required: field.required })),
    publishSettings: data.forms[0].publishSettings,
  } : null);
  const currentFormShareUrl = currentForm?.publishSettings?.path
    ? buildApiUrl(currentForm.publishSettings.path)
    : currentForm?.slug
      ? buildApiUrl(`/public/forms/${currentForm.slug}`)
      : "";

  const startBlankForm = async (templateName?: string) => {
    const templateMap: Record<string, { description: string; fields: Array<{ key: string; label: string; type: string; required: boolean; order: number }> }> = {
      "Consultation Request": {
        description: "Capture consultation requests and project scope.",
        fields: [
          { key: "name", label: "Name", type: "Short Text", required: true, order: 0 },
          { key: "email", label: "Email", type: "Email", required: true, order: 1 },
          { key: "phone", label: "Phone", type: "Phone", required: false, order: 2 },
        ],
      },
      "Lead Generation": {
        description: "Capture lead details quickly.",
        fields: [
          { key: "firstName", label: "First Name", type: "Short Text", required: true, order: 0 },
          { key: "lastName", label: "Last Name", type: "Short Text", required: true, order: 1 },
          { key: "email", label: "Email", type: "Email", required: true, order: 2 },
        ],
      },
    };

    const selectedTemplate = templateName ? templateMap[templateName] : null;
    const form = await data.createForm({
      name: templateName ?? "New Lead Form",
      description: selectedTemplate?.description ?? "Tell us a little about yourself.",
      fields: selectedTemplate?.fields ?? [
        { key: "name", label: "Name", type: "Short Text", required: true, order: 0 },
        { key: "email", label: "Email", type: "Email", required: true, order: 1 },
        { key: "interest", label: "What are you interested in?", type: "Multiple Choice", required: false, order: 2 },
      ],
      submitAction: { createContact: true, createOpportunity: false, pipelineStage: "new" },
      status: "draft",
    });
    setSelectedForm({
      _id: form._id,
      name: form.name,
      slug: form.slug,
      fields: form.fields?.map((field) => ({ label: field.label, type: field.type, required: field.required })),
      publishSettings: form.publishSettings,
    });
    navigate("form-editor");
  };

  const saveCurrentForm = async () => {
    if (!currentForm) {
      return;
    }
    await data.updateForm(currentForm._id, {
      name: currentForm.name,
      slug: currentForm.slug,
      fields: currentForm.fields ?? [],
    });
  };

  const publishCurrentForm = async () => {
    if (!currentForm) {
      return;
    }
    const published = await data.publishForm(currentForm._id);
    setSelectedForm({
      _id: published._id,
      name: published.name,
      slug: published.slug,
      fields: published.fields?.map((field) => ({ label: field.label, type: field.type, required: field.required })),
      publishSettings: published.publishSettings,
    });
    navigate("form-published");
  };

  const useLandingTemplate = async (templateKey: LandingTemplateKey, formId: string | null) => {
    const template = LANDING_TEMPLATES.find((item) => item.key === templateKey) ?? LANDING_TEMPLATES[0];
    const selectedLandingForm = formId ? data.forms.find((form) => form._id === formId) ?? null : null;

    await data.createPage({
      name: template.name,
      type: "landing",
      status: "draft",
      seo: {
        title: template.name,
        description: template.description,
      },
      sections: [
        {
          type: "hero",
          template: template.key,
          headline: template.headline,
          description: template.description,
          ctaLabel: template.ctaLabel,
          colors: template.colors,
        },
        {
          type: "form",
          layout: "inline",
          formId: selectedLandingForm?._id ?? null,
          formName: selectedLandingForm?.name ?? null,
          formSlug: selectedLandingForm?.slug ?? null,
          ctaLabel: selectedLandingForm ? "Submit" : "Create a form",
        },
        {
          type: "highlights",
          items: template.highlights,
        },
      ],
    });
    navigate("more");
  };

  const saveProductDraft = async (draft: { name: string; price: number; description: string; inventory: number; status: string }) => {
    const product = await data.createProduct({
      name: draft.name,
      slug: draft.name,
      description: draft.description,
      price: draft.price,
      status: draft.status === "active" ? "active" : "draft",
      inventory: draft.inventory,
      checkoutSettings: { allowQuantity: true },
    });
    await data.createPage({
      name: `${product.name} Checkout`,
      slug: `${product.slug}-checkout`,
      type: "buy-now",
      status: "draft",
      sections: [
        {
          type: "product-checkout",
          productId: product._id,
        },
      ],
    });
    setSelectedProduct({
      name: product.name,
      price: product.price,
      description: product.description,
    });
    navigate("checkout-preview");
  };

  const createFromLeadPrompt = async () => {
    const name = window.prompt("Lead name");
    if (!name) return;
    const email = window.prompt("Lead email") ?? undefined;
    const phone = window.prompt("Lead phone") ?? undefined;
    const interest = window.prompt("Interest", "General inquiry") ?? undefined;
    await data.createLead({ name, email, phone, interest, source: "manual" });
  };

  const createOpportunityPrompt = async () => {
    const name = window.prompt("Contact name");
    if (!name) return;
    const contactEmail = window.prompt("Contact email") ?? undefined;
    const contact = await data.createLead({ name, email: contactEmail, source: "manual", interest: "New opportunity" });
    const title = window.prompt("Opportunity title", "New Opportunity") ?? "New Opportunity";
    const value = Number(window.prompt("Opportunity value", "0") ?? "0");
    await data.createOpportunity({ contactId: contact.rawId, title, value, stageKey: "new", source: "manual" });
  };

  if (data.loading) {
    return (
      <div className="flex h-dvh items-center justify-center bg-white text-[#111111]">
        <div className="text-center">
          <div className="text-[18px] font-bold">Loading workspace</div>
          <div className="text-[13px] text-[#6B7280] mt-1">Connecting the frontend to the backend.</div>
        </div>
      </div>
    );
  }

  if (data.error) {
    return (
      <div className="flex h-dvh items-center justify-center bg-white px-6 text-center">
        <div>
          <div className="text-[18px] font-bold text-[#111111]">Unable to load app data</div>
          <div className="text-[13px] text-[#6B7280] mt-2">{data.error}</div>
          <button
            onClick={() => void data.refresh()}
            className="mt-4 rounded-xl bg-[#0325D9] px-4 py-2 text-[14px] font-semibold text-white"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="h-dvh w-full overflow-hidden"
      style={{ background: "linear-gradient(135deg, #eef1ff 0%, #f3eeff 50%, #eef5ff 100%)", fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}
    >
      <div className="relative flex h-full min-h-0 w-full flex-col overflow-hidden bg-white">
        <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain pb-28" style={{ scrollbarWidth: "none" }}>
          {screen === "home" && (
            <HomeScreen
              navigate={navigate}
              setShowCreate={setShowCreate}
              leads={data.leads as any}
              opportunities={data.opportunities as any}
              workspaceName={data.workspaceName}
              userName={data.userName}
              summary={data.summary}
            />
          )}
          {screen === "leads" && (
            <LeadsScreen
              leads={data.leads as any}
              filterTab={filterTab}
              setFilterTab={setFilterTab}
              onSelect={(lead) => { setSelectedLead(lead as LeadUI); navigate("lead-detail"); }}
              onCreateLead={createFromLeadPrompt}
            />
          )}
          {screen === "lead-detail" && currentLead && <LeadDetailScreen lead={currentLead as any} goBack={goBack} />}
          {screen === "pipeline" && (
            <PipelineScreen
              opportunities={data.opportunities as any}
              stage={pipelineStage}
              setStage={setPipelineStage}
              onSelect={(opp) => { setSelectedOpp(opp as OpportunityUI); navigate("opp-detail"); }}
              onCreateOpportunity={createOpportunityPrompt}
            />
          )}
          {screen === "opp-detail" && currentOpp && <OppDetailScreen opp={currentOpp as any} goBack={goBack} />}
          {screen === "more" && (
            <MoreScreen
              navigate={navigate}
              summary={data.summary}
              forms={data.forms}
              products={data.products}
              notifications={data.notifications}
              orders={data.orders}
              workspaceName={data.workspaceName}
              userName={data.userName}
              userEmail={data.userEmail}
            />
          )}
          {screen === "analytics" && <AnalyticsScreen data={data.analytics as any} summary={data.summary} goBack={goBack} />}
          {screen === "orders" && <OrdersScreen goBack={goBack} orders={data.orders} summary={data.summary} />}
          {screen === "notifications" && <NotificationsScreen goBack={goBack} notifications={data.notifications} onRead={data.markNotificationRead} />}
          {screen === "settings" && <SettingsScreen goBack={goBack} />}
          {screen === "forms" && (
            <FormsScreen
              goBack={goBack}
              navigate={navigate}
              forms={data.forms}
              onSelect={(form) => {
                setSelectedForm({
                  _id: form._id,
                  name: form.name,
                  slug: form.slug,
                  fields: form.fields?.map((field) => ({ label: field.label, type: field.type, required: field.required })),
                  publishSettings: form.publishSettings,
                });
                navigate("form-editor");
              }}
            />
          )}
          {screen === "form-templates" && <FormTemplatesScreen goBack={goBack} onCreateDraft={startBlankForm} />}
          {screen === "form-editor" && <FormEditorScreen goBack={goBack} form={currentForm} onSave={saveCurrentForm} onPublish={publishCurrentForm} />}
          {screen === "form-published" && <FormPublishedScreen goBack={goBack} shareUrl={currentFormShareUrl} />}
          {screen === "landing-templates" && (
            <LandingTemplatesScreen
              goBack={goBack}
              navigate={navigate}
              forms={data.forms}
              onUseTemplate={useLandingTemplate}
            />
          )}
          {screen === "product-create" && (
            <ProductCreateScreen
              goBack={goBack}
              onSaveProduct={saveProductDraft}
              onCreatePage={async () => {
                await data.createPage({ name: "Buy Now Page", type: "buy-now", status: "draft", sections: [] });
              }}
            />
          )}
          {screen === "checkout-preview" && <CheckoutPreviewScreen goBack={goBack} product={selectedProduct} />}
          {screen === "products" && <ProductsScreen goBack={goBack} navigate={navigate} products={data.products} />}
        </div>

        {showNav && <BottomNav active={activeTab} onTab={tabNav} onCreate={() => setShowCreate(true)} />}
        {showCreate && <CreateSheet onClose={() => setShowCreate(false)} navigate={navigate} />}
      </div>
    </div>
  );
}
