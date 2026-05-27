import {
  analyticsAggregate,
  getSnapshotData,
  getMarketComposition,
  getCorpBondOutstandingByIssuer,
  getCorpBondTradingTrend,
  getPrivatePlacementTrend,
  getGsecMaturityProfile,
  getSdlMaturityProfile,
  getStripsMaturityProfile,
  getNcdPublicIssuesTrend,
  getStateOutstandingShare,
  getCorpBondLegacyIssuerSplit,
  getCorpBondCurrentIssuerSplit,
  getCorpBondRatingActivity,
  getCorpBondRatingCoverage,
  getNseSecurityMasterStatus,
} from './bond_api';

// ─────────────────────────────────────────────────────────────────────────────
//  Debt Markets Page — API definitions
//
//  Confirmed source_ids:
//    source_id  1  — NCD Public Issues              date_attr_type 2
//    source_id  2  — Private Placements             date_attr_type 3
//    source_id  3  — Corp Bond Trades (SEBI)        date_attr_type 3
//    source_id  5  — Corp Bond Outstanding (TRACKS) date_attr_type 3
//    source_id  6  — SGB Outstanding                date_attr_type 6
//    source_id  7  — SDL / SGS Outstanding          date_attr_type 5
//    source_id  8  — G-Sec Outstanding              date_attr_type 5
//    source_id  9  — STRIPS Outstanding             date_attr_type 5
//    source_id 11  — RBI Policy Rates               date_attr_type 9
//

// ═══════════════════════════════════════════════════════════════════════════
//  OVERVIEW TAB
// ═══════════════════════════════════════════════════════════════════════════

// ── KPI : G-Sec Outstanding (snapshot, sum all dim_type 14 rows) ────────────
//   /analytics/snapshot-data · source_id 8 · metric_id 29 · date_attr 5 · dim_type 14
export const fetchDmKpiGsecOs = async () => {
  const raw  = await getSnapshotData({ source_id: 8, date_attribute_type_id: 5, dimension_type_id: 14, metric_id: 29 });
  const list = Array.isArray(raw) ? raw : (raw?.data || []);
  if (!list.length) return [];
  const period = raw?.snapshot_date ?? null;
  const total  = list.reduce((sum, r) => sum + +(r.metric_value ?? r.value ?? 0), 0);
  return [{ period, value: total }];
};

// ── KPI : SGS Outstanding (snapshot, sum all dim_type 11 rows) ──────────────
//   /analytics/snapshot-data · source_id 7 · metric_id 29 · date_attr 5 · dim_type 11
export const fetchDmKpiSgsOs = async () => {
  const raw  = await getSnapshotData({ source_id: 7, date_attribute_type_id: 5, dimension_type_id: 11, metric_id: 29 });
  const list = Array.isArray(raw) ? raw : (raw?.data || []);
  if (!list.length) return [];
  const period = raw?.snapshot_date ?? null;
  const total  = list.reduce((sum, r) => sum + +(r.metric_value ?? r.value ?? 0), 0);
  return [{ period, value: total }];
};

// ── KPI : Corp Bond Outstanding (snapshot, latest month, sum all dim_type 5 rows) ─
//   /analytics/snapshot-data · source_id 5 · metric_id 22 · date_attr 3 · dim_type 5
export const fetchDmKpiCorpBondOs = async () => {
  const raw  = await getSnapshotData({ source_id: 5, date_attribute_type_id: 3, dimension_type_id: 5, metric_id: 22 });
  const list = Array.isArray(raw) ? raw : (raw?.data || []);
  if (!list.length) return [];
  const period = raw?.snapshot_date ?? null;
  const total  = list.reduce((sum, r) => sum + +(r.metric_value ?? r.value ?? 0), 0);
  return [{ period, value: total }];
};

// ── KPI : Total Debt Market — dedicated endpoint ─────────────────────────────
//   Returns { segments: [{instrument, value_cr}], grand_total_cr }
export { getMarketComposition as fetchDmMarketComposition };

