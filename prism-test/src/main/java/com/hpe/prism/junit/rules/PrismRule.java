package com.hpe.prism.junit.rules;

import org.junit.rules.TestWatcher;
import org.junit.runner.Description;

import com.hpe.prism.junit.drivers.PrismDriver;

public class PrismRule extends TestWatcher {

    private PrismDriver driver;

    public PrismRule(PrismDriver driver) {
        this.driver = driver;
    }

    @Override
    protected void starting(Description description) {
        driver.setTags(description.getMethodName(), description.getClassName(), description.getDisplayName());
    }

    @Override
    protected void finished(Description description) {
        driver.removeTags();
    }
}
