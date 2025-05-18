import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ForecastData } from '@/api/types';
import { Droplets } from 'lucide-react';

interface RainfallForecastProps {
	data: ForecastData;
}

export function RainfallForecast({ data }: RainfallForecastProps) {
	// Get next 24 hours of forecast data
	const next24Hours = data.list.slice(0, 8);

	// Calculate average rainfall probability and accumulation
	const rainfallData = next24Hours.map((item) => ({
		time: new Date(item.dt * 1000).toLocaleTimeString([], {
			hour: '2-digit',
			minute: '2-digit',
		}),
		probability: (item as any).pop * 100 || 0, // Probability of precipitation
		amount: (item as any).rain?.['3h'] || 0, // Rain amount in mm for 3 hours
	}));

	const averageProbability =
		rainfallData.reduce((acc, curr) => acc + curr.probability, 0) /
		rainfallData.length;
	const totalRainfall = rainfallData.reduce(
		(acc, curr) => acc + curr.amount,
		0
	);

	return (
		<Card className="h-full">
			<CardHeader className="flex flex-row items-center justify-between pb-4">
				<CardTitle className="text-xl">Rainfall Forecast</CardTitle>
				<Droplets className="h-6 w-6 text-blue-500" />
			</CardHeader>
			<CardContent>
				<div className="space-y-8">
					<div>
						<p className="text-3xl font-bold">
							{totalRainfall.toFixed(1)}
							<span className="text-base font-normal text-muted-foreground ml-1">
								mm
							</span>
						</p>
						<p className="text-sm text-muted-foreground mt-1">
							Expected rainfall (24h)
						</p>
					</div>
					<div>
						<p className="text-2xl font-semibold">
							{Math.round(averageProbability)}
							<span className="text-base font-normal text-muted-foreground ml-1">
								%
							</span>
						</p>
						<p className="text-sm text-muted-foreground mt-1">
							Chance of precipitation
						</p>
					</div>
					<div className="space-y-4">
						<p className="text-lg font-medium">Hourly Forecast</p>
						<div className="grid grid-cols-4 gap-4">
							{rainfallData.slice(0, 4).map((data, index) => (
								<div
									key={index}
									className="text-center p-3 rounded-lg border"
								>
									<p className="text-sm text-muted-foreground mb-2">
										{data.time}
									</p>
									<p className="text-lg font-medium mb-1">
										{Math.round(data.probability)}%
									</p>
									<p className="text-sm text-muted-foreground">
										{data.amount.toFixed(1)}mm
									</p>
								</div>
							))}
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
