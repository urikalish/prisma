package com.hpe.prism.config.webpack;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

import java.io.IOException;
import java.util.concurrent.TimeUnit;

/**
 * Development utility which launch Webpack dev-server when Spring profile webpack-dev-server is active.
 */
@Configuration
@Profile("webpack")
public class WebpackDevServerWindowsLauncher {
    @Bean
    public WebpackRunner frontRunner() {
        return new WebpackRunner();
    }

    static class WebpackRunner implements InitializingBean {
        private Logger logger = LoggerFactory.getLogger(getClass());

        private static final String WEBPACK_SERVER_PROPERTY = "webpack-server-loaded";

        @Override
        public void afterPropertiesSet() throws Exception {
            if (null == System.getProperty(WEBPACK_SERVER_PROPERTY)) {
                startWebpackDevServer();
            }
        }

        private void startWebpackDevServer() {

            killRunningNodeProcesses();

            String cmd = "cmd /c gradlew buildClientWatch";
            logger.info("webpack dev-server " + cmd);

            Thread thread = new Thread(() -> runHotReload(cmd));

            thread.start();
        }

        private void killRunningNodeProcesses() {
            Runtime rt = Runtime.getRuntime();
            try {
                // Kill node.exe and wait up to 2 seconds for to be killed
                rt.exec("taskkill /F /IM node.exe").waitFor(5, TimeUnit.SECONDS);
            } catch (IOException e) {
                logger.warn("Fail to kill running node.exe\n\n", e);
            } catch (InterruptedException e) {
                logger.warn("Fail to kill running node.exe\n\n", e);
            }
        }

        private void runHotReload(String cmd) {
            ProcessBuilder pb = new ProcessBuilder(cmd.split(" "));
            pb.redirectOutput(ProcessBuilder.Redirect.INHERIT);
            pb.redirectError(ProcessBuilder.Redirect.INHERIT);

            // Running gradlew from the root directory (one dir up)
            pb.directory();

            Process process = null;
            try {
                // Start the node process
                process = pb.start();

                // Wait for the node process to quit (blocking)
                process.waitFor();

                // Ensure the node process is killed
                process.destroyForcibly();
                System.setProperty(WEBPACK_SERVER_PROPERTY, "true");
            } catch (InterruptedException | IOException e) {
                // Ensure the node process is killed.
                // InterruptedException is thrown when the main process exit.
                logger.info("killing webpack dev-server", e);
                if (process != null) {
                    process.destroyForcibly();
                }
            }
        }
    }
}
