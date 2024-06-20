export class SearchResult<T> {
  #error
  #value
  #isFound
  #isNotFound

  constructor(isFound: boolean, error?: string | null, value?: T) {
    this.#error = error
    this.#value = value
    this.#isFound = isFound
    this.#isNotFound = !isFound
    Object.freeze(this)
  }

  getValue(): T {
    if (this.#isNotFound) {
      throw new Error(`Cant get value from the not found result`)
    }
    return this.#value as T
  }

  getErrorValue(): string {
    return this.#error ?? ''
  }

  get isFound(): boolean {
    return this.#isFound
  }

  get isNotFound(): boolean {
    return this.#isNotFound
  }
}

export type Maybe<T> = SearchResult<T>
