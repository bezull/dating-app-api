Feature: Swipe Right Dating Profile

    Rule: Prerequisites discover dating profiles
      1. seed user
      2. seed dating profiles

        Scenario: successfully swipe right dating profile
          Given seed new user and dating profile
          When swipe right dating profile
          Then should successfully swipe right dating profile
          And dating profile total like increased by 1

        Scenario: error swipe right dating profile due to already interacted today
          Given seed new user, dating profile, daily dating profile, and daily dating profile interaction
          When swipe right dating profile
          Then should return error swipe right dating profile due to already interacted today