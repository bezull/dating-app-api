Feature: Discover Dating Profiles

    Rule: Prerequisites discover dating profiles
      1. seed user
      2. seed dating profiles

        Scenario: successfully discover dating profiles
          Given seed new user and dating profile
          When discover dating profiles using newly seeded user id
          Then should return dating profiles

        Scenario: successfully discover dating profiles that haven't been interacted
          Given seed new user, dating profile, daily dating profile, and daily dating profile interaction
          When discover dating profiles using newly seeded user id
          Then should return dating profiles that hasn't been interacted