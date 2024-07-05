import { v4 as uuidv4 } from 'uuid'
import { DailyDatingProfileInteraction } from './dailyDatingProfileInteraction'

describe('DailyDatingProfileInteraction', () => {
  it('should able to create daily dating profile interaction', () => {
    const dailyDatingProfileInteraction = DailyDatingProfileInteraction.create({
      dailyDatingProfileId: uuidv4(),
      datingProfileId: uuidv4(),
      isLiked: true,
    })

    expect(dailyDatingProfileInteraction.isSuccess).toBeTruthy()
  })
})
