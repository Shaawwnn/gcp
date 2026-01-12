interface ErrorMessageProps {
  message: string;
}

export default function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
      <p className="text-sm text-red-800 dark:text-red-200 font-semibold mb-1">
        Error
      </p>
      <p className="text-sm text-red-700 dark:text-red-300">{message}</p>
    </div>
  );
}

