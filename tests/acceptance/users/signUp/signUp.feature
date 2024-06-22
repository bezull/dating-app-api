Feature: Sign Up

    Scenario: Successfully sign up user
        Given email, name, and password
        When Sign up
        Then Should successfully sign up user
        And Dating profile is created

    Scenario: Error sign up user
        Given duplicate email, name, and password 
        When Sign Up
        Then should return error with message "Email already in use"