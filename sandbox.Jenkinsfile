def sandboxServer = [
    "sandbox-1": "192.168.1.1"
]

pipeline {
    agent any

    parameters{
        string(name: 'Branch', defaultValue: '', description: 'Branch to deploy')
        choice(name: 'Server', choices: [script(sandboxServer.keySet())], description: 'Target deploy sandbox server')
    }

    environment {   
        SANDBOX_SERVER = "$params.Branch"
        SANDBOX_IP = script(sandboxServer.get("$params.Branch"))
    }   

    stages {
        stage('pre-condition') {
            steps {
                script {
                    echo "Pre-Condition"
                    echo "Branch: $env.SANDBOX_SERVER"
                    echo "Target Sandbox Server: $env.SANDBOX_SERVER@$env.SANDBOX_IP"
                }
            }
        }
        stage('checkout scm') {
            steps {
                script {
                    sh("Checkout SCM")
                }
            }
        }
        stage('build') {
            steps{
                script {
                    sh("Build Docker Image")
                }
            }
        }
    }
}