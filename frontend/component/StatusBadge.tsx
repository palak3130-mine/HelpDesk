export default function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    CREATED: "bg-blue-100 text-blue-700",
    ASSIGNED: "bg-purple-100 text-purple-700",
    STARTED: "bg-yellow-100 text-yellow-700",
    RESOLVED: "bg-green-100 text-green-700",
    CLOSED: "bg-gray-200 text-gray-700",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold ${
        styles[status] || "bg-gray-100 text-gray-600"
      }`}
    >
      {status}
    </span>
  );
}