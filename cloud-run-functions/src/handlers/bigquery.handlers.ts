import * as logger from "firebase-functions/logger";
import { HttpsError, CallableRequest } from "firebase-functions/https";
import { BigQuery } from "@google-cloud/bigquery";

const bigquery = new BigQuery();

export const runBigQueryHandler = async (request: CallableRequest) => {
  const { query: sqlQuery } = request.data;

  if (!sqlQuery || typeof sqlQuery !== "string") {
    throw new HttpsError("invalid-argument", "SQL query is required");
  }

  // Safety check: only allow SELECT queries
  const trimmedQuery = sqlQuery.trim().toUpperCase();
  if (!trimmedQuery.startsWith("SELECT")) {
    throw new HttpsError(
      "invalid-argument",
      "Only SELECT queries are allowed for security reasons"
    );
  }

  // Safety limiter: enforce max 25 rows
  const MAX_ROWS = 25;
  let modifiedQuery = sqlQuery.trim();

  // Check if query has a LIMIT clause
  const limitRegex = /\bLIMIT\s+\d+\s*$/i;
  if (limitRegex.test(modifiedQuery)) {
    // Replace existing LIMIT with our max
    modifiedQuery = modifiedQuery.replace(
      limitRegex,
      `LIMIT ${MAX_ROWS}`
    );
  } else {
    // Add LIMIT if not present
    modifiedQuery = `${modifiedQuery} LIMIT ${MAX_ROWS}`;
  }

  try {
    logger.info("Running BigQuery query", { query: modifiedQuery });

    const options = {
      query: modifiedQuery,
      location: "US",
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
      limitEnforced: MAX_ROWS,
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
      {
        id: "bigquery-public-data.new_york_citibike",
        name: "NYC Citi Bike",
        description: "New York City bike share data",
        sampleQuery:
          "SELECT * FROM " +
          "`bigquery-public-data.new_york_citibike.citibike_trips` LIMIT 10",
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

