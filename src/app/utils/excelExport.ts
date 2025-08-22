import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { AnalyticsData, DateRange } from "./analytics";
import { Capacitor } from "@capacitor/core";
import { Filesystem, Directory, Encoding } from "@capacitor/filesystem";
import { Share } from "@capacitor/share";

export async function exportAnalyticsToExcel(
  analytics: AnalyticsData,
  range: DateRange
) {
  try {
    console.log("Starting Excel export...");

    // Create workbook
    const wb = XLSX.utils.book_new();

    // Add sheets with error handling
    try {
      addFinancialOverviewSheet(wb, analytics, range);
      addTopProductsSheet(wb, analytics);
      addTopCustomersSheet(wb, analytics);
      addMonthlyBreakdownSheet(wb, analytics);
    } catch (sheetError) {
      console.error("Error creating sheets:", sheetError);
      throw new Error("Failed to create Excel sheets");
    }

    // Generate filename
    const timestamp = new Date().toISOString().split("T")[0].replace(/-/g, "");
    const safeRangeString = range.replace(/[^a-zA-Z0-9_-]/g, "_");
    const filename = `analytics_${safeRangeString}_${timestamp}.xlsx`;

    console.log("Generated filename:", filename);

    if (Capacitor.isNativePlatform()) {
      await exportForMobile(wb, filename);
    } else {
      await exportForWeb(wb, filename);
    }

    console.log("Excel export completed successfully");
  } catch (error) {
    console.error("Excel export error:", error);
  }
}

async function exportForMobile(wb: XLSX.WorkBook, filename: string) {
  try {
    console.log("Exporting for mobile platform...");

    // Generate the Excel file as array buffer
    const arrayBuffer = XLSX.write(wb, {
      bookType: "xlsx",
      type: "array",
      compression: false,
    });

    // Convert to base64 for Capacitor
    const base64String = arrayBufferToBase64(arrayBuffer);

    console.log("Generated base64 string length:", base64String.length);

    // Ensure the Documents directory exists
    try {
      await Filesystem.mkdir({
        path: "exports",
        directory: Directory.Documents,
        recursive: true,
      });
    } catch (mkdirError) {
      console.log("Directory already exists or creation failed:", mkdirError);
    }

    // Write file with proper encoding for binary data
    const result = await Filesystem.writeFile({
      path: `exports/${filename}`,
      data: base64String,
      directory: Directory.Documents,
      // Remove encoding parameter or use Encoding.UTF8 but ensure data is base64
    });

    console.log("File written successfully:", result.uri);

    // Verify file was written
    try {
      const fileInfo = await Filesystem.stat({
        path: `exports/${filename}`,
        directory: Directory.Documents,
      });
      console.log("File info:", fileInfo);
    } catch (statError) {
      console.error("Could not verify file:", statError);
    }

    // Try to share the file
    try {
      const canShare = await Share.canShare();
      if (canShare) {
        await Share.share({
          title: "Analytics Export",
          text: "Your analytics report is ready",
          url: result.uri,
          dialogTitle: "Share Analytics Report",
        });
      } else {
        alert(`File saved successfully to Documents/exports/${filename}`);
      }
    } catch (shareError) {
      console.log("Share failed, but file was saved:", shareError);
      alert(`File saved successfully to Documents/exports/${filename}`);
    }
  } catch (error) {
    console.error("Mobile export failed:", error);
  }
}

async function exportForMobileFallback(wb: XLSX.WorkBook, filename: string) {
  // Alternative method using binary string
  const binaryString = XLSX.write(wb, {
    bookType: "xlsx",
    type: "binary",
    compression: false,
  });

  // Convert binary string to Uint8Array then to base64
  const uint8Array = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    uint8Array[i] = binaryString.charCodeAt(i);
  }

  const base64String = uint8ArrayToBase64(uint8Array);

  const result = await Filesystem.writeFile({
    path: `exports/fallback_${filename}`,
    data: base64String,
    directory: Directory.Documents,
    encoding: Encoding.UTF8,
  });

  console.log("Fallback file written:", result.uri);
  alert(
    `File saved using fallback method to Documents/exports/fallback_${filename}`
  );
}

