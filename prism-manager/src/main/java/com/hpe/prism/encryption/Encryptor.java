package com.hpe.prism.encryption;

import java.io.UnsupportedEncodingException;

import org.bouncycastle.crypto.CryptoException;

public class Encryptor {
    
    public static void main(String[] args) {
        
        if (args.length != 2) {
            System.out.println("Usage: java -jar encrypt.jar PLAIN_PASSWORD ENCRYPTION_KEY_32_CHARACTERS");
        }
        
        final String PLAIN_PASSWORD = args[0];
        final String KEY = args[1];
        
        String encrypted = null;
        try {
            encrypted = SecurityUtils.encrypt(PLAIN_PASSWORD, KEY);
        } catch (CryptoException | UnsupportedEncodingException e) {
            e.printStackTrace();
        }
        
        System.out.println(encrypted);
    }
}
