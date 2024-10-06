package com.seasonalservices.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

@RestController
@RequestMapping("/api/weather")
public class WeatherProxyController {

	// You can configure your user-agent header using application.properties or
	// application.yml
	@Value("${weather.api.userAgent}")
	private String userAgent;

	@GetMapping("/forecast")
	public ResponseEntity<String> getWeatherForecast(@RequestParam("lat") double lat, @RequestParam("lon") double lon) {
		try {
			// Create a RestTemplate object to make the API request
			RestTemplate restTemplate = new RestTemplate();

			// Set the URL for the weather.gov points API
			String url = String.format("https://api.weather.gov/points/%f,%f", lat, lon);

			// Create headers, including the User-Agent header
			HttpHeaders headers = new HttpHeaders();
			headers.set("User-Agent", userAgent);

			// Create the HttpEntity with headers
			HttpEntity<String> entity = new HttpEntity<>(headers);

			// Make the request to weather.gov
			ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);

			// Get the forecast URL from the response
			String forecastUrl = extractForecastUrl(response.getBody());

			// Make the request to get the forecast
			ResponseEntity<String> forecastResponse = restTemplate.exchange(forecastUrl, HttpMethod.GET, entity,
					String.class);

			return new ResponseEntity<>(forecastResponse.getBody(), HttpStatus.OK);
		} catch (Exception e) {
			// Handle any errors that may have occurred
			return new ResponseEntity<>("Failed to fetch data from weather.gov: " + e.getMessage(),
					HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	// Helper function to extract the forecast URL from the points response
	private String extractForecastUrl(String responseBody) {
		// Parse the JSON response and extract the forecast URL
		// Assuming you're using a JSON library like Jackson or org.json
		// Replace this implementation with proper JSON parsing
		String forecastUrl = ""; // Parse the JSON and get the URL from `properties.forecast`
		// Implement parsing logic here
		return forecastUrl;
	}
}