// ── KPI : 10Y G-Sec Zero (FY 2025-26, latest available month) ───────────────
//   source_id 33 · metric_id 160 · dimension_id 34092 · date_attr 3
export const fetchDmKpi10YZero = () =>
  analyticsAggregate({
    source_id: 33, metric_id: 160,
    date_attribute_type_id: 3, dimension_id: 34092,
    granularity: 'month', aggregation: 'sum',
    limit: 100,
  });

// ── KPI : SGB Outstanding (snapshot, sum all dim_type 10 rows) ──────────────
//   /analytics/snapshot-data · source_id 6 · metric_id 28 · date_attr 6 · dim_type 10
export const fetchDmKpiSgbOs = async () => {
  const raw  = await getSnapshotData({ source_id: 6, date_attribute_type_id: 6, dimension_type_id: 10, metric_id: 28 });
  const list = Array.isArray(raw) ? raw : (raw?.data || []);
  if (!list.length) return [];
  const period = raw?.snapshot_date ?? null;
  const total  = list.reduce((sum, r) => sum + +(r.metric_value ?? r.value ?? 0), 0);
  return [{ period, value: total }];
};

// ── Chart : Key Sovereign Rates — Repo Rate monthly series ──────────────────
//   source_id 11 · metric_id 46 · date_attr 9 · granularity month
//   NOTE: 1Y / 5Y / 10Y zero yields from FBIL ZCYC — source_id TBD
export const fetchDmRepoRateMonthly = () =>
  analyticsAggregate({
    source_id: 11, metric_id: 46,
    date_attribute_type_id: 9,
    granularity: 'month', aggregation: 'sum', limit: 500,
  });

// ── Chart : Secondary Debt Trading — SEBI Corp Bond Trades ──────────────────
//   source_id 3 · metric_id 6 · date_attr 3 · dim_type 3 · granularity month
//   Sums all dimension_ids: 4 BSE-Listed, 5 BSE-Unlisted, 6 NSE-Listed,
//   7 NSE-Unlisted, 8 MCX-SX, 9 Off Market-Listed, 10 Off Market-Unlisted
//   NOTE: NSE WDM breakdown — source_id TBD
export const fetchDmSebiCorpTrades = () =>
  analyticsAggregate({
    source_id: 3, metric_id: 6,
    date_attribute_type_id: 3, dimension_type_id: 3,
    granularity: 'month', aggregation: 'sum', limit: 500,
  });

// ── Chart : NSE WDM Security Mix — source_id TBD ────────────────────────────
//   Segments: G-Sec, T-Bill, SDL, Corp Debt, PTC, CP, Other
//   Discover via GET /data-sources/ → filter source_name = "NSE WDM"

// ── Chart : NSE EBP Issuance Mix — source_id TBD ────────────────────────────
//   Segments: NCD, Bond, Debenture, Bank Capital, Structured, Other
//   Discover via GET /data-sources/ → filter source_name = "NSE EBP"


// ═══════════════════════════════════════════════════════════════════════════
//  G-SECS TAB
// ═══════════════════════════════════════════════════════════════════════════

const computeWam = (list, snapshotDate) => {
  const ref = snapshotDate ? new Date(snapshotDate) : new Date();
  let ws = 0, tw = 0;
  for (const r of list) {
    const md = r.date ? new Date(r.date) : null;
    if (!md || isNaN(md)) continue;
    const yrs = (md - ref) / (365.25 * 24 * 3600 * 1000);
    if (yrs <= 0) continue;
    const w = +(r.metric_value ?? 0);
    ws += yrs * w; tw += w;
  }
  return tw > 0 ? ws / tw : null;
};

// ── KPI : G-Sec Weighted Average Maturity ───────────────────────────────────
export const fetchDmGsecWam = async () => {
  const raw  = await getSnapshotData({ source_id: 8, date_attribute_type_id: 5, dimension_type_id: 13, metric_id: 29 });
  const list = Array.isArray(raw) ? raw : (raw?.data || []);
  const wam  = computeWam(list, raw?.snapshot_date);
  return { wam, snapshot_date: raw?.snapshot_date ?? null };
};

// ── Chart : G-Sec Maturity Ladder by FY ─────────────────────────────────────
//   Reuses snapshot source_id 8 · dim_type 13; groups metric_value by maturity FY
//   Returns [{ fy: '2026-27', value_cr: 123456 }] sorted ascending
export const fetchDmGsecMaturityLadder = async () => {
  const raw  = await getSnapshotData({ source_id: 8, date_attribute_type_id: 5, dimension_type_id: 13, metric_id: 29 });
  const list = Array.isArray(raw) ? raw : (raw?.data || []);
  const byFy = {};
  for (const r of list) {
    if (!r.date) continue;
    const d = new Date(r.date);
    if (isNaN(d)) continue;
    const yr  = d.getFullYear();
    const mo  = d.getMonth() + 1;
    const fy  = mo >= 4 ? `${yr}-${String(yr+1).slice(2)}` : `${yr-1}-${String(yr).slice(2)}`;
    byFy[fy]  = (byFy[fy] ?? 0) + +(r.metric_value ?? 0);
  }
  return Object.entries(byFy)
    .map(([fy, value_cr]) => ({ fy, value_cr }))
    .sort((a, b) => a.fy.localeCompare(b.fy));
};

// ── Chart : STRIPS Maturity Ladder by FY ────────────────────────────────────
//   Reuses snapshot source_id 9 · dim_type 15; groups metric_value by maturity FY
//   Returns [{ fy: '2026-27', value_cr: 123456 }] sorted ascending
export const fetchDmStripsMaturityLadder = async () => {
  const raw  = await getSnapshotData({ source_id: 9, date_attribute_type_id: 5, dimension_type_id: 15, metric_id: 29 });
  const list = Array.isArray(raw) ? raw : (raw?.data || []);
  const byFy = {};
  for (const r of list) {
    if (!r.date) continue;
    const d = new Date(r.date);
    if (isNaN(d)) continue;
    const yr  = d.getFullYear();
    const mo  = d.getMonth() + 1;
    const fy  = mo >= 4 ? `${yr}-${String(yr+1).slice(2)}` : `${yr-1}-${String(yr).slice(2)}`;
    byFy[fy]  = (byFy[fy] ?? 0) + +(r.metric_value ?? 0);
  }
  return Object.entries(byFy)
    .map(([fy, value_cr]) => ({ fy, value_cr }))
    .sort((a, b) => a.fy.localeCompare(b.fy));
};

// ── KPI : STRIPS Stock (snapshot, sum all dim_type 15 rows) ─────────────────
//   /analytics/snapshot-data · source_id 9 · metric_id 29 · date_attr 5 · dim_type 15
export const fetchDmKpiStripsOs = async () => {
  const raw  = await getSnapshotData({ source_id: 9, date_attribute_type_id: 5, dimension_type_id: 15, metric_id: 29 });
  const list = Array.isArray(raw) ? raw : (raw?.data || []);
  if (!list.length) return [];
  const period = raw?.snapshot_date ?? null;
  const total  = list.reduce((sum, r) => sum + +(r.metric_value ?? r.value ?? 0), 0);
  return [{ period, value: total }];
};

// ── KPI : STRIPS Weighted Average Maturity ──────────────────────────────────
export const fetchDmStripsWam = async () => {
  const raw  = await getSnapshotData({ source_id: 9, date_attribute_type_id: 5, dimension_type_id: 15, metric_id: 29 });
  const list = Array.isArray(raw) ? raw : (raw?.data || []);
  const wam  = computeWam(list, raw?.snapshot_date);
  return { wam, snapshot_date: raw?.snapshot_date ?? null };
};

// ── KPI : 1S10S Slope — TBD (FBIL ZCYC) ────────────────────────────────────

// ── Chart : G-Sec Maturity Profile by residual bucket ───────────────────────
//   Dedicated endpoint → /analytics/gsec/maturity-profile
export { getGsecMaturityProfile as fetchDmGsecMaturityProfile };

// ── Chart : STRIPS Maturity Profile by residual bucket ──────────────────────
//   Dedicated endpoint → /analytics/gsec/strips/maturity-profile
export { getStripsMaturityProfile as fetchDmStripsMaturityProfile };

