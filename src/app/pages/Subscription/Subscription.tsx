import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Content } from '../../../_metronic/layout/components/content'
import { PageHeader } from '../../modules/apps/shared_table/entity-list/components/header/PageHeader'
import SubscriptionList from '../../modules/SubscriptionList/SubscriptionList'
import { PlanModal } from '../../modules/SubscriptionList/PlanModal'
import { DeleteConfirmModal } from '../../modules/apps/component/DeleteConfirmModal'
import {
    fetchPlans, savePlan, removePlan,
    openPlanModal, closePlanModal,
} from '../../services/features/subscriptions/plan.slice'
import { ALL_FEATURES, type Plan } from '../../services/features/subscriptions/plan.types'
import type { RootState, AppDispatch } from '../../services/store'

const CURRENT_PLAN = { id: 'silver', name: 'Silver', propertyLimit: 25, usedProperties: 25 }

const Subscription = () => {
    const dispatch = useDispatch<AppDispatch>()
    const { data: plans, loading, isModalOpen, editingPlan, saving } =
        useSelector((s: RootState) => s.plans)

    const [deletingPlan, setDeletingPlan] = useState<Plan | null>(null)

    useEffect(() => {
        dispatch(fetchPlans())
    }, [])

    if (loading) return <Content><div className="p-10">Loading...</div></Content>

    return (
        <Content>
            <PageHeader title="Subscription Plans" subtitle="Manage platform plans" />

            <SubscriptionList
                plans={plans}
                currentPlan={CURRENT_PLAN}
                onAdd={() => dispatch(openPlanModal(null))}
                onEdit={(plan) => dispatch(openPlanModal(plan))}
                onDelete={(plan) => setDeletingPlan(plan)}
            />

            {isModalOpen && (
                <PlanModal
                    initialValues={editingPlan}
                    isSubmitting={saving}
                    onClose={() => dispatch(closePlanModal())}
                    onSubmit={(values) => dispatch(savePlan({ id: editingPlan?.id, values }))}
                />
            )}

            {deletingPlan && (
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
        </Content>
    )
}

export default Subscription