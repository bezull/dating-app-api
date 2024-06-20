export class SuccessOrFailureResult<T> {
  #error
  #value
  #isSuccess
  #isFailure

  constructor(isSuccess: boolean, error?: string | null, value?: T) {
    this.#error = error
    this.#value = value
    this.#isSuccess = isSuccess
    this.#isFailure = !isSuccess
    Object.freeze(this)
  }

  getValue(): T {
    if (this.#isFailure) {
      throw new Error(`Cant get value from the failure result`)
    }
    return this.#value!
  }

  getErrorValue(): string {
    return this.#error ?? ''
  }

  get isSuccess(): boolean {
    return this.#isSuccess
  }

  get isFailure(): boolean {
    return this.#isFailure
  }
}

export type SuccessOrFailure<T> = SuccessOrFailureResult<T>
