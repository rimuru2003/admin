import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Content } from '../../../_metronic/layout/components/content'
import { PageHeader } from '../../modules/apps/shared_table/entity-list/components/header/PageHeader'
import { SubscriptionList } from '../../modules/SubscriptionList/SubscriptionList'
import { PlanModal } from '../../modules/SubscriptionList/PlanModal'
import { DeleteConfirmModal } from '../../modules/apps/component/DeleteConfirmModal'
import { ModalShell } from '../../modules/apps/component/ModalShell'
import { fetchPermissionsApi } from '../../services/features/permissions/permission.api'
import {
    fetchPlans, savePlan, removePlan, changePlan,
    openPlanModal, closePlanModal,
} from '../../services/features/subscriptions/plan.slice'
import type { Plan, PlanSubscriptionSummary } from '../../services/features/subscriptions/plan.types'
import type { RootState, AppDispatch } from '../../services/store'
import { useRoleAccess } from '../../modules/auth'
import type { PermissionGroup } from '../../services/features/permissions/permission.types'
import { getPermissionsByToken } from '../../modules/auth/core/_requests'
import { setBusinessProfile, setEnabledModules, setPermissions } from '../../modules/auth/core/auth.store'

const Subscription = () => {
    const dispatch = useDispatch<AppDispatch>()
    const { isSuperAdmin } = useRoleAccess()
    const canManage = isSuperAdmin

    const { data: plans, loading, isModalOpen, editingPlan, saving, changing, subscription } =
        useSelector((s: RootState) => s.plans)

    const [deletingPlan, setDeletingPlan] = useState<Plan | null>(null)
    const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null)
    const [permissionGroups, setPermissionGroups] = useState<PermissionGroup[]>([])
    const [subscriptionSummary, setSubscriptionSummary] = useState<PlanSubscriptionSummary | null>(null)
    useEffect(() => {
        void dispatch(fetchPlans())
    }, [dispatch])

    useEffect(() => {
        if (!canManage) {
            setPermissionGroups([])
            return
        }

        let mounted = true
        void fetchPermissionsApi().then((response) => {
            if (mounted) {
                setPermissionGroups(response.data.grouped ?? [])
            }
        }).catch(() => {
            if (mounted) {
                setPermissionGroups([])
            }
        })

        return () => {
            mounted = false
        }
    }, [canManage])

    useEffect(() => {
        setSubscriptionSummary(subscription)
    }, [subscription])

    const handleConfirmChange = async () => {
        if (!selectedPlan) return
        await dispatch(changePlan(selectedPlan.id)).unwrap()
        const permissions = await getPermissionsByToken()
        dispatch(setPermissions(permissions.data.effective_permission_names ?? []))
        dispatch(setEnabledModules(permissions.data.enabled_modules ?? []))
        dispatch(
            setBusinessProfile({
                businessType: permissions.data.user?.business_type ?? null,
                businessVerificationStatus:
                    permissions.data.user?.business_verification_status ?? null,
            }),
        )
        setSelectedPlan(null)
    }

    const selectedPlanPropertyLimit = selectedPlan
        ? (selectedPlan.propertyLimit ?? selectedPlan.features.find((feature) => feature.name.toLowerCase() === "property listings")?.value ?? "unlimited")
        : null

    if (loading) return <Content><div className="p-10">Loading...</div></Content>

    return (
        <Content>
            <PageHeader
                title="Subscription Plans"
                subtitle={canManage ? "Manage platform plans" : "Choose a plan that fits your business"}
            />

            {subscriptionSummary ? (
                <div className="alert alert-info mb-6">
                    Subscription status: <strong className="ms-1 text-capitalize">{subscriptionSummary.status}</strong>
                    {subscriptionSummary.trial_ends_at ? (
                        <span className="ms-2">Trial ends {new Date(subscriptionSummary.trial_ends_at).toLocaleDateString()}</span>
                    ) : null}
                </div>
            ) : null}

            <SubscriptionList
                plans={plans}
                canManage={canManage}
                onAdd={canManage ? () => dispatch(openPlanModal(null)) : undefined}
                onEdit={canManage ? (plan) => dispatch(openPlanModal(plan)) : undefined}
                onDelete={canManage ? (plan) => setDeletingPlan(plan) : undefined}
                onSelectPlan={!canManage ? (plan) => setSelectedPlan(plan) : undefined}
            />

            {canManage && isModalOpen && (
                <PlanModal
                    initialValues={editingPlan}
                    isSubmitting={saving}
                    onClose={() => dispatch(closePlanModal())}
                    onSubmit={(values) => dispatch(savePlan({ id: editingPlan?.id, values }))}
                    permissionGroups={permissionGroups}
                />
            )}

            {canManage && deletingPlan && (
                <DeleteConfirmModal
                    title="Delete Plan"
                    message={`Are you sure you want to delete the "${deletingPlan.name}" plan?`}
                    onClose={() => setDeletingPlan(null)}
                    onConfirm={() => {
                        dispatch(removePlan(deletingPlan.id))
                        setDeletingPlan(null)
                    }}
                />
            )}

            {!canManage && selectedPlan && (
                <ModalShell
                    title="Confirm Plan Change"
                    onClose={() => setSelectedPlan(null)}
                    onSubmit={handleConfirmChange}
                    isSubmitting={changing}
                    submitLabel="Confirm"
                >
                    <div className="text-center py-4">
                        <h4 className="fw-bold mb-2">Switch to {selectedPlan.name}</h4>
                        <p className="text-gray-700 fs-5">
                            ₹{selectedPlan.price}/month — up to {selectedPlanPropertyLimit} properties
                        </p>
                        <p className="text-muted fs-6">
                            This change takes effect immediately and your billing will be updated.
                        </p>
                    </div>
                </ModalShell>
            )}
        </Content>
    )
}

export default Subscription
