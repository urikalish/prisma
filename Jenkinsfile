pipeline {
    options { timeout(time: 45, unit: 'MINUTES') }
    environment {
        APP_ID = credentials('chrome-app-id')
        DEV_APP_ID = credentials('chrome-dev-app-id')
        REFRESH_TOKEN = credentials('chrome-refresh-token')
        DEV_REFRESH_TOKEN = credentials('chrome-dev-refresh-token')
        CLIENT_SECRET = credentials('chrome-client-secret')
        DEV_CLIENT_SECRET = credentials('chrome-dev-client-secret')
        CLIENT_ID = credentials('chrome-client-id')
        DEV_CLIENT_ID = credentials('chrome-dev-client-id')
    }

    agent {
        docker {
            image 'node:6.12-alpine'
            args """-u root:root
            -e HTTP_PROXY="${env.HTTP_PROXY}"
            -e HTTPS_PROXY="${env.HTTPS_PROXY}"
            -v /tmp/yarn_cache:/usr/local/share/.cache/yarn/v1
            """
        }
    }

    stages {
        stage('PROVISION: install packages in agent') {
            steps {
                installApk()
                echo "INSTALLED!!"
            }
        }

        stage('BUILD: yarn build chrome-extension') {
            steps {
                increaseMinorVersion()
                sh """cd chrome-extension
                    npm config set http-proxy $HTTP_PROXY
                    npm config set https-proxy $HTTPS_PROXY
                    yarn install
                    rm -rf ${env.WORKSPACE}/chrome-extension/build-prod
                    mkdir ${env.WORKSPACE}/chrome-extension/build-prod
                    yarn build
                    cp -r ${env.WORKSPACE}/chrome-extension/build/* ${env.WORKSPACE}/chrome-extension/build-prod
                    yarn build-angular
                """
            }
        }

        stage('COMPRESS: archive build to ZIP') {
            steps {
                sh """rm -f ${env.WORKSPACE}/chrome-extension/chrome-extension.zip
                      rm -f ${env.WORKSPACE}/chrome-extension/chrome-extension[dev].zip
                      rm -f ${env.WORKSPACE}/chrome-extension/Prisma.crx
                   """

                zip zipFile: 'chrome-extension/chrome-extension.zip',
                       archive: true,
                       dir: 'chrome-extension/build-prod'

                zip zipFile: 'chrome-extension/chrome-extension[dev].zip',
                       archive: true,
                       dir: 'chrome-extension/build'

                sh """curl -L "https://clients2.google.com/service/update2/crx?response=redirect&prodversion=49.0&x=id%3Dhoelgmhhfelfhcibnblnmiflmcfppenm%26installsource%3Dondemand%26uc" > ${env.WORKSPACE}/chrome-extension/Prisma.crx"""
                archiveArtifacts artifacts: 'chrome-extension/Prisma.crx',
                               fingerprint: true
            }
        }

        stage('PUBLISH: push to chrome store') {
            when {
                allOf {
                    branch 'master'
                    expression { shouldPublishToStore() == true }
                }
            }

            steps {
                retry(3) {
                    script {
                        def token = getAccessToken(false)
                        pushToStore(token, false)
                        env.WAS_PUSHED = true
                    }
                }
            }
        }

        stage('PUBLISH: push dev extension to chrome store') {
                    when {
                        allOf {
                            branch 'master'
                            expression { publishDevExtensionToStore() == true }
                        }
                    }

                    steps {
                        retry(3) {
                            script {
                                def token = getAccessToken(true)
                                pushToStore(token, true)
                                env.WAS_PUSHED_DEV_EXTENSION = true
                            }
                        }
                    }
                }
    }

    post {
        success {
            script {
                if(env.WAS_PUSHED == "true" || env.WAS_PUSHED_DEV_EXTENSION == "true") {
                    def storeLink
                    if(env.WAS_PUSHED == "true"){
                        storeLink = 'https://chrome.google.com/webstore/detail/prisma/hoelgmhhfelfhcibnblnmiflmcfppenm'
                    } else {
                        storeLink = 'https://chrome.google.com/webstore/detail/prisma/hnijicpamlojghdddhoodpddnokljfpk'
                    }
                    emailext (
                        subject: "SUCCESS: Job '${env.JOB_NAME} [${env.BUILD_ID}]'",
                        body: "SUCCESS: Job '${env.JOB_NAME} [${env.BUILD_ID}]': Check console output at: ${env.BUILD_URL}\nThe extension is available here:\n${storeLink}",
                        recipientProviders: [
                            [$class: 'CulpritsRecipientProvider'],
                            [$class: 'DevelopersRecipientProvider'],
                            [$class: 'RequesterRecipientProvider']
                        ]
                    )
                }
            }
        }

        failure {
            emailext (
                subject: "FAILED: Job '${env.JOB_NAME} [${env.BUILD_ID}]'",
                body: "FAILED: Job '${env.JOB_NAME} [${env.BUILD_ID}]': Check console output at: ${env.BUILD_URL}",
                recipientProviders: [
                    [$class: 'CulpritsRecipientProvider'],
                    [$class: 'DevelopersRecipientProvider'],
                    [$class: 'RequesterRecipientProvider']
                ]
            )
        }
    }
}

