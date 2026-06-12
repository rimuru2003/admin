import type {
  EmailTemplate,
  EmailTemplateFormValues,
} from "./email-template.types";

let DUMMY_TEMPLATES: EmailTemplate[] = [
  {
    id: "1",
    name: "Welcome Email",
    subject: "Welcome to Briksy!",
    body: "Hi {{name}}, welcome to Briksy. We're glad to have you onboard.",
    trigger: "user.registered",
    status: "active",
    created_at: "2026-01-10T10:00:00Z",
  },
  {
    id: "2",
    name: "Order Confirmation",
    subject: "Your order #{{order_id}} is confirmed",
    body: "Hi {{name}}, your order has been placed successfully.",
    trigger: "order.placed",
    status: "active",
    created_at: "2026-01-12T10:00:00Z",
  },
  {
    id: "3",
    name: "Password Reset",
    subject: "Reset your password",
    body: "Click the link below to reset your password: {{reset_link}}",
    trigger: "password.reset",
    status: "active",
    created_at: "2026-01-15T10:00:00Z",
  },
  {
    id: "4",
    name: "Subscription Expiring",
    subject: "Your plan expires soon",
    body: "Hi {{name}}, your {{plan_name}} plan expires on {{expiry_date}}. Renew now to avoid interruption.",
    trigger: "subscription.expiring",
    status: "inactive",
    created_at: "2026-01-18T10:00:00Z",
  },
];

const delay = (ms = 300) => new Promise((res) => setTimeout(res, ms));

export const fetchEmailTemplatesApi = async (): Promise<EmailTemplate[]> => {
  await delay();
  return DUMMY_TEMPLATES;

  // REAL API:
  // const res = await axiosInstance.get("/super-admin/email-templates")
  // return res.data.data ?? []
};

export const createEmailTemplateApi = async (
  payload: EmailTemplateFormValues,
): Promise<EmailTemplate> => {
  await delay();
  const newTemplate: EmailTemplate = {
    ...payload,
    id: Date.now().toString(),
    created_at: new Date().toISOString(),
  };
  DUMMY_TEMPLATES = [...DUMMY_TEMPLATES, newTemplate];
  return newTemplate;

  // REAL API:
  // const res = await axiosInstance.post("/super-admin/email-templates", payload)
  // return res.data.data ?? res.data
};

export const updateEmailTemplateApi = async (
  id: string,
  payload: EmailTemplateFormValues,
): Promise<EmailTemplate> => {
  await delay();
  const existing = DUMMY_TEMPLATES.find((t) => t.id === id);
  const updated: EmailTemplate = {
    id,
    created_at: existing?.created_at ?? new Date().toISOString(),
    ...payload,
  };
  DUMMY_TEMPLATES = DUMMY_TEMPLATES.map((t) => (t.id === id ? updated : t));
  return updated;

  // REAL API:
  // const res = await axiosInstance.put(`/super-admin/email-templates/${id}`, payload)
  // return res.data.data ?? res.data
};

export const deleteEmailTemplateApi = async (id: string): Promise<void> => {
  await delay();
  DUMMY_TEMPLATES = DUMMY_TEMPLATES.filter((t) => t.id !== id);

  // REAL API:
  // await axiosInstance.delete(`/super-admin/email-templates/${id}`)
};
