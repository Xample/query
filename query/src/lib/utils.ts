import {
  QueryObserverResult,
  QueryObserverSuccessResult,
} from '@tanstack/query-core';
import { Observable, Subject, firstValueFrom, takeUntil } from 'rxjs';

export function toPromise<T>({
  source,
  signal,
}: {
  source: Observable<T>;
  signal?: AbortSignal;
}): Promise<T> {
  const cancel = new Subject<void>();

  if (signal) {
    signal.addEventListener('abort', () => {
      cancel.next();
      cancel.complete();
    });
  }

  return firstValueFrom(source.pipe(signal ? takeUntil(cancel) : (s) => s));
}

export function createSuccessObserverResult<T,TError = DefaultError>(
  data: T,
): QueryObserverResult<T,TError> {
  return {
    data,
    isLoading: false,
    isError: false,
    isFetching: false,
    isPending: false,
    isSuccess: true,
    status: 'success',
  } as QueryObserverSuccessResult<T,TError>;
}

export function createPendingObserverResult<T,TError = DefaultError>(): QueryObserverResult<T,TError> {
  return {
    isError: false,
    isLoading: true,
    isPending: true,
    isFetching: true,
    isSuccess: false,
    fetchStatus: 'fetching',
    status: 'pending',
  } as QueryObserverResult<T,TError>;
}
