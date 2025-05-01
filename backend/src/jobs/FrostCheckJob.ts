import { userRepository } from "../db/repositories/user.repository";
import { sendEmail } from "../utils/awsMailer";
import { getWeatherData } from "../utils/openWeatherApi";

export class FrostCheckJob {
  static async run() {
    try {
      console.log("Starting FrostCheckJob...");

      // Fetch all users with location set
      const users = await userRepository.getAllUsersWithLocation();

      for (const user of users) {
        // Fetch weather data for the user's location
        const weatherData = await getWeatherData(
          user.latitude!,
          user.longitude!
        );

        if (
          !weatherData ||
          !weatherData.list ||
          weatherData.list.length === 0
        ) {
          console.warn(`No weather data available for user ${user.id}.`);
          continue;
        }

        // Check the minimum temperature for the forecasted days, should be 8 by default
        let dailyForecast = weatherData.list[0];
        for (const forecast of weatherData.list) {
          if (forecast.main.temp_min < dailyForecast.main.temp_min) {
            dailyForecast = forecast;
          }
        }
        const minTemp = dailyForecast.main.temp_min;

        // Update the user's last lowest temperature in the database
        await userRepository.setLastLowestTemperature(user.id, minTemp);

        // Skip if the user has already been notified about the last lowest temperature
        if (user.lastLowestTemperature && user.lastLowestTemperature <= 32) {
          continue;
        }

        // If the temperature is below 32F, send a warning email
        if (minTemp < 32) {
          const subject = "GreenThumbTracker - Frost Warning Notification";
          const body = `${user.username},\n\nFreezing temperatures have been forecasted in your area. Please take necessary precautions to protect your plants.\n\nBest regards,\nGreenThumbTracker Team`;
          await sendEmail(user.email, subject, body);
        }

        // Log weather summary if available
        /*if (dailyForecast.summary) {
          console.log(
            `Weather summary for user ${user.id}: ${dailyForecast.summary}`
          );
        } */
      }

      console.log("FrostCheckJob completed successfully.");
    } catch (error) {
      console.error("Error running FrostCheckJob:", error);
    }
  }
}
