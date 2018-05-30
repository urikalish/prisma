package com.hpe.prism.entities;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public enum DefaultEventType {

    AUTO("auto"),
    MANUAL("manual"),
    USER("user"),
    UNKNOWN("unknown");

    private String value;
}
