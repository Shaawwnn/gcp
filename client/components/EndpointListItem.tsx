interface EndpointListItemProps {
  method: string;
  path: string;
  description: string;
}

export default function EndpointListItem({
  method,
  path,
  description,
}: EndpointListItemProps) {
  return (
    <li className="flex items-start gap-2">
      <code className="bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded">
        {method} {path}
      </code>
      <span>- {description}</span>
    </li>
  );
}

