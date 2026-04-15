import axios from "axios";
import { GOOGLE_MAPS_API_KEY } from "../../envConfig.js";

export async function calculateDistance(
  origin: { lat: number; lng: number },
  destination: { lat: number; lng: number },
): Promise<number> {
  const response = await axios.get(
    "https://maps.googleapis.com/maps/api/distancematrix/json",
    {
      params: {
        origins: `${origin.lat},${origin.lng}`,
        destinations: `${destination.lat},${destination.lng}`,
        key: GOOGLE_MAPS_API_KEY,
      },
    },
  );
  const distanceMeters = response.data.rows[0].elements[0].distance.value;
  return distanceMeters / 1000; // convert to km
}
