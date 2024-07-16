Feature: Update Dating Profile

    Rule: Prerequisites update dating profile
      1. seed user
      2. seed dating profile

        Scenario: successfully update dating profile name
          Given dating profile with updated name
          When update dating profile
          Then should successfully update dating profile
          And dating profile name should match

        Scenario: successfully update dating profile picture
          Given a fake picture
          When update dating profile with fake picture
          Then should successfully update dating profile picture
          And dating profile picture url should exists