import { httpsCallable } from "firebase/functions";
import { functions } from "./firebase";

interface BigQueryRow {
  [key: string]: unknown;
}

interface RunQueryResponse {
  success: boolean;
  rows: BigQueryRow[];
  rowCount: number;
  jobId: string;
}

interface PublicDataset {
  id: string;
  name: string;
  description: string;
  sampleQuery: string;
}

interface ListDatasetsResponse {
  success: boolean;
  datasets: PublicDataset[];
}

export const runBigQuery = async (query: string): Promise<RunQueryResponse> => {
  const callable = httpsCallable<{ query: string }, RunQueryResponse>(
    functions,
    "runBigQuery"
  );

  const result = await callable({ query });
  return result.data;
};

export const listPublicDatasets = async (): Promise<PublicDataset[]> => {
  const callable = httpsCallable<void, ListDatasetsResponse>(
    functions,
    "listPublicDatasets"
  );

  const result = await callable();
  return result.data.datasets;
};

