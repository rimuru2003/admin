import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Content } from '../../../_metronic/layout/components/content'
import { PageHeader } from '../../modules/apps/shared_table/entity-list/components/header/PageHeader'
import EmailTemplateList from '../../services/features/email_template/components/EmailTemplateList'
import { EmailTemplateModal } from '../../services/features/email_template/components/EmailTemplateModal'
import { DeleteConfirmModal } from '../../modules/apps/component/DeleteConfirmModal'
import {
    fetchEmailTemplates,
    saveEmailTemplate,
    removeEmailTemplate,
    openTemplateModal,
    closeTemplateModal,
} from '../../services/features/email_template/email-template.slice'
import type { EmailTemplate } from '../../services/features/email_template/email-template.types'
import type { RootState, AppDispatch } from '../../services/store'

const EmailTemplatePage = () => {
    const dispatch = useDispatch<AppDispatch>()
    const { data, loading, error, isModalOpen, editingTemplate, saving } =
        useSelector((s: RootState) => s.emailTemplates)

    const [deletingTemplate, setDeletingTemplate] = useState<EmailTemplate | null>(null)

    useEffect(() => {
        dispatch(fetchEmailTemplates())
    }, [])

    if (loading) return <Content><div className="p-10">Loading...</div></Content>

    if (error) return (
        <Content>
            <PageHeader title="Email Templates" subtitle="Manage automated email templates" />
            <div className="alert alert-danger">{error}</div>
        </Content>
    )

    return (
        <Content>
            <PageHeader title="Email Templates" subtitle="Manage automated email templates" />

            <EmailTemplateList
                templates={data}
                onAdd={() => dispatch(openTemplateModal(null))}
                onEdit={(template) => dispatch(openTemplateModal(template))}
                onDelete={(template) => setDeletingTemplate(template)}
            />

            {isModalOpen && (
                <EmailTemplateModal
                    initialValues={editingTemplate}
                    isSubmitting={saving}
                    onClose={() => dispatch(closeTemplateModal())}
                    onSubmit={(values) =>
                        dispatch(saveEmailTemplate({ id: editingTemplate?.id, values }))
                    }
                />
            )}

            {deletingTemplate && (
                <DeleteConfirmModal
                    title="Delete Email Template"
                    message={`Are you sure you want to delete "${deletingTemplate.name}"?`}
                    onClose={() => setDeletingTemplate(null)}
                    onConfirm={() => {
                        dispatch(removeEmailTemplate(deletingTemplate.id))
                        setDeletingTemplate(null)
                    }}
                />
            )}
        </Content>
    )
}

export default EmailTemplatePage