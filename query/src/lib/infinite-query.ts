import { inject, Injectable, InjectionToken } from '@angular/core';
import { injectQueryClient } from './query-client';

import {
  DefaultError,
  InfiniteData,
  QueryKey,
  QueryObserver,
  InfiniteQueryObserver,
  InfiniteQueryObserverOptions,
  InfiniteQueryObserverResult,
} from '@tanstack/query-core';
import { createBaseQuery } from './base-query';
import { Result } from './types';

type CreateInfiniteQueryOptions<
  TQueryFnData = unknown,
  TError = DefaultError,
  TData = TQueryFnData,
  TQueryData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
  TPageParam = unknown
> = InfiniteQueryObserverOptions<
  TQueryFnData,
  TError,
  TData,
  TQueryData,
  TQueryKey,
  TPageParam
>;

type CreateInfiniteQueryResult<TData = unknown, TError = DefaultError> = Result<
  InfiniteQueryObserverResult<TData, TError>
>;

@Injectable({ providedIn: 'root' })
class InfiniteQuery {
  private instance = injectQueryClient();

  use<
    TQueryFnData,
    TError = DefaultError,
    TData = InfiniteData<TQueryFnData>,
    TQueryKey extends QueryKey = QueryKey,
    TPageParam = unknown
  >(
    options: CreateInfiniteQueryOptions<
      TQueryFnData,
      TError,
      TData,
      TQueryFnData,
      TQueryKey,
      TPageParam
    >
  ): CreateInfiniteQueryResult<TData, TError> {
    return createBaseQuery({
      client: this.instance,
      Observer: InfiniteQueryObserver as typeof QueryObserver,
      options,
    });
  }
}

const UseInfiniteQuery = new InjectionToken<InfiniteQuery['use']>('UseQuery', {
  providedIn: 'root',
  factory() {
    const query = new InfiniteQuery();

    return query.use.bind(query);
  },
});

export function injectInfiniteQuery() {
  return inject(UseInfiniteQuery);
}
