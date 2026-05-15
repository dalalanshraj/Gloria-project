import {
  Wifi,
  BedDouble,
  Tv,
  Utensils,
  Car,
  Waves,
  Snowflake,
  Home,
} from "lucide-react";

export const getIcon = (name = "") => {
  const key = name.toLowerCase();

  if (key.includes("wifi")) return Wifi;
  if (key.includes("bed")) return BedDouble;
  if (key.includes("tv")) return Tv;
  if (key.includes("kitchen") || key.includes("dishes")) return Utensils;
  if (key.includes("parking")) return Car;
  if (key.includes("pool")) return Waves;
  if (key.includes("air")) return Snowflake;

  return Home;
};