import { FC } from "react";
import { useIntl } from "react-intl";
import { toAbsoluteUrl } from "../../../_metronic/helpers";
import { PageTitle } from "../../../_metronic/layout/core";
import {
  ListsWidget2,
  ListsWidget3,
  ListsWidget4,
  ListsWidget6,
  TablesWidget5,
  TablesWidget10,
  MixedWidget8,
  CardsWidget7,
  CardsWidget17,
  CardsWidget20,
  ListsWidget26,
  EngageWidget10,
  ChartsWidget3,
  ChartsWidget4,
  TablesWidget8,
  ListsWidget8,
  ChartsWidget1,
} from "../../../_metronic/partials/widgets";
import { ToolbarWrapper } from "../../../_metronic/layout/components/toolbar";
import { Content } from "../../../_metronic/layout/components/content";

const DashboardPage: FC = () => (
  <>
    <ToolbarWrapper />
    <Content>
      <div className="d-flex flex-wrap align-items-stretch gap-8 ">
        <div className="flex-grow-1">
          <CardsWidget20
            className="h-100"
            description="Active Builders"
            color="#F1416C"
            img={toAbsoluteUrl("media/patterns/vector-1.png")}
          />
        </div>

        <div className="flex-grow-1">
          <CardsWidget7
            className="h-100"
            description="Agency"
            icon={false}
            stats={357}
            labelColor="dark"
            textColor="gray-800"
          />
        </div>

        <div className="flex-grow-1">
          <CardsWidget17 className="h-100" />
        </div>
      </div>

      <div className="row gx-5 gx-xl-10 ">
        <div className="col-xxl-6 mb-5 mb-xl-10"></div>

        <div className="col-xxl-6 mb-5 mb-xl-10"></div>
      </div>
      <div className="row g-5 g-xl-8">
        <div className="col-xl-6">
          <ChartsWidget3 className="card-xl-stretch mb-xl-8" />
        </div>
        <div className="col-xl-6">
          <ChartsWidget4 className="card-xl-stretch mb-5 mb-xl-8" />
        </div>
      </div>

      <div className="row gy-5 gx-xl-8">
        <div className="col-xxl-4">
          <ListsWidget3 className="card-xxl-stretch mb-xl-3" />
        </div>
        <div className="col-xl-8">
          <TablesWidget10 className="card-xxl-stretch mb-5 mb-xl-8" />
        </div>
      </div>

      <div className="row g-5 g-xl-8">
        <div className="col-xl-6">
          <ChartsWidget1 className='card-xl-stretch mb-xl-8' />
        </div>
        <div className="col-xl-6">
          <TablesWidget8 className='card-xl-stretch mb-5 mb-xl-8' />
        </div>
      </div>

      <div className="row g-5 gx-xxl-8">
        <div className="col-xxl-4">
          <ListsWidget8 className="card-xl-stretch mb-5 mb-xl-8" />
        </div>
        <div className="col-xxl-8">
          <TablesWidget5 className="card-xxl-stretch mb-5 mb-xxl-8" />
        </div>
      </div>
    </Content>
  </>
);

const DashboardWrapper: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.DASHBOARD" })}
      </PageTitle>
      <DashboardPage />
    </>
  );
};

export { DashboardWrapper };
