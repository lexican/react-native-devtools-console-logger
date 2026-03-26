/**
 * Console UI
 * Displays console logs in the dev tools
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { ConsoleLogger, LogEntry, LogLevel } from './ConsoleLogger';

export const ConsoleUI: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [filter, setFilter] = useState<LogLevel | 'all'>('all');
  const scrollViewRef = React.useRef<ScrollView>(null);

  useEffect(() => {
    // Subscribe to log updates
    const unsubscribe = ConsoleLogger.subscribe(newLogs => {
      setLogs(newLogs);
    });

    // Load initial logs
    setLogs(ConsoleLogger.getLogs());

    return unsubscribe;
  }, []);

  useEffect(() => {
    // Auto-scroll to bottom when new logs arrive
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [logs.length]);

  const filteredLogs =
    filter === 'all' ? logs : logs.filter(log => log.level === filter);

  const handleClear = () => {
    ConsoleLogger.clear();
  };

  const getLogColor = (level: LogLevel): string => {
    switch (level) {
      case 'error':
        return '#ff5252';
      case 'warn':
        return '#ffa726';
      case 'info':
        return '#42a5f5';
      case 'debug':
        return '#ab47bc';
      default:
        return '#aaa';
    }
  };

  const getLogIcon = (level: LogLevel): string => {
    switch (level) {
      case 'error':
        return '✕';
      case 'warn':
        return '⚠';
      case 'info':
        return 'ℹ';
      case 'debug':
        return '⚙';
      default:
        return '•';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.toolbar}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterScroll}>
          {['all', 'log', 'info', 'warn', 'error', 'debug'].map(level => (
            <TouchableOpacity
              key={level}
              onPress={() => setFilter(level as LogLevel | 'all')}
              style={[
                styles.filterButton,
                filter === level && styles.filterButtonActive,
              ]}>
              <Text
                style={[
                  styles.filterButtonText,
                  filter === level && styles.filterButtonTextActive,
                ]}>
                {level.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
          <Text style={styles.clearButtonText}>Clear</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        ref={scrollViewRef}
        style={styles.logsContainer}
        contentContainerStyle={styles.logsContent}>
        {filteredLogs.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No console logs</Text>
          </View>
        ) : (
          filteredLogs.map(log => (
            <View key={log.id} style={styles.logEntry}>
              <View style={styles.logHeader}>
                <Text
                  style={[
                    styles.logIcon,
                    { color: getLogColor(log.level) },
                  ]}>
                  {getLogIcon(log.level)}
                </Text>
                <Text style={styles.logLevel}>{log.level.toUpperCase()}</Text>
                <Text style={styles.logTime}>
                  {new Date(log.timestamp).toLocaleTimeString()}
                </Text>
              </View>
              <Text
                style={[
                  styles.logMessage,
                  { color: getLogColor(log.level) },
                ]}>
                {log.message}
              </Text>
              {log.stack && (
                <Text style={styles.logStack}>{log.stack}</Text>
              )}
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e1e1e',
  },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2a2a2a',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  filterScroll: {
    flex: 1,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    borderRadius: 4,
    backgroundColor: '#333',
  },
  filterButtonActive: {
    backgroundColor: '#4fc3f7',
  },
  filterButtonText: {
    color: '#888',
    fontSize: 11,
    fontWeight: '600',
  },
  filterButtonTextActive: {
    color: '#000',
  },
  clearButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    backgroundColor: '#d32f2f',
  },
  clearButtonText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
  },
  logsContainer: {
    flex: 1,
  },
  logsContent: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    color: '#666',
    fontSize: 14,
  },
  logEntry: {
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a2a',
  },
  logHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  logIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  logLevel: {
    color: '#888',
    fontSize: 10,
    fontWeight: '600',
    marginRight: 8,
    fontFamily: 'monospace',
  },
  logTime: {
    color: '#666',
    fontSize: 10,
    fontFamily: 'monospace',
  },
  logMessage: {
    fontSize: 12,
    fontFamily: 'monospace',
    lineHeight: 18,
  },
  logStack: {
    marginTop: 8,
    color: '#666',
    fontSize: 10,
    fontFamily: 'monospace',
    lineHeight: 14,
  },
});
