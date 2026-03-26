/**
 * Console Logger
 * Captures and stores console logs for the dev tools
 */

export type LogLevel = 'log' | 'info' | 'warn' | 'error' | 'debug';

export interface LogEntry {
  id: string;
  level: LogLevel;
  message: string;
  args: any[];
  timestamp: number;
  stack?: string;
}

type LogListener = (logs: LogEntry[]) => void;

class ConsoleLoggerClass {
  private logs: LogEntry[] = [];
  private readonly listeners: Set<LogListener> = new Set();
  private readonly maxLogs = 500;
  private readonly originalConsole: {
    log: typeof console.log;
    info: typeof console.info;
    warn: typeof console.warn;
    error: typeof console.error;
    debug: typeof console.debug;
  };

  constructor() {
    // Store original console methods
    this.originalConsole = {
      log: console.log,
      info: console.info,
      warn: console.warn,
      error: console.error,
      debug: console.debug,
    };
  }

  /**
   * Start intercepting console methods
   */
  start(): void {
    this.interceptConsole('log');
    this.interceptConsole('info');
    this.interceptConsole('warn');
    this.interceptConsole('error');
    this.interceptConsole('debug');
  }

  /**
   * Stop intercepting and restore original console
   */
  stop(): void {
    console.log = this.originalConsole.log;
    console.info = this.originalConsole.info;
    console.warn = this.originalConsole.warn;
    console.error = this.originalConsole.error;
    console.debug = this.originalConsole.debug;
  }

  private interceptConsole(level: LogLevel): void {
    const original = this.originalConsole[level];
    (console as any)[level] = (...args: any[]) => {
      // Call original console method
      original.apply(console, args);

      // Store log entry
      this.addLog(level, args);
    };
  }

  private addLog(level: LogLevel, args: any[]): void {
    const entry: LogEntry = {
      id: `${Date.now()}-${Math.random()}`,
      level,
      message: this.formatMessage(args),
      args,
      timestamp: Date.now(),
      stack: level === 'error' ? new Error('Stack trace').stack : undefined,
    };

    this.logs.push(entry);

    // Keep only last maxLogs entries
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    this.notifyListeners();
  }

  private formatMessage(args: any[]): string {
    return args
      .map(arg => {
        if (typeof arg === 'object') {
          try {
            return JSON.stringify(arg, null, 2);
          } catch {
            return String(arg);
          }
        }
        return String(arg);
      })
      .join(' ');
  }

  /**
   * Get all logs
   */
  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  /**
   * Clear all logs
   */
  clear(): void {
    this.logs = [];
    this.notifyListeners();
  }

  /**
   * Subscribe to log updates
   */
  subscribe(listener: LogListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => {
      listener(this.getLogs());
    });
  }

  /**
   * Add a custom log programmatically
   */
  addCustomLog(level: LogLevel, message: string, args: any[] = []): void {
    this.addLog(level, [message, ...args]);
  }
}

export const ConsoleLogger = new ConsoleLoggerClass();


// npm run build
// npm link
// npm link devtools-console-logger
// npm login
// npm publish