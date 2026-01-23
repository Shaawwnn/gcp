/**
 * Shared constants for BigQuery
 */

export const MAX_QUERY_RESULTS = 25;

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
FROM \`bigquery-public-data.hacker_news.stories\`
WHERE score IS NOT NULL
ORDER BY score DESC
LIMIT 10`,
  },
];
