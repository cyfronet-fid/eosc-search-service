interface IStatistics {
  usageCountsViews: number | null;
  usageCountsDownloads: number | null;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const parseStatistics = (data: any): IStatistics => {
  const usageCountsViews = parseInt(data['usage_counts_views'] ?? '');
  const usageCountsDownloads = parseInt(data['usage_counts_downloads'] ?? '');

  return {
    usageCountsViews: isNaN(usageCountsViews) ? null : usageCountsViews,
    usageCountsDownloads: isNaN(usageCountsDownloads)
      ? null
      : usageCountsDownloads,
  };
};
