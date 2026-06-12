export const PLATFORM_PERMISSIONS = [
  "organization.view",
  "soloTrader.view",
  "seeker.view",
  "order.view",
  "plan.manage",
  "coupon.manage",
  "emailTemplate.manage",
  "staff.manage",
] as const;

export type PlatformPermission = (typeof PLATFORM_PERMISSIONS)[number];

export const PERMISSION_LABELS: Record<PlatformPermission, string> = {
  "organization.view": "View Organizations",
  "soloTrader.view": "View Solo Traders",
  "seeker.view": "View Seekers",
  "order.view": "View Orders",
  "plan.manage": "Manage Plans",
  "coupon.manage": "Manage Coupons",
  "emailTemplate.manage": "Manage Email Templates",
  "staff.manage": "Manage Staff",
};

export type StaffMember = {
  id: string;
  name: string;
  email: string;
  permissions: PlatformPermission[];
  status: "active" | "inactive";
  created_at: string;
};

export type StaffFormValues = {
  name: string;
  email: string;
  password?: string;
  permissions: PlatformPermission[];
};

// `Staff` is a superset used by admin tables and lists. Keep fields optional
// when they are not part of the core `StaffMember` shape.
export type Staff = StaffMember & {
  display_name?: string;
  organization_id?: string | null;
  mobile_number?: string | null;
  roles?: string[];
  email_verified_at?: string | null;
  mobile_verified_at?: string | null;
  updated_at?: string | null;
};

export type GetStaffParams = {
  page?: number;
  per_page?: number;
  search?: string;
  sort?: string;
  direction?: "asc" | "desc";
  filters?: Record<string, any>;
};
