import { Router } from 'express';
import { exportReportCsv, reportSummary, sprintHealthReport } from '../controllers/reports.controller';

const router = Router();

router.get('/summary', reportSummary);
router.get('/sprint-health', sprintHealthReport);
router.get('/export.csv', exportReportCsv);

export default router;
