import { SWRConfiguration } from "swr";

export const swrConfig: SWRConfiguration = {
  revalidateOnFocus: false,
  refreshWhenHidden: false,
  revalidateIfStale: true,
  revalidateOnMount: true,
  errorRetryCount: 3,
};
