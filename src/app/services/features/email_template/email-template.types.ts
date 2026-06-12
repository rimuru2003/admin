export type EmailTemplate = {
  id: string;
  name: string;
  subject: string;
  body: string;
  trigger: string;
  status: "active" | "inactive";
  created_at: string;
};

export type EmailTemplateFormValues = {
  name: string;
  subject: string;
  body: string;
  trigger: string;
  status: "active" | "inactive";
};

export const TEMPLATE_TRIGGERS = [
  "user.registered",
  "order.placed",
  "order.completed",
  "password.reset",
  "subscription.expiring",
  "staff.invited",
] as const;

export const TRIGGER_LABELS: Record<string, string> = {
  "user.registered": "User Registered",
  "order.placed": "Order Placed",
  "order.completed": "Order Completed",
  "password.reset": "Password Reset",
  "subscription.expiring": "Subscription Expiring",
  "staff.invited": "Staff Invited",
};
