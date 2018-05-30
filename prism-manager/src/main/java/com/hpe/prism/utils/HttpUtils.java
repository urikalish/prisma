package com.hpe.prism.utils;

import java.io.IOException;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class HttpUtils {
    
    public static String getCookieValue(HttpServletRequest request, String cookieName) {
        Cookie cookie = getCookie(request, cookieName);
        return cookie != null ? cookie.getValue() : null;
    }
    
    public static Cookie getCookie(HttpServletRequest request, String cookieName) {
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if (cookieName.equalsIgnoreCase(cookie.getName())) {
                    return cookie;
                }
            }
        }
        return null;
    }
    
    public static void writeBodyToResponse(HttpServletResponse response, String responseBody)
            throws IOException {
        response.getWriter().write(responseBody);
        response.getWriter().flush();
        response.getWriter().close();
    }
}
