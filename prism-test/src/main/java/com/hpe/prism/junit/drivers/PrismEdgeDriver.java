package com.hpe.prism.junit.drivers;

import org.openqa.selenium.edge.EdgeDriver;

public class PrismEdgeDriver extends EdgeDriver implements PrismDriver {

    private String[] tags;

    @Override
    public void get(String url) {
        super.get(url);
        injectTags();
    }

    @Override
    public void injectTags() {
        executeScript(String.format("localStorage.setItem('%s', '%s')", LOCAL_STORAGE_KEY, String.join(", ", tags)));
    }

    @Override
    public void setTags(String... tags) {
        this.tags = tags;
    }

    @Override
    public void removeTags() {
        executeScript(String.format("localStorage.removeItem('%s')", LOCAL_STORAGE_KEY));
    }
}
