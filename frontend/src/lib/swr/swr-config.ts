import { SWRConfiguration } from "swr";
import { apiClient } from "../api/api-client";

export const swrConfig: SWRConfiguration = {
  fetcher: (url: string) => apiClient.get(url),
  revalidateOnFocus: false,
  shouldRetryOnError: false,
};
