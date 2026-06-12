import axiosInstance from "../../api/axiosInstance";
import type { PropertyListParams } from "./property.types";
import { buildApiParams } from "../../utils/buildApiParams";

export type { PropertyListParams };

export const fetchPropertyListApi = async (params: PropertyListParams) => {
  try {
    const res = await axiosInstance.get("/super-admin/property-list", {
      params: buildApiParams(params),
    });

    const { data, meta } = res.data || {};

    return {
      data: data ?? [],
      total: meta?.pagination?.total ?? 0,
    };
  } catch (error) {
    return {
      data: [],
      total: 0,
    };
  }
};
