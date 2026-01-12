import JsonDisplay from "./JsonDisplay";

interface ResponseDisplayProps {
  title: string;
  data: any;
  status?: number;
  responseTime?: number;
  children?: React.ReactNode;
}

export default function ResponseDisplay({
  title,
  data,
  status,
  responseTime,
  children,
}: ResponseDisplayProps) {
  return (
    <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm text-green-800 dark:text-green-200 font-semibold">
          {title}
        </p>
        {(status || responseTime !== undefined) && (
          <div className="flex gap-4 text-xs text-green-700 dark:text-green-300">
            {status && (
              <span>
                Status: <span className="font-semibold">{status}</span>
              </span>
            )}
            {responseTime !== undefined && (
              <span>
                Time: <span className="font-semibold">{responseTime}ms</span>
              </span>
            )}
          </div>
        )}
      </div>
      <JsonDisplay data={data} />
      {children}
    </div>
  );
}

