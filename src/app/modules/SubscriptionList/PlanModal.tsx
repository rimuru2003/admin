import { useState, useEffect } from "react"
import clsx from "clsx"
import { ModalShell } from "../apps/component/ModalShell"
import { DEFAULT_FEATURES, type Plan, type PlanFormValues, type PlanFeature } from "../../services/features/subscriptions/plan.types"
import { KTIcon } from "../../../_metronic/helpers"

type Props = {
  initialValues?: Plan | null
  onClose: () => void
  onSubmit: (values: PlanFormValues) => void
  isSubmitting?: boolean
}

const defaultFeatureList = (): PlanFeature[] =>
  DEFAULT_FEATURES.map((name) => ({ name, enabled: false }))

const PlanModal = ({ initialValues, onClose, onSubmit, isSubmitting }: Props) => {
  const isEdit = !!initialValues

  const [form, setForm] = useState<PlanFormValues>({
    name: "",
    price: 0,
    propertyLimit: 0,
    popular: false,
    features: defaultFeatureList(),
  })

  const [newFeatureName, setNewFeatureName] = useState("")

  const [touched, setTouched] = useState({ name: false, price: false, propertyLimit: false })

  useEffect(() => {
    if (initialValues) {
      setForm({
        name: initialValues.name,
        price: initialValues.price,
        propertyLimit: initialValues.propertyLimit,
        popular: initialValues.popular,
        features: initialValues.features,
      })
    }
  }, [initialValues])

  const nameError = touched.name && !form.name ? "Name is required" : ""
  const priceError = touched.price && form.price <= 0 ? "Price must be greater than 0" : ""
  const limitError = touched.propertyLimit && form.propertyLimit <= 0 ? "Property limit must be greater than 0" : ""

  const isValid = !!form.name && form.price > 0 && form.propertyLimit > 0

  const handleSubmit = () => {
    setTouched({ name: true, price: true, propertyLimit: true })
    if (!isValid) return
    onSubmit(form)
  }

  const toggleFeature = (index: number) =>
    setForm((p) => ({
      ...p,
      features: p.features.map((f, i) => i === index ? { ...f, enabled: !f.enabled } : f),
    }))

  const removeFeature = (index: number) =>
    setForm((p) => ({
      ...p,
      features: p.features.filter((_, i) => i !== index),
    }))

  const addFeature = () => {
    const name = newFeatureName.trim()
    if (!name) return
    // prevent duplicates
    if (form.features.some((f) => f.name.toLowerCase() === name.toLowerCase())) {
      setNewFeatureName("")
      return
    }
    setForm((p) => ({
      ...p,
      features: [...p.features, { name, enabled: true }],
    }))
    setNewFeatureName("")
  }

  const handleNewFeatureKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addFeature()
    }
  }

  return (
    <ModalShell
      title={isEdit ? "Edit Plan" : "Add Plan"}
      onClose={onClose}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      submitLabel={isEdit ? "Update Plan" : "Create Plan"}
      isValid={isValid}
    >
      {/* Name */}
      <div className="fv-row mb-7">
        <label className="required fw-bold fs-6 mb-2">Plan Name</label>
        <input
          type="text"
          className={clsx("form-control form-control-solid", {
            "is-invalid": !!nameError,
            "is-valid": touched.name && !nameError,
          })}
          placeholder="e.g. Gold"
          value={form.name}
          onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
          onBlur={() => setTouched((p) => ({ ...p, name: true }))}
        />
        {nameError && <div className="fv-plugins-message-container"><span className="fv-help-block">{nameError}</span></div>}
      </div>

      {/* Price */}
      <div className="fv-row mb-7">
        <label className="required fw-bold fs-6 mb-2">Price (₹)</label>
        <input
          type="number"
          className={clsx("form-control form-control-solid", {
            "is-invalid": !!priceError,
            "is-valid": touched.price && !priceError,
          })}
          placeholder="e.g. 1999"
          value={form.price || ""}
          onChange={(e) => setForm((p) => ({ ...p, price: Number(e.target.value) }))}
          onBlur={() => setTouched((p) => ({ ...p, price: true }))}
        />
        {priceError && <div className="fv-plugins-message-container"><span className="fv-help-block">{priceError}</span></div>}
      </div>

      {/* Property Limit */}
      <div className="fv-row mb-7">
        <label className="required fw-bold fs-6 mb-2">Property Limit</label>
        <input
          type="number"
          className={clsx("form-control form-control-solid", {
            "is-invalid": !!limitError,
            "is-valid": touched.propertyLimit && !limitError,
          })}
          placeholder="e.g. 25"
          value={form.propertyLimit || ""}
          onChange={(e) => setForm((p) => ({ ...p, propertyLimit: Number(e.target.value) }))}
          onBlur={() => setTouched((p) => ({ ...p, propertyLimit: true }))}
        />
        {limitError && <div className="fv-plugins-message-container"><span className="fv-help-block">{limitError}</span></div>}
      </div>

      {/* Popular */}
      <div className="fv-row mb-7">
        <label className="form-check form-check-custom form-check-solid d-flex align-items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            className="form-check-input"
            checked={form.popular}
            onChange={(e) => setForm((p) => ({ ...p, popular: e.target.checked }))}
          />
          <span className="fw-bold fs-6">Mark as Most Popular</span>
        </label>
      </div>

      {/* Features */}
      <div className="fv-row mb-7">
        <label className="fw-bold fs-6 mb-4 d-block">Features</label>

        <div className="d-flex flex-column gap-3 mb-4">
          {form.features.map((feature, i) => (
            <div key={feature.name} className="d-flex align-items-center justify-content-between">
              <label className="form-check form-check-custom form-check-solid d-flex align-items-center gap-3 cursor-pointer m-0">
                <input
                  type="checkbox"
                  className="form-check-input"
                  checked={feature.enabled}
                  onChange={() => toggleFeature(i)}
                />
                <span className="fw-semibold text-gray-800">{feature.name}</span>
              </label>

              <button
                type="button"
                className="btn btn-icon btn-sm btn-light-danger"
                onClick={() => removeFeature(i)}
                title="Remove feature"
              >
                <KTIcon iconName="trash" className="fs-5" />
              </button>
            </div>
          ))}

          {form.features.length === 0 && (
            <div className="text-muted fs-7">No features added yet.</div>
          )}
        </div>

        {/* Add new feature */}
        <div className="d-flex gap-2">
          <input
            type="text"
            className="form-control form-control-solid"
            placeholder="e.g. White-label App"
            value={newFeatureName}
            onChange={(e) => setNewFeatureName(e.target.value)}
            onKeyDown={handleNewFeatureKeyDown}
          />
          <button
            type="button"
            className="btn btn-light-primary d-flex align-items-center gap-2"
            onClick={addFeature}
          >
            <KTIcon iconName="plus" className="fs-3" />
            Add
          </button>
        </div>
      </div>
    </ModalShell>
  )
}

export { PlanModal }