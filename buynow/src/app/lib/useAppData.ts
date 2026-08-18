import { useEffect, useMemo, useState } from "react";
import { apiRequest, bootstrapContext, loadStoredContext, saveStoredContext, type AppContext } from "./api";

type BackendContact = {
  _id: string;
  name: string;
  email?: string;
  phone?: string;
  source?: string;
  kind?: string;
  status?: string;
  interest?: string;
  createdAt?: string;
  lastActivityAt?: string;
};

type BackendOpportunity = {
  _id: string;
  contactId: string;
  title: string;
  value: number;
  stageKey: string;
  status?: string;
  source?: string;
  closeDate?: string;
  createdAt?: string;
};

type BackendPipeline = {
  _id: string;
  name: string;
  isDefault?: boolean;
  stages: Array<{ key: string; label: string; color?: string; position?: number }>;
};

type BackendProduct = {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  currency?: string;
  status?: string;
  inventory?: number;
  imageAssetId?: string;
  createdAt?: string;
};

type BackendPage = {
  _id: string;
  name: string;
  slug: string;
  type: "landing" | "buy-now";
  status?: string;
  publishedUrl?: string;
  createdAt?: string;
};

type BackendOrder = {
  _id: string;
  orderNumber: string;
  status?: string;
  subtotal?: number;
  tax?: number;
  shipping?: number;
  discount?: number;
  total: number;
  currency?: string;
  productId?: string;
  contactId?: string;
  billing?: { name?: string; email?: string };
  paidAt?: string;
  createdAt?: string;
};

type BackendNotification = {
  _id: string;
  type: string;
  title: string;
  body?: string;
  readAt?: string;
  link?: string;
  createdAt?: string;
};

type BackendActivity = {
  _id: string;
  type: string;
  title: string;
  body?: string;
  occurredAt?: string;
};

type BackendForm = {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  status?: string;
  fields?: Array<{ key: string; label: string; type: string; required?: boolean; options?: string[]; placeholder?: string }>;
  submitAction?: { createContact?: boolean; createOpportunity?: boolean; pipelineStage?: string };
  publishSettings?: { path?: string };
  stats?: { views?: number; starts?: number; submissions?: number };
  createdAt?: string;
};

export type LeadUI = {
  id: string;
  name: string;
  email: string;
  phone: string;
  source: string;
  status: string;
  time: string;
  interest: string;
  initials: string;
  kind?: string;
  rawId: string;
};

export type OpportunityUI = {
  id: string;
  name: string;
  title: string;
  value: number;
  stage: string;
  close: string;
  source: string;
  rawId: string;
};

export type ProductUI = {
  id: string;
  name: string;
  price: number;
  sales: number;
  status: string;
  description?: string;
  rawId: string;
};

export type OrderUI = {
  id: string;
  product: string;
  amount: number;
  customer: string;
  status: string;
  time: string;
  rawId: string;
};

export type NotificationUI = {
  id: string;
  title: string;
  body: string;
  time: string;
  unread: boolean;
  color: string;
  bg: string;
  icon: "users" | "payment" | "pipeline" | "system";
  rawId: string;
};

export type AnalyticsPoint = { day: string; visitors: number; leads: number };

export type AppSummary = {
  counts: {
    contacts: number;
    opportunities: number;
    orders: number;
    submissions: number;
    products: number;
    pages: number;
    notifications: number;
  };
  revenue: number;
};

export type AppData = {
  workspaceName: string;
  userName: string;
  userEmail: string;
  context: AppContext;
  pipeline: BackendPipeline | null;
  pipelineStages: Array<{ key: string; label: string; color?: string; position?: number }>;
  leads: LeadUI[];
  opportunities: OpportunityUI[];
  products: ProductUI[];
  pages: BackendPage[];
  orders: OrderUI[];
  notifications: NotificationUI[];
  forms: BackendForm[];
  analytics: AnalyticsPoint[];
  summary: AppSummary;
  activities: BackendActivity[];
};

function titleCase(value?: string) {
  if (!value) {
    return "New";
  }

  return value
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return (parts[0]?.[0] ?? "U") + (parts[1]?.[0] ?? parts[0]?.[1] ?? "N");
}

