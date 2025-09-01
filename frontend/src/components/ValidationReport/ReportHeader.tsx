interface ReportHeaderProps {
  summary: any;
}

export function ReportHeader({ summary }: ReportHeaderProps) {
  return (
    <div className="mb-4">
      <h2 className="text-2xl font-bold">ASN Validation Report</h2>
      <div className="text-gray-600">
        <span>Total Cartons: {summary.total_cartons}</span> |{" "}
        <span>Total Items: {summary.total_items}</span> |{" "}
        <span>Total Weight: {summary.total_weight} lbs</span>
      </div>
    </div>
  );
}
