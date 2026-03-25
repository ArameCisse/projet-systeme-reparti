pipeline {
    agent any

    environment {
        // Adapter ces valeurs selon ton Docker Hub / registry
        REGISTRY       = "docker.io"
        IMAGE_PREFIX   = "aramecisse/projet-systeme-reparti"
        KUBE_NAMESPACE = "projet-sr"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Backend - Lint & Tests') {
            steps {
                sh """
                python3 -m venv .venv
                . .venv/bin/activate
                pip install -r backend/requirements.txt
                cd backend
                python manage.py test
                """
            }
        }

        stage('Frontend - Build') {
            steps {
                sh """
                cd frontend
                npm install
                npm run build
                """
            }
        }

        stage('Docker Build & Push') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    sh """
                    echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin

                    BACKEND_IMAGE=${REGISTRY}/${IMAGE_PREFIX}-backend:${env.BUILD_NUMBER}
                    FRONTEND_IMAGE=${REGISTRY}/${IMAGE_PREFIX}-frontend:${env.BUILD_NUMBER}

                    docker build -t $BACKEND_IMAGE -f backend/Dockerfile .
                    docker build -t $FRONTEND_IMAGE -f frontend/Dockerfile .

                    docker push $BACKEND_IMAGE
                    docker push $FRONTEND_IMAGE

                    # Tags latest
                    docker tag $BACKEND_IMAGE ${REGISTRY}/${IMAGE_PREFIX}-backend:latest
                    docker tag $FRONTEND_IMAGE ${REGISTRY}/${IMAGE_PREFIX}-frontend:latest
                    docker push ${REGISTRY}/${IMAGE_PREFIX}-backend:latest
                    docker push ${REGISTRY}/${IMAGE_PREFIX}-frontend:latest
                    """
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                withKubeConfig(credentialsId: 'kubeconfig') {
                    sh """
                    kubectl apply -f k8s/namespace.yaml
                    kubectl apply -f k8s/configmap.yaml
                    kubectl apply -f k8s/secret.yaml
                    kubectl apply -f k8s/postgres.yaml
                    kubectl apply -f k8s/backend.yaml
                    kubectl apply -f k8s/frontend.yaml
                    """
                }
            }
        }
    }
}

