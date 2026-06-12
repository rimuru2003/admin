import { useDispatch, useSelector } from "react-redux";
import { fetchPropertyList } from "../../services/features/properties/property.slice";
import { propertyListConfig } from "../../services/features/properties/property.config";
import type { RootState, AppDispatch } from "../../services/store";

import { useEntityTable } from "../../modules/apps/shared_table/hooks/useEntityTable";
import { EntityList } from "../../modules/apps/shared_table/entity-list/EntityList";
import { PageHeader } from "../../modules/apps/shared_table/entity-list/components/header/PageHeader";
import { Content } from "../../../_metronic/layout/components/content";

const PropertyListPage = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { data, total, error } = useSelector((s: RootState) => s.serviceGroup);

    const { params, handleParamsChange } = useEntityTable(
        (p) => dispatch(fetchPropertyList(p))
    );

    if (error) return (
        <Content>
            <PageHeader title="Property List" subtitle="All properties on the platform" />
            <div className="text-danger">{error}</div>
        </Content>
    );

    return (
        <Content>
            <PageHeader title="Property List" subtitle="All properties on the platform" />
            <EntityList
                data={data}
                total={total}
                params={params}
                onParamsChange={handleParamsChange}
                columns={propertyListConfig.columns}
                filtersConfig={propertyListConfig.filters}
                enableRowClick
                getRowLink={(row) => `/apps/property-management/listing/${row.id}`}
            />
        </Content>
    );
};

export default PropertyListPage;