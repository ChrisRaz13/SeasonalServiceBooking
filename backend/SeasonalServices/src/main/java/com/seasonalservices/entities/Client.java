package com.seasonalservices.entities;

public class Client {
	private Integer id;
	private String name;
	private String email;
	private String phoneNumber;
	private String address;

	public Client() {
	}

	public Client(Integer id, String name, String email, String phoneNumber, String address) {
		this.id = id;
		this.name = name;
		this.email = email;
		this.phoneNumber = phoneNumber;
		this.address = address;
	}

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getPhoneNumber() {
		return phoneNumber;
	}

	public void setPhoneNumber(String phoneNumber) {
		this.phoneNumber = phoneNumber;
	}

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}
}
