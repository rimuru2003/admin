import { configureStore } from "@reduxjs/toolkit";
import seekerReducer from "../features/seeker/seekerSlice";
import organizationReducer from "../features/organization/organization.slice";
// import soloReducer from "../features/solo/soloSlice";
import staffReducer from "../features/staff/staff.slice";
import serviceGroupReducer from "../features/service/service_service_list.slice";
import emailTemplatesReducer from "../features/email_template/email-template.slice";
import authReducer from "../../modules/auth/core/auth.store";
import plansReducer from "../features/subscriptions/plan.slice";
import propertyListReducer from "../features/properties/property.slice";

export const store = configureStore({
  reducer: {
    seeker: seekerReducer,
    organization: organizationReducer,
    // solo: soloReducer,
    staff: staffReducer,
    plans: plansReducer,
    serviceGroup: serviceGroupReducer,
    emailTemplates: emailTemplatesReducer,
    propertyList: propertyListReducer,

    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
