import { Card, CardContent } from "./ui/card";
import { ArrowDown, ArrowUp, Droplets, Wind } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import type { WeatherData, GeocodingResponse } from "@/api/types";

interface CurrentWeatherProps {
  data: WeatherData;
  locationName?: GeocodingResponse;
}

export function CurrentWeather({ data, locationName }: CurrentWeatherProps) {
  const [unit, setUnit] = useState<'c' | 'f'>('c');

  const {
    weather: [currentWeather],
    main: { temp, feels_like, temp_min, temp_max, humidity },
    wind: { speed },
  } = data;

  const formatTemp = (temp: number) => {
    const converted = unit === 'f' ? (temp * 9/5) + 32 : temp;
    return `${Math.round(converted)}°${unit.toUpperCase()}`;
  };

  return (
    <Card className="overflow-hidden bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-gray-800 dark:to-gray-900 border-blue-100 dark:border-gray-700">
      <CardContent className="p-6">
        {/* Header row */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center">
              <h2 className="text-2xl font-bold tracking-tight text-cool-blue-800 dark:text-white">
                {locationName?.name}
                {locationName?.state && (
                  <span className="text-cool-blue-600 dark:text-cool-blue-300">
                    , {locationName.state}
                  </span>
                )}
              </h2>
            </div>
            <p className="text-sm text-cool-blue-600 dark:text-cool-blue-300">
              {locationName?.country}
            </p>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setUnit(unit === 'c' ? 'f' : 'c')}
            className="h-8 px-3 ml-auto border-cool-blue-300 hover:bg-cool-blue-100 text-cool-blue-700 dark:border-gray-600 dark:hover:bg-gray-700 dark:text-white"
          >
            °{unit.toUpperCase()}
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <p className="text-7xl font-bold tracking-tighter text-cool-blue-900 dark:text-white">
                {formatTemp(temp)}
              </p>
              <div className="space-y-1">
                <p className="text-sm font-medium text-cool-blue-600 dark:text-cool-blue-300">
                  Feels like {formatTemp(feels_like)}
                </p>
                <div className="flex gap-2 text-sm font-medium">
                  <span className="flex items-center gap-1 text-blue-500">
                    <ArrowDown className="h-3 w-3" />
                    {formatTemp(temp_min)}
                  </span>
                  <span className="flex items-center gap-1 text-red-500">
                    <ArrowUp className="h-3 w-3" />
                    {formatTemp(temp_max)}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2 p-3 rounded-lg bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm">
                <Droplets className="h-4 w-4 text-blue-500" />
                <div className="space-y-0.5">
                  <p className="text-sm font-medium text-cool-blue-700 dark:text-cool-blue-200">Humidity</p>
                  <p className="text-sm text-cool-blue-600 dark:text-cool-blue-300">{humidity}%</p>
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-lg bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm">
                <Wind className="h-4 w-4 text-blue-500" />
                <div className="space-y-0.5">
                  <p className="text-sm font-medium text-cool-blue-700 dark:text-cool-blue-200">Wind Speed</p>
                  <p className="text-sm text-cool-blue-600 dark:text-cool-blue-300">{speed} m/s</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center">
            <div className="relative flex aspect-square w-full max-w-[200px] items-center justify-center">
              <img
                src={`https://openweathermap.org/img/wn/${currentWeather.icon}@4x.png`}
                alt={currentWeather.description}
                className="h-full w-full object-contain drop-shadow-lg"
              />
              <div className="absolute bottom-0 text-center">
                <p className="text-sm font-medium capitalize text-cool-blue-800 dark:text-white bg-white/70 dark:bg-gray-800/70 px-2 py-1 rounded-full">
                  {currentWeather.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}