interface EndpointButtonProps {
  endpoint: {
    path: string;
    method: string;
    description: string;
  };
  isSelected: boolean;
  onClick: () => void;
}

export default function EndpointButton({
  endpoint,
  isSelected,
  onClick,
}: EndpointButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors text-left ${
        isSelected
          ? "bg-blue-600 text-white"
          : "bg-zinc-100 dark:bg-zinc-800 text-black dark:text-zinc-50 hover:bg-zinc-200 dark:hover:bg-zinc-700"
      }`}
    >
      <div className="font-mono text-xs mb-1">{endpoint.method}</div>
      <div className="font-semibold">{endpoint.path}</div>
      <div className="text-xs opacity-75 mt-1">{endpoint.description}</div>
    </button>
  );
}

