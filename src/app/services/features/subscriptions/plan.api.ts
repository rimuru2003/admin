import type { Plan, PlanFormValues } from "./plan.types";

// ── Dummy in-memory "database" ──────────────────────────
let DUMMY_PLANS: Plan[] = [
  {
    id: "bronze",
    name: "Bronze",
    price: 999,
    propertyLimit: 10,
    popular: false,
    features: [
      { name: "Property Listings", enabled: true },
      { name: "Featured Listings", enabled: false },
      { name: "Agent Profiles", enabled: true },
      { name: "Advanced Analytics", enabled: false },
      { name: "Priority Support", enabled: false },
      { name: "CRM Integration", enabled: false },
      { name: "Lead Management", enabled: false },
      { name: "Custom Branding", enabled: false },
    ],
  },
  {
    id: "silver",
    name: "Silver",
    price: 1999,
    propertyLimit: 25,
    popular: true,
    features: [
      { name: "Property Listings", enabled: true },
      { name: "Featured Listings", enabled: true },
      { name: "Agent Profiles", enabled: true },
      { name: "Advanced Analytics", enabled: true },
      { name: "Priority Support", enabled: false },
      { name: "CRM Integration", enabled: false },
      { name: "Lead Management", enabled: true },
      { name: "Custom Branding", enabled: false },
    ],
  },
  {
    id: "gold",
    name: "Gold",
    price: 3999,
    propertyLimit: 100,
    popular: false,
    features: [
      { name: "Property Listings", enabled: true },
      { name: "Featured Listings", enabled: true },
      { name: "Agent Profiles", enabled: true },
      { name: "Advanced Analytics", enabled: true },
      { name: "Priority Support", enabled: true },
      { name: "CRM Integration", enabled: true },
      { name: "Lead Management", enabled: true },
      { name: "Custom Branding", enabled: true },
    ],
  },
];

const delay = (ms = 300) => new Promise((res) => setTimeout(res, ms));


export const fetchPlansApi = async (): Promise<Plan[]> => {
  await delay();
  return DUMMY_PLANS;

  // REAL API (uncomment when ready):
  // const res = await axiosInstance.get("/super-admin/plans")
  // return res.data.data ?? []
};

export const createPlanApi = async (payload: PlanFormValues): Promise<Plan> => {
  await delay();
  const newPlan: Plan = { ...payload, id: Date.now().toString() };
  DUMMY_PLANS = [...DUMMY_PLANS, newPlan];
  return newPlan;

  // REAL API:
  // const res = await axiosInstance.post("/super-admin/plans", payload)
  // return res.data
};

export const updatePlanApi = async (
  id: string,
  payload: PlanFormValues,
): Promise<Plan> => {
  await delay();
  const updated: Plan = { id, ...payload };
  DUMMY_PLANS = DUMMY_PLANS.map((p) => (p.id === id ? updated : p));
  return updated;

  // REAL API:
  // const res = await axiosInstance.put(`/super-admin/plans/${id}`, payload)
  // return res.data
};

export const deletePlanApi = async (id: string): Promise<void> => {
  await delay();
  DUMMY_PLANS = DUMMY_PLANS.filter((p) => p.id !== id);

  // REAL API:
  // await axiosInstance.delete(`/super-admin/plans/${id}`)
};
