import type { Column } from "../../../modules/apps/shared_table/entity-list/EntityList";
import type { PropertyList } from "./property.types";
import { formatDateTime } from "../../utils/dateFormat";

const safeDate = (value: unknown) =>
  typeof value === "string" ? formatDateTime(value) : "—";

export const propertyListConfig = {
  columns: [
    {
      Header: "ID",
      accessor: "id",
      sortable: true,
      alwaysVisible: true,
    },
    {
      Header: "Name",
      accessor: "name",
      sortable: true,
      Cell: ({ value }: { value: any }) => value || "—",
    },
    {
      Header: "Slug",
      accessor: "slug",
      Cell: ({ value }: { value: any }) => value || "—",
    },
    {
      Header: "Description",
      accessor: "description",
      Cell: ({ value }: { value: any }) => value || "—",
    },
    {
      Header: "Organization Type",
      accessor: "organization_type",
      Cell: ({ value }: { value: any }) => value?.name ?? "—",
    },
    {
      Header: "Services Count",
      accessor: "services_count",
      sortable: true,
      Cell: ({ value }: { value: any }) => value ?? 0,
    },
    {
      Header: "Organization Count",
      accessor: "organization_count",
      sortable: true,
      Cell: ({ value }: { value: any }) => value ?? 0,
    },
    {
      Header: "Created At",
      accessor: "created_at",
      sortable: true,
      Cell: ({ value }: { value: any }) => safeDate(value),
    },
  ] satisfies Column<PropertyList>[],

  filters: [
    {
      key: "created_at",
      label: "Created Date",
      type: "dateRange" as const,
    },
  ],

  addAction: null,
  rowActions: [],
};
