export type PropertyList = {
  id: string;

  name: string;
  slug?: string | null;
  description?: string | null;

  organization_type?: {
    id: string;
    name: string;
    slug: string;
  } | null;

  services_count?: number;
  organization_count?: number;

  created_at?: string | null;
  updated_at?: string | null;
};

export type PropertyListParams = {
  page?: number;
  per_page?: number;
  search?: string;
  sort?: string;
  direction?: "asc" | "desc";
  filters?: Record<string, any>;
};