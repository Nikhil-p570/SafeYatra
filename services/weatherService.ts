interface WeatherData {
  current: {
    temp_c: number;
    condition: {
      text: string;
      icon: string;
    };
    humidity: number;
    wind_kph: number;
    feelslike_c: number;
  };
  location: {
    name: string;
    region: string;
    country: string;
  };
}

interface HistoricalWeatherData {
  forecast: {
    forecastday: Array<{
      date: string;
      day: {
        maxtemp_c: number;
        mintemp_c: number;
        avgtemp_c: number;
        condition: {
          text: string;
        };
      };
    }>;
  };
}

interface WeatherAlert {
  type: 'hot' | 'cold' | 'normal' | 'extreme_hot' | 'extreme_cold';
  message: string;
  recommendation: string;
  severity: 'low' | 'medium' | 'high' | 'extreme';
  color: string;
}

class WeatherService {
  private apiKey = '4f8ebf272c4a4053a9f43525252208';
  private baseUrl = 'http://api.weatherapi.com/v1';

  async getCurrentWeather(latitude: number, longitude: number): Promise<WeatherData | null> {
    try {
      const response = await fetch(
        `${this.baseUrl}/current.json?key=${this.apiKey}&q=${latitude},${longitude}&aqi=no`
      );
      
      if (!response.ok) {
        throw new Error('Weather API request failed');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching current weather:', error);
      return null;
    }
  }

  async getHistoricalWeather(latitude: number, longitude: number, days: number = 7): Promise<HistoricalWeatherData | null> {
    try {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(endDate.getDate() - days);
      
      const response = await fetch(
        `${this.baseUrl}/history.json?key=${this.apiKey}&q=${latitude},${longitude}&dt=${startDate.toISOString().split('T')[0]}&end_dt=${endDate.toISOString().split('T')[0]}`
      );
      
      if (!response.ok) {
        throw new Error('Historical weather API request failed');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching historical weather:', error);
      return null;
    }
  }

  generateWeatherAlert(currentTemp: number, historicalAvg?: number): WeatherAlert {
    // Temperature thresholds
    const EXTREME_HOT = 40;
    const HOT_THRESHOLD = 30;
    const COLD_THRESHOLD = 10;
    const EXTREME_COLD = 0;

    if (currentTemp >= EXTREME_HOT) {
      return {
        type: 'extreme_hot',
        message: `Extreme Heat Alert: ${currentTemp}°C`,
        recommendation: 'Stay indoors! Avoid outdoor activities. Risk of heat stroke.',
        severity: 'extreme',
        color: '#DC2626'
      };
    } else if (currentTemp >= HOT_THRESHOLD) {
      return {
        type: 'hot',
        message: `High Temperature Alert: ${currentTemp}°C`,
        recommendation: 'Avoid going out during peak hours. Stay hydrated if you must go out.',
        severity: 'high',
        color: '#EF4444'
      };
    } else if (currentTemp <= EXTREME_COLD) {
      return {
        type: 'extreme_cold',
        message: `Extreme Cold Alert: ${currentTemp}°C`,
        recommendation: 'Stay indoors! Risk of hypothermia. Avoid outdoor activities.',
        severity: 'extreme',
        color: '#1E40AF'
      };
    } else if (currentTemp <= COLD_THRESHOLD) {
      return {
        type: 'cold',
        message: `Low Temperature Alert: ${currentTemp}°C`,
        recommendation: 'Dress warmly if going out. Limit outdoor exposure.',
        severity: 'high',
        color: '#3B82F6'
      };
    } else {
      const tempComparison = historicalAvg ? 
        (currentTemp > historicalAvg + 5 ? ' (warmer than usual)' : 
         currentTemp < historicalAvg - 5 ? ' (cooler than usual)' : ' (normal)') : '';
      
      return {
        type: 'normal',
        message: `Comfortable Temperature: ${currentTemp}°C${tempComparison}`,
        recommendation: 'Weather conditions are suitable for outdoor activities.',
        severity: 'low',
        color: '#10B981'
      };
    }
  }

  calculateHistoricalAverage(historicalData: HistoricalWeatherData): number {
    if (!historicalData.forecast?.forecastday?.length) return 0;
    
    const totalTemp = historicalData.forecast.forecastday.reduce(
      (sum, day) => sum + day.day.avgtemp_c, 0
    );
    
    return totalTemp / historicalData.forecast.forecastday.length;
  }
}

export const weatherService = new WeatherService();
export type { WeatherData, WeatherAlert };