import { useDispatch, useSelector } from "react-redux";
import { Route, Routes } from "react-router-dom";
import { useEffect } from "react";

import {
  fetchOrders,
  saveOrder,
  openOrderModal,
  closeOrderModal,
  deleteOrder,
  cancelOrder,
  markOrderPaid,
  openDeleteOrderModal,
  closeDeleteOrderModal,
} from "../../services/features/orders/order.slice";
import { DeleteConfirmModal } from "../../modules/apps/component/DeleteConfirmModal";

import { orderConfig } from "../../services/features/orders/order.config";

import type { RootState, AppDispatch } from "../../services/store";

import { useEntityTable } from "../../modules/apps/shared_table/hooks/useEntityTable";
import { EntityList } from "../../modules/apps/shared_table/entity-list/EntityList";
import { PageHeader } from "../../modules/apps/shared_table/entity-list/components/header/PageHeader";
import { Content } from "../../../_metronic/layout/components/content";

import { OrderModal } from "../../services/features/orders/component/OrderModal";

import GenericDetailPage from "../../modules/apps/shared_table/entity-list/components/GenericDetailPage";

import { useRoleAccess } from "../../modules/auth";
import { getRolePortalBaseRoute } from "../../modules/auth/core/roleRoutes";

const OrderList = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { isSuperAdmin } = useRoleAccess();

  const portalBase = getRolePortalBaseRoute(
    isSuperAdmin ? ["super_admin"] : ["admin"],
  );

  const {
    data,
    total,
    error,
    isModalOpen,
    editingOrder,
    saving,
    deleteModalOpen,
    deletingOrder,
  } = useSelector((s: RootState) => s.orders);

  const { params, handleParamsChange } = useEntityTable((p) =>
    dispatch(fetchOrders(p)),
  );

  useEffect(() => {
    if (!saving && !isModalOpen) {
      dispatch(fetchOrders(params));
    }
  }, [isModalOpen]);

  if (error)
    return (
      <Content>
        <PageHeader title="Orders" subtitle="Track plan and billing orders" />
        <div className="alert alert-danger">{error}</div>
      </Content>
    );

  return (
    <>
      <Content>
        <PageHeader title="Orders" subtitle="Track plan and billing orders" />

        <EntityList
          data={data}
          total={total}
          params={params}
          onParamsChange={handleParamsChange}
          columns={orderConfig.columns}
          filtersConfig={orderConfig.filters}
          enableRowClick
          getRowLink={(row) => `${portalBase}/orders/${row.id}`}
          storageKey="orderColumns"
          headerActions={[
            {
              label: "New Order",
              onClick: () => dispatch(openOrderModal(null)),
            },
          ]}
          rowActions={[
            {
              label: "Edit",
              onClick: (row) => dispatch(openOrderModal(row)),
            },
            {
              label: "Mark Paid",
              onClick: (row) => dispatch(markOrderPaid(row.id)),
            },
            {
              label: "Cancel",
              onClick: (row) => dispatch(cancelOrder(row.id)),
            },
            {
              label: "Delete",
              className: "text-danger",
              onClick: (row) => dispatch(openDeleteOrderModal(row)),
            },
          ]}
        />
      </Content>

      {isModalOpen && (
        <OrderModal
          initialValues={editingOrder}
          isSubmitting={saving}
          onClose={() => dispatch(closeOrderModal())}
          onSubmit={(values) =>
            dispatch(
              saveOrder({
                id: editingOrder?.id,
                values,
              }),
            )
          }
        />
      )}

      {deleteModalOpen && deletingOrder && (
        <DeleteConfirmModal
          title="Delete Coupon"
          message={`Are you sure you want to delete coupon ${deletingOrder.order_number}?`}
          onClose={() => dispatch(closeDeleteOrderModal())}
          onConfirm={() => dispatch(deleteOrder(deletingOrder.id))}
          isSubmitting={saving}
        />
      )}
    </>
  );
};

const OrderPage = () => (
  <Routes>
    <Route index element={<OrderList />} />
    <Route path=":id" element={<GenericDetailPage />} />
  </Routes>
);

export default OrderPage;