// ── Chart : G-Sec Outstanding — Annual trend ────────────────────────────────
//   source_id 8 · metric_id 29 · date_attr 5 · dim_type 14 · granularity FY
export const fetchDmGsecTrend = () =>
  analyticsAggregate({
    source_id: 8, metric_id: 29,
    date_attribute_type_id: 5, dimension_type_id: 14,
    granularity: 'financial_year', aggregation: 'sum', limit: 100,
  });

// ── Chart : STRIPS Outstanding — Annual trend ───────────────────────────────
//   source_id 9 · metric_id 29 · date_attr 5 · dim_type 15 · granularity FY
//   NOTE: returns ₹ face value; divide by 1e7 for ₹ L Cr
export const fetchDmStripsTrend = () =>
  analyticsAggregate({
    source_id: 9, metric_id: 29,
    date_attribute_type_id: 5, dimension_type_id: 15,
    granularity: 'financial_year', aggregation: 'sum', limit: 100,
  });

// ── Chart : G-Sec Auction Supply & Cut-off Yield — TBD ──────────────────────
//   Source: FIMMDA auction data — source_id not yet confirmed
// ── Chart : FBIL G-Sec Zero Curve — TBD ────────────────────────────────────
//   Source: FBIL ZCYC — source_id not yet confirmed
// ── Chart : CCIL ZCYC Model Pulse (Beta0, Beta1) — TBD ─────────────────────
//   Source: CCIL ZCYC NSS parameters — source_id not yet confirmed
// ── Chart : G-Sec Maturity Ladder by FY — TBD ───────────────────────────────
// ── Chart : STRIPS Maturity Ladder by FY — TBD ──────────────────────────────
// ── Shared WAM helper ────────────────────────────────────────────────────────


// ── Table : Top G-Sec Outstanding Lines  +  KPI : G-Sec WAM ────────────────
//   /analytics/snapshot-data · source_id 8 · metric_id 29 · date_attr 5 · dim_type 13
export const fetchDmTopGsecLines = () =>
  getSnapshotData({ source_id: 8, date_attribute_type_id: 5, dimension_type_id: 13, metric_id: 29 });


// ── Table : Top STRIPS Lines ─────────────────────────────────────────────────
//   /analytics/snapshot-data · source_id 9 · metric_id 29 · date_attr 5 · dim_type 16
export const fetchDmTopStripsLines = () =>
  getSnapshotData({ source_id: 9, date_attribute_type_id: 5, dimension_type_id: 16, metric_id: 29 });



// ── Chart : RBI Policy Rates — all 7 metrics monthly ───────────────────────
//   source_id 11 · date_attr 9 · granularity month
//   metric_ids: 46 Repo, 47 SDF, 48 MSF, 49 Bank Rate,
//               50 Reverse Repo, 51 CRR, 52 SLR
export const fetchDmPolicyRates = () =>
  Promise.all(
    [46, 47, 48, 49, 50, 51, 52].map(metric_id =>
      analyticsAggregate({
        source_id: 11, metric_id,
        date_attribute_type_id: 9,
        granularity: 'month', aggregation: 'sum', limit: 500,
      })
    )
  );


// ═══════════════════════════════════════════════════════════════════════════
//  SGS TAB
// ═══════════════════════════════════════════════════════════════════════════

// ── KPI : Annual Archive Stock (latest financial year total) ─────────────────
//   Returns the single most-recent FY row; component reads row[0].value as ₹ Cr
//   source_id            : 7    (SDL / SGS Outstanding)
//   metric_id            : 29
//   date_attribute_type_id: 5
//   dimension_type_id    : 11   (state-level aggregate, all states summed)
//   granularity          : financial_year
//   aggregation          : sum
//   limit                : 1    → only the latest FY row
export const fetchDmSgsArchiveStockKpi = () =>
  analyticsAggregate({
    source_id: 7, metric_id: 29,
    date_attribute_type_id: 5, dimension_type_id: 11,
    granularity: 'financial_year', aggregation: 'sum', limit: 1,
  });

