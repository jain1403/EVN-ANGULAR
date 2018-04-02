#!groovy

try {
    node('predixci-node6.9') {

        try {
          def branchName = env.BRANCH_NAME
          stage('Checkout') {
            echo "Checking out ${branchName}"
            checkout scm
          }

          stage('Build'){ //Build stage installs dependencies
                sh "npm config set registry https://repo.jenkins.build.ge.com/artifactory/api/npm/npm-virtual" //Use Caching repo for faster build
                echo 'Installing NPM and Bower dependencies'
                //sh 'npm install && bower install --allow-root'
                stash includes: '**' , name: 'artifact' //Stash project to be picked up in Deploy stage
          }

          stage ('Deploy'){
            node('aws-deploy') {
              unstash 'artifact'
              withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', credentialsId: 'evn-jenkins-creds']]) {
                  sh "aws s3 cp ./ s3://www.evn-analytics-${branchName}/ --recursive --no-verify-ssl"
  		        }

            }
         }
    } catch(err){
    throw(err)
}

}} catch(err){
    throw(err)
}
