import { NextRequest, NextResponse } from "next/server";
import {
  fetchLiveFirmsData,
  fireRecordsToGeoJSON,
  getSeededPakistanFires,
  FireRecord,
} from "@/lib/firms";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const instrument = searchParams.get("instrument"); // "MODIS" | "VIIRS" | "ALL"
  const minConfidence = parseFloat(searchParams.get("minConfidence") || "0");
  const minFrp = parseFloat(searchParams.get("minFrp") || "0");
  const province = searchParams.get("province");

  // Fetch or retrieve calibrated records
  const { records: rawRecords, isLive, message } = await fetchLiveFirmsData({
    source: searchParams.get("source") || undefined,
    days: parseInt(searchParams.get("days") || "2", 10),
    date: searchParams.get("date") || undefined,
  });

  const baseRecords = rawRecords.length > 0 ? rawRecords : getSeededPakistanFires();

  // Apply filters
  const filtered = baseRecords.filter((rec: FireRecord) => {
    if (instrument && instrument !== "ALL" && rec.instrument !== instrument) {
      return false;
    }
    if (rec.confidence < minConfidence) {
      return false;
    }
    if (rec.frp < minFrp) {
      return false;
    }
    if (province && province !== "ALL" && rec.province !== province) {
      return false;
    }
    return true;
  });

  const geojson = fireRecordsToGeoJSON(filtered);

  // Compute aggregate telemetry statistics
  const totalCount = filtered.length;
  const modisCount = filtered.filter((r) => r.instrument === "MODIS").length;
  const viirsCount = filtered.filter((r) => r.instrument === "VIIRS").length;
  const highConfCount = filtered.filter((r) => r.confidenceLevel === "high").length;
  const totalFrp = Math.round(filtered.reduce((sum, r) => sum + r.frp, 0) * 10) / 10;
  const maxFrp = filtered.reduce((max, r) => Math.max(max, r.frp), 0);
  const avgTempK =
    totalCount > 0
      ? Math.round((filtered.reduce((sum, r) => sum + r.brightness, 0) / totalCount) * 10) / 10
      : 0;

  return NextResponse.json({
    success: true,
    count: totalCount,
    isLive,
    message,
    stats: {
      totalCount,
      modisCount,
      viirsCount,
      highConfCount,
      totalFrpMW: totalFrp,
      maxFrpMW: Math.round(maxFrp * 10) / 10,
      avgBrightnessK: avgTempK,
      avgBrightnessC: avgTempK > 0 ? Math.round((avgTempK - 273.15) * 10) / 10 : 0,
    },
    geojson,
    records: filtered,
  });
}

