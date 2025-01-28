import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../api';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Calendar, Download, RefreshCcw, Loader, ChevronDown } from 'lucide-react';
import CompanyLogo from '../../assets/rubis.jpg';

const ReportsPage = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [reportType, setReportType] = useState('branch-report');
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const REPORT_TYPES = [
    { id: 'branch-report', label: 'Branch Report', icon: '📊' },
    { id: 'branch-revenue', label: 'Branch Revenue', icon: '💰' },
    { id: 'monthly-sales', label: 'Monthly Sales', icon: '📈' },
    { id: 'inventory-report', label: 'Inventory Report', icon: '📦' }
  ];
  useEffect(() => {
    fetchOverallReport();
  }, [reportType]);

  const fetchOverallReport = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/reports/${reportType}`);
      setReportData(response.data);
    } catch (error) {
      handleError('Error fetching overall report.');
    } finally {
      setLoading(false);
    }
  };

  const fetchDateRangeReport = async () => {
    if (!startDate || !endDate) {
      showSnackbar('Please select a valid date range.', 'warning');
      return;
    }
  
    if (endDate < startDate) {
      showSnackbar('End date must be after start date.', 'warning');
      return;
    }
  
    try {
      setLoading(true);
      const formattedStartDate = formatDate(startDate);
      const formattedEndDate = formatDate(endDate);
  
      console.log('Sending payload:', { start_date: formattedStartDate, end_date: formattedEndDate });
  
      const response = await axios.get(`${API_BASE_URL}/reports/${reportType}`, {
        params: {
          start_date: formattedStartDate,
          end_date: formattedEndDate,
        },
      });
  
      setReportData(response.data);
    } catch (error) {
      handleError('Error fetching date range report.');
    } finally {
      setLoading(false);
    }
  };
  
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  
  

  
  const formatCurrency = (value, currency = 'RWF') => {
    return new Intl.NumberFormat('en-RW', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
    }).format(value);
  };

  const formatNumber = (value) => {
    return new Intl.NumberFormat('en-RW').format(value);
  };

  const handleError = (message) => {
    showSnackbar(message, 'error');
    setReportData([]);
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
    setTimeout(() => setSnackbar({ open: false, message: '', severity }), 5000);
  };

 // Previous imports remain the same...

const downloadPDF = () => {
  try {
    const doc = new jsPDF();
    const headers = getTableHeaders();
    const rows = reportData.map((row) => Object.values(row));
    
    // Set background color for header
    doc.setFillColor(0, 117, 71); // #007547
    doc.rect(0, 0, doc.internal.pageSize.width, 40, 'F');
    
    // Add logo
    doc.addImage(CompanyLogo, 'PNG', 14, 10, 40, 20);
    
    // Add company name with enhanced styling
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(24);
    doc.text('RUBIS', 60, 25);
    
    // Add decorative line
    doc.setDrawColor(255, 255, 255);
    doc.setLineWidth(0.5);
    doc.line(14, 35, doc.internal.pageSize.width - 14, 35);
    
    // Reset text color for rest of the document
    doc.setTextColor(51, 51, 51);
    
    // Add report title with styling
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text('Management Report', 14, 60);
    
    // Add report metadata box
    doc.setDrawColor(0, 117, 71);
    doc.setLineWidth(0.1);
    doc.roundedRect(14, 70, 180, 35, 3, 3);
    
    // Add report details with enhanced formatting
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    
    // Add report type with icon-like bullet
    doc.setFont("helvetica", "bold");
    doc.text('Report Type:', 20, 80);
    doc.setFont("helvetica", "normal");
    doc.text(REPORT_TYPES.find(t => t.id === reportType)?.label, 70, 80);
    
    // Add date information
    doc.setFont("helvetica", "bold");
    doc.text('Date Range:', 20, 88);
    doc.setFont("helvetica", "normal");
    doc.text(startDate && endDate
      ? `${formatDate(startDate)} - ${formatDate(endDate)}`
      : 'Overall Report', 70, 88);
    
    // Add generation timestamp
    doc.setFont("helvetica", "bold");
    doc.text('Generated:', 20, 96);
    doc.setFont("helvetica", "normal");
    doc.text(new Date().toLocaleString(), 70, 96);
    
    // Add table with enhanced styling
    doc.autoTable({
      head: [headers],
      body: rows,
      startY: 120,
      styles: {
        font: "helvetica",
        fontSize: 10,
        cellPadding: 5,
        lineWidth: 0.1,
      },
      headStyles: {
        fillColor: [0, 117, 71],
        textColor: [255, 255, 255],
        fontSize: 11,
        fontStyle: 'bold',
        halign: 'center',
        valign: 'middle',
        lineWidth: 0.1,
      },
      bodyStyles: {
        fillColor: [255, 255, 255],
        textColor: [51, 51, 51],
        fontSize: 10,
        lineColor: [220, 220, 220],
      },
      alternateRowStyles: {
        fillColor: [248, 248, 248],
      },
      columnStyles: {
        0: {
          halign: 'left',
          cellWidth: 'auto',
          fontStyle: 'bold',
        },
        1: { halign: 'center' },
        2: { halign: 'center' },
        3: { halign: 'center' },
      },
      margin: { top: 120 },
    });
    
    // Get the final Y position after the table
    const finalY = doc.previousAutoTable.finalY || 120;
    
    // Add summary box if applicable
    if (reportType === 'branch-revenue' || reportType === 'monthly-sales') {
      const totalRevenue = reportData.reduce((sum, row) => sum + (row.revenue || row.totalRevenue || 0), 0);
      
      // Add summary box
      doc.setDrawColor(0, 117, 71);
      doc.setLineWidth(0.1);
      doc.roundedRect(14, finalY + 20, 180, 25, 3, 3);
      
      // Add summary text
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.text(formatCurrency(totalRevenue), 100, finalY + 35);
    }
    
    // Add footer to each page
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      
      // Add footer background
      doc.setFillColor(248, 248, 248);
      doc.rect(0, doc.internal.pageSize.height - 20, doc.internal.pageSize.width, 20, 'F');
      
      // Add footer content
      doc.setFontSize(8);
      doc.setTextColor(128, 128, 128);
      doc.text(
        `Generated by ADMIN - ${new Date().toLocaleDateString()}`,
        14,
        doc.internal.pageSize.height - 10
      );
      
      // Add page numbers
      doc.text(
        `Page ${i} of ${pageCount}`,
        doc.internal.pageSize.width - 30,
        doc.internal.pageSize.height - 10
      );
      
      // Add decorative line above footer
      doc.setDrawColor(0, 117, 71);
      doc.setLineWidth(0.1);
      doc.line(
        0,
        doc.internal.pageSize.height - 20,
        doc.internal.pageSize.width,
        doc.internal.pageSize.height - 20
      );
    }
    
    // Save the PDF
    const filename = `${reportType}-${formatDate(new Date())}.pdf`;
    doc.save(filename);
    showSnackbar('PDF downloaded successfully');
  } catch (error) {
    handleError('Error generating PDF.');
  }
};

  const getTableHeaders = () => {
    switch (reportType) {
      case 'branch-report':
        return ['Branch', 'Total Liters Purchased', 'Total Liters Sold', 'Remaining Inventory'];
      case 'branch-revenue':
        return ['Branch', 'Total Revenue (RWF)'];
      case 'monthly-sales':
        return ['Branch', 'Month', 'Total Liters Sold', 'Total Revenue (RWF)'];
      case 'inventory-report':
        return ['Branch', 'Fuel Type', 'Available Liters'];
      default:
        return [];
    }
  };

  const formatCellValue = (value, columnIndex) => {
    if (typeof value === 'number') {
      if (reportType === 'branch-revenue' || (reportType === 'monthly-sales' && columnIndex === 3)) {
        return formatCurrency(value);
      }
      return formatNumber(value);
    }
    return value;
  };

  const LoadingSpinner = () => (
    <div className="flex justify-center items-center">
      <div className="w-6 h-6 border-2 border-t-2 border-gray-200 rounded-full animate-spin" 
           style={{ borderTopColor: '#007547' }}></div>
    </div>
  );

  const renderTableRows = () => {
    if (loading) {
      return (
        <tr>
          <td colSpan={getTableHeaders().length} className="text-center py-8">
            <LoadingSpinner />
          </td>
        </tr>
      );
    }

    if (!reportData.length) {
      return (
        <tr>
          <td colSpan={getTableHeaders().length} className="text-center py-8 text-gray-500">
            No data available for the selected criteria.
          </td>
        </tr>
      );
    }

    return reportData.map((row, index) => (
      <tr key={index} className="border-b hover:bg-gray-50 transition-colors">
        {Object.values(row).map((value, cellIndex) => (
          <td key={cellIndex} className="px-4 py-3 text-center">
            {formatCellValue(value, cellIndex)}
          </td>
        ))}
      </tr>
    ));
  };

  // Custom Snackbar Component
  const Snackbar = ({ open, message, severity }) => {
    if (!open) return null;

    const bgColor = severity === 'error' ? 'bg-red-500' : 
                   severity === 'warning' ? 'bg-yellow-500' : 
                   severity === 'success' ? 'bg-green-500' : 'bg-blue-500';

    return (
      <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg text-white ${bgColor} transition-opacity duration-300`}>
        {message}
      </div>
    );
  };

  // Custom DatePicker Styles
  const datePickerStyles = {
    input: `w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-transparent`,
    wrapper: `relative`,
    calendar: {
      position: 'absolute',
      right: '12px',
      top: '50%',
      transform: 'translateY(-50%)',
      color: '#718096',
      pointerEvents: 'none'
    }
  };
  const CustomDatePickerInput = React.forwardRef(({ value, onClick, placeholder }, ref) => (
    <div className="relative">
      <input
        ref={ref}
        onClick={onClick}
        value={value}
        placeholder={placeholder}
        readOnly
        className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-gray-700 
                   shadow-sm transition duration-150 ease-in-out
                   hover:border-green-400 focus:outline-none focus:ring-2 focus:ring-green-200
                   placeholder-gray-400"
      />
      <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
    </div>
  ));
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
          <div className="flex items-center gap-6 border-b border-gray-100 pb-6">
            <img src={CompanyLogo} alt="Company Logo" className="h-16 w-auto" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Management Reports
              </h1>
              <p className="text-gray-500 mt-1">
                Generate and analyze detailed reports for your business
              </p>
            </div>
          </div>
        </div>

        {/* Controls Section */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
          {/* Date Range Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Start Date</label>
              <DatePicker
  selected={startDate}
  onChange={(date) => {
    console.log('Selected Date:', date); // Log the raw date
    setStartDate(date);
  }}
  customInput={<CustomDatePickerInput />}
  placeholderText="Select start date"
  dateFormat="yyyy-MM-dd"
/>

            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">End Date</label>
              <DatePicker
                selected={endDate}
                onChange={setEndDate}
                customInput={<CustomDatePickerInput />}
                placeholderText="Select end date"
                dateFormat="yyyy-MM-dd"
                minDate={startDate}
                className="w-full"
              />
            </div>

            <div className="flex items-end gap-4">
              <button
                onClick={fetchDateRangeReport}
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg
                         bg-green-600 text-white font-medium transition-all
                         hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500
                         disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? <Loader className="animate-spin" size={18} /> : null}
                {loading ? 'Loading...' : 'Generate Report'}
              </button>

              <button
                onClick={fetchOverallReport}
                disabled={loading}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg
                         border border-gray-200 text-gray-600 font-medium
                         hover:bg-gray-50 transition-all focus:outline-none focus:ring-2
                         focus:ring-gray-200 disabled:opacity-50"
              >
                <RefreshCcw size={18} />
                Reset
              </button>
            </div>
          </div>

          {/* Report Types */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {REPORT_TYPES.map(({ id, label, icon }) => (
              <button
                key={id}
                onClick={() => setReportType(id)}
                className={`flex items-center gap-3 px-6 py-4 rounded-lg font-medium
                         transition-all duration-200 ${
                  reportType === id
                    ? 'bg-green-600 text-white shadow-lg scale-[1.02]'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span className="text-xl">{icon}</span>
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-8">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-green-600">
                  {getTableHeaders().map((header, index) => (
                    <th key={index} className="px-6 py-4 text-left text-white font-semibold">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {renderTableRows()}
              </tbody>
            </table>
          </div>
        </div>

        {/* Download Button */}
        <button
          onClick={downloadPDF}
          disabled={loading || !reportData.length}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4
                   bg-green-600 text-white font-medium rounded-lg transition-all
                   hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500
                   disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download size={20} />
          Download PDF Report
        </button>

        {/* Snackbar */}
        <Snackbar
          open={snackbar.open}
          message={snackbar.message}
          severity={snackbar.severity}
        />
      </div>
    </div>
  );
};

// Snackbar Component with enhanced styling
const Snackbar = ({ open, message, severity }) => {
  if (!open) return null;

  const styles = {
    success: 'bg-green-600',
    error: 'bg-red-600',
    warning: 'bg-yellow-600',
    info: 'bg-blue-600'
  };

  return (
    <div className={`fixed top-4 right-4 z-50 transform transition-all duration-300
                    ${open ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'}`}>
      <div className={`${styles[severity]} text-white px-6 py-4 rounded-lg shadow-lg
                      flex items-center gap-3 min-w-[300px]`}>
        <span className="flex-1">{message}</span>
      </div>
    </div>
  );
};

export default ReportsPage;