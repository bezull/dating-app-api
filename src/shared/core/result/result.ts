import { SearchResult } from './searchResult'
import { SuccessOrFailureResult } from './successOrFailureResult'

export class Result<T> {
  static #createSuccessOrFailureResult<T>(
    isSuccess: boolean,
    error?: string | null,
    value?: T,
  ): SuccessOrFailureResult<T> {
    if (isSuccess && error) {
      throw new Error(`Invalid Operation: a result cannot be successful and contain an error`)
    }

    if (!isSuccess && !error) {
      throw new Error(`Invalid Operation: a failing result needs to contain an error message`)
    }

    return new SuccessOrFailureResult(isSuccess, error, value)
  }

  static #createSearchResult<T>(isFound: boolean, error?: string | null, value?: T): SearchResult<T> {
    if (isFound && error) {
      throw new Error(`Invalid Operation: a result cannot be found and contain an error`)
    }

    if (!isFound && !error) {
      throw new Error(`Invalid Operation: a not found result needs to contain an error message`)
    }

    return new SearchResult(isFound, error, value)
  }

  static ok<T>(value?: T): SuccessOrFailureResult<T> {
    return Result.#createSuccessOrFailureResult(true, null, value)
  }

  static fail<T>(error?: string | null): SuccessOrFailureResult<T> {
    return Result.#createSuccessOrFailureResult(false, error)
  }

  static found<T>(value: T): SearchResult<T> {
    return Result.#createSearchResult(true, null, value)
  }

  static notFound<T>(error: string): SearchResult<T> {
    return Result.#createSearchResult(false, error)
  }

  static allSuccess<T>(results: SuccessOrFailureResult<T>[]): Result<T> {
    for (const result of results) {
      if (result.isFailure) return result
    }
    return Result.ok()
  }

  static allFound<T>(results: SearchResult<T>[]): Result<T> {
    for (const result of results) {
      if (result.isNotFound) return Result.fail(result.getErrorValue())
    }
    return Result.ok()
  }
}
