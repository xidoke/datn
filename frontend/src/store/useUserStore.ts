import {create} from 'zustand';
import { devtools } from 'zustand/middleware';

import useSWR from 'swr';
import { useEffect } from 'react';
import { IUser } from '@/types/users';

interface UserState {
  user: IUser | null;
  isLoading: boolean;
  error: any;
}

const useUserStore = create<UserState>()(
  devtools((set) => {
    return {
      user: null,
      isLoading: true,
      error: null,
    };
  })
);

export const useUser = () => {
  const { user, isLoading, error } = useUserStore();

  const { data, error: swrError } = useSWR('/api/user/me', async () => {
    const response = await fetch('/api/user/me');
    return response.json();
  });

  useEffect(() => {
    if (data) {
      useUserStore.setState({ user: data, isLoading: false, error: null });
    } else if (swrError) {
      useUserStore.setState({ user: null, isLoading: false, error: swrError });
    }
  }, [data, swrError]);

  return { user, isLoading: isLoading || !data, error: error || swrError };
};

export default useUserStore;