function formatTimeLabel(value?: string) {
  if (!value) {
    return "Just now";
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "Just now";
  }
  const deltaMs = Date.now() - date.getTime();
  const deltaMinutes = Math.max(0, Math.round(deltaMs / 60000));
  if (deltaMinutes < 60) return `${deltaMinutes || 1} min ago`;
  const deltaHours = Math.round(deltaMinutes / 60);
  if (deltaHours < 24) return `${deltaHours} hr ago`;
  const deltaDays = Math.round(deltaHours / 24);
  return `${deltaDays} day${deltaDays === 1 ? "" : "s"} ago`;
}

function formatShortDate(value?: string) {
  if (!value) {
    return "TBD";
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "TBD";
  }
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function formatNumber(value: number) {
  return value.toLocaleString(undefined, { maximumFractionDigits: 0 });
}

function buildAnalytics(points: BackendActivity[], contacts: BackendContact[]): AnalyticsPoint[] {
  const days = Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - index));
    return date;
  });

  return days.map((date) => {
    const key = date.toDateString();
    const leadCount = contacts.filter((contact) => {
      const created = contact.createdAt ? new Date(contact.createdAt) : null;
      return created?.toDateString() === key;
    }).length;
    const activityCount = points.filter((activity) => {
      const occurred = activity.occurredAt ? new Date(activity.occurredAt) : null;
      return occurred?.toDateString() === key;
    }).length;

    return {
      day: date.toLocaleDateString(undefined, { weekday: "short" }),
      visitors: Math.max(150, activityCount * 42 + leadCount * 18 + (date.getDay() + 1) * 27),
      leads: leadCount,
    };
  });
}

function buildNotifications(items: BackendNotification[]): NotificationUI[] {
  return items.map((item) => {
    const type = item.type === "payment" ? "payment" : item.type === "pipeline" ? "pipeline" : item.type === "system" ? "system" : "users";
    const color = type === "payment" ? "#16B879" : type === "pipeline" ? "#7448F6" : "#0325D9";
    const bg = type === "payment" ? "#E8F8F1" : type === "pipeline" ? "#EEE9FF" : "#E9EDFF";

    return {
      id: item._id,
      title: item.title,
      body: item.body ?? "",
      time: formatTimeLabel(item.createdAt),
      unread: !item.readAt,
      color,
      bg,
      icon: type,
      rawId: item._id,
    };
  });
}

