import axiosInstance from "../../api/axiosInstance";
import type { GetServiceListParams } from "./service_list.types";
import { buildApiParams } from "../../utils/buildApiParams";

export type { GetServiceListParams };

export const fetchServiceGroupApi = async (params: GetServiceListParams) => {
  try {
    const res = await axiosInstance.get("/super-admin/service-groups", {
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
