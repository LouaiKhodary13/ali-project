import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { AnalyticsData, DateRange } from "./analytics";
import { Capacitor } from "@capacitor/core";
import { Filesystem, Directory } from "@capacitor/filesystem";
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
    const filename = `تقرير_التحليلات_${safeRangeString}_${timestamp}.xlsx`;

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
          title: "تصدير التحليلات",
          text: "تقرير التحليلات جاهز",
          url: result.uri,
          dialogTitle: "مشاركة تقرير التحليلات",
        });
      } else {
        alert(`تم حفظ الملف بنجاح في Documents/exports/${filename}`);
      }
    } catch (shareError) {
      console.log("Share failed, but file was saved:", shareError);
      alert(`تم حفظ الملف بنجاح في Documents/exports/${filename}`);
    }
  } catch (error) {
    console.error("Mobile export failed:", error);
  }
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

// Common styles
const headerStyle = {
  font: { bold: true, sz: 14, color: { rgb: "FFFFFF" } },
  fill: { fgColor: { rgb: "4472C4" } },
  alignment: { horizontal: "center", vertical: "center" },
  border: {
    top: { style: "thin", color: { rgb: "000000" } },
    bottom: { style: "thin", color: { rgb: "000000" } },
    left: { style: "thin", color: { rgb: "000000" } },
    right: { style: "thin", color: { rgb: "000000" } },
  },
};

const titleStyle = {
  font: { bold: true, sz: 16, color: { rgb: "2F5597" } },
  alignment: { horizontal: "center", vertical: "center" },
};

const dataStyle = {
  alignment: { horizontal: "center", vertical: "center" },
  border: {
    top: { style: "thin", color: { rgb: "CCCCCC" } },
    bottom: { style: "thin", color: { rgb: "CCCCCC" } },
    left: { style: "thin", color: { rgb: "CCCCCC" } },
    right: { style: "thin", color: { rgb: "CCCCCC" } },
  },
};

const numberStyle = {
  ...dataStyle,
  numFmt: "#,##0.00",
};

function addFinancialOverviewSheet(
  wb: XLSX.WorkBook,
  analytics: AnalyticsData,
  dateRange: DateRange
) {
  const ws = XLSX.utils.aoa_to_sheet([]);

  // Add title
  XLSX.utils.sheet_add_aoa(ws, [["النظرة المالية العامة"]], { origin: "A1" });
  ws["A1"].s = titleStyle;

  // Add financial data
  const financialData = [
    ["", ""],
    ["إجمالي الأرباح", analytics.totalEarned.toFixed(2)],
    ["إجمالي المصروفات", analytics.totalSpent.toFixed(2)],
    ["صافي الربح", analytics.netProfit.toFixed(2)],
    ["", ""],
    ["الفترة الزمنية", dateRange],
    ["تاريخ التصدير", new Date().toLocaleDateString("ar-EG")],
  ];

  XLSX.utils.sheet_add_aoa(ws, financialData, { origin: "A3" });

  // Apply styles
  ws["A4"].s = { ...dataStyle, font: { bold: true } };
  ws["A5"].s = { ...dataStyle, font: { bold: true } };
  ws["A6"].s = { ...dataStyle, font: { bold: true } };
  ws["A8"].s = { ...dataStyle, font: { bold: true } };
  ws["A9"].s = { ...dataStyle, font: { bold: true } };

  ws["B4"].s = numberStyle;
  ws["B5"].s = numberStyle;
  ws["B6"].s = numberStyle;
  ws["B8"].s = dataStyle;
  ws["B9"].s = dataStyle;

  // Set column widths
  ws["!cols"] = [{ width: 25 }, { width: 20 }];

  // Merge title cell
  ws["!merges"] = [{ s: { c: 0, r: 0 }, e: { c: 1, r: 0 } }];

  XLSX.utils.book_append_sheet(wb, ws, "النظرة المالية");
}

function addTopProductsSheet(wb: XLSX.WorkBook, analytics: AnalyticsData) {
  const ws = XLSX.utils.aoa_to_sheet([]);

  // Add title
  XLSX.utils.sheet_add_aoa(ws, [["أفضل المنتجات مبيعاً"]], { origin: "A1" });
  ws["A1"].s = titleStyle;

  // Add headers
  const headers = [["اسم المنتج", "الكمية المباعة", "إجمالي الإيرادات"]];
  XLSX.utils.sheet_add_aoa(ws, headers, { origin: "A3" });

  // Apply header styles
  ws["A3"].s = headerStyle;
  ws["B3"].s = headerStyle;
  ws["C3"].s = headerStyle;

  // Add data
  if (analytics.topSellingProducts.length > 0) {
    const productData = analytics.topSellingProducts.map((item) => [
      item.product.prod_name,
      item.totalQuantity,
      item.totalRevenue.toFixed(2),
    ]);

    XLSX.utils.sheet_add_aoa(ws, productData, { origin: "A4" });

    // Apply data styles
    for (let i = 0; i < productData.length; i++) {
      const row = i + 4;
      ws[`A${row}`].s = dataStyle;
      ws[`B${row}`].s = { ...dataStyle, numFmt: "#,##0" };
      ws[`C${row}`].s = numberStyle;
    }
  } else {
    XLSX.utils.sheet_add_aoa(ws, [["لا توجد بيانات منتجات متاحة", "", ""]], {
      origin: "A4",
    });
    ws["A4"].s = dataStyle;
  }

  // Set column widths
  ws["!cols"] = [{ width: 35 }, { width: 18 }, { width: 20 }];

  // Merge title cell
  ws["!merges"] = [{ s: { c: 0, r: 0 }, e: { c: 2, r: 0 } }];

  XLSX.utils.book_append_sheet(wb, ws, "أفضل المنتجات");
}