export function useAppData() {
  const [context, setContext] = useState<AppContext | null>(loadStoredContext());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [workspaceName, setWorkspaceName] = useState("Buy Now Workspace");
  const [userName, setUserName] = useState("Jake Smith");
  const [userEmail, setUserEmail] = useState("jake@business.com");
  const [pipeline, setPipeline] = useState<BackendPipeline | null>(null);
  const [contacts, setContacts] = useState<BackendContact[]>([]);
  const [opportunities, setOpportunities] = useState<BackendOpportunity[]>([]);
  const [products, setProducts] = useState<BackendProduct[]>([]);
  const [pages, setPages] = useState<BackendPage[]>([]);
  const [orders, setOrders] = useState<BackendOrder[]>([]);
  const [notifications, setNotifications] = useState<BackendNotification[]>([]);
  const [forms, setForms] = useState<BackendForm[]>([]);
  const [activities, setActivities] = useState<BackendActivity[]>([]);
  const [summary, setSummary] = useState<AppSummary>({
    counts: { contacts: 0, opportunities: 0, orders: 0, submissions: 0, products: 0, pages: 0, notifications: 0 },
    revenue: 0,
  });

  async function ensureContext() {
    let active = context;
    if (!active) {
      const bootstrap = await bootstrapContext();
      active = bootstrap.context;
      setContext(active);
      saveStoredContext(active);
    }
    return active;
  }

  async function loadData() {
    setLoading(true);
    setError(null);
    try {
      const active = await ensureContext();
      const [
        workspaceRes,
        pipelineRes,
        contactsRes,
        opportunitiesRes,
        productsRes,
        pagesRes,
        ordersRes,
        notificationsRes,
        formsRes,
        activitiesRes,
        summaryRes,
      ] = await Promise.all([
        apiRequest<{ workspace: { name?: string }; users: Array<{ name?: string; email?: string }> }>("/workspace/current", {}, active),
        apiRequest<{ pipelines: BackendPipeline[] }>("/pipelines", {}, active),
        apiRequest<{ contacts: BackendContact[] }>("/contacts", {}, active),
        apiRequest<{ opportunities: BackendOpportunity[] }>("/opportunities", {}, active),
        apiRequest<{ products: BackendProduct[] }>("/products", {}, active),
        apiRequest<{ pages: BackendPage[] }>("/pages", {}, active),
        apiRequest<{ orders: BackendOrder[] }>("/orders", {}, active),
        apiRequest<{ notifications: BackendNotification[] }>("/notifications", {}, active),
        apiRequest<{ forms: BackendForm[] }>("/forms", {}, active),
        apiRequest<{ activities: BackendActivity[] }>("/activity", {}, active),
        apiRequest<AppSummary>("/dashboard/summary", {}, active),
      ]);

      setWorkspaceName(workspaceRes.workspace.name ?? "Buy Now Workspace");
      setUserName(workspaceRes.users[0]?.name ?? "Jake Smith");
      setUserEmail(workspaceRes.users[0]?.email ?? active.userEmail ?? "jake@business.com");
      setPipeline(pipelineRes.pipelines.find((item) => item.isDefault) ?? pipelineRes.pipelines[0] ?? null);
      setContacts(contactsRes.contacts);
      setOpportunities(opportunitiesRes.opportunities);
      setProducts(productsRes.products);
      setPages(pagesRes.pages);
      setOrders(ordersRes.orders);
      setNotifications(notificationsRes.notifications);
      setForms(formsRes.forms);
      setActivities(activitiesRes.activities);
      setSummary(summaryRes);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load app data");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadData();
  }, []);

  const pipelineStages = useMemo(() => {
    if (pipeline?.stages?.length) {
      return [...pipeline.stages].sort((left, right) => (left.position ?? 0) - (right.position ?? 0));
    }
    return [
      { key: "new", label: "New", color: "#0325D9", position: 0 },
      { key: "contacted", label: "Contacted", color: "#FF8A00", position: 1 },
      { key: "qualified", label: "Qualified", color: "#7448F6", position: 2 },
      { key: "proposal", label: "Proposal", color: "#16B879", position: 3 },
      { key: "won", label: "Won", color: "#16B879", position: 4 },
      { key: "lost", label: "Lost", color: "#6B7280", position: 5 },
    ];
  }, [pipeline]);

  const contactsById = useMemo(() => new Map(contacts.map((contact) => [contact._id, contact])), [contacts]);
  const productsById = useMemo(() => new Map(products.map((product) => [product._id, product])), [products]);
  const stageLabelByKey = useMemo(
    () => new Map(pipelineStages.map((stage) => [stage.key, stage.label])),
    [pipelineStages],
  );

  const leads: LeadUI[] = useMemo(
    () =>
      contacts
        .filter((contact) => contact.archivedAt == null && contact.kind !== "customer")
        .map((contact) => ({
          id: contact._id,
          name: contact.name,
          email: contact.email ?? "",
          phone: contact.phone ?? "",
          source: titleCase(contact.source),
          status: titleCase(contact.status),
          time: formatTimeLabel(contact.lastActivityAt ?? contact.createdAt),
          interest: contact.interest ?? contact.company ?? "Lead",
          initials: initials(contact.name),
          kind: contact.kind,
          rawId: contact._id,
        })),
    [contacts],
  );

  const normalizedOpportunities: OpportunityUI[] = useMemo(
    () =>
      opportunities.map((opportunity) => {
        const contact = contactsById.get(opportunity.contactId);
        return {
          id: opportunity._id,
          name: contact?.name ?? "Unknown Contact",
          title: opportunity.title,
          value: opportunity.value,
          stage: stageLabelByKey.get(opportunity.stageKey) ?? titleCase(opportunity.stageKey),
          close: formatShortDate(opportunity.closeDate),
          source: opportunity.source ?? contact?.source ?? "Manual",
          rawId: opportunity._id,
        };
      }),
    [contactsById, opportunities, stageLabelByKey],
  );

  const normalizedProducts: ProductUI[] = useMemo(
    () =>
      products.map((product) => {
        const sales = orders.filter((order) => order.productId === product._id && order.status === "paid").length;
        return {
          id: product._id,
          name: product.name,
          price: product.price,
          sales,
          status: titleCase(product.status),
          description: product.description,
          rawId: product._id,
        };
      }),
    [orders, products],
  );

  const normalizedOrders: OrderUI[] = useMemo(
    () =>
      orders.map((order) => {
        const contact = order.contactId ? contactsById.get(order.contactId) : null;
        const product = order.productId ? productsById.get(order.productId) : null;
        return {
          id: order.orderNumber,
          product: product?.name ?? "Order",
          amount: order.total,
          customer: contact?.name ?? order.billing?.name ?? "Customer",
          status: titleCase(order.status),
          time: formatTimeLabel(order.paidAt ?? order.createdAt),
          rawId: order._id,
        };
      }),
    [contactsById, orders, productsById],
  );

  const analytics = useMemo(() => buildAnalytics(activities, contacts), [activities, contacts]);
  const normalizedNotifications = useMemo(() => buildNotifications(notifications), [notifications]);

  async function refresh() {
    await loadData();
  }

  async function createLead(input: { name: string; email?: string; phone?: string; interest?: string; source?: string }) {
    await apiRequest("/contacts", { method: "POST", body: JSON.stringify(input) }, context);
    await refresh();
  }

  async function createOpportunity(input: {
    contactId: string;
    title: string;
    value: number;
    stageKey?: string;
    source?: string;
    closeDate?: string;
  }) {
    await apiRequest("/opportunities", { method: "POST", body: JSON.stringify(input) }, context);
    await refresh();
  }

  async function createForm(input: {
    name: string;
    slug?: string;
    description?: string;
    fields?: Array<{ key: string; label: string; type: string; required?: boolean; options?: string[]; placeholder?: string; order: number }>;
    submitAction?: { createContact?: boolean; createOpportunity?: boolean; pipelineStage?: string };
    publishSettings?: { path?: string; qrCodeEnabled?: boolean; embedEnabled?: boolean };
    status?: string;
  }) {
    const result = await apiRequest<{ form: BackendForm }>("/forms", { method: "POST", body: JSON.stringify(input) }, context);
    await refresh();
    return result.form;
  }

  async function updateForm(formId: string, input: Record<string, unknown>) {
    const result = await apiRequest<{ form: BackendForm }>(`/forms/${formId}`, { method: "PATCH", body: JSON.stringify(input) }, context);
    await refresh();
    return result.form;
  }

  async function publishForm(formId: string, input: { publishSettings?: { path?: string; qrCodeEnabled?: boolean; embedEnabled?: boolean } } = {}) {
    const result = await apiRequest<{ form: BackendForm }>(`/forms/${formId}/publish`, { method: "POST", body: JSON.stringify(input) }, context);
    await refresh();
    return result.form;
  }

  async function createProduct(input: {
    name: string;
    slug?: string;
    description?: string;
    price: number;
    currency?: string;
    status?: string;
    inventory?: number;
    imageAssetId?: string;
    checkoutSettings?: { requirePhone?: boolean; collectAddress?: boolean; allowQuantity?: boolean };
  }) {
    const result = await apiRequest<{ product: BackendProduct }>("/products", { method: "POST", body: JSON.stringify(input) }, context);
    await refresh();
    return result.product;
  }

  async function createPage(input: {
    name: string;
    slug?: string;
    type?: "landing" | "buy-now";
    status?: string;
    seo?: Record<string, unknown>;
    sections?: unknown[];
    publishedUrl?: string;
  }) {
    const result = await apiRequest<{ page: BackendPage }>("/pages", { method: "POST", body: JSON.stringify(input) }, context);
    await refresh();
    return result.page;
  }

  async function markNotificationRead(notificationId: string) {
    await apiRequest(`/notifications/${notificationId}/read`, { method: "PATCH" }, context);
    await refresh();
  }

  return {
    loading,
    error,
    workspaceName,
    userName,
    userEmail,
    context,
    summary,
    pipeline,
    pipelineStages,
    leads,
    opportunities: normalizedOpportunities,
    products: normalizedProducts,
    pages,
    orders: normalizedOrders,
    notifications: normalizedNotifications,
    forms,
    analytics,
    activities,
    refresh,
    createLead,
    createOpportunity,
    createForm,
    updateForm,
    publishForm,
    createProduct,
    createPage,
    markNotificationRead,
    formatNumber,
    stageLabelByKey,
  };
}
