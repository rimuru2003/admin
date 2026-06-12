import { KTCard, KTIcon } from '../../../_metronic/helpers'
import type { Plan } from '../../services/features/subscriptions/plan.types'

type CurrentPlan = {
  id: string
  name: string
  propertyLimit: number
  usedProperties: number
}

type Props = {
  plans: Plan[]
  currentPlan: CurrentPlan
  onAdd: () => void
  onEdit: (plan: Plan) => void
  onDelete: (plan: Plan) => void
}

const SubscriptionList = ({ plans, currentPlan, onAdd, onEdit, onDelete }: Props) => {
  const isLimitReached = currentPlan.usedProperties >= currentPlan.propertyLimit

  return (
    <KTCard>
      <div className="container-fluid py-6">

        <div className="card mb-8">
          <div className="card-body d-flex justify-content-between align-items-center flex-wrap gap-4">
            <div>
              <h3 className="fw-bold mb-1">{isLimitReached ? '⚠️ Limit Reached' : 'Active Plan'}</h3>
              <span className="text-muted">Current plan: {currentPlan.name}</span>
            </div>
            <div className="d-flex align-items-center gap-3">
              <span className="badge badge-light-primary fs-6">
                {currentPlan.usedProperties}/{currentPlan.propertyLimit} Properties
              </span>
              <button className="btn btn-primary d-flex align-items-center gap-2" onClick={onAdd}>
                <KTIcon iconName="plus" className="fs-2" />
                Add Plan
              </button>
            </div>
          </div>
        </div>

        <div className="row g-5 g-xl-8 align-items-stretch">
          {plans.map((plan) => {
            const isCurrent = plan.id === currentPlan.id

            return (
              <div className="col-xl-4 col-md-6 col-sm-12" key={plan.id}>
                <div
                  className={`card h-100 shadow-sm border-0 position-relative ${plan.popular ? 'text-white' : 'bg-white'}`}
                  style={plan.popular ? { background: '#2E42FF', transform: 'scale(1.05)', zIndex: 2 } : {}}
                >
                  {plan.popular && (
                    <div
                      className="position-absolute top-0 start-50 translate-middle badge badge-light-primary"
                      style={{ marginTop: '-10px' }}
                    >
                      Most Popular
                    </div>
                  )}

                  <div className="position-absolute top-0 end-0 p-3 d-flex gap-2" style={{ zIndex: 3 }}>
                    <button
                      className={`btn btn-icon btn-sm ${plan.popular ? 'btn-light' : 'btn-light-primary'}`}
                      onClick={() => onEdit(plan)}
                      title="Edit plan"
                    >
                      <KTIcon iconName="pencil" className="fs-4" />
                    </button>
                    <button
                      className="btn btn-icon btn-sm btn-light-danger"
                      onClick={() => onDelete(plan)}
                      title="Delete plan"
                    >
                      <KTIcon iconName="trash" className="fs-4" />
                    </button>
                  </div>

                  <div className="card-body d-flex flex-column pt-10">
                    <div className="mb-4">
                      <h4 className="fw-bold mb-2">{plan.name}</h4>
                      <div className={plan.popular ? 'text-white opacity-75' : 'text-muted'}>
                        Up to {plan.propertyLimit} properties
                      </div>
                    </div>

                    <div className="fw-bold mb-4">
                      <span className="fs-1">₹{plan.price}</span>
                    </div>

                    <button
                      className={`btn w-100 mb-4 ${plan.popular ? 'btn-light' : 'btn-light-primary'}`}
                      disabled={isCurrent}
                    >
                      {isCurrent ? 'Current Plan' : 'Get Started Now'}
                    </button>

                    <ul className="list-unstyled mb-0">
                      {plan.features.map((feature) => (
                        <li key={feature.name} className="d-flex align-items-center mb-3">
                          <span
                            className={`me-3 d-flex align-items-center justify-content-center rounded-circle ${feature.enabled
                                ? plan.popular ? 'bg-white text-primary' : 'bg-light-primary text-primary'
                                : 'bg-light text-muted'
                              }`}
                            style={{ width: 24, height: 24, fontSize: 12 }}
                          >
                            {feature.enabled ? '✓' : '✕'}
                          </span>
                          <span className={feature.enabled ? (plan.popular ? 'text-white' : 'text-dark') : 'text-muted'}>
                            {feature.name}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

      </div>
    </KTCard>
  )
}

export default SubscriptionList