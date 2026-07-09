export const exportToCSV = <T extends Record<string, any>>(
  data: T[], 
  filename: string = 'sigmaspire-filtered-export'
): void => {
  if (!data || data.length === 0) return;

  const firstRow = data[0];
  if (!firstRow) return;
  const headers = Object.keys(firstRow);
  const csvRows = [];

  // Generate explicit columns header line
  csvRows.push(headers.join(','));

  // Parse structural values safely escaping commas
  for (const row of data) {
    const values = headers.map(header => {
      const val = row[header];
      const escaped = ('' + val).replace(/"/g, '\\"');
      return `"${escaped}"`;
    });
    csvRows.push(values.join(','));
  }

  const csvContent = 'data:text/csv;charset=utf-8,' + csvRows.join('\n');
  const encodedUri = encodeURI(csvContent);
  
  const downloadLink = document.createElement('a');
  downloadLink.setAttribute('href', encodedUri);
  downloadLink.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
  
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
};
