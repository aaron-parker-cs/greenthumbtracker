import { userRepository } from "../db/repositories/user.repository";
import { Request, Response } from "express";
import { getWeatherData, setUserLocation } from "../utils/openWeatherApi";

export const getWeather = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    if (!userId) {
      res.status(400).json({ message: "No user ID provided." });
      return;
    }

    const user = await userRepository.findUserById(userId);
    if (!user) {
      res.status(404).json({ message: "User not found." });
      return;
    }

    if (!user.latitude || !user.longitude) {
      res.status(400).json({ message: "User location not set." });
      return;
    }

    const weatherData = await getWeatherData(user.latitude, user.longitude);
    res.status(200).json(weatherData);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

export const setLocation = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    if (!userId) {
      res.status(400).json({ message: "No user ID provided." });
      return;
    }

    const { city, latitude, longitude } = req.body;
    if (!latitude || !longitude) {
      res.status(400).json({ message: "Latitude and longitude are required." });
      return;
    }

    await userRepository.updateUserLocation(userId, city, latitude, longitude);
    res.status(200).json({ message: "Location updated successfully." });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

export const setLocationByCity = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    if (!userId) {
      res.status(400).json({ message: "No user ID provided." });
      return;
    }

    const { city } = req.body;
    if (!city) {
      res.status(400).json({ message: "City name is required." });
      return;
    }

    await setUserLocation(city, userId);

    res.status(200).json({ message: "Location updated successfully." });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

export const getUserCity = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;

    const city = await userRepository.getUserCityById(userId);
    if (!city) {
      res.status(404).json({ message: "City not found" });
      return;
    }

    res.status(200).json({ city });
    return;
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
    return;
  }
};
