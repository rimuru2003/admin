import type { PlanRequest } from "./plan-request.types";

type PlanRequestApi = PlanRequest;

export const mapPlanRequest = (
  item: PlanRequestApi
): PlanRequest => ({
  ...item,
});