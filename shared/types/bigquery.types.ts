/**
 * Shared types for BigQuery
 * Used by both client and cloud functions
 */

export interface BigQueryRequest {
  query: string;
}

export interface BigQueryRow {
  [key: string]: unknown;
}

export interface BigQueryResponse {
  success: boolean;
  rows: BigQueryRow[];
  totalRows: number;
  jobId: string;
}

export interface PublicDataset {
  id: string;
  name: string;
  description: string;
  tables: string[];
}

export interface ListDatasetsResponse {
  success: boolean;
  datasets: PublicDataset[];
}
