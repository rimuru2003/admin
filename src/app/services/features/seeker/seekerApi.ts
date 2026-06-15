import axiosInstance from "../../api/axiosInstance";
import type { GetSeekersParams } from "./seeker.types";
import { buildApiParams } from "../../utils/buildApiParams";
import { getAuth } from "../../../modules/auth/core/AuthHelpers";

export type { GetSeekersParams };

const getSeekerEndpoint = () => {
  const auth = getAuth();
  const roles = (auth?.abilities ?? []).map(String);
  const isSuperAdmin = roles.includes("super_admin");

  return isSuperAdmin ? "/super-admin/seekers" : "/admin/seekers";
};

export const fetchSeekersApi = async (params: GetSeekersParams) => {
  const res = await axiosInstance.get(getSeekerEndpoint(), {
    params: buildApiParams(params),
  });

  const { data, meta } = res.data || {};

  return {
    data: data ?? [],
    total: meta?.pagination?.total ?? 0,
  };
};  
