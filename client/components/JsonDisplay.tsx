interface JsonDisplayProps {
  data: unknown;
  title?: string;
}

export default function JsonDisplay({ data, title }: JsonDisplayProps) {
  return (
    <>
      {title && (
        <p className="text-xs font-semibold text-green-800 dark:text-green-200 mb-1">
          {title}:
        </p>
      )}
      <pre className="text-xs bg-white dark:bg-zinc-900 p-3 rounded overflow-x-auto text-zinc-800 dark:text-zinc-200">
        {JSON.stringify(data, null, 2)}
      </pre>
    </>
  );
}

