import { client, unwrap } from './client';
import { ReportSummary } from './types';

export function getSummary() {
  return unwrap<ReportSummary>(client.get('/reports/summary'));
}
