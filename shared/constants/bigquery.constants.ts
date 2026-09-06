/**
 * Shared constants for BigQuery
 */

export const MAX_QUERY_RESULTS = 25;

/**
 * Hard per-query cost cap, enforced via BigQuery's maximumBytesBilled.
 *
 * MAX_QUERY_RESULTS provides no cost protection: BigQuery bills by bytes
 * scanned, and LIMIT does not reduce scan volume. Measured 2026-09-06, the
 * sample queries below scan 144 MB, 505 MB and 799 MB, so 2 GB leaves
 * comfortable headroom while blocking terabyte-scale scans.
 */
export const MAX_BYTES_BILLED = 2 * 1024 * 1024 * 1024; // 2GB

export const SAMPLE_QUERIES = [
  {
    name: "Top 10 Popular Names (1980-2000)",
    query: `SELECT name, SUM(number) as total
FROM \`bigquery-public-data.usa_names.usa_1910_current\`
WHERE year BETWEEN 1980 AND 2000
GROUP BY name
ORDER BY total DESC
LIMIT 10`,
  },
  {
    name: "COVID-19 Cases by Country",
    query: `SELECT country_name, SUM(cumulative_confirmed) as total_cases
FROM \`bigquery-public-data.covid19_open_data.covid19_open_data\`
WHERE date = '2021-12-31'
GROUP BY country_name
ORDER BY total_cases DESC
LIMIT 10`,
  },
  {
    name: "Top Hacker News Posts",
    query: `SELECT title, score, \`by\` as author
FROM \`bigquery-public-data.hacker_news.full\`
WHERE score IS NOT NULL
ORDER BY score DESC
LIMIT 10`,
  },
];
