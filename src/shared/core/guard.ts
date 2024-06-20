import { Result } from './result/result'
import { SuccessOrFailure } from './result/successOrFailureResult'

type NullGuardArg = {
  argument: unknown
  argumentName: string
}

export class Guard {
  static againstNullOrUndefined(argument: unknown, argumentName: string): SuccessOrFailure<string> {
    if (argument === null || argument === undefined) {
      return Result.fail(`${String(argumentName)} is null or undefined`)
    }

    return Result.ok()
  }

  static againstNullOrUndefinedBulk(args: NullGuardArg[]): SuccessOrFailure<string> {
    for (const arg of args) {
      const result = this.againstNullOrUndefined(arg.argument, arg.argumentName)
      if (result.isFailure) return result
    }

    return Result.ok()
  }

  static isOneOf(props: { value: string; validValues: string[]; argumentName: string }) {
    const { value, validValues, argumentName } = props
    let isValid = false

    for (const validValue of validValues) {
      if (value === validValue) {
        isValid = true
      }
    }

    if (isValid) {
      return Result.ok()
    }

    return Result.fail(
      `${argumentName} isn't one of the correct types in ${JSON.stringify(validValues)}. Got "${value}"`,
    )
  }
}

exports.Guard = Guard
