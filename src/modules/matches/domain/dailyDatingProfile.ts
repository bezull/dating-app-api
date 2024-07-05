import moment from 'moment'
import { v4 as uuidv4 } from 'uuid'
import { Guard } from '../../../shared/core/guard'
import { Result } from '../../../shared/core/result/result'
import { SuccessOrFailure } from '../../../shared/core/result/successOrFailureResult'

export type DailyDatingProfileProps = {
  userId: string
  date?: string
  totalInteractions?: number
}

export class DailyDatingProfile {
  #props: DailyDatingProfileProps
  #id: string

  private constructor(props: DailyDatingProfileProps, id?: string) {
    this.#props = props
    this.#id = id ?? uuidv4()
  }

  get dailyDatingProfileId(): string {
    return this.#id
  }

  get userId(): string {
    return this.#props.userId
  }

  get date(): string {
    return this.#props.date!
  }

  get totalInteractions(): number {
    return this.#props.totalInteractions!
  }

  static create(props: DailyDatingProfileProps, id?: string): SuccessOrFailure<DailyDatingProfile> {
    const guardResult = Guard.againstNullOrUndefinedBulk([
      {
        argument: props.userId,
        argumentName: 'userId',
      },
    ])

    if (guardResult.isFailure) return Result.fail(guardResult.getErrorValue())

    const dailyDatingProfile = new DailyDatingProfile(
      {
        ...props,
        date: props.date ?? moment().format('YYYY-MM-DD'),
        totalInteractions: props.totalInteractions ?? 0,
      },
      id,
    )

    return Result.ok(dailyDatingProfile)
  }
}
