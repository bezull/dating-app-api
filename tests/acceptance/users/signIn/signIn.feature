Feature: Sign In

    Scenario: Successfully sign in user
        Given valid email and password
        When Sign in
        Then Should successfully sign in user

    Scenario: Error sign in due to email not found
        Given invalid email and password
        When Sign In
        Then should return error with message "Email not found"

    Scenario: Error sign in due to invalid credential
        Given valid email and invalid password
        When Sign In
        Then should return error with message "Invalid email or password"