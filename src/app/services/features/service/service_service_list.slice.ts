import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchServiceGroupApi,
  type GetServiceListParams,
} from "./service_list.api";
import { mapServiceList } from "./service_list.mapper";
import type { ServiceList } from "./service_list.types";

type fetchServiceList = {
  data: ServiceList[];
  total: number;
  loading: boolean;
  error: string | null;
};

const initialState: fetchServiceList = {
  data: [],
  total: 0,
  loading: false,
  error: null,
};

export const fetchServiceList = createAsyncThunk(
  "servicegroup/fetch",
  async (params: GetServiceListParams) => {
    const res = await fetchServiceGroupApi(params);

    if (!res.data) throw new Error("Invalid API response");

    return {
      data: res.data.map(mapServiceList),
      total: res.total,
    };
  },
);

const ServiceListSlice = createSlice({
  name: "serviceGroup",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchServiceList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchServiceList.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.data;
        state.total = action.payload.total;
      })
      .addCase(fetchServiceList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch service groups";
      });
  },
});

export default ServiceListSlice.reducer;
