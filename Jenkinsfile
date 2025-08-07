pipeline {
    agent any
    
    environment {
        // Docker Hub credentials (configure in Jenkins credentials)
        DOCKER_HUB_CREDENTIALS = credentials('dockerhub-credentials')
        DOCKER_IMAGE_NAME = 'your-dockerhub-username/lovable-app'
        DOCKER_IMAGE_TAG = "${BUILD_NUMBER}"
        
        // SonarQube configuration
        SONAR_PROJECT_KEY = 'lovable-app'
        SONAR_PROJECT_NAME = 'Lovable App'
        
        // Node.js version
        NODE_VERSION = '18'
    }
    
    tools {
        nodejs "${NODE_VERSION}"
    }
    
    stages {
        stage('Checkout') {
            steps {
                script {
                    echo "🔄 Checking out source code..."
                    checkout scm
                }
            }
        }
        
        stage('Install Dependencies') {
            steps {
                script {
                    echo "📦 Installing Node.js dependencies..."
                    sh '''
                        npm ci --cache /tmp/.npm
                        npm list
                    '''
                }
            }
        }
        
        stage('Code Quality & Security Analysis') {
            parallel {
                stage('Lint & Format Check') {
                    steps {
                        script {
                            echo "🔍 Running ESLint and Prettier checks..."
                            sh '''
                                npm run lint || true
                                npx prettier --check . || true
                            '''
                        }
                    }
                }
                
                stage('OWASP Dependency Check') {
                    steps {
                        script {
                            echo "🛡️ Running OWASP dependency vulnerability scan..."
                            sh '''
                                npm audit --audit-level=moderate
                                npm audit fix --dry-run
                            '''
                        }
                    }
                }
            }
        }
        
        stage('Build Application') {
            steps {
                script {
                    echo "🏗️ Building React application..."
                    sh '''
                        npm run build
                        ls -la dist/
                    '''
                }
            }
        }
        
        stage('Run Tests') {
            parallel {
                stage('Unit Tests') {
                    steps {
                        script {
                            echo "🧪 Running Jest unit tests..."
                            sh '''
                                npm test -- --coverage --watchAll=false --passWithNoTests
                            '''
                        }
                    }
                    post {
                        always {
                            // Publish test results
                            publishTestResults testResultsPattern: 'coverage/lcov.info'
                            publishHTML([
                                allowMissing: false,
                                alwaysLinkToLastBuild: true,
                                keepAll: true,
                                reportDir: 'coverage/lcov-report',
                                reportFiles: 'index.html',
                                reportName: 'Coverage Report'
                            ])
                        }
                    }
                }
                
                stage('Type Check') {
                    steps {
                        script {
                            echo "📝 Running TypeScript type checking..."
                            sh 'npx tsc --noEmit'
                        }
                    }
                }
            }
        }
        
        stage('SonarQube Analysis') {
            steps {
                script {
                    echo "📊 Running SonarQube code quality analysis..."
                    withSonarQubeEnv('SonarQube') {
                        sh '''
                            npx sonar-scanner \
                                -Dsonar.projectKey=${SONAR_PROJECT_KEY} \
                                -Dsonar.projectName="${SONAR_PROJECT_NAME}" \
                                -Dsonar.sources=src \
                                -Dsonar.tests=src \
                                -Dsonar.test.inclusions=**/*.test.ts,**/*.test.tsx,**/*.spec.ts,**/*.spec.tsx \
                                -Dsonar.exclusions=**/*.test.ts,**/*.test.tsx,**/*.spec.ts,**/*.spec.tsx,**/node_modules/**,**/dist/** \
                                -Dsonar.typescript.lcov.reportPaths=coverage/lcov.info \
                                -Dsonar.javascript.lcov.reportPaths=coverage/lcov.info
                        '''
                    }
                }
            }
        }
        
        stage('Quality Gate') {
            steps {
                script {
                    echo "🚪 Waiting for SonarQube Quality Gate..."
                    timeout(time: 5, unit: 'MINUTES') {
                        def qg = waitForQualityGate()
                        if (qg.status != 'OK') {
                            error "Pipeline aborted due to quality gate failure: ${qg.status}"
                        }
                    }
                }
            }
        }
        
        stage('Build Docker Image') {
            steps {
                script {
                    echo "🐳 Building Docker image..."
                    sh '''
                        docker build -t ${DOCKER_IMAGE_NAME}:${DOCKER_IMAGE_TAG} \
                                     -t ${DOCKER_IMAGE_NAME}:latest \
                                     --build-arg BUILD_DATE=$(date -u +'%Y-%m-%dT%H:%M:%SZ') \
                                     --build-arg BUILD_VERSION=${BUILD_NUMBER} \
                                     .
                        docker images | grep ${DOCKER_IMAGE_NAME}
                    '''
                }
            }
        }
        
        stage('Container Security Scan') {
            steps {
                script {
                    echo "🔒 Scanning Docker image with Trivy..."
                    sh '''
                        # Install Trivy if not present
                        if ! command -v trivy &> /dev/null; then
                            wget -qO - https://aquasecurity.github.io/trivy-repo/deb/public.key | sudo apt-key add -
                            echo "deb https://aquasecurity.github.io/trivy-repo/deb $(lsb_release -sc) main" | sudo tee -a /etc/apt/sources.list.d/trivy.list
                            sudo apt-get update
                            sudo apt-get install trivy
                        fi
                        
                        # Run Trivy scan
                        trivy image --format json --output trivy-report.json ${DOCKER_IMAGE_NAME}:${DOCKER_IMAGE_TAG}
                        trivy image --severity HIGH,CRITICAL --format table ${DOCKER_IMAGE_NAME}:${DOCKER_IMAGE_TAG}
                    '''
                }
            }
            post {
                always {
                    archiveArtifacts artifacts: 'trivy-report.json', fingerprint: true
                }
            }
        }
        
        stage('Push to Docker Hub') {
            when {
                anyOf {
                    branch 'main'
                    branch 'master'
                    branch 'develop'
                }
            }
            steps {
                script {
                    echo "🚀 Pushing Docker image to Docker Hub..."
                    sh '''
                        echo $DOCKER_HUB_CREDENTIALS_PSW | docker login -u $DOCKER_HUB_CREDENTIALS_USR --password-stdin
                        docker push ${DOCKER_IMAGE_NAME}:${DOCKER_IMAGE_TAG}
                        docker push ${DOCKER_IMAGE_NAME}:latest
                        docker logout
                    '''
                }
            }
        }
        
        stage('Archive Artifacts') {
            steps {
                script {
                    echo "📦 Archiving build artifacts..."
                    sh '''
                        # Create artifacts directory
                        mkdir -p artifacts
                        
                        # Archive build output
                        tar -czf artifacts/dist-${BUILD_NUMBER}.tar.gz dist/
                        
                        # Create deployment manifest
                        cat > artifacts/deployment-info.json << EOF
{
    "buildNumber": "${BUILD_NUMBER}",
    "gitCommit": "${GIT_COMMIT}",
    "gitBranch": "${GIT_BRANCH}",
    "dockerImage": "${DOCKER_IMAGE_NAME}:${DOCKER_IMAGE_TAG}",
    "buildDate": "$(date -u +'%Y-%m-%dT%H:%M:%SZ')",
    "nodeVersion": "${NODE_VERSION}"
}
EOF
                    '''
                }
            }
            post {
                always {
                    archiveArtifacts artifacts: 'artifacts/**', fingerprint: true
                    archiveArtifacts artifacts: 'dist/**', fingerprint: true
                }
            }
        }
    }
    
    post {
        always {
            script {
                echo "🧹 Cleaning up workspace..."
                // Clean up Docker images to save space
                sh '''
                    docker system prune -f
                    docker image prune -f
                '''
                
                // Clean workspace
                cleanWs()
            }
        }
        
        success {
            script {
                echo "✅ Pipeline completed successfully!"
                // Add Slack/email notifications here if needed
            }
        }
        
        failure {
            script {
                echo "❌ Pipeline failed!"
                // Add failure notifications here
            }
        }
        
        unstable {
            script {
                echo "⚠️ Pipeline completed with warnings!"
            }
        }
    }
}