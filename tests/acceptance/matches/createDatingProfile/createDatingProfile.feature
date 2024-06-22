Feature: Create Dating Profile
    Scenario: Successfully create dating profile
    Given valid user id and name
    When create dating profile with valid user id and name
    Then should successfully create dating profile

    Scenario: Error create dating profile 
    Given seed 1 dating profile
    When create dating profile using user id and name from seeded dating profile
    Then should return error with message "Dating profile already exists"