function addTopCustomersSheet(wb: XLSX.WorkBook, analytics: AnalyticsData) {
  const ws = XLSX.utils.aoa_to_sheet([]);

  // Add title
  XLSX.utils.sheet_add_aoa(ws, [["أفضل العملاء"]], { origin: "A1" });
  ws["A1"].s = titleStyle;

  // Add headers
  const headers = [["اسم العميل", "إجمالي المشتريات", "عدد الفواتير"]];
  XLSX.utils.sheet_add_aoa(ws, headers, { origin: "A3" });
  // Apply header styles
  ws["A3"].s = headerStyle;
  ws["B3"].s = headerStyle;
  ws["C3"].s = headerStyle;

  // Add data
  if (analytics.topBuyingCustomers.length > 0) {
    const customerData = analytics.topBuyingCustomers.map((item) => [
      item.customer.cust_name,
      item.totalSpent.toFixed(2),
      item.totalTransactions,
    ]);

    XLSX.utils.sheet_add_aoa(ws, customerData, { origin: "A4" });

    // Apply data styles
    for (let i = 0; i < customerData.length; i++) {
      const row = i + 4;
      ws[`A${row}`].s = dataStyle;
      ws[`B${row}`].s = numberStyle;
      ws[`C${row}`].s = { ...dataStyle, numFmt: "#,##0" };
    }
  } else {
    XLSX.utils.sheet_add_aoa(ws, [["لا توجد بيانات عملاء متاحة", "", ""]], {
      origin: "A4",
    });
    ws["A4"].s = dataStyle;
  }

  // Set column widths
  ws["!cols"] = [{ width: 35 }, { width: 20 }, { width: 18 }];

  // Merge title cell
  ws["!merges"] = [{ s: { c: 0, r: 0 }, e: { c: 2, r: 0 } }];

  XLSX.utils.book_append_sheet(wb, ws, "أفضل العملاء");
}

function addMonthlyBreakdownSheet(wb: XLSX.WorkBook, analytics: AnalyticsData) {
  const ws = XLSX.utils.aoa_to_sheet([]);

  // Add title
  XLSX.utils.sheet_add_aoa(ws, [["التفصيل الشهري"]], { origin: "A1" });
  ws["A1"].s = titleStyle;

  // Add headers
  const headers = [["الشهر", "الأرباح", "المصروفات", "صافي الربح"]];
  XLSX.utils.sheet_add_aoa(ws, headers, { origin: "A3" });

  // Apply header styles
  ws["A3"].s = headerStyle;
  ws["B3"].s = headerStyle;
  ws["C3"].s = headerStyle;
  ws["D3"].s = headerStyle;

  // Add data
  if (analytics.monthlyBreakdown.length > 0) {
    const monthlyData = analytics.monthlyBreakdown.map((item) => [
      item.month,
      item.earned.toFixed(2),
      item.spent.toFixed(2),
      item.profit.toFixed(2),
    ]);

    XLSX.utils.sheet_add_aoa(ws, monthlyData, { origin: "A4" });

    // Apply data styles
    for (let i = 0; i < monthlyData.length; i++) {
      const row = i + 4;
      ws[`A${row}`].s = dataStyle;
      ws[`B${row}`].s = numberStyle;
      ws[`C${row}`].s = numberStyle;
      ws[`D${row}`].s = numberStyle;
    }

    // Add totals row
    const totalRow = monthlyData.length + 4;
    const totalEarned = analytics.monthlyBreakdown.reduce(
      (sum, item) => sum + item.earned,
      0
    );
    const totalSpent = analytics.monthlyBreakdown.reduce(
      (sum, item) => sum + item.spent,
      0
    );
    const totalProfit = analytics.monthlyBreakdown.reduce(
      (sum, item) => sum + item.profit,
      0
    );

    XLSX.utils.sheet_add_aoa(
      ws,
      [
        [
          "الإجمالي",
          totalEarned.toFixed(2),
          totalSpent.toFixed(2),
          totalProfit.toFixed(2),
        ],
      ],
      { origin: `A${totalRow}` }
    );

    // Style totals row
    ws[`A${totalRow}`].s = {
      ...headerStyle,
      fill: { fgColor: { rgb: "E7E6E6" } },
    };
    ws[`B${totalRow}`].s = {
      ...numberStyle,
      font: { bold: true },
      fill: { fgColor: { rgb: "E7E6E6" } },
    };
    ws[`C${totalRow}`].s = {
      ...numberStyle,
      font: { bold: true },
      fill: { fgColor: { rgb: "E7E6E6" } },
    };
    ws[`D${totalRow}`].s = {
      ...numberStyle,
      font: { bold: true },
      fill: { fgColor: { rgb: "E7E6E6" } },
    };
  } else {
    XLSX.utils.sheet_add_aoa(ws, [["لا توجد بيانات شهرية متاحة", "", "", ""]], {
      origin: "A4",
    });
    ws["A4"].s = dataStyle;
  }

  // Set column widths
  ws["!cols"] = [{ width: 25 }, { width: 18 }, { width: 18 }, { width: 18 }];

  // Merge title cell
  ws["!merges"] = [{ s: { c: 0, r: 0 }, e: { c: 3, r: 0 } }];

  XLSX.utils.book_append_sheet(wb, ws, "التفصيل الشهري");
}
