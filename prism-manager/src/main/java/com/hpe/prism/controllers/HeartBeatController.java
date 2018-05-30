package com.hpe.prism.controllers;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/heartbeat")
public class HeartBeatController {
    
    private final Logger logger = LoggerFactory.getLogger(getClass());
    
    @GetMapping
    public ResponseEntity heartBeat() {
        logger.info("Manager got heartbeat request.");
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
