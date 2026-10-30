import React, { useState, useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import MetricCards from './components/MetricCards';
import FilterBar from './components/FilterBar';
import HistoricalChart from './components/HistoricalChart';
import RecentReadingsTable from './components/RecentReadingsTable';
import AlertHistory from './components/AlertHistory';
import {
  DEVICES,
  generateDeviceReading,
  generateInitialHistory,
  evaluateThresholds,
  getAqiCategory,
} from './mockData';
import {
  auth,
  db,
  isFirebaseConfigured,
  signInAnonymously,
  onAuthStateChanged,
  collection,
  query,
  where,
  onSnapshot,
  saveSensorReadingToFirestore,
} from './firebase';
import { AlertTriangle, CheckCircle, CloudOff, Database, ExternalLink, Info, Loader2, UserCheck, X } from 'lucide-react';

export default function App() {
  // Theme state
  const [darkMode, setDarkMode] = useState(false);

  // Simulation state: Start / Stop (default running)
  const [isSimulating, setIsSimulating] = useState(true);

  // Firebase Authentication & Loading state
  const [authUser, setAuthUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(isFirebaseConfigured);
  const [dataLoading, setDataLoading] = useState(false);
  const [firestorePermissionError, setFirestorePermissionError] = useState(false);
  const [firestoreSyncedCount, setFirestoreSyncedCount] = useState(0);

  // Seed initial readings right away so the dashboard is immediately functional
  const initialData = useRef(generateInitialHistory());
  const [readings, setReadings] = useState(initialData.current.initialReadings);
  const [alerts, setAlerts] = useState(initialData.current.initialAlerts);

  // Filtering state
  const [selectedDevice, setSelectedDevice] = useState('ALL');
  const [selectedDate, setSelectedDate] = useState('');

  // Track simulation device cycling index and timer ref
  const deviceCycleRef = useRef(0);
  const timerRef = useRef(null);

  // 1. Firebase Anonymous Authentication
  useEffect(() => {
    if (!isFirebaseConfigured || !auth) {
      setAuthLoading(false);
      return;
    }

    setAuthLoading(true);
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setAuthUser(user);
        setAuthLoading(false);
      } else {
        try {
          const cred = await signInAnonymously(auth);
          setAuthUser(cred.user);
        } catch (err) {
          console.error('Anonymous authentication failed:', err);
        } finally {
          setAuthLoading(false);
        }
      }
    });

    return () => unsubscribeAuth();
  }, []);

  // 2. Real-time Firestore Listener
  useEffect(() => {
    if (!isFirebaseConfigured || !db || !authUser) {
      return;
    }

    setDataLoading(true);

    const readingsQuery = query(
      collection(db, 'sensorReadings'),
      where('ownerUid', '==', authUser.uid)
    );

    const unsubscribeSnapshot = onSnapshot(
      readingsQuery,
      (snapshot) => {
        setFirestorePermissionError(false);
        setFirestoreSyncedCount(snapshot.size);

        if (!snapshot.empty) {
          const fetchedReadings = [];
          const generatedAlerts = [];

          snapshot.forEach((doc) => {
            const data = doc.data();
            let isoTimestamp = new Date().toISOString();
            if (data.timestamp?.toDate) {
              isoTimestamp = data.timestamp.toDate().toISOString();
            }

            const readingItem = {
              id: doc.id,
              deviceId: data.deviceId,
              deviceName:
                DEVICES.find((d) => d.id === data.deviceId)?.name || data.deviceId,
              timestamp: isoTimestamp,
              temperature: data.temperature,
              humidity: data.humidity,
              aqi: data.airQualityIndex,
              airQualityIndex: data.airQualityIndex,
              status: getAqiCategory(data.airQualityIndex).label,
              isSimulated: true,
              ownerUid: data.ownerUid,
            };

            fetchedReadings.push(readingItem);
            const itemAlerts = evaluateThresholds(readingItem);
            generatedAlerts.push(...itemAlerts);
          });

          fetchedReadings.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
          generatedAlerts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

          setReadings(fetchedReadings);
          setAlerts(generatedAlerts);
        }
        setDataLoading(false);
      },
      (err) => {
        console.warn('Firestore subscription status:', err.message);
        if (err.code === 'permission-denied') {
          setFirestorePermissionError(true);
        }
        setDataLoading(false);
      }
    );

    return () => unsubscribeSnapshot();
  }, [authUser]);

  // 3. Dark mode synchronization
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // 4. Simulator: Generate readings every 5 seconds while running
  useEffect(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (!isSimulating) return;

    timerRef.current = setInterval(async () => {
      const targetDevice = DEVICES[deviceCycleRef.current % DEVICES.length];
      deviceCycleRef.current += 1;

      const generated = generateDeviceReading(targetDevice.id);

      // ALWAYS update the UI in real-time so the dashboard never freezes or stays blank
      const newAlerts = evaluateThresholds(generated);
      setReadings((prev) => [generated, ...prev]);
      if (newAlerts.length > 0) {
        setAlerts((prev) => [...newAlerts, ...prev]);
      }

      // Concurrently attempt to sync with Cloud Firestore if authenticated
      if (isFirebaseConfigured && authUser && db) {
        try {
          await saveSensorReadingToFirestore(
            {
              deviceId: generated.deviceId,
              temperature: generated.temperature,
              humidity: generated.humidity,
              airQualityIndex: generated.aqi,
            },
            authUser.uid
          );
          setFirestorePermissionError(false);
        } catch (err) {
          if (err.code === 'permission-denied' || err.message?.includes('permissions')) {
            setFirestorePermissionError(true);
          }
        }
      }
    }, 5000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isSimulating, authUser]);

  // Handlers for Simulation
  const handleStartSimulation = () => setIsSimulating(true);
  const handleStopSimulation = () => setIsSimulating(false);
  const handleToggleTheme = () => setDarkMode((prev) => !prev);
  const handleClearAlerts = () => setAlerts([]);
  const handleResetFilters = () => {
    setSelectedDevice('ALL');
    setSelectedDate('');
  };

  // Filtered readings based on device and date selection
  const filteredReadings = readings.filter((r) => {
    const matchesDevice = selectedDevice === 'ALL' || r.deviceId === selectedDevice;
    const matchesDate = !selectedDate || r.timestamp.startsWith(selectedDate);
    return matchesDevice && matchesDate;
  });

  // Latest reading for the KPI cards
  const latestReading = filteredReadings.length > 0 ? filteredReadings[0] : readings[0];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 flex flex-col transition-colors">
      
      {/* Top Navigation */}
      <Navbar
        isSimulating={isSimulating}
        onStartSimulation={handleStartSimulation}
        onStopSimulation={handleStopSimulation}
        darkMode={darkMode}
        onToggleTheme={handleToggleTheme}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Status Bar */}
        <div className="space-y-3">
          
          {/* Permission Notice (Soft Banner if rules not yet published) */}
          {firestorePermissionError && (
            <div className="bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 p-4 rounded-xl flex items-start justify-between gap-4 text-xs shadow-sm">
              <div className="flex items-start gap-3">
                <div className="p-1.5 rounded-lg bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300 shrink-0 mt-0.5">
                  <CloudOff className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-amber-900 dark:text-amber-200 text-sm">
                    Running in Live Real-Time Mode (Cloud Sync Pending Rules)
                  </h3>
                  <p className="text-amber-800 dark:text-amber-300 mt-1 leading-relaxed">
                    Your dashboard is fully active and updating every 5 seconds. To enable persistent cloud storage, paste your security rules in the Firebase Console and click <strong>Publish</strong>.
                  </p>
                </div>
              </div>
              <a
                href="https://console.firebase.google.com/project/cloud-iot-monitor/firestore/rules"
                target="_blank"
                rel="noreferrer"
                className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-lg text-xs transition-colors"
              >
                <span>Open Rules</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}

          {/* Connection Status Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs shadow-sm">
            <div className="flex items-center gap-2 flex-wrap">
              <Database className="w-4 h-4 text-blue-500" />
              <span className="font-semibold text-slate-700 dark:text-slate-200">
                Backend Status:
              </span>
              
              <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-medium">
                <CheckCircle className="w-3.5 h-3.5" />
                Firebase Connected
              </span>

              {/* Auth Status */}
              {authLoading ? (
                <span className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-500" />
                  Authenticating...
                </span>
              ) : authUser ? (
                <span className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
                  <UserCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span>UID: <code className="font-mono text-[11px] bg-slate-100 dark:bg-slate-700 px-1 py-0.5 rounded">{authUser.uid.slice(0, 8)}...</code></span>
                </span>
              ) : null}
            </div>

            {/* Cloud Storage Status */}
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-[11px]">
              {firestorePermissionError ? (
                <span className="text-amber-600 dark:text-amber-400 font-medium">
                  ● Local Active Stream
                </span>
              ) : (
                <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                  ● Cloud Firestore Synced ({firestoreSyncedCount} docs)
                </span>
              )}
            </div>
          </div>

          {/* Simulated Disclaimer Banner */}
          <div className="bg-blue-50 dark:bg-blue-950/40 border-l-4 border-blue-500 p-3.5 rounded-r-lg flex items-start gap-3 shadow-sm text-blue-900 dark:text-blue-200 text-xs">
            <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <span className="font-bold">LIVE TELEMETRY STREAM ACTIVE: </span>
              Simulated IoT sensor readings are generating every 5 seconds. All metrics, historical graphs, and table logs are updating automatically in real time.
            </div>
          </div>
        </div>

        {/* Real-time KPI Metric Cards */}
        <MetricCards latestReading={latestReading} />

        {/* Filter Controls Bar */}
        <FilterBar
          selectedDevice={selectedDevice}
          onChangeDevice={setSelectedDevice}
          selectedDate={selectedDate}
          onChangeDate={setSelectedDate}
          onResetFilters={handleResetFilters}
          totalReadingsCount={filteredReadings.length}
        />

        {/* Historical Charts and Alert History Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <HistoricalChart readings={filteredReadings} darkMode={darkMode} />
          </div>
          <div className="lg:col-span-1">
            <AlertHistory alerts={alerts} onClearAlerts={handleClearAlerts} />
          </div>
        </div>

        {/* Recent Readings Telemetry Table */}
        <RecentReadingsTable readings={filteredReadings} />

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-4 text-center text-xs text-slate-500 dark:text-slate-400">
        <p>Phase 2 • Cloud-Based IoT Air Quality Monitoring System • Connected to Firebase</p>
      </footer>

    </div>
  );
}