// ── KPI : Archive CAGR — compound annual growth rate across full FY history ──
//   No separate API call; fetches the same full FY series as the chart and
//   computes CAGR = (last / first) ^ (1 / (n-1)) - 1 over all available years.
//   source_id            : 7
//   metric_id            : 29
//   date_attribute_type_id: 5
//   dimension_type_id    : 11
//   granularity          : financial_year
//   Returns { cagr: number (%), firstPeriod: string, lastPeriod: string }
export const fetchDmSgsArchiveCagr = async () => {
  const raw  = await analyticsAggregate({
    source_id: 7, metric_id: 29,
    date_attribute_type_id: 5, dimension_type_id: 11,
    granularity: 'financial_year', aggregation: 'sum', limit: 100,
  });
  const list = Array.isArray(raw) ? raw : (raw?.data || raw?.items || []);
  const vals = list.map(r => +(r.value ?? r.metric_value ?? 0)).filter(Boolean);
  if (vals.length < 2) return null;
  const cagr = (Math.pow(vals[vals.length - 1] / vals[0], 1 / (vals.length - 1)) - 1) * 100;
  return {
    cagr: +cagr.toFixed(1),
    firstPeriod: list[0]?.period ?? '',
    lastPeriod:  list[list.length - 1]?.period ?? '',
  };
};


// ── KPI : Top-5 State Share ──────────────────────────────────────────────────
//   Endpoint → /analytics/state-outstanding-share  (same as above)
//   Sorts all states by outstanding_cr descending, sums share_pct of top 5
//   Returns { share: number (%), top5: [{ state_name, outstanding_cr, share_pct }] }
export const fetchDmSgsTop5Share = async () => {
  const raw  = await getStateOutstandingShare();
  const list = Array.isArray(raw) ? raw : (raw?.data || []);
  if (!list.length) return null;
  const sorted = [...list].sort((a, b) => (b.total_outstanding ?? 0) - (a.total_outstanding ?? 0));
  const top5   = sorted.slice(0, 5);
  const grand  = list.reduce((s, r) => s + (r.total_outstanding ?? 0), 0);
  const share  = top5.reduce((s, r) => {
    const pct = r.share_percent != null
      ? r.share_percent
      : grand > 0 ? (r.total_outstanding / grand) * 100 : 0;
    return s + pct;
  }, 0);
  return { share: +share.toFixed(1), top5 };
};



// ── Chart : RBI SGS Annual Market Loan Archive ────
//   source_id            : 7
//   metric_id            : 29
//   date_attribute_type_id: 5
//   dimension_type_id    : 11
//   granularity          : financial_year
export const fetchDmSgsTrend = () =>
  analyticsAggregate({
    source_id: 7, metric_id: 29,
    date_attribute_type_id: 5, dimension_type_id: 11,
    granularity: 'financial_year', aggregation: 'sum', limit: 100,
  });

// ── Chart : SGS per-state annual breakdown (Dynamic Top-5 share computation) ─
//   Same source/metric as fetchDmSgsTrend but without dimension_type_id filter
//   so the API returns one row per state per year (dimension-level data).
//   Used to compute "Dynamic Top-5 Share" — the combined share of the 5 largest
//   borrowers in each financial year.
//   source_id            : 7   (SDL / SGS Outstanding)
//   metric_id            : 29
//   date_attribute_type_id: 5
//   granularity          : financial_year
export const fetchDmSgsStateBreakdown = () =>
  analyticsAggregate({
    source_id: 7, metric_id: 29,
    date_attribute_type_id: 5,
    granularity: 'financial_year', aggregation: 'sum', limit: 2000,
  });

// ── Chart : SDL Maturity Profile by residual bucket ─────────────────────────
//   Dedicated endpoint → /analytics/sdl/maturity-profile
export { getSdlMaturityProfile as fetchDmSdlMaturityProfile };

// ── Chart : State-wise SDL Outstanding Share (map / bar) ────────────────────
//   Dedicated endpoint → /analytics/state-outstanding-share
//   Returns [{ state_name, outstanding_cr, share_pct }]
export { getStateOutstandingShare as fetchDmStateOutstandingShare };


// ═══════════════════════════════════════════════════════════════════════════
//  CORPORATE BONDS TAB
// ═══════════════════════════════════════════════════════════════════════════

// ── KPI : Corp Bond Outstanding — same as fetchDmKpiCorpBondOs above ────────

// ── Chart : Corp Bond Outstanding — Monthly trend ───────────────────────────
//   source_id 5 · metric_id 22 · date_attr 3 · dim_type 5 · granularity month
export const fetchDmCorpBondOsTrend = () =>
  analyticsAggregate({
    source_id: 5, metric_id: 22,
    date_attribute_type_id: 3, dimension_type_id: 5,
    granularity: 'month', aggregation: 'sum', limit: 500,
  });

// ── Chart : Corp Bond Trading Trend — dedicated endpoint ────────────────────
//   Returns [{ period, trade_amount_cr }] quarterly
export { getCorpBondTradingTrend as fetchDmCorpBondTradingTrend };

// ── Chart : Corp Bond Outstanding by Issuer Type ────────────────────────────
//   Dedicated endpoint → returns [{ issuer_type, outstanding_cr }]
export { getCorpBondOutstandingByIssuer as fetchDmCorpBondOsByIssuer };

// ── Chart : NCD Public Issues — Annual trend ────────────────────────────────
//   source_id 1 · metric_id 2 · date_attr 2 · granularity FY
export const fetchDmNcdIpoAnnual = () =>
  analyticsAggregate({
    source_id: 1, metric_id: 2,
    date_attribute_type_id: 2,
    granularity: 'financial_year', aggregation: 'sum', limit: 100,
  });

// ── Chart : Private Placements — Annual trend ───────────────────────────────
//   source_id 2 · metric_id 4 · date_attr 3 · granularity FY
export const fetchDmPrivatePlacementAnnual = () =>
  analyticsAggregate({
    source_id: 2, metric_id: 4,
    date_attribute_type_id: 3,
    granularity: 'financial_year', aggregation: 'sum', limit: 100,
  });

// ── Chart : Private Placement Trend — dedicated endpoint ────────────────────
export { getPrivatePlacementTrend as fetchDmPrivatePlacementTrend };

// ── Chart : NCD Public Issues Trend — dedicated endpoint ────────────────────
export { getNcdPublicIssuesTrend as fetchDmNcdTrend };

// ── Chart : Legacy issuer split — Financial vs Non-Financial (quarterly) ────
export { getCorpBondLegacyIssuerSplit as fetchDmCorpBondLegacyIssuerSplit };

// ── Chart : Current issuer split — multi-category monthly (post Apr 2024) ──
export { getCorpBondCurrentIssuerSplit as fetchDmCorpBondCurrentIssuerSplit };

// ── Chart : Rating activity — monthly NSE EBP events ────────────────────────
export { getCorpBondRatingActivity as fetchDmCorpBondRatingActivity };

// ── Chart : Rating coverage snapshot — active rows by agency ────────────────
export { getCorpBondRatingCoverage as fetchDmCorpBondRatingCoverage };

// ── Chart + Table : NSE Debt Security Master Status ─────────────────────────
export { getNseSecurityMasterStatus as fetchDmNseSecurityMasterStatus };


// ═══════════════════════════════════════════════════════════════════════════
//  SGB TAB
// ═══════════════════════════════════════════════════════════════════════════

// ── KPI : SGB Outstanding — same as fetchDmKpiSgbOs above ───────────────────

// ── Chart : SGB Outstanding — Annual trend ──────────────────────────────────
//   source_id 6 · metric_id 28 · date_attr 6 · dim_type 10 · granularity FY
export const fetchDmSgbTrend = () =>
  analyticsAggregate({
    source_id: 6, metric_id: 28,
    date_attribute_type_id: 6, dimension_type_id: 10,
    granularity: 'financial_year', aggregation: 'sum', limit: 100,
  });

// ── Table : Largest SGB Tranches — per-tranche snapshot ──────────────────────
//   /analytics/snapshot-data · source_id 6 · metric_id 28 · date_attr 6 · dim_type 10
export const fetchDmSgbTranches = () =>
  getSnapshotData({ source_id: 6, date_attribute_type_id: 6, dimension_type_id: 10, metric_id: 28 });
