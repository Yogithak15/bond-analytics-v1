
// const BASE_URL = "http://13.127.131.27:8001";

const BASE_URL = "https://bondanalytics-api.bondbulls.in"

const header = {
  accept: "application/json",
};

// get data sources with pagination
export const getDataSources = async (skip = 0, limit = 20) => {
  try {
    const response = await fetch(
      `${BASE_URL}/data-sources/?skip=${skip}&limit=${limit}`,
      {
        method: "GET",
        headers: header,
      }
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data sources:", error);
    return [];
  }
};

// get url linked to source
export const getDataSourceUrls = async (sourceId) => {
  const response = await fetch(
    `${BASE_URL}/data-source-urls/by-source/${sourceId}`,
    {
      method: "GET",
      headers: { accept: "application/json" },
    }
  );
  return await response.json();
};

// get dimension type linked to source
export const getDataSourceDimensionTypes = async (sourceId) => {
  const response = await fetch(
    `${BASE_URL}/sources/${sourceId}/dimension-types`,
    {
      method: "GET",
      headers: { accept: "application/json" },
    }
  );
  return await response.json();
};

/**
 * Fetch a single page of dimensions for a given dimension_type_id.
 * Use getAllDimensions() when you need the complete list.
 */
export const getDimensions = async (dimension_type_id,is_active = true, skip = 0, limit = 100) => {
  const response = await fetch(
    `${BASE_URL}/dimensions/?dimension_type_id=${dimension_type_id}&skip=${skip}&limit=${limit}&is_active=${is_active}`,
    {
      method: "GET",
      headers: { accept: "application/json" },
    }
  );
  return await response.json();
};

/**
 * Fetch ALL dimensions for a dimension_type_id by auto-paginating until
 * the API returns fewer rows than the page size (exhaustion strategy).
 *
 * @param {number} dimension_type_id
 * @param {number} [pageSize=200]  - rows per internal request
 * @returns {Promise<Array>}
 */


export const getAllDimensions = async (dimension_type_id, pageSize = 200) => {
  const all = [];
  let skip = 0;

  while (true) {
    let page;
    try {
      page = await getDimensions(dimension_type_id, true, skip, pageSize);
    } catch {
      break;
    }

    if (!Array.isArray(page) || page.length === 0) break;

    all.push(...page);

    // Fewer rows than requested => we've exhausted the dataset
    if (page.length < pageSize) break;

    skip += pageSize;
  }

  return all;
};

export const getDataSourceMetrics = async (sourceId) => {
  const response = await fetch(
    `${BASE_URL}/data_source_metrics/source/${sourceId}`,
    {
      method: "GET",
      headers: { accept: "application/json" },
    }
  );
  return await response.json();
};

// get date attributes linked to source
export const getDataSourceDates = async (sourceId) => {
  const response = await fetch(
    `${BASE_URL}/data-source-date-attribute-types/source/${sourceId}`,
    {
      method: "GET",
      headers: { accept: "application/json" },
    }
  );
  return await response.json();
};

// get details of a single date attribute type
export const getDateAttributeTypes = async (date_attribute_type_id) => {
  const response = await fetch(
    `${BASE_URL}/date-attribute-types/${date_attribute_type_id}`,
    {
      method: "GET",
      headers: { accept: "application/json" },
    }
  );
  return await response.json();
};

// After — dimension_id is now an array of integers
export const analyticsAggregate = async ({
  source_id,
  date_attribute_type_id,
  aggregation = "sum",
  granularity = "month",
  metric_id,
  dimension_id,          // now: number[] | undefined
  dimension_type_id,
  start_date,
  end_date,
  skip = 0,
  limit = 100,
}) => {
  const qp = new URLSearchParams({
    source_id,
    date_attribute_type_id,
    aggregation,
    granularity,
    skip,
    limit,
  });

  if (metric_id         != null) qp.set("metric_id",         metric_id);
  if (dimension_type_id != null) qp.set("dimension_type_id", dimension_type_id);
  if (start_date)                qp.set("start_date",         start_date);
  if (end_date)                  qp.set("end_date",           end_date);

  // Append one ?dimension_id=N per selected ID
  if (Array.isArray(dimension_id)) {
    dimension_id.forEach((id) => qp.append("dimension_id", id));
  } else if (dimension_id != null) {
    qp.append("dimension_id", dimension_id);
  }

  const response = await fetch(
    `${BASE_URL}/analytics/aggregate?${qp.toString()}`,
    { method: "GET", headers: { accept: "application/json" } }
  );

  if (!response.ok) throw new Error(`Analytics API error: ${response.status}`);
  return await response.json();
};