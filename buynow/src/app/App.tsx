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

// ── Types ──────────────────────────────────────────────────────────────────────
type Screen =
  | "home" | "leads" | "lead-detail" | "pipeline" | "opp-detail"
  | "more" | "analytics" | "orders" | "notifications" | "settings"
  | "form-templates" | "form-editor" | "form-published"
  | "landing-templates" | "product-create" | "checkout-preview" | "products";

type Tab = "home" | "leads" | "pipeline" | "more";

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
function HomeScreen({ navigate, setShowCreate, leads, opportunities }: {
  navigate: (s: Screen) => void;
  setShowCreate: (v: boolean) => void;
  leads: typeof LEADS;
  opportunities: typeof OPPS;
}) {
  return (
    <div className="px-4 pb-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between pt-2">
        <div>
          <div className="text-[22px] font-black text-[#111111]">Good morning, Jake 👋</div>
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
        <div className="text-[44px] font-black leading-none mb-2">1,248</div>
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
          { label: "New Leads", value: "+42", Icon: Users, color: "#0325D9", bg: "#E9EDFF" },
          { label: "Pipeline Value", value: "$24.5K", Icon: DollarSign, color: "#7448F6", bg: "#EEE9FF" },
          { label: "Conversions", value: "8.4%", Icon: TrendingUp, color: "#16B879", bg: "#E8F8F1" },
          { label: "Orders", value: "126", Icon: ShoppingBag, color: "#FF8A00", bg: "#FFF3E5" },
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
function LeadsScreen({ leads, filterTab, setFilterTab, onSelect }: {
  leads: typeof LEADS;
  filterTab: string;
  setFilterTab: (f: string) => void;
  onSelect: (l: (typeof LEADS)[0]) => void;
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
            <button className="w-9 h-9 flex items-center justify-center rounded-full bg-[#0325D9]">
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
function PipelineScreen({ opportunities, stage, setStage, onSelect }: {
  opportunities: typeof OPPS;
  stage: number;
  setStage: (n: number) => void;
  onSelect: (o: (typeof OPPS)[0]) => void;
}) {
  const currentStage = STAGES[stage];
  const stageOpps = opportunities.filter((o) => o.stage === currentStage);
  const totalValue = opportunities.reduce((s, o) => s + o.value, 0);

  return (
    <div className="pb-4">
      <div className="px-4 pt-2 pb-4">
        <div className="flex items-center justify-between mb-1">
          <h1 className="text-[22px] font-black text-[#111111]">Pipeline</h1>
          <button className="w-9 h-9 flex items-center justify-center rounded-full bg-[#0325D9]">
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
            <button className="px-5 py-2.5 rounded-xl text-[14px] font-semibold text-white bg-[#0325D9]">
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
function MoreScreen({ navigate }: { navigate: (s: Screen) => void }) {
  const items = [
    { Icon: BarChart2, label: "Analytics", desc: "Visitors, leads, revenue", screen: "analytics", color: "#0325D9", bg: "#E9EDFF" },
    { Icon: ShoppingCart, label: "Orders", desc: "84 orders · $12,450 revenue", screen: "orders", color: "#16B879", bg: "#E8F8F1" },
    { Icon: Layout, label: "Pages", desc: "3 published landing pages", screen: "landing-templates", color: "#7448F6", bg: "#EEE9FF" },
    { Icon: Package, label: "Products", desc: "5 active products", screen: "products", color: "#FF8A00", bg: "#FFF3E5" },
    { Icon: Bell, label: "Notifications", desc: "3 unread alerts", screen: "notifications", color: "#0325D9", bg: "#E9EDFF" },
    { Icon: Settings, label: "Settings", desc: "Account, billing, team", screen: "settings", color: "#6B7280", bg: "#F7F8FC" },
  ] as const;

  return (
    <div className="pb-4">
      <div className="px-4 pt-4 pb-5 border-b border-[#EEF0F5]">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-full flex items-center justify-center text-white font-black text-[18px]"
            style={{ background: "linear-gradient(135deg, #0325D9, #7448F6)" }}>
            JK
          </div>
          <div className="flex-1">
            <div className="font-black text-[17px] text-[#111111]">Jake Keller</div>
            <div className="text-[13px] text-[#6B7280]">jake@business.com</div>
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
function AnalyticsScreen({ data, goBack }: { data: typeof ANALYTICS; goBack: () => void }) {
  const [period, setPeriod] = useState("7 Days");
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
            { label: "Visitors", value: "12,840", change: "+18%" },
            { label: "Leads", value: "1,248", change: "+12.5%" },
            { label: "Conversion", value: "9.7%", change: "+2.1%" },
            { label: "Revenue", value: "$24,560", change: "+24%" },
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

// ── Orders Screen ──────────────────────────────────────────────────────────────
function OrdersScreen({ goBack }: { goBack: () => void }) {
  const orders = [
    { id: "#1048", product: "Premium Consultation", amount: 299, customer: "Sarah Johnson", status: "Paid", time: "Today" },
    { id: "#1047", product: "Website Template", amount: 49, customer: "Mike Rodriguez", status: "Paid", time: "Today" },
    { id: "#1046", product: "Marketing Bundle", amount: 199, customer: "Jessica Smith", status: "Pending", time: "Yesterday" },
    { id: "#1045", product: "Premium Consultation", amount: 299, customer: "David Chen", status: "Paid", time: "2 days ago" },
  ];
  const sColor: Record<string, string> = { Paid: "#16B879", Pending: "#FF8A00", Refunded: "#6B7280", Failed: "#EF4444" };
  const sBg: Record<string, string> = { Paid: "#E8F8F1", Pending: "#FFF3E5", Refunded: "#F7F8FC", Failed: "#FEECEC" };

  return (
    <div className="pb-8">
      <ScreenHeader title="Orders" onBack={goBack} />
      <div className="px-4 pt-5 space-y-5">
        <div className="rounded-[20px] p-5 text-white" style={{ background: "linear-gradient(135deg, #0325D9, #7448F6)" }}>
          <div className="text-white/70 text-[12px] mb-1">Total Revenue</div>
          <div className="text-white font-black text-[36px] leading-none mb-3">$12,450</div>
          <div className="flex gap-6">
            <div><div className="text-white/70 text-[11px]">Orders</div><div className="text-white font-bold text-[16px]">84</div></div>
            <div><div className="text-white/70 text-[11px]">Avg. Order</div><div className="text-white font-bold text-[16px]">$148</div></div>
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
function NotificationsScreen({ goBack }: { goBack: () => void }) {
  const notifs = [
    { title: "New lead captured", body: "Sarah Johnson submitted Consultation Request.", time: "2 min ago", color: "#0325D9", bg: "#E9EDFF", Icon: Users },
    { title: "Payment received", body: "$299 payment from Mike Rodriguez.", time: "15 min ago", color: "#16B879", bg: "#E8F8F1", Icon: DollarSign },
    { title: "Pipeline update", body: "Sarah Johnson moved to Proposal.", time: "1 hour ago", color: "#7448F6", bg: "#EEE9FF", Icon: GitBranch },
    { title: "New lead captured", body: "David Chen submitted Lead Form.", time: "2 hours ago", color: "#0325D9", bg: "#E9EDFF", Icon: Users },
  ];

  return (
    <div className="pb-8">
      <ScreenHeader title="Notifications" onBack={goBack} />
      <div className="px-4 pt-4 space-y-2">
        {notifs.map(({ title, body, time, color, bg, Icon }, i) => (
          <div key={i} className="flex gap-3 p-4 rounded-[16px] border"
            style={{ background: i < 2 ? "#FAFBFF" : "#FFFFFF", borderColor: i < 2 ? "#D4DEFF" : "#EEF0F5" }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: bg }}>
              <Icon size={18} color={color} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-[14px] text-[#111111]">{title}</div>
              <div className="text-[12px] text-[#6B7280] mt-0.5">{body}</div>
              <div className="text-[11px] text-[#9CA3AF] mt-1">{time}</div>
            </div>
            {i < 2 && <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0 bg-[#0325D9]" />}
          </div>
        ))}
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
function FormTemplatesScreen({ goBack, navigate }: { goBack: () => void; navigate: (s: Screen) => void }) {
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
          onClick={() => navigate("form-editor")}
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
              onClick={() => navigate("form-editor")}
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
function FormEditorScreen({ goBack, navigate }: { goBack: () => void; navigate: (s: Screen) => void }) {
  const fields = [
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
        <span className="font-bold text-[16px] text-[#111111]">New Lead Form</span>
        <div className="flex gap-2">
          <button className="px-3 py-1.5 rounded-xl text-[13px] font-semibold bg-[#F7F8FC] text-[#111111]">Save</button>
          <button onClick={() => navigate("form-published")} className="px-3 py-1.5 rounded-xl text-[13px] font-semibold text-white bg-[#0325D9]">
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
function FormPublishedScreen({ goBack }: { goBack: () => void }) {
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
          <div className="text-[13px] font-semibold text-[#0325D9]">app.leadflow.io/f/consultation</div>
        </div>

        <div className="w-full grid grid-cols-2 gap-3">
          {[
            { Icon: Copy, label: "Copy Link", color: "#0325D9", bg: "#E9EDFF" },
            { Icon: Share2, label: "Share", color: "#7448F6", bg: "#EEE9FF" },
            { Icon: Eye, label: "Preview", color: "#16B879", bg: "#E8F8F1" },
            { Icon: Edit3, label: "Edit Form", color: "#FF8A00", bg: "#FFF3E5" },
          ].map(({ Icon, label, color, bg }) => (
            <button key={label} className="flex items-center gap-2.5 p-3.5 rounded-[14px]" style={{ background: bg }}>
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

        <button className="w-full font-bold text-[16px] text-white rounded-xl bg-[#0325D9]"
          style={{ height: 52, boxShadow: "0 8px 24px rgba(3,37,217,0.25)" }}>
          Share Form
        </button>
      </div>
    </div>
  );
}

// ── Landing Templates Screen ───────────────────────────────────────────────────
function LandingTemplatesScreen({ goBack }: { goBack: () => void }) {
  const templates = [
    { name: "Modern Agency", category: "Lead Generation", colors: ["#0325D9", "#7448F6"] },
    { name: "Service Business", category: "Consultation", colors: ["#16B879", "#0B36E5"] },
    { name: "Creator Brand", category: "Personal Brand", colors: ["#7448F6", "#FF8A00"] },
    { name: "Simple SaaS", category: "Product Signup", colors: ["#0325D9", "#16B879"] },
    { name: "Local Business", category: "Contact Page", colors: ["#FF8A00", "#0325D9"] },
  ];

  return (
    <div className="pb-8">
      <ScreenHeader title="Landing Pages" onBack={goBack} />
      <div className="px-4 pt-4 space-y-3">
        <div className="text-[14px] text-[#6B7280] mb-1">Choose a template to get started quickly</div>
        {templates.map(({ name, category, colors }) => (
          <div key={name} className="rounded-[16px] border border-[#EEF0F5] overflow-hidden">
            <div className="h-28 p-4 flex flex-col justify-between"
              style={{ background: `linear-gradient(135deg, ${colors[0]}, ${colors[1]})` }}>
              <div className="w-8 h-1.5 rounded-full bg-white/40" />
              <div>
                <div className="h-2 w-24 rounded-full bg-white/90 mb-2" />
                <div className="h-1.5 w-32 rounded-full bg-white/60 mb-3" />
                <div className="h-7 w-24 rounded-xl bg-white/90" />
              </div>
            </div>
            <div className="flex items-center justify-between p-3.5 bg-white">
              <div>
                <div className="font-bold text-[14px] text-[#111111]">{name}</div>
                <div className="text-[12px] text-[#6B7280]">{category}</div>
              </div>
              <button className="px-3 py-1.5 rounded-xl text-[12px] font-semibold text-white bg-[#0325D9]">
                Use Template
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Product Create Screen ──────────────────────────────────────────────────────
function ProductCreateScreen({ goBack, navigate }: { goBack: () => void; navigate: (s: Screen) => void }) {
  return (
    <div className="pb-8">
      <ScreenHeader title="Create Product" onBack={goBack} />
      <div className="px-4 pt-5 space-y-4">
        <button className="w-full h-36 rounded-[16px] border-2 border-dashed border-[#0325D9] bg-[#F4F6FF] flex flex-col items-center justify-center gap-2">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-[#E9EDFF]">
            <Upload size={20} color="#0325D9" />
          </div>
          <span className="text-[13px] font-semibold text-[#0325D9]">Upload Product Photo</span>
        </button>

        {[
          { label: "Product Name", placeholder: "Enter product name" },
          { label: "Price", placeholder: "$49.00" },
        ].map(({ label, placeholder }) => (
          <div key={label}>
            <div className="text-[13px] font-semibold text-[#333333] mb-1.5">{label}</div>
            <div className="h-[52px] px-4 rounded-xl flex items-center text-[14px] text-[#9CA3AF] bg-[#F7F8FC] border border-[#E5E7EB]">
              {placeholder}
            </div>
          </div>
        ))}

        <div>
          <div className="text-[13px] font-semibold text-[#333333] mb-1.5">Description</div>
          <div className="h-24 px-4 py-3 rounded-xl text-[14px] text-[#9CA3AF] bg-[#F7F8FC] border border-[#E5E7EB]">
            Describe your product...
          </div>
        </div>

        <div className="p-4 rounded-[16px] bg-[#F7F8FC] border border-[#EEF0F5]">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#9CA3AF] mb-2">Optional</div>
          {["SKU", "Inventory", "Product Category"].map((f) => (
            <div key={f} className="flex items-center justify-between py-2.5 border-b border-[#EEF0F5] last:border-0">
              <span className="text-[13px] text-[#6B7280]">{f}</span>
              <ChevronRight size={14} color="#9CA3AF" />
            </div>
          ))}
        </div>

        <button
          onClick={() => navigate("checkout-preview")}
          className="w-full font-bold text-[16px] text-white rounded-xl"
          style={{ height: 52, background: "linear-gradient(135deg, #0325D9, #7448F6)", boxShadow: "0 8px 24px rgba(3,37,217,0.25)" }}
        >
          Create Buy Now Page
        </button>
        <button className="w-full font-bold text-[15px] text-[#111111] rounded-xl bg-[#F7F8FC]" style={{ height: 48 }}>
          Save Product
        </button>
      </div>
    </div>
  );
}

// ── Checkout Preview Screen ────────────────────────────────────────────────────
function CheckoutPreviewScreen({ goBack }: { goBack: () => void }) {
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
            <div className="text-[22px] font-black text-[#111111]">Premium Consultation</div>
            <div className="text-[28px] font-black text-[#0325D9] mt-1">$299</div>
            <div className="text-[14px] text-[#6B7280] mt-2">
              Get a personalized consultation designed to help you grow your business.
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
function ProductsScreen({ goBack, navigate }: { goBack: () => void; navigate: (s: Screen) => void }) {
  const products = [
    { name: "Premium Consultation", price: 299, sales: 127, status: "Active" },
    { name: "Website Template", price: 49, sales: 84, status: "Active" },
    { name: "Marketing Bundle", price: 199, sales: 31, status: "Active" },
    { name: "Brand Strategy Kit", price: 149, sales: 12, status: "Draft" },
  ];

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
        {products.map(({ name, price, sales, status }) => (
          <div key={name} className="p-4 rounded-[16px] border border-[#EEF0F5] bg-white">
            <div className="flex items-start gap-3">
              <div className="w-14 h-14 rounded-[12px] flex items-center justify-center flex-shrink-0"
                style={{ background: "linear-gradient(135deg, #E9EDFF, #EEE9FF)" }}>
                <Package size={22} color="#0325D9" />
              </div>
              <div className="flex-1">
                <div className="font-bold text-[14px] text-[#111111]">{name}</div>
                <div className="text-[22px] font-black text-[#0325D9]">${price}</div>
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
  const [screen, setScreen] = useState<Screen>("home");
  const [activeTab, setActiveTab] = useState<Tab>("home");
  const [showCreate, setShowCreate] = useState(false);
  const [selectedLead, setSelectedLead] = useState(LEADS[0]);
  const [selectedOpp, setSelectedOpp] = useState(OPPS[0]);
  const [pipelineStage, setPipelineStage] = useState(0);
  const [filterTab, setFilterTab] = useState("All");

  const DETAIL_SCREENS: Screen[] = [
    "lead-detail", "opp-detail", "analytics", "orders", "notifications",
    "settings", "form-templates", "form-editor", "form-published",
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
    else if (["analytics", "orders", "notifications", "settings", "products"].includes(screen)) { setScreen("more"); setActiveTab("more"); }
    else { setScreen("home"); setActiveTab("home"); }
  };

  const tabNav = (tab: Tab) => { setActiveTab(tab); setScreen(tab as Screen); };

  const showNav = !DETAIL_SCREENS.includes(screen);

  return (
    <div
      className="h-dvh w-full overflow-hidden"
      style={{ background: "linear-gradient(135deg, #eef1ff 0%, #f3eeff 50%, #eef5ff 100%)", fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}
    >
      <div className="relative flex h-full min-h-0 w-full flex-col overflow-hidden bg-white">
        {/* Content */}
        <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain pb-28" style={{ scrollbarWidth: "none" }}>
          {screen === "home" && (
            <HomeScreen navigate={navigate} setShowCreate={setShowCreate} leads={LEADS} opportunities={OPPS} />
          )}
          {screen === "leads" && (
            <LeadsScreen
              leads={LEADS}
              filterTab={filterTab}
              setFilterTab={setFilterTab}
              onSelect={(lead) => { setSelectedLead(lead); navigate("lead-detail"); }}
            />
          )}
          {screen === "lead-detail" && <LeadDetailScreen lead={selectedLead} goBack={goBack} />}
          {screen === "pipeline" && (
            <PipelineScreen
              opportunities={OPPS}
              stage={pipelineStage}
              setStage={setPipelineStage}
              onSelect={(opp) => { setSelectedOpp(opp); navigate("opp-detail"); }}
            />
          )}
          {screen === "opp-detail" && <OppDetailScreen opp={selectedOpp} goBack={goBack} />}
          {screen === "more" && <MoreScreen navigate={navigate} />}
          {screen === "analytics" && <AnalyticsScreen data={ANALYTICS} goBack={goBack} />}
          {screen === "orders" && <OrdersScreen goBack={goBack} />}
          {screen === "notifications" && <NotificationsScreen goBack={goBack} />}
          {screen === "settings" && <SettingsScreen goBack={goBack} />}
          {screen === "form-templates" && <FormTemplatesScreen goBack={goBack} navigate={navigate} />}
          {screen === "form-editor" && <FormEditorScreen goBack={goBack} navigate={navigate} />}
          {screen === "form-published" && <FormPublishedScreen goBack={goBack} />}
          {screen === "landing-templates" && <LandingTemplatesScreen goBack={goBack} />}
          {screen === "product-create" && <ProductCreateScreen goBack={goBack} navigate={navigate} />}
          {screen === "checkout-preview" && <CheckoutPreviewScreen goBack={goBack} />}
          {screen === "products" && <ProductsScreen goBack={goBack} navigate={navigate} />}
        </div>

        {/* Bottom nav */}
        {showNav && <BottomNav active={activeTab} onTab={tabNav} onCreate={() => setShowCreate(true)} />}

        {/* Create sheet */}
        {showCreate && <CreateSheet onClose={() => setShowCreate(false)} navigate={navigate} />}
      </div>
    </div>
  );
}
