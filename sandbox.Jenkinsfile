def sandboxServer = [
    "sandbox-1": "192.168.1.1"
]

pipeline {
    agent any

    parameters {
        string(name: 'BRANCH', defaultValue: 'master', description: 'Branch to deploy')
        choice(name: 'SERVER', choices: ["sandbox-1"], description: 'Target deploy sandbox server')
    }

    environment {   
        SANDBOX_SERVER = "$params.SERVER"
        SANDBOX_IP = sandboxServer.get(params.SERVER)
        TARGET_BRANCH = "$params.BRANCH"
        DOCKER_IMAGE_TAG = "bezull/dating-app-api:$env.SANDBOX_SERVER"
    }   

    stages {
        stage('Pre-condition') {
            steps {
                script {
                    echo "Pre-Condition"
                    echo "Branch: $env.SANDBOX_SERVER"
                    echo "Target Sandbox Server: $env.SANDBOX_SERVER@$env.SANDBOX_IP"
                }
            }
        }
        stage('Checkout SCM') {
            steps {
                script {
                    echo "Checkout SCM"
                    checkout scmGit(branches: [[name: "*/${env.TARGET_BRANCH}"]], userRemoteConfigs: [[credentialsId: 'BezullGithub', url: 'https://github.com/bezull/dating-app-api.git']])
                }
            }
        }
        stage('Docker Preparation') {
            steps {
                script {
                    echo "Preparation for Docker Image Build"
                    echo "Docker Image Tag: $env.DOCKER_IMAGE_TAG"
                }
            }
        }
        stage('Building Image') {
            steps {
                script {
                    catchError {
                        docker.withRegistry("https://registry.hub.docker.com", 'BezullRegistry') {
                            docker.build("$env.DOCKER_IMAGE_TAG")
                        }
                    }
                }
            }
        }
        stage('Publish Image') {
            steps {
                script {
                    catchError {
                        def dockerImg = docker.image(env.DOCKER_IMAGE_TAG)
                        dockerImg.push()
                    }
                }
            }
        }
    }

    post{
        success {
            script {
                echo 'success!'
            }
        }
    }
}