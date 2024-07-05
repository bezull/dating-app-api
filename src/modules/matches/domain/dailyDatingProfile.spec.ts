import moment from 'moment'
import { v4 as uuidv4 } from 'uuid'
import { DailyDatingProfile } from './dailyDatingProfile'

describe('DailyDatingProfile', () => {
  it('should able to create daily dating profile', () => {
    const dailyDatingProfileResult = DailyDatingProfile.create({
      userId: uuidv4(),
    })

    expect(dailyDatingProfileResult.isSuccess).toBeTruthy()
    const dailyDatingProfile = dailyDatingProfileResult.getValue()
    expect(dailyDatingProfile.date).toBe(moment().format('YYYY-MM-DD'))
    expect(dailyDatingProfile.totalInteractions).toBe(0)
  })
})
