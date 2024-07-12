import { Result } from '../../../../shared/core/result/result'
import { SuccessOrFailure } from '../../../../shared/core/result/successOrFailureResult'
import { DailyDatingProfileInteraction } from '../../domain/dailyDatingProfileInteraction'
import { DailyDatingProfileInteractionRepository } from './dailyDatingProfileInteractionRepository'

export class InMemoryDailyDatingProfileInteractionRepository implements DailyDatingProfileInteractionRepository {
  #inMemoryDailyDatingProfileInteractions: DailyDatingProfileInteraction[] = []

  async save(dailyDatingProfileInteraction: DailyDatingProfileInteraction): Promise<SuccessOrFailure<void>> {
    const existingIndex = this.#inMemoryDailyDatingProfileInteractions.findIndex(
      (inMemory) =>
        inMemory.dailyDatingProfileInteractionId === dailyDatingProfileInteraction.dailyDatingProfileInteractionId,
    )

    if (existingIndex != -1) {
      this.#inMemoryDailyDatingProfileInteractions[existingIndex] = dailyDatingProfileInteraction
    } else {
      this.#inMemoryDailyDatingProfileInteractions.push(dailyDatingProfileInteraction)
    }

    return Result.ok()
  }

  async saveBulk(dailyDatingProfileInteractions: DailyDatingProfileInteraction[]): Promise<SuccessOrFailure<void>> {
    return Promise.all(
      dailyDatingProfileInteractions.map(async (dailyDatingProfileInteraction) =>
        this.save(dailyDatingProfileInteraction),
      ),
    )
      .catch(() => Result.fail())
      .then(() => Result.ok())
  }

  async getDatingProfileIdsByDailyDatingProfileId(
    dailyDatingProfileId: string,
    excludeDatingProfileId: string,
  ): Promise<string[]> {
    return this.#inMemoryDailyDatingProfileInteractions
      .filter(
        (inMemory) =>
          inMemory.dailyDatingProfileId === dailyDatingProfileId && inMemory.datingProfileId !== excludeDatingProfileId,
      )
      .map((data) => data.datingProfileId)
  }

  async isDatingProfileInteracted(dailyDatingProfileId: string, datingProfileId: string): Promise<boolean> {
    return this.#inMemoryDailyDatingProfileInteractions.find(
      (inMemory) =>
        inMemory.dailyDatingProfileId === dailyDatingProfileId && inMemory.datingProfileId === datingProfileId,
    )
      ? true
      : false
  }
}
