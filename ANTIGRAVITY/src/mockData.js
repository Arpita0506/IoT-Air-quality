// IoT Devices located across Dharwad (Karnataka)
export const DEVICES = [
  { id: 'DWD-101', name: 'KUD Campus (Pavate Nagar)', location: 'Green Campus Zone' },
  { id: 'DWD-202', name: 'Jubilee Circle (City Center)', location: 'Commercial Traffic Junction' },
  { id: 'DWD-303', name: 'Belur Industrial Area', location: 'KIADB Industrial Corridor' },
  { id: 'DWD-404', name: 'IIT Dharwad Campus', location: 'Chikkamalligawad Tech Zone' },
  { id: 'DWD-505', name: 'SDMCET (Dhavalagiri Campus)', location: 'Engineering Campus Hill' },
];

export const AQI_THRESHOLDS = {
  GOOD: 50,
  MODERATE: 100,
  UNHEALTHY_SENSITIVE: 150,
  UNHEALTHY: 200,
};

export const TEMP_THRESHOLDS = {
  HIGH: 35,
  LOW: 15,
};

export const HUMIDITY_THRESHOLDS = {
  HIGH: 70,
  LOW: 25,
};

export function getAqiCategory(aqi) {
  if (aqi <= 50) return { label: 'Good', color: 'emerald', bg: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' };
  if (aqi <= 100) return { label: 'Moderate', color: 'yellow', bg: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300' };
  if (aqi <= 150) return { label: 'Unhealthy for Sensitive', color: 'amber', bg: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' };
  return { label: 'Unhealthy', color: 'rose', bg: 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300' };
}

// Check if a reading breaches any threshold and generate an alert object
export function evaluateThresholds(reading) {
  const alerts = [];
  const timestamp = reading.timestamp;
  const deviceId = reading.deviceId;

  if (reading.aqi > AQI_THRESHOLDS.UNHEALTHY_SENSITIVE) {
    alerts.push({
      id: `alert-aqi-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp,
      deviceId,
      type: 'Air Quality Hazard',
      parameter: 'AQI',
      value: reading.aqi,
      threshold: `> ${AQI_THRESHOLDS.UNHEALTHY_SENSITIVE}`,
      severity: 'critical',
      message: `AQI reached unhealthy level of ${reading.aqi} at ${reading.deviceName || deviceId} (Simulated)`,
    });
  } else if (reading.aqi > AQI_THRESHOLDS.MODERATE) {
    alerts.push({
      id: `alert-aqi-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp,
      deviceId,
      type: 'Elevated AQI Warning',
      parameter: 'AQI',
      value: reading.aqi,
      threshold: `> ${AQI_THRESHOLDS.MODERATE}`,
      severity: 'warning',
      message: `AQI exceeded moderate limit with reading of ${reading.aqi} at ${reading.deviceName || deviceId} (Simulated)`,
    });
  }

  if (reading.temperature > TEMP_THRESHOLDS.HIGH) {
    alerts.push({
      id: `alert-temp-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp,
      deviceId,
      type: 'High Temperature Alert',
      parameter: 'Temperature',
      value: `${reading.temperature}°C`,
      threshold: `> ${TEMP_THRESHOLDS.HIGH}°C`,
      severity: 'warning',
      message: `Ambient temperature exceeded ${TEMP_THRESHOLDS.HIGH}°C at ${reading.temperature}°C (Simulated)`,
    });
  } else if (reading.temperature < TEMP_THRESHOLDS.LOW) {
    alerts.push({
      id: `alert-temp-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp,
      deviceId,
      type: 'Low Temperature Alert',
      parameter: 'Temperature',
      value: `${reading.temperature}°C`,
      threshold: `< ${TEMP_THRESHOLDS.LOW}°C`,
      severity: 'info',
      message: `Ambient temperature dropped below ${TEMP_THRESHOLDS.LOW}°C at ${reading.temperature}°C (Simulated)`,
    });
  }

  if (reading.humidity > HUMIDITY_THRESHOLDS.HIGH) {
    alerts.push({
      id: `alert-hum-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp,
      deviceId,
      type: 'High Humidity Warning',
      parameter: 'Humidity',
      value: `${reading.humidity}%`,
      threshold: `> ${HUMIDITY_THRESHOLDS.HIGH}%`,
      severity: 'warning',
      message: `Relative humidity high at ${reading.humidity}% (Simulated)`,
    });
  }

  return alerts;
}

// Generate a random reading for a specific device tailored to Dharwad climate
export function generateDeviceReading(deviceId, customTimestamp = null) {
  const baseDevice = DEVICES.find(d => d.id === deviceId) || DEVICES[0];
  
  // Custom baseline characteristics tailored to Dharwad's microclimates
  let baseTemp = 25;
  let baseHumidity = 52;
  let baseAqi = 40;

  if (deviceId === 'DWD-101') {
    // KUD Campus: Lush trees, clean fresh air
    baseTemp = 24.5;
    baseHumidity = 56;
    baseAqi = 38;
  } else if (deviceId === 'DWD-202') {
    // Jubilee Circle: Traffic, vehicle exhausts, central market
    baseTemp = 28.5;
    baseHumidity = 48;
    baseAqi = 105;
  } else if (deviceId === 'DWD-303') {
    // Belur Industrial Area: Industrial manufacturing, freight transport
    baseTemp = 31.0;
    baseHumidity = 42;
    baseAqi = 135;
  } else if (deviceId === 'DWD-404') {
    // IIT Dharwad Campus: Open plateau, higher breeze
    baseTemp = 26.0;
    baseHumidity = 50;
    baseAqi = 48;
  } else if (deviceId === 'DWD-505') {
    // SDMCET: Dhavalagiri hill campus, elevated, pleasant breeze & clean air
    baseTemp = 25.0;
    baseHumidity = 52;
    baseAqi = 42;
  }

  const tempVariance = (Math.random() * 6 - 3); // +/- 3°C
  const humVariance = (Math.random() * 14 - 7);  // +/- 7%
  const aqiVariance = (Math.random() * 30 - 15); // varied AQI

  const temperature = parseFloat((baseTemp + tempVariance).toFixed(1));
  const humidity = Math.min(100, Math.max(10, Math.round(baseHumidity + humVariance)));
  const aqi = Math.max(15, Math.round(baseAqi + aqiVariance));

  const now = customTimestamp || new Date().toISOString();

  return {
    id: `reading-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    deviceId,
    deviceName: baseDevice.name,
    timestamp: now,
    temperature,
    humidity,
    aqi,
    status: getAqiCategory(aqi).label,
    isSimulated: true,
  };
}

// Seed initial historical readings
export function generateInitialHistory() {
  const initialReadings = [];
  const initialAlerts = [];
  const now = Date.now();

  // Generate 20 historical data points per device spread over the last 10 hours
  for (let i = 20; i >= 1; i--) {
    const pointTime = new Date(now - i * 30 * 60 * 1000).toISOString();
    DEVICES.forEach(dev => {
      const reading = generateDeviceReading(dev.id, pointTime);
      initialReadings.push(reading);
      const alerts = evaluateThresholds(reading);
      initialAlerts.push(...alerts);
    });
  }

  // Sort descending by timestamp
  initialReadings.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  initialAlerts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  return { initialReadings, initialAlerts };
}
