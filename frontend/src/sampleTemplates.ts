export const validSampleTemplates = [
    // 1. Valid Multi-Carton ASN
    {
        vendor_id: "V12345",
        ship_date: "2025-12-20",
        expected_delivery: "2025-12-25",
        warehouse_code: "351",
        tms_routing: {
            shipment_id: "TMS12345678",
            ready_date: "2025-12-20",
            cartons: 2,
            cube: 15.5,
            pallets: 1,
            weight: 45.2
        },
        cartons: [
            {
                ucc128_label: {
                    sscc: "000123456789012345",
                    department_number: "10 - Athletic Apparel",
                    vendor_name: "Vendor Name, 123 Vendor St, City, ST 12345",
                    dsg_dc_name: "DSG - PA1, 456 DC St, City, PA 12345",
                    po_number: "DSG-2024-001234",
                    sort_letter: "A",
                    upc: "123456789012",
                    dc_store_number: "PA1"
                },
                po_number: "DSG-2024-001234",
                items: [
                    {
                        sku: "ITEM001",
                        description: "Basketball Jersey",
                        quantity: 100,
                        upc: "123456789012",
                        po_number: "DSG-2024-001234",
                    }
                ],
                weight: 25.1,
                dimensions: [24, 18, 12]
            },
            {
                ucc128_label: {
                    sscc: "000123456789012346",
                    department_number: "10 - Athletic Apparel",
                    vendor_name: "Vendor Name, 123 Vendor St, City, ST 12345",
                    dsg_dc_name: "DSG - PA1, 456 DC St, City, PA 12345",
                    po_number: "DSG-2024-001234",
                    sort_letter: "B",
                    upc: "123456789013",
                    dc_store_number: "PA1"
                },
                po_number: "DSG-2024-001234",
                items: [
                    {
                        sku: "ITEM002",
                        description: "Basketball Shorts",
                        quantity: 50,
                        upc: "123456789013",
                        po_number: "DSG-2024-001234",
                    }
                ],
                weight: 20.1,
                dimensions: [20, 16, 10]
            }
        ]
    },

    // 2. Valid Single-Carton ASN
    {
        vendor_id: "V98765",
        ship_date: "2025-12-19",
        expected_delivery: "2025-12-24",
        warehouse_code: "51",
        tms_routing: {
            shipment_id: "TMS87654321",
            ready_date: "2025-12-19",
            cartons: 1,
            cube: 8.5,
            pallets: 1,
            weight: 15.3
        },
        cartons: [
            {
                ucc128_label: {
                    sscc: "000987654321098765",
                    department_number: "20 - Footwear",
                    vendor_name: "Sports Gear Inc, 789 Main St, Dallas, TX 75201",
                    dsg_dc_name: "DSG - TX1, 123 Warehouse Blvd, Austin, TX 78701",
                    po_number: "DSG-2024-998877",
                    sort_letter: "A",
                    upc: "987654321098",
                    dc_store_number: "TX1"
                },
                po_number: "DSG-2024-998877",
                items: [
                    {
                        sku: "SHOE001",
                        description: "Running Sneakers",
                        quantity: 30,
                        upc: "987654321098",
                        po_number: "DSG-2024-998877",
                    }
                ],
                weight: 15.3,
                dimensions: [16, 12, 8]
            }
        ]
    }
];

