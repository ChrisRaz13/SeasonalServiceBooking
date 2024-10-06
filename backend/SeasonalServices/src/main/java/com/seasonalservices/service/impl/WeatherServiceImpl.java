package com.seasonalservices.service.impl;

import java.io.BufferedReader;
import java.io.InputStreamReader;

import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.CloseableHttpClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.seasonalservices.service.WeatherService;

@Service
public class WeatherServiceImpl implements WeatherService {

    private final CloseableHttpClient httpClient;

    @Autowired
    public WeatherServiceImpl(CloseableHttpClient httpClient) {
        this.httpClient = httpClient;
    }

    @Override
    public String getWeatherForecast(double lat, double lon) {
        String apiUrl = String.format("https://api.weather.gov/points/%.4f,%.4f", lat, lon);
        HttpGet request = new HttpGet(apiUrl);
        request.setHeader("User-Agent", "Weather Application (contact@example.com)"); // Replace with your email

        try (CloseableHttpResponse response = httpClient.execute(request)) {
            BufferedReader reader = new BufferedReader(new InputStreamReader(response.getEntity().getContent()));
            StringBuilder responseString = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                responseString.append(line);
            }
            return responseString.toString();
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}
