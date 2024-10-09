import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../api';
import {
  Container,
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Snackbar,
  Alert,
  CircularProgress,
} from '@mui/material';
import { DateRangePicker } from '@mui/lab';

const ReportsPage = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [reportType, setReportType] = useState('branch-report');
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    // On initial load, fetch the overall report
    fetchOverallReport();
  }, []);

  // Fetch the overall report without any date filters
  const fetchOverallReport = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/reports/${reportType}/overall`);
      setReportData(response.data);
    } catch (error) {
      setSnackbar({ open: true, message: 'Error fetching overall report data.', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // Fetch report based on the selected date range
  const fetchDateRangeReport = async () => {
    if (!startDate || !endDate) {
      setSnackbar({ open: true, message: 'Please select a valid date range.', severity: 'warning' });
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/reports/${reportType}`, {
        params: {
          start_date: startDate.toISOString().split('T')[0],
          end_date: endDate.toISOString().split('T')[0],
        },
      });
      setReportData(response.data);
    } catch (error) {
      setSnackbar({ open: true, message: 'Error fetching date range report data.', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // Table Headers based on the report type
  const getTableHeaders = () => {
    switch (reportType) {
      case 'branch-report':
        return ['Branch', 'Total Liters Purchased', 'Total Liters Sold', 'Remaining Inventory'];
      case 'branch-revenue':
        return ['Branch', 'Total Revenue'];
      case 'monthly-sales':
        return ['Branch', 'Month', 'Total Liters Sold', 'Total Revenue'];
      case 'inventory-report':
        return ['Branch', 'Fuel Type', 'Available Liters'];
      default:
        return [];
    }
  };

  // Table Data Rows
  const renderTableRows = () => {
    return reportData.map((row, index) => (
      <TableRow key={index}>
        {Object.values(row).map((value, cellIndex) => (
          <TableCell key={cellIndex}>{value}</TableCell>
        ))}
      </TableRow>
    ));
  };

  return (
    <Container maxWidth="lg">
      <Box my={4}>
        <Typography variant="h4" gutterBottom>
          Reports for Management
        </Typography>

        {/* Date Range Picker */}
        <DateRangePicker
          startText="Start Date"
          endText="End Date"
          value={[startDate, endDate]}
          onChange={(newValue) => {
            setStartDate(newValue[0]);
            setEndDate(newValue[1]);
          }}
          renderInput={(startProps, endProps) => (
            <>
              <TextField {...startProps} margin="normal" />
              <Box mx={2}>to</Box>
              <TextField {...endProps} margin="normal" />
            </>
          )}
        />

        {/* Report Type Selector */}
        <Box my={2}>
          <Button
            variant={reportType === 'branch-report' ? 'contained' : 'outlined'}
            onClick={() => setReportType('branch-report')}
          >
            Branch Report
          </Button>
          <Button
            variant={reportType === 'branch-revenue' ? 'contained' : 'outlined'}
            onClick={() => setReportType('branch-revenue')}
            sx={{ ml: 2 }}
          >
            Revenue Report
          </Button>
          <Button
            variant={reportType === 'monthly-sales' ? 'contained' : 'outlined'}
            onClick={() => setReportType('monthly-sales')}
            sx={{ ml: 2 }}
          >
            Monthly Sales Report
          </Button>
          <Button
            variant={reportType === 'inventory-report' ? 'contained' : 'outlined'}
            onClick={() => setReportType('inventory-report')}
            sx={{ ml: 2 }}
          >
            Inventory Report
          </Button>
        </Box>

        {/* Fetch Report Buttons */}
        <Box mb={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={fetchDateRangeReport}
            disabled={loading}
            sx={{ mr: 2 }}
          >
            {loading ? <CircularProgress size={24} /> : 'Fetch Date Range Report'}
          </Button>
          <Button
            variant="outlined"
            color="primary"
            onClick={fetchOverallReport}
            disabled={loading}
          >
            Reset to Overall Report
          </Button>
        </Box>

        {/* Report Data Table */}
        {reportData.length > 0 && (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  {getTableHeaders().map((header, index) => (
                    <TableCell key={index}>{header}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>{renderTableRows()}</TableBody>
            </Table>
          </TableContainer>
        )}

        {/* Snackbar for error or success messages */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={() => setSnackbar({ open: false, message: '', severity: 'success' })}
        >
          <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
        </Snackbar>
      </Box>
    </Container>
  );
};

export default ReportsPage;
