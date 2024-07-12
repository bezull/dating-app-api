Feature: Swipe Left Dating Profile

    Rule: Prerequisites discover dating profiles
      1. seed user
      2. seed dating profiles

        Scenario: successfully swipe left dating profile
          Given seed new user and dating profile
          When swipe left dating profile
          Then should successfully swipe left dating profile
          And dating profile total pass increased by 1

        Scenario: error swipe left dating profile due to already interacted today
          Given seed new user, dating profile, daily dating profile, and daily dating profile interaction
          When swipe left dating profile
          Then should return error swipe left dating profile due to already interacted today