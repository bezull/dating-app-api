import { v4 as uuidv4 } from 'uuid'
import { Guard } from '../../../shared/core/guard'
import { Result } from '../../../shared/core/result/result'
import { SuccessOrFailure } from '../../../shared/core/result/successOrFailureResult'

type DatingProfileProps = {
  userId: string
  name: string
  profilePicUrl?: string
  totalLikes?: number
  totalPass?: number
}

export class DatingProfile {
  #props: DatingProfileProps
  #id: string

  private constructor(props: DatingProfileProps, id?: string) {
    this.#props = props
    this.#id = id ?? uuidv4()
  }

  get datingProfileId(): string {
    return this.#id
  }

  get userId(): string {
    return this.#props.userId
  }

  get name(): string {
    return this.#props.name
  }

  get profilePicUrl(): string {
    return this.#props.profilePicUrl!
  }

  get totalLikes(): number {
    return this.#props.totalLikes!
  }

  get totalPass(): number {
    return this.#props.totalPass!
  }

  addPass(): void {
    this.#props.totalPass! += 1
  }

  addLike(): void {
    this.#props.totalLikes! += 1
  }

  static create(props: DatingProfileProps, id?: string): SuccessOrFailure<DatingProfile> {
    const guardResult = Guard.againstNullOrUndefinedBulk([
      {
        argument: props.userId,
        argumentName: 'userId',
      },
      {
        argument: props.name,
        argumentName: 'name',
      },
    ])

    if (guardResult.isFailure) {
      return Result.fail(guardResult.getErrorValue())
    }

    return Result.ok(
      new DatingProfile(
        {
          ...props,
          profilePicUrl: props.profilePicUrl ?? '',
          totalLikes: props.totalLikes ?? 0,
          totalPass: props.totalPass ?? 0,
        },
        id,
      ),
    )
  }
}
