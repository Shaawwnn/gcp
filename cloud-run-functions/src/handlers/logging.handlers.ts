import * as logger from "firebase-functions/logger";
import { HttpsError, CallableRequest } from "firebase-functions/https";
import { Logging } from "@google-cloud/logging";

const logging = new Logging();

/**
 * Severity levels for Cloud Logging
 */
export enum LogSeverity {
  DEBUG = "DEBUG",
  INFO = "INFO",
  NOTICE = "NOTICE",
  WARNING = "WARNING",
  ERROR = "ERROR",
  CRITICAL = "CRITICAL",
  ALERT = "ALERT",
  EMERGENCY = "EMERGENCY",
}

/**
 * Available log services to filter by
 */
export enum LogService {
  ALL = "ALL",
  CLOUD_FUNCTIONS = "CLOUD_FUNCTIONS",
  CLOUD_RUN = "CLOUD_RUN",
  CLOUD_BUILD = "CLOUD_BUILD",
}

/**
 * Time range options for filtering logs
 */
export enum TimeRange {
  ONE_HOUR = "1h",
  SIX_HOURS = "6h",
  TWELVE_HOURS = "12h",
  ONE_DAY = "1d",
  THREE_DAYS = "3d",
  SEVEN_DAYS = "7d",
  THIRTY_DAYS = "30d",
}

interface FetchLogsRequest {
  severity?: LogSeverity;
  service?: LogService;
  timeRange?: TimeRange;
  pageSize?: number;
  pageToken?: string;
}

/**
 * Converts TimeRange enum to hours
 *
 * @param {TimeRange} range - The time range to convert
 * @return {number} The number of hours
 */
const timeRangeToHours = (range: TimeRange): number => {
  const map: Record<TimeRange, number> = {
    [TimeRange.ONE_HOUR]: 1,
    [TimeRange.SIX_HOURS]: 6,
    [TimeRange.TWELVE_HOURS]: 12,
    [TimeRange.ONE_DAY]: 24,
    [TimeRange.THREE_DAYS]: 72,
    [TimeRange.SEVEN_DAYS]: 168,
    [TimeRange.THIRTY_DAYS]: 720,
  };
  return map[range];
};

/**
 * Builds the Cloud Logging filter string
 * Documentation: https://cloud.google.com/logging/docs/view/logging-query-language
 *
 * @param {LogSeverity} severity - Optional severity filter
 * @param {LogService} service - Optional service filter
 * @param {TimeRange} timeRange - Optional time range filter
 * @return {string} The filter string for Cloud Logging API
 */
const buildLogFilter = (
  severity?: LogSeverity,
  service?: LogService,
  timeRange?: TimeRange
): string => {
  const filters: string[] = [];

  // Filter by timestamp (required for performance)
  const hours = timeRange ? timeRangeToHours(timeRange) : 24; // Default 24h
  const timestamp = new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();
  filters.push(`timestamp >= "${timestamp}"`);

  // Filter by severity
  if (severity && severity !== LogSeverity.DEBUG) {
    // Include all severities >= selected severity
    const severityOrder = [
      LogSeverity.DEBUG,
      LogSeverity.INFO,
      LogSeverity.NOTICE,
      LogSeverity.WARNING,
      LogSeverity.ERROR,
      LogSeverity.CRITICAL,
      LogSeverity.ALERT,
      LogSeverity.EMERGENCY,
    ];
    const selectedIndex = severityOrder.indexOf(severity);
    const includedSeverities = severityOrder.slice(selectedIndex);
    const severityFilter = includedSeverities
      .map((s) => `severity="${s}"`)
      .join(" OR ");
    filters.push(`(${severityFilter})`);
  }

  // Filter by service (resource type)
  if (service && service !== LogService.ALL) {
    switch (service) {
    case LogService.CLOUD_FUNCTIONS:
      filters.push("resource.type=\"cloud_function\"");
      break;
    case LogService.CLOUD_RUN:
      filters.push("resource.type=\"cloud_run_revision\"");
      break;
    case LogService.CLOUD_BUILD:
      filters.push("resource.type=\"build\"");
      break;
    }
  }

  return filters.join(" AND ");
};

/**
 * Handler to fetch logs from Cloud Logging
 *
 * @param {CallableRequest} request - The callable function request
 * @return {Promise} Promise resolving to logs data
 */
export const fetchLogsHandler = async (request: CallableRequest) => {
  try {
    const {
      severity,
      service,
      timeRange,
      pageSize = 50,
      pageToken,
    } = request.data as FetchLogsRequest;

    logger.info("Fetching logs", {
      severity,
      service,
      timeRange,
      pageSize,
      hasPageToken: !!pageToken,
    });

    // Build filter
    const filter = buildLogFilter(severity, service, timeRange);
    logger.info("Built filter", { filter });

    // Fetch logs
    const options: {
      filter: string;
      orderBy: string;
      pageSize: number;
      pageToken?: string;
    } = {
      filter,
      orderBy: "timestamp desc",
      pageSize: Math.min(pageSize, 100), // Cap at 100 for safety
    };

    if (pageToken) {
      options.pageToken = pageToken;
    }

    const [entries, , response] = await logging.getEntries(options);

    // Transform entries to a simpler format
    const logs = entries.map((entry) => {
      const metadata = entry.metadata;
      return {
        id: metadata.insertId || `${Date.now()}-${Math.random()}`,
        timestamp: metadata.timestamp,
        severity: metadata.severity || "DEFAULT",
        service: metadata.resource?.type || "unknown",
        serviceName:
          metadata.resource?.labels?.service_name ||
          metadata.resource?.labels?.function_name ||
          metadata.resource?.labels?.build_id ||
          "unknown",
        message: typeof entry.data === "string" ?
          entry.data :
          JSON.stringify(entry.data),
        labels: metadata.labels || {},
        resource: metadata.resource,
      };
    });

    logger.info(`Fetched ${logs.length} logs`);

    return {
      success: true,
      logs,
      nextPageToken: response?.nextPageToken || null,
      hasMore: !!response?.nextPageToken,
      filter,
    };
  } catch (error) {
    logger.error("Error fetching logs:", error);
    throw new HttpsError(
      "internal",
      "Failed to fetch logs",
      error instanceof Error ? error.message : "Unknown error"
    );
  }
};

/**
 * Handler to get available log services
 */
export const getLogServicesHandler = async () => {
  try {
    const services = [
      {
        id: LogService.ALL,
        name: "All Services",
        description: "Show logs from all GCP services",
      },
      {
        id: LogService.CLOUD_FUNCTIONS,
        name: "Cloud Functions",
        description: "Firebase Functions (Gen 2)",
        resourceType: "cloud_function",
      },
      {
        id: LogService.CLOUD_RUN,
        name: "Cloud Run",
        description: "Cloud Run services and revisions",
        resourceType: "cloud_run_revision",
      },
      {
        id: LogService.CLOUD_BUILD,
        name: "Cloud Build",
        description: "Cloud Build pipeline logs",
        resourceType: "build",
      },
    ];

    return {
      success: true,
      services,
      severities: Object.values(LogSeverity),
      timeRanges: Object.values(TimeRange),
    };
  } catch (error) {
    logger.error("Error getting log services:", error);
    throw new HttpsError(
      "internal",
      "Failed to get log services",
      error instanceof Error ? error.message : "Unknown error"
    );
  }
};