async function exportForWeb(wb: XLSX.WorkBook, filename: string) {
  const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  const blob = new Blob([wbout], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  saveAs(blob, filename);
}

// Improved base64 conversion functions
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  return uint8ArrayToBase64(bytes);
}

function uint8ArrayToBase64(uint8Array: Uint8Array): string {
  let binary = "";
  const chunkSize = 8192; // Process in chunks to avoid call stack overflow

  for (let i = 0; i < uint8Array.length; i += chunkSize) {
    const chunk = uint8Array.subarray(i, i + chunkSize);
    binary += String.fromCharCode.apply(null, Array.from(chunk));
  }

  return btoa(binary);
}

function addFinancialOverviewSheet(
  wb: XLSX.WorkBook,
  analytics: AnalyticsData,
  dateRange: DateRange
) {
  const data = [
    ["Financial Overview", ""],
    ["", ""],
    ["Total Earned", `${analytics.totalEarned.toFixed(2)}`],
    ["Total Spent", `${analytics.totalSpent.toFixed(2)}`],
    ["Net Profit", `${analytics.netProfit.toFixed(2)}`],
    ["", ""],
    ["Date Range", dateRange],
    ["Export Date", new Date().toLocaleDateString()],
  ];

  const ws = XLSX.utils.aoa_to_sheet(data);

  // Set column widths
  ws["!cols"] = [{ width: 20 }, { width: 15 }];

  XLSX.utils.book_append_sheet(wb, ws, "Financial Overview");
}

function addTopProductsSheet(wb: XLSX.WorkBook, analytics: AnalyticsData) {
  const data = [
    ["Top Selling Products", "", ""],
    ["", "", ""],
    ["Product Name", "Quantity Sold", "Total Revenue"],
    ...analytics.topSellingProducts.map((item) => [
      item.product.prod_name,
      item.totalQuantity,
      `${item.totalRevenue.toFixed(2)}`,
    ]),
  ];

  if (analytics.topSellingProducts.length === 0) {
    data.push(["No products data available", "", ""]);
  }

  const ws = XLSX.utils.aoa_to_sheet(data);

  // Set column widths
  ws["!cols"] = [{ width: 30 }, { width: 15 }, { width: 15 }];

  XLSX.utils.book_append_sheet(wb, ws, "Top Products");
}

function addTopCustomersSheet(wb: XLSX.WorkBook, analytics: AnalyticsData) {
  const data = [
    ["Top Customers", "", ""],
    ["", "", ""],
    ["Customer Name", "Total Spent", "Purchase Count"],
    ...analytics.topBuyingCustomers.map((item) => [
      item.customer.cust_name,
      `${item.totalSpent.toFixed(2)}`,
      item.totalTransactions,
    ]),
  ];

  if (analytics.topBuyingCustomers.length === 0) {
    data.push(["No customers data available", "", ""]);
  }

  const ws = XLSX.utils.aoa_to_sheet(data);

  // Set column widths
  ws["!cols"] = [{ width: 30 }, { width: 15 }, { width: 15 }];

  XLSX.utils.book_append_sheet(wb, ws, "Top Customers");
}

function addMonthlyBreakdownSheet(wb: XLSX.WorkBook, analytics: AnalyticsData) {
  const data = [
    ["Monthly Breakdown", "", "", ""],
    ["", "", "", ""],
    ["Month", "Earned", "Spent", "Profit"],
  ];

  if (analytics.monthlyBreakdown.length > 0) {
    data.push(
      ...analytics.monthlyBreakdown.map((item) => [
        item.month,
        `${item.earned.toFixed(2)}`,
        `${item.spent.toFixed(2)}`,
        `${item.profit.toFixed(2)}`,
      ])
    );
  } else {
    data.push(["No monthly data available", "", "", ""]);
  }

  const ws = XLSX.utils.aoa_to_sheet(data);

  // Set column widths
  ws["!cols"] = [{ width: 20 }, { width: 15 }, { width: 15 }, { width: 15 }];

  XLSX.utils.book_append_sheet(wb, ws, "Monthly Breakdown");
}
