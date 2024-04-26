import { SignInFormData } from "./pages/Login";
import { RegisterFormData } from "./pages/Register";

import { HotelType } from "../../backend/src/shared/types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

export async function register(formData: RegisterFormData) {
  const response = await fetch(`${API_BASE_URL}/api/users/register`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  const responseBody = await response.json();

  if (!response.ok) {
    throw new Error(responseBody.message);
  }
}

export async function login(formData: SignInFormData) {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  const body = await response.json();

  if (!response.ok) {
    throw new Error(body.message);
  }

  return body;
}

export async function validateToken() {
  const response = await fetch(`${API_BASE_URL}/api/auth/validate-token`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("TOKEN_INVALID");
  }

  return await response.json();
}

export async function logout() {
  const response = await fetch(`${API_BASE_URL}/api/auth/logout`, {
    credentials: "include",
    method: "POST",
  });

  if (!response.ok) {
    throw new Error("ERROR_DURING_LOGOUT");
  }
}

export async function addMyHotel(hotelFormData: FormData) {
  const response = await fetch(`${API_BASE_URL}/api/my-hotels`, {
    method: "POST",
    credentials: "include",
    body: hotelFormData,
  });

  if (!response.ok) {
    throw new Error("Failed to add hotel");
  }

  return response.json();
}

export async function fetchMyHotels(): Promise<HotelType[]> {
  const response = await fetch(`${API_BASE_URL}/api/my-hotels`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("ERROR_FETCHING_HOTELS");
  }

  return response.json();
}

export const fetchMyHotelsById = async(hotelId: string): Promise<HotelType> => {
    const response = await fetch(`${API_BASE_URL}/api/my-hotels/${hotelId}`, {
        credentials: "include",
    })
    if (!response.ok){
        throw new Error("ERROR_FETCHING_HOTELS");
    }

    return response.json();
}

export const updateMyHotelById = async(hotelFormData: FormData) => {
    const response = await fetch(`${API_BASE_URL}/api/my-hotels/${hotelFormData.get("hotelId")}`, {
        method: "PUT",
        body: hotelFormData,
        credentials: "include"
    })

    if(!response.ok){
        throw new Error("FAILED_TO_UPDATE_HOTEL")
    }

    return response.json();
}