export const invalidSampleTemplates = [
    // 1. Invalid: SSCC doesn't start with 0 (DSG GS1 requirement)
    {
        vendor_id: "V12346",
        ship_date: "2026-01-15", // Future date to avoid timing error
        expected_delivery: "2026-01-20",
        warehouse_code: "351",
        tms_routing: {
            shipment_id: "TMS12345679",
            ready_date: "2026-01-15",
            cartons: 1,
            cube: 12.3,
            pallets: 1,
            weight: 22.5
        },
        cartons: [
            {
                ucc128_label: {
                    sscc: "123456789012345678", // Valid format but doesn't start with 0
                    department_number: "10 - Athletic Apparel",
                    vendor_name: "Vendor Name, 123 Vendor St, City, ST 12345",
                    dsg_dc_name: "DSG - PA1, 456 DC St, City, PA 12345",
                    po_number: "DSG-2024-001235",
                    sort_letter: "A",
                    upc: "123456789014",
                    dc_store_number: "PA1"
                },
                po_number: "DSG-2024-001235",
                items: [
                    {
                        sku: "ITEM003",
                        description: "Running Shoes",
                        quantity: 25,
                        upc: "123456789014",
                        po_number: "DSG-2024-001235",
                    }
                ],
                weight: 22.5,
                dimensions: [18, 14, 8]
            }
        ]
    },

    // 2. Invalid: TMS carton count mismatch
    {
        vendor_id: "V12347",
        ship_date: "2026-01-16",
        expected_delivery: "2026-01-21",
        warehouse_code: "651",
        tms_routing: {
            shipment_id: "TMS12345680",
            ready_date: "2026-01-16",
            cartons: 3, // Says 3 cartons but only provides 1
            cube: 8.2,
            pallets: 1,
            weight: 51.5
        },
        cartons: [
            {
                ucc128_label: {
                    sscc: "000123456789012348",
                    department_number: "10 - Athletic Apparel",
                    vendor_name: "Vendor Name, 123 Vendor St, City, ST 12345",
                    dsg_dc_name: "DSG - TX1, 456 DC St, City, TX 12345",
                    po_number: "DSG-2024-001236",
                    sort_letter: "A",
                    upc: "123456789015",
                    dc_store_number: "TX1"
                },
                po_number: "DSG-2024-001236",
                items: [
                    {
                        sku: "ITEM004",
                        description: "Tennis Racket",
                        quantity: 10,
                        upc: "123456789015",
                        po_number: "DSG-2024-001236",
                    }
                ],
                weight: 51.5, // invalid weight (too heavy)
                dimensions: [12, 10, 8]
            }
        ]
    },

    // 3. Invalid: Multiple PO numbers in a single carton and invalid dimensions
    {
        vendor_id: "V12347",
        ship_date: "2026-01-16",
        expected_delivery: "2026-01-21",
        warehouse_code: "851",
        tms_routing: {
            shipment_id: "TMS12345680",
            ready_date: "2026-01-16",
            cartons: 1,
            cube: 8.2,
            pallets: 1,
            weight: 50.0
        },
        cartons: [
            {
                ucc128_label: {
                    sscc: "000123456789012348",
                    department_number: "10 - Athletic Apparel",
                    vendor_name: "Vendor Name, 123 Vendor St, City, ST 12345",
                    dsg_dc_name: "DSG - TX1, 456 DC St, City, TX 12345",
                    po_number: "DSG-2024-001236",
                    sort_letter: "A",
                    upc: "123456789015",
                    dc_store_number: "TX1"
                },
                po_number: "DSG-2024-001236",
                items: [
                    {
                        sku: "ITEM004",
                        description: "Tennis Racket",
                        quantity: 10,
                        upc: "123456789015",
                        po_number: "DSG-2024-001236",
                    },
                    {
                        sku: "ITEM004",
                        description: "Tennis Racket",
                        quantity: 10,
                        upc: "123456789015",
                        po_number: "DSG-2024-001223", // different po_number
                    }
                ],
                weight: 15.3,
                dimensions: [7, 10, 8] // invalid dimensions
            }
        ]
    },
    // 4. Invalid: ship_date is before current date
    {
        vendor_id: "V12346",
        ship_date: "2025-01-15", // old date
        expected_delivery: "2025-01-20",
        warehouse_code: "CA2", // invalid warehouse code
        tms_routing: {
            shipment_id: "TMS12345679",
            ready_date: "2025-01-15",
            cartons: 1,
            cube: 12.3,
            pallets: 1,
            weight: 22.5
        },
        cartons: [
            {
                ucc128_label: {
                    sscc: "023456789012345678",
                    department_number: "10 - Athletic Apparel",
                    vendor_name: "Vendor Name, 123 Vendor St, City, ST 12345",
                    dsg_dc_name: "DSG - PA1, 456 DC St, City, PA 12345",
                    po_number: "DSG-2024-001235",
                    sort_letter: "A",
                    upc: "123456789014",
                    dc_store_number: "PA1"
                },
                po_number: "DSG-2024-001235",
                items: [
                    {
                        sku: "ITEM003",
                        description: "Running Shoes",
                        quantity: 25,
                        upc: "123456789014",
                        po_number: "DSG-2024-001235",
                    }
                ],
                weight: 22.5,
                dimensions: [18, 14, 8]
            }
        ]
    },
    // 5. Invalid: Item PO number does not match carton PO number
    {
        vendor_id: "V12350",
        ship_date: "2026-01-15",
        expected_delivery: "2026-01-20",
        warehouse_code: "1051",
        tms_routing: {
            shipment_id: "TMS12345679",
            ready_date: "2026-01-15",
            cartons: 1,
            cube: 12.3,
            pallets: 1,
            weight: 22.5
        },
        cartons: [
            {
                ucc128_label: {
                    sscc: "023456789012345678",
                    department_number: "10 - Athletic Apparel",
                    vendor_name: "Vendor Name, 123 Vendor St, City, ST 12345",
                    dsg_dc_name: "DSG - PA1, 456 DC St, City, PA 12345",
                    po_number: "DSG-2024-001235",
                    sort_letter: "A",
                    upc: "123456789014",
                    dc_store_number: "PA1"
                },
                po_number: "DSG-2024-001235",
                items: [
                    {
                        sku: "ITEM003",
                        description: "Running Shoes",
                        quantity: 25,
                        upc: "123456789014",
                        po_number: "DSG-2024-001236", // different po_number to carton
                    }
                ],
                weight: 22.5,
                dimensions: [18, 14, 8]
            }
        ]
    },
];