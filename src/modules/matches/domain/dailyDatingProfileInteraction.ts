import { v4 as uuidv4 } from 'uuid'
import { Guard } from '../../../shared/core/guard'
import { Result } from '../../../shared/core/result/result'
import { SuccessOrFailure } from '../../../shared/core/result/successOrFailureResult'

export type DailyDatingProfileInteractionProps = {
  dailyDatingProfileId: string
  datingProfileId: string
  isLiked: boolean
}

export class DailyDatingProfileInteraction {
  #props: DailyDatingProfileInteractionProps
  #id: string

  private constructor(props: DailyDatingProfileInteractionProps, id?: string) {
    this.#props = props
    this.#id = id ?? uuidv4()
  }

  get dailyDatingProfileInteractionId(): string {
    return this.#id
  }

  get dailyDatingProfileId(): string {
    return this.#props.dailyDatingProfileId
  }

  get datingProfileId(): string {
    return this.#props.datingProfileId
  }

  get isLiked(): boolean {
    return this.#props.isLiked
  }

  static create(
    props: DailyDatingProfileInteractionProps,
    id?: string,
  ): SuccessOrFailure<DailyDatingProfileInteraction> {
    const guardResult = Guard.againstNullOrUndefinedBulk([
      {
        argument: props.dailyDatingProfileId,
        argumentName: 'dailyDatingProfileId',
      },
      {
        argument: props.datingProfileId,
        argumentName: 'datingProfileId',
      },
      {
        argument: props.isLiked,
        argumentName: 'isLiked',
      },
    ])

    if (guardResult.isFailure) {
      return Result.fail(guardResult.getErrorValue())
    }

    return Result.ok(new DailyDatingProfileInteraction(props, id))
  }
}
