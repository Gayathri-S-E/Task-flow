import { useState } from "react";
import { getSummaryApi } from "../index";
import { DashboardSummary } from "../../../types/summary/summary_types";

export const useSummary = () => {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSummary = async (): Promise<DashboardSummary> => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await getSummaryApi();
      setSummary(res.data);
      return res.data;
    } catch (err: any) {
      setError("Failed to fetch summary data");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { summary, fetchSummary, isLoading, error };
};
