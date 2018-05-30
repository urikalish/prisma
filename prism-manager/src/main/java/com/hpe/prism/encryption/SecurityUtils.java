package com.hpe.prism.encryption;

import java.io.UnsupportedEncodingException;
import java.util.Base64;

import org.bouncycastle.crypto.BufferedBlockCipher;
import org.bouncycastle.crypto.CryptoException;
import org.bouncycastle.crypto.engines.AESEngine;
import org.bouncycastle.crypto.modes.CBCBlockCipher;
import org.bouncycastle.crypto.paddings.PaddedBufferedBlockCipher;
import org.bouncycastle.crypto.params.KeyParameter;
import org.bouncycastle.crypto.params.ParametersWithIV;
import org.h2.util.StringUtils;

public class SecurityUtils {
    
    private final static String CHARSET = "UTF-8";
    
    private static byte[] callCipher(byte[] data, KeyParameter key, boolean isForEncryption)
            throws CryptoException {
        
        BufferedBlockCipher cipher =
                new PaddedBufferedBlockCipher(new CBCBlockCipher(new AESEngine()));
        final byte[] INITIALIZATION_VECTOR = { 3, 1, 6, 9, 7, 8, 2, 1, 2, 4, 9, 8, 2, 2, 4, 9 };
        cipher.init(isForEncryption, new ParametersWithIV(key, INITIALIZATION_VECTOR));
        
        int size = cipher.getOutputSize(data.length);
        byte[] result = new byte[size];
        int len = cipher.processBytes(data, 0, data.length, result, 0);
        len += cipher.doFinal(result, len);
        
        if (len < size) {
            byte[] tmp = new byte[len];
            System.arraycopy(result, 0, tmp, 0, len);
            result = tmp;
        }
        
        return result;
    }
    
    static String encrypt(String data, String key) throws CryptoException,
            UnsupportedEncodingException {
        
        String ret = "";
        if (!StringUtils.isNullOrEmpty(data)) {
            byte[] encryptedArr =
                    callCipher(
                            data.getBytes(CHARSET),
                            new KeyParameter(key.getBytes(CHARSET)),
                            true);
            ret = Base64.getUrlEncoder().encodeToString(encryptedArr);
        }
        
        return ret;
    }
    
    public static String decrypt(String data, String key) throws CryptoException,
            UnsupportedEncodingException {
        
        String ret = "";
        if (!StringUtils.isNullOrEmpty(data)) {
            ret =
                    new String(callCipher(
                            Base64.getUrlDecoder().decode(data),
                            new KeyParameter(key.getBytes(CHARSET)),
                            false));
        }
        
        return ret;
    }
}
