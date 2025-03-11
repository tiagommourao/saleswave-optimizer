
// Níveis de log suportados
export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

// Interface para um evento de log
export interface LogEvent {
  timestamp: Date;
  level: LogLevel;
  message: string;
  context?: Record<string, any>;
  userId?: string;
  route?: string;
}

// Configuração do logger
export interface LoggerConfig {
  minLevel: LogLevel;
  enableConsole: boolean;
  enablePersistence: boolean;
  maxLogSize?: number;
}

// Valores de nível de log para fins de filtragem
const LOG_LEVEL_VALUES: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3
};

/**
 * Serviço central de logging
 */
class Logger {
  private logs: LogEvent[] = [];
  private config: LoggerConfig = {
    minLevel: 'info',
    enableConsole: true,
    enablePersistence: true,
    maxLogSize: 1000
  };

  constructor(config?: Partial<LoggerConfig>) {
    if (config) {
      this.config = { ...this.config, ...config };
    }
  }

  /**
   * Adiciona um evento de log
   */
  public log(level: LogLevel, message: string, context?: Record<string, any>, userId?: string, route?: string): void {
    // Verifica se o nível do log atende ao nível mínimo configurado
    if (LOG_LEVEL_VALUES[level] < LOG_LEVEL_VALUES[this.config.minLevel]) {
      return;
    }

    const logEvent: LogEvent = {
      timestamp: new Date(),
      level,
      message,
      context,
      userId,
      route
    };

    // Log no console se habilitado
    if (this.config.enableConsole) {
      this.logToConsole(logEvent);
    }

    // Persistir o log se habilitado
    if (this.config.enablePersistence) {
      this.persistLog(logEvent);
    }
  }

  /**
   * Métodos de conveniência para diferentes níveis de log
   */
  public debug(message: string, context?: Record<string, any>, userId?: string, route?: string): void {
    this.log('debug', message, context, userId, route);
  }

  public info(message: string, context?: Record<string, any>, userId?: string, route?: string): void {
    this.log('info', message, context, userId, route);
  }

  public warn(message: string, context?: Record<string, any>, userId?: string, route?: string): void {
    this.log('warn', message, context, userId, route);
  }

  public error(message: string, context?: Record<string, any>, userId?: string, route?: string): void {
    this.log('error', message, context, userId, route);
  }

  /**
   * Escrever no console com formatação por nível
   */
  private logToConsole(logEvent: LogEvent): void {
    const formattedTime = logEvent.timestamp.toISOString();
    const prefix = `[${formattedTime}] [${logEvent.level.toUpperCase()}]`;
    
    switch (logEvent.level) {
      case 'debug':
        console.debug(prefix, logEvent.message, logEvent.context || '');
        break;
      case 'info':
        console.info(prefix, logEvent.message, logEvent.context || '');
        break;
      case 'warn':
        console.warn(prefix, logEvent.message, logEvent.context || '');
        break;
      case 'error':
        console.error(prefix, logEvent.message, logEvent.context || '');
        break;
    }
  }

  /**
   * Persistir o log na memória (e potencialmente em armazenamento)
   */
  private persistLog(logEvent: LogEvent): void {
    // Adicionar ao array de logs em memória
    this.logs.push(logEvent);

    // Limitar o tamanho do array se necessário
    if (this.config.maxLogSize && this.logs.length > this.config.maxLogSize) {
      this.logs = this.logs.slice(-this.config.maxLogSize);
    }

    // No futuro, poderíamos enviar para um serviço externo aqui
  }

  /**
   * Obter todos os logs armazenados
   */
  public getLogs(filter?: Partial<Pick<LogEvent, 'level' | 'userId' | 'route'>>): LogEvent[] {
    if (!filter) {
      return [...this.logs];
    }

    return this.logs.filter(log => {
      let match = true;
      if (filter.level && log.level !== filter.level) match = false;
      if (filter.userId && log.userId !== filter.userId) match = false;
      if (filter.route && log.route !== filter.route) match = false;
      return match;
    });
  }

  /**
   * Limpar logs armazenados
   */
  public clearLogs(): void {
    this.logs = [];
  }
}

// Exporta uma instância única para uso em toda a aplicação
export const logger = new Logger();
