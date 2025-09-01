import { ASNRequest } from "../types";

interface ASNPreviewProps {
  asn: ASNRequest;
}

export function ASNPreview({ asn }: ASNPreviewProps) {
  return (
    <div className="bg-gray-50 p-4 rounded shadow">
      <h3 className="text-lg font-semibold text-blue-700 mb-2">
        Shipment Info
      </h3>
      <div className="mb-4 grid grid-cols-2 gap-x-4 gap-y-1">
        <div>
          <span className="font-medium">Vendor ID:</span> {asn.vendor_id}
        </div>
        <div>
          <span className="font-medium">Warehouse:</span> {asn.warehouse_code}
        </div>
        <div>
          <span className="font-medium">Ship Date:</span> {asn.ship_date}
        </div>
        <div>
          <span className="font-medium">Expected Delivery:</span>{" "}
          {asn.expected_delivery}
        </div>
        <div>
          <span className="font-medium">TMS Shipment ID:</span>{" "}
          {asn.tms_routing.shipment_id}
        </div>
      </div>

      <h3 className="text-lg font-semibold text-blue-700 mb-2">Cartons</h3>
      {asn.cartons.map((carton, i) => (
        <div
          key={i}
          className="mb-4 p-3 bg-white rounded border border-gray-200"
        >
          <div className="mb-2 font-medium text-gray-700">Carton #{i + 1}</div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
            <div>
              <span className="font-medium">SSCC:</span>{" "}
              {carton.ucc128_label.sscc}
            </div>
            <div>
              <span className="font-medium">PO Number:</span> {carton.po_number}
            </div>
            <div>
              <span className="font-medium">Weight:</span> {carton.weight} lbs
            </div>
            <div>
              <span className="font-medium">Dimensions:</span>{" "}
              {carton.dimensions.join(" x ")} in
            </div>
            <div>
              <span className="font-medium">Department:</span>{" "}
              {carton.ucc128_label.department_number}
            </div>
            <div>
              <span className="font-medium">Sort Letter:</span>{" "}
              {carton.ucc128_label.sort_letter}
            </div>
            <div>
              <span className="font-medium">Vendor Name:</span>{" "}
              {carton.ucc128_label.vendor_name}
            </div>
            <div>
              <span className="font-medium">DC Name:</span>{" "}
              {carton.ucc128_label.dsg_dc_name}
            </div>
            <div>
              <span className="font-medium">UPC:</span>{" "}
              {carton.ucc128_label.upc}
            </div>
            <div>
              <span className="font-medium">DC/Store Number:</span>{" "}
              {carton.ucc128_label.dc_store_number}
            </div>
          </div>
          <div className="mt-2">
            <div className="font-medium text-gray-700">Items:</div>
            <ul className="list-disc pl-5 text-sm">
              {carton.items.map((item, j) => (
                <li key={j}>
                  <span className="font-medium">SKU:</span> {item.sku},{" "}
                  <span className="font-medium">Desc:</span> {item.description},{" "}
                  <span className="font-medium">Qty:</span> {item.quantity},{" "}
                  <span className="font-medium">UPC:</span> {item.upc}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
}
