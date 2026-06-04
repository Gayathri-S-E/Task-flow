import api, { APIResponse } from "../api_base";
import { DashboardSummary } from "../../types/summary/summary_types";

export const getSummaryApi = (): Promise<APIResponse<DashboardSummary>> =>
  api.get("/summary");
