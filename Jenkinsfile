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
                // Utilisation du chemin absolu de l'hôte pour garantir que Docker trouve les fichiers
                sh '''
                docker run --rm -v /home/arame/projet-systeme-reparti:/app -w /app python:3.11-slim sh -c "
                    pip install --no-cache-dir -r backend/requirements.txt && 
                    python backend/manage.py test
                "
                '''
            }
        }

        stage("Frontend - Build") {
            steps {
                // Utilisation du chemin absolu de l'hôte
                sh '''
                docker run --rm -v /home/arame/projet-systeme-reparti:/app -w /app node:20-slim sh -c "
                    cd frontend && 
                    npm install && 
                    npm run build
                "
                '''
            }
        }

        stage("Docker Build & Push") {
            steps {
                withCredentials([usernamePassword(credentialsId: "dockerhub", usernameVariable: "DOCKER_USER", passwordVariable: "DOCKER_PASS")]) {
                    sh '''
                    echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin
                    
                    docker build -t ${REGISTRY}/${IMAGE_PREFIX}-backend:latest -f backend/Dockerfile .
                    docker build -t ${REGISTRY}/${IMAGE_PREFIX}-frontend:latest -f frontend/Dockerfile .
                    
                    docker push ${REGISTRY}/${IMAGE_PREFIX}-backend:latest
                    docker push ${REGISTRY}/${IMAGE_PREFIX}-frontend:latest
                    '''
                }
            }
        }

        stage("Deploy to Kubernetes") {
            steps {
                script {
                    try {
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
                    } catch (Exception e) {
                        echo "Le déploiement K8s a échoué, vérifiez vos fichiers YAML ou la connexion au cluster."
                    }
                }
            }
        }
    }
}