def shouldPublishToStore() {
    def result
    def returnValue = false
    def command = $/git log -1 | grep '\[publish extension\]' | wc -l/$

    result = sh(script: command, returnStdout: true).trim()

    if (result == "1") {
        echo "SHOULD PUSH TO STORE!!!"
        returnValue = true
    }

    returnValue
}

def publishDevExtensionToStore() {
    def result
    def returnValue = false
    def command = $/git log -1 | grep '\[publish dev extension\]' | wc -l/$

    result = sh(script: command, returnStdout: true).trim()

    if (result == "1") {
        echo "PUSH DEV EXTENSION TO CHROME STORE!!"
        returnValue = true
    }

    returnValue
}

def installApk() {
    sh """apk upgrade
            apk update
            apk add git
            apk add curl
            apk add openssl
            apk add jq
            """
}

def getAccessToken(dev) {
    def access_token
    def command
    if(!dev){
        echo "id: ${env.CLIENT_ID} secret: ${env.CLIENT_SECRET} refresh: ${env.REFRESH_TOKEN}"
        command = $/curl https://accounts.google.com/o/oauth2/token -d client_id=${env.CLIENT_ID}\&client_secret=${env.CLIENT_SECRET}\&refresh_token=${env.REFRESH_TOKEN}\&grant_type=refresh_token\&redirect_uri=urn:ietf:wg:oauth:2.0:oob | jq -r .access_token/$
    } else {
        echo "in dev id: ${env.DEV_CLIENT_ID} secret: ${env.DEV_CLIENT_SECRET} refresh: ${env.DEV_REFRESH_TOKEN}"
        command = $/curl https://accounts.google.com/o/oauth2/token -d client_id=${env.DEV_CLIENT_ID}\&client_secret=${env.DEV_CLIENT_SECRET}\&refresh_token=${env.DEV_REFRESH_TOKEN}\&grant_type=refresh_token\&redirect_uri=urn:ietf:wg:oauth:2.0:oob | jq -r .access_token/$
    }

    access_token = sh(script: command, returnStdout: true).trim()

    if(access_token == "null") {
        error("ACCESS TOKEN ERROR: failed to create")
    }

    access_token
}

def pushToStore(access_token, dev) {
    if(!dev){
        sh """
        curl -H "Authorization: Bearer ${access_token}" -H "x-goog-api-version: 2" -X PUT -T ${env.WORKSPACE}/chrome-extension/chrome-extension.zip -v "https://www.googleapis.com/upload/chromewebstore/v1.1/items/${env.APP_ID}"
        curl -H "Authorization: Bearer ${access_token}" -H "x-goog-api-version: 2" -H "Content-Length: 0" -X POST -v "https://www.googleapis.com/chromewebstore/v1.1/items/${env.APP_ID}/publish"
        """
    } else {
        sh """
        curl -H "Authorization: Bearer ${access_token}" -H "x-goog-api-version: 2" -X PUT -T ${env.WORKSPACE}/chrome-extension/chrome-extension[dev].zip -v "https://www.googleapis.com/upload/chromewebstore/v1.1/items/${env.DEV_APP_ID}"
        curl -H "Authorization: Bearer ${access_token}" -H "x-goog-api-version: 2" -H "Content-Length: 0" -X POST -v "https://www.googleapis.com/chromewebstore/v1.1/items/${env.DEV_APP_ID}/publish"
        """
    }
}

def increaseMinorVersion() {
    def path = 'chrome-extension/src/manifest.json'
    def data = readJSON file: path
    def newVersion = "${data.version}" + "." + "${env.BUILD_NUMBER}"
    data['version'] = "" + "$newVersion"

    writeJSON(file: path, json: data)
}