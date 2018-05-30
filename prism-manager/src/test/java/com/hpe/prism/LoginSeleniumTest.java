package com.hpe.prism;

import static org.openqa.selenium.support.ui.ExpectedConditions.presenceOfElementLocated;

import java.util.concurrent.TimeUnit;

import org.junit.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.ui.WebDriverWait;

public class LoginSeleniumTest {
    
    private WebDriver driver;
    private WebDriverWait wait;
    protected final static int TIMEOUT = 20;
    
    @Test
    public void login() throws Exception {
        
        driver = new ChromeDriver();
        driver.manage().timeouts().implicitlyWait(10, TimeUnit.SECONDS);
        driver.manage().window().maximize();
        wait = new WebDriverWait(this.driver, TIMEOUT);
        driver.get("http://devenv.hpeswlab.net:8443/");
        
        WebElement tempElem = wait.until(presenceOfElementLocated(By.id("federateLoginName")));
        tempElem.clear();
        tempElem.sendKeys("yaakov.amsalem2@hp.com");
        
        tempElem = driver.findElement(By.id("fed-submit"));
        tempElem.click();
        
        tempElem = wait.until(presenceOfElementLocated(By.id("password")));
        tempElem.sendKeys("Welcome1");
        
        tempElem = driver.findElement(By.id("submit_button"));
        tempElem.click();
        
        driver.close();
    }
}
