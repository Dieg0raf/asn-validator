import React from "react";
import { ASNRequest } from "../types";

interface ASNPreviewProps {
  asn: ASNRequest;
}

export function ASNPreview({ asn }: ASNPreviewProps) {
  return (
    <pre className="bg-gray-100 p-4 rounded overflow-x-auto text-sm">
      {JSON.stringify(asn, null, 2)}
    </pre>
  );
}
