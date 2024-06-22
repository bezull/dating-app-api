Feature: Get Dating Profile

    Rule:
        1. A user has been seeded.
        2. A dating profile has with seeded user are added.

    Scenario: Successfully get dating profile
    Given newly created user with dating profile
    When get dating profile 
    Then should successfully get dating profile

    Scenario: Error get dating profile due to dating profile not found
    Given seed new user without dating profile
    When get dating profile with new user
    Then should return error