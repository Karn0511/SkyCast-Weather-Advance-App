import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ForecastData } from '@/api/types';
import { Droplets } from 'lucide-react';
import { format } from 'date-fns';

interface RainfallForecastProps {
	data: ForecastData;
}

interface DailyRainfall {
	date: number;
	probability: number;
	amount: number;
}

export function RainfallForecast({ data }: RainfallForecastProps) {
	// Group forecast by day and calculate daily rainfall
	const dailyRainfall = data.list.reduce((acc, forecast) => {
		const date = format(new Date(forecast.dt * 1000), 'yyyy-MM-dd');
		const probability = forecast.pop * 100 || 0;
		const amount = forecast.rain?.['3h'] || 0;

		if (!acc[date]) {
			acc[date] = {
				date: forecast.dt,
				probability: probability,
				amount: amount,
				count: 1,
			};
		} else {
			acc[date].probability += probability;
			acc[date].amount += amount;
			acc[date].count += 1;
		}

		return acc;
	}, {} as Record<string, DailyRainfall & { count: number }>);

	// Convert to array and calculate averages
	const nextDays = Object.values(dailyRainfall)
		.map((day) => ({
			date: day.date,
			probability: day.probability / day.count,
			amount: day.amount,
		}))
		.slice(0, 5); // Get next 5 days

	return (
		<Card className="h-full">
			<CardHeader className="flex flex-row items-center justify-between pb-4">
				<CardTitle className="text-xl">
					5-Day Rainfall Forecast
				</CardTitle>
				<Droplets className="h-6 w-6 text-blue-500" />
			</CardHeader>
			<CardContent>
				<div className="space-y-4">
					{nextDays.map((day, index) => (
						<div
							key={index}
							className="flex flex-col gap-2 rounded-lg border p-4"
						>
							<div className="flex items-center justify-between">
								<p className="font-medium">
									{format(
										new Date(day.date * 1000),
										'EEE, MMM d'
									)}
								</p>
								<p className="text-lg font-semibold">
									{day.amount.toFixed(1)}
									<span className="text-base font-normal text-muted-foreground ml-1">
										mm
									</span>
								</p>
							</div>
							<div className="flex items-center justify-between">
								<p className="text-sm text-muted-foreground">
									Chance of rain
								</p>
								<p className="text-base font-medium">
									{Math.round(day.probability)}%
								</p>
							</div>
							<div className="relative h-2 w-full rounded-full bg-muted">
								<div
									className="absolute left-0 top-0 h-full rounded-full bg-blue-500"
									style={{
										width: `${Math.round(
											day.probability
										)}%`,
									}}
								/>
							</div>
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	);
}
