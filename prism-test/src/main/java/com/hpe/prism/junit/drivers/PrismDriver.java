package com.hpe.prism.junit.drivers;

public interface PrismDriver {
    String LOCAL_STORAGE_KEY = "prism test";
    void setTags(String... tags);
    void injectTags();
    void removeTags();
}
