import * as logger from "firebase-functions/logger";
import { HttpsError, CallableRequest } from "firebase-functions/v2/https";
import { BigQuery } from "@google-cloud/bigquery";
import { MAX_BYTES_BILLED, MAX_QUERY_RESULTS } from "@shared/constants";

const bigquery = new BigQuery();

export const runBigQueryHandler = async (request: CallableRequest) => {
  const { query: sqlQuery } = request.data;

  if (!sqlQuery || typeof sqlQuery !== "string") {
    throw new HttpsError("invalid-argument", "SQL query is required");
  }

  // Drop a single trailing semicolon, then reject any remaining statement
  // separator. BigQuery executes multi-statement scripts, so a prefix check
  // alone lets "SELECT 1; DROP TABLE ..." through.
  const trimmedQuery = sqlQuery.trim().replace(/;\s*$/, "");

  if (trimmedQuery.includes(";")) {
    throw new HttpsError(
      "invalid-argument",
      "Only a single statement is allowed"
    );
  }

  // Read-only statements only. WITH is permitted so CTEs are not rejected.
  if (!/^(SELECT|WITH)\b/i.test(trimmedQuery)) {
    throw new HttpsError(
      "invalid-argument",
      "Only SELECT queries are allowed for security reasons"
    );
  }

  // Row limiter. A trailing LIMIT may carry an OFFSET, which has to be
  // preserved — appending a second LIMIT after it would be invalid SQL.
  const limitRegex = /\bLIMIT\s+(\d+)(\s+OFFSET\s+\d+)?\s*$/i;
  const limitMatch = trimmedQuery.match(limitRegex);
  const userLimit = limitMatch
    ? parseInt(limitMatch[1], 10)
    : MAX_QUERY_RESULTS;
  const effectiveLimit = Math.min(userLimit, MAX_QUERY_RESULTS);

  const modifiedQuery = limitMatch
    ? trimmedQuery.replace(
        limitRegex,
        `LIMIT ${effectiveLimit}${limitMatch[2] ?? ""}`
      )
    : `${trimmedQuery} LIMIT ${effectiveLimit}`;

  try {
    logger.info("Running BigQuery query", { query: modifiedQuery });

    const options = {
      query: modifiedQuery,
      // Deliberately NOT GCP_REGION. A BigQuery job runs in the location of the
      // data it reads, and every dataset in SAMPLE_QUERIES lives under
      // bigquery-public-data in the US. Pointing this at asia-east1 with the
      // rest of the project fails every query with "dataset not found in
      // location". The cross-region read is the intended behaviour here.
      location: "US",
      // Hard cost ceiling. The row limit above caps what comes back, not what
      // gets scanned, which is what BigQuery actually bills for.
      maximumBytesBilled: String(MAX_BYTES_BILLED),
    };

    const [job] = await bigquery.createQueryJob(options);
    logger.info(`Job ${job.id} started.`);

    const [rows] = await job.getQueryResults();

    logger.info(`Query returned ${rows.length} rows`);

    return {
      success: true,
      rows,
      rowCount: rows.length,
      jobId: job.id,
      limitEnforced: MAX_QUERY_RESULTS,
    };
  } catch (error) {
    logger.error("Error running BigQuery query:", error);
    throw new HttpsError(
      "internal",
      "Failed to run query",
      error instanceof Error ? error.message : "Unknown error"
    );
  }
};

export const listPublicDatasetsHandler = async () => {
  try {
    // Return a curated list of interesting public datasets
    const publicDatasets = [
      {
        id: "bigquery-public-data.usa_names",
        name: "USA Names",
        description: "Popular baby names in the USA from 1910 to 2021",
        sampleQuery:
          "SELECT name, SUM(number) as total " +
          "FROM `bigquery-public-data.usa_names.usa_1910_2013` " +
          "WHERE gender = 'M' GROUP BY name ORDER BY total DESC LIMIT 10",
      },
      {
        id: "bigquery-public-data.austin_bikeshare",
        name: "Austin Bikeshare",
        description: "Bike share trip data from Austin, Texas",
        sampleQuery:
          "SELECT * FROM " +
          "`bigquery-public-data.austin_bikeshare.bikeshare_trips` LIMIT 10",
      },
      {
        id: "bigquery-public-data.covid19_open_data",
        name: "COVID-19 Open Data",
        description: "Global COVID-19 statistics",
        sampleQuery:
          "SELECT country_name, SUM(new_confirmed) as total_cases " +
          "FROM `bigquery-public-data.covid19_open_data.covid19_open_data` " +
          "WHERE date >= '2020-01-01' GROUP BY country_name " +
          "ORDER BY total_cases DESC LIMIT 10",
      },
      {
        id: "bigquery-public-data.hacker_news",
        name: "Hacker News",
        description: "Full dataset of Hacker News stories and comments",
        sampleQuery:
          "SELECT title, score FROM " +
          "`bigquery-public-data.hacker_news.full` " +
          "WHERE type = 'story' ORDER BY score DESC LIMIT 10",
      },
    ];

    return {
      success: true,
      datasets: publicDatasets,
    };
  } catch (error) {
    logger.error("Error listing datasets:", error);
    throw new HttpsError(
      "internal",
      "Failed to list datasets",
      error instanceof Error ? error.message : "Unknown error"
    );
  }
};
