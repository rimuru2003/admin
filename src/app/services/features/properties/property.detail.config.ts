import type { DetailConfig } from "../../../modules/apps/shared_detail/core/DetailTypes";
import type { Property } from "./property.types";

const formatBool = (value: unknown) => (value ? "Yes" : "No");

export const propertyDetailConfig: DetailConfig<Property> = {
  header: {
    titleAccessor: (data) => data.title ?? "Property",
    subtitleAccessor: (data) =>
      data.full_address ?? data.address ?? data.formatted_address ?? "No address provided",
    badges: [
      {
        label: (data) => data.status ?? "Unknown",
        color: (data) =>
          data.status === "Published"
            ? "success"
            : data.status === "Draft"
              ? "warning"
              : "danger",
      },
      {
        label: (data) => data.property_type?.name ?? "Unspecified type",
        color: "primary",
        showIf: (data) => !!data.property_type?.name,
      },
    ],
    metrics: [
      {
        label: "Rating",
        valueAccessor: (data) =>
          data.rating !== undefined && data.rating !== null ? Number(data.rating).toFixed(2) : "—",
      },
      {
        label: "Verified",
        valueAccessor: (data) => formatBool(data.location_verified),
      },
    ],
  },
  tabs: [
    {
      id: "overview",
      label: "Overview",
      sections: ["property_info", "location", "media_summary", "gallery"],
    },
  ],
  sections: [
    {
      id: "property_info",
      type: "info",
      title: "Property Information",
      gridColumnSpan: 6,
      fields: [
        { label: "Title", accessor: "title", colSpan: 6 },
        { label: "Status", accessor: "status", colSpan: 6 },
        { label: "Description", accessor: "description", colSpan: 12 },
        { label: "Property Type", accessor: (data) => data.property_type?.name ?? "—", colSpan: 6 },
        { label: "Organization", accessor: (data) => data.organization?.name ?? "—", colSpan: 6 },
        { label: "Creator", accessor: (data) => data.creator?.name ?? "—", colSpan: 6 },
        { label: "Creator Email", accessor: (data) => data.creator?.email ?? "—", colSpan: 6 },
      ],
    },
    {
      id: "location",
      type: "info",
      title: "Location",
      gridColumnSpan: 6,
      fields: [
        { label: "Address", accessor: (data) => data.full_address ?? data.address ?? "—", colSpan: 12 },
        { label: "Address Line 1", accessor: "address_line_1", colSpan: 6 },
        { label: "Address Line 2", accessor: "address_line_2", colSpan: 6 },
        { label: "Suburb", accessor: "suburb", colSpan: 6 },
        { label: "State", accessor: "state", colSpan: 6 },
        { label: "Postcode", accessor: "postcode", colSpan: 6 },
        { label: "Country", accessor: "country", colSpan: 6 },
        { label: "Latitude", accessor: (data) => data.latitude ?? "—", colSpan: 6 },
        { label: "Longitude", accessor: (data) => data.longitude ?? "—", colSpan: 6 },
        { label: "Place ID", accessor: "place_id", colSpan: 6 },
        { label: "Verified", accessor: (data) => formatBool(data.location_verified), colSpan: 6 },
      ],
    },
    {
      id: "media",
      type: "gallery",
      title: "Property Gallery",
      gridColumnSpan: 12,
      imagesAccessor: (data) => (data.images ?? []).map((image) => image.url),
    },
    {
      id: "media_summary",
      type: "info",
      title: "Media Summary",
      gridColumnSpan: 12,
      fields: [
        { label: "Images", accessor: (data) => data.images?.length ?? 0, colSpan: 3 },
        { label: "Videos", accessor: (data) => data.videos?.length ?? 0, colSpan: 3 },
        {
          label: "First Image",
          accessor: (data) => data.images?.[0]?.url ?? "—",
          colSpan: 6,
        },
        {
          label: "First Video",
          accessor: (data) => data.videos?.[0]?.url ?? "—",
          colSpan: 6,
        },
        { label: "Created At", accessor: "created_at", colSpan: 6 },
        { label: "Updated At", accessor: "updated_at", colSpan: 6 },
      ],
    },
  ],
};
