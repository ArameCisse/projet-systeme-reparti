pipeline {
    agent any
    environment {
        REGISTRY       = "docker.io"
        IMAGE_PREFIX   = "aramecisse/projet-systeme-reparti"
        KUBE_NAMESPACE = "projet-sr"
    }
    stages {
        stage("Checkout") {
            steps {
                checkout scm
            }
        }
        stage("Backend - Lint & Tests") {
            steps {
                sh '''
                python3 -m venv .venv
                . .venv/bin/activate
                pip install -r backend/requirements.txt
                cd backend
                python manage.py test
                '''
            }
        }
        stage("Frontend - Build") {
            steps {
                sh '''
                cd frontend
                npm install
                npm run build
                '''
            }
        }
        stage("Docker Build & Push") {
            steps {
                withCredentials([usernamePassword(credentialsId: "dockerhub", usernameVariable: "DOCKER_USER", passwordVariable: "DOCKER_PASS")]) {
                    sh '''
                    echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin
                    docker build -t docker.io/aramecisse/projet-systeme-reparti-backend:latest -f backend/Dockerfile .
                    docker build -t docker.io/aramecisse/projet-systeme-reparti-frontend:latest -f frontend/Dockerfile .
                    docker push docker.io/aramecisse/projet-systeme-reparti-backend:latest
                    docker push docker.io/aramecisse/projet-systeme-reparti-frontend:latest
                    '''
                }
            }
        }
        stage("Deploy to Kubernetes") {
            steps {
                withKubeConfig(credentialsId: "kubeconfig") {
                    sh '''
                    kubectl apply -f k8s/namespace.yaml
                    kubectl apply -f k8s/configmap.yaml
                    kubectl apply -f k8s/secret.yaml
                    kubectl apply -f k8s/postgres.yaml
                    kubectl apply -f k8s/backend.yaml
                    kubectl apply -f k8s/frontend.yaml
                    '''
                }
            }
        }
    }
}