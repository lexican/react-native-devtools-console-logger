# devtools-console-logger

A React Native console logger for capturing and displaying console logs in dev tools. Perfect for debugging React Native apps with an in-app console UI.

## Features

- 📝 Captures all console methods (`log`, `info`, `warn`, `error`, `debug`)
- 🎨 Beautiful dark-themed console UI component
- 🔍 Filter logs by level
- 📦 Stores up to 500 recent logs
- 🔄 Real-time log updates via subscription
- 📱 React Native optimized
- 💾 TypeScript support with full type definitions
- 🎯 Zero dependencies (except peer deps)

## Installation

```bash
npm install devtools-console-logger
```

or

```bash
yarn add devtools-console-logger
```

## Usage

### Basic Setup

```tsx
import { ConsoleLogger, ConsoleDevTools } from 'devtools-console-logger';
import React, { useEffect } from 'react';
import { View } from 'react-native';

function App() {
  useEffect(() => {
    // Start intercepting console logs
    ConsoleLogger.start();

    return () => {
      // Stop intercepting when component unmounts
      ConsoleLogger.stop();
    };
  }, []);

  return (
    <View style={{ flex: 1 }}>
      {/* Your app content */}
      
      {/* Console UI - typically shown in dev mode only */}
      {__DEV__ && <ConsoleDevTools />}
    </View>
  );
}
```

### Using Console Logger Programmatically

```tsx
import { ConsoleLogger } from 'devtools-console-logger';

// Start capturing logs
ConsoleLogger.start();

// Get all logs
const logs = ConsoleLogger.getLogs();

// Subscribe to log updates
const unsubscribe = ConsoleLogger.subscribe((logs) => {
  console.log('Logs updated:', logs);
});

// Clear all logs
ConsoleLogger.clear();

// Add custom log entry
ConsoleLogger.addCustomLog('info', 'Custom message', ['arg1', 'arg2']);

// Stop capturing (restores original console)
ConsoleLogger.stop();

// Cleanup subscription
unsubscribe();
```

### Custom Console UI Integration

```tsx
import { ConsoleLogger } from 'devtools-console-logger';
import { useState, useEffect } from 'react';
import { View } from 'react-native';

function MyCustomConsole() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const unsubscribe = ConsoleLogger.subscribe(setLogs);
    setLogs(ConsoleLogger.getLogs());
    return unsubscribe;
  }, []);

  return (
    <View>
      {logs.map(log => (
        <View key={log.id}>
          [{log.level}] {log.message}
        </View>
      ))}
    </View>
  );
}
```

## API

### ConsoleLogger

#### Methods

- **`start(): void`** - Start intercepting console methods
- **`stop(): void`** - Stop intercepting and restore original console
- **`getLogs(): LogEntry[]`** - Get all captured logs
- **`clear(): void`** - Clear all logs
- **`subscribe(listener: (logs: LogEntry[]) => void): () => void`** - Subscribe to log updates, returns unsubscribe function
- **`addCustomLog(level: LogLevel, message: string, args?: any[]): void`** - Add a custom log entry

#### Types

```typescript
type LogLevel = 'log' | 'info' | 'warn' | 'error' | 'debug';

interface LogEntry {
  id: string;
  level: LogLevel;
  message: string;
  args: any[];
  timestamp: number;
  stack?: string; // Only present for 'error' level
}
```

### ConsoleDevTools

A pre-built React Native component that displays captured logs with:
- Filter buttons for each log level
- Clear button
- Auto-scroll to newest logs
- Color-coded log levels
- Timestamp display
- Stack traces for errors
- Dark theme

## Example Use Cases

### Development Mode Only

```tsx
import { ConsoleLogger, ConsoleDevTools } from 'devtools-console-logger';

export default function App() {
  useEffect(() => {
    if (__DEV__) {
      ConsoleLogger.start();
    }
    return () => ConsoleLogger.stop();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <YourMainApp />
      {__DEV__ && <ConsoleDevTools />}
    </SafeAreaView>
  );
}
```

### Debug Overlay

```tsx
import { ConsoleUI } from 'devtools-console-logger';
import { useState } from 'react';
import { Modal, Button } from 'react-native';

function App() {
  const [showConsole, setShowConsole] = useState(false);

  return (
    <>
      <YourApp />
      <Button title="Show Console" onPress={() => setShowConsole(true)} />
      
      <Modal visible={showConsole} animationType="slide">
        <ConsoleUI />
        <Button title="Close" onPress={() => setShowConsole(false)} />
      </Modal>
    </>
  );
}
```

## Configuration

The logger automatically limits storage to the last 500 logs to prevent memory issues. This limit is currently hardcoded but can be customized by forking the package.

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
