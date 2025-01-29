import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../api";
import { Loader2, FileDown, DollarSign, Droplet, Building2 } from "lucide-react";

class AdminFuelSales extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sales: [],
      loading: true,
      error: ""
    };
  }

  componentDidMount() {
    this.fetchSales();
  }

  fetchSales = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/fuel-sales/admin/sales`);
      this.setState({ sales: response.data, loading: false });
    } catch (err) {
      console.error("Error fetching sales:", err);
      this.setState({ error: "Failed to load sales data.", loading: false });
    }
  };

  handleExportPDF = async () => {
    try {
      const printWindow = window.open('', '', 'width=1000,height=800');
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Fuel Sales Report</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #007547; color: white; }
            .header { margin-bottom: 20px; }
            .header h1 { color: #007547; }
            @media print {
              button { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Fuel Sales Report</h1>
            <p>Generated on: ${new Date().toLocaleDateString()}</p>
          </div>
          ${document.querySelector('.sales-table').outerHTML}
          <button onclick="window.print();window.close();" style="margin-top: 20px; padding: 10px 20px; background: #007547; color: white; border: none; border-radius: 4px; cursor: pointer;">
            Print Report
          </button>
        </body>
        </html>
      `;
      
      printWindow.document.write(htmlContent);
      printWindow.document.close();
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  getTotalRevenue = () => {
    return this.state.sales.reduce((sum, sale) => sum + Number(sale.total_revenue), 0).toFixed(2);
  };

  getTotalLiters = () => {
    return this.state.sales.reduce((sum, sale) => sum + Number(sale.liters), 0).toFixed(2);
  };

  getUniqueBranches = () => {
    return new Set(this.state.sales.map(sale => sale.branch_name)).size;
  };

  renderStatsCard = (title, value, icon, bgColor) => {
    return (
      <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-gray-500 mb-1">{title}</p>
            <h3 className="text-2xl font-bold">{value}</h3>
          </div>
          <div className={`p-3 ${bgColor} rounded-lg`}>
            {icon}
          </div>
        </div>
      </div>
    );
  };

  renderHeader = () => {
    return (
      <div className="mb-8 flex flex-col gap-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-[#007547]">Admin Fuel Sales</h1>
            <p className="text-gray-500 mt-1">Manage and monitor your fuel sales data</p>
          </div>
          <button
            onClick={this.handleExportPDF}
            className="flex items-center gap-2 px-6 py-3 bg-[#007547] text-white rounded-lg hover:bg-[#006037] transition-all transform hover:scale-105 shadow-lg"
          >
            <FileDown className="w-5 h-5" />
            Export PDF
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {this.renderStatsCard(
            "Total Revenue",
            `Rwf ${this.getTotalRevenue()}`,
            <DollarSign className="w-6 h-6 text-[#007547]" />,
            "bg-green-100"
          )}
          {this.renderStatsCard(
            "Total Liters Sold",
            `${this.getTotalLiters()}L`,
            <Droplet className="w-6 h-6 text-[#007547]" />,
            "bg-blue-100"
          )}
          {this.renderStatsCard(
            "Active Branches",
            this.getUniqueBranches(),
            <Building2 className="w-6 h-6 text-[#007547]" />,
            "bg-purple-100"
          )}
        </div>
      </div>
    );
  };

  renderTable = () => {
    return (
      <div className="overflow-x-auto">
        <table className="w-full border-collapse rounded-lg overflow-hidden sales-table">
          <thead className="bg-[#007547] text-white">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold">Fuel Type</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Liters</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Total Revenue</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Price/Liter</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Sale Date</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Payment Mode</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Branch</th>
            </tr>
          </thead>
          <tbody>
            {this.state.sales.map((sale) => (
              <tr 
                key={sale.id} 
                className="border-b hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-4 text-sm text-gray-700">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {sale.fuel_type}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-700 font-medium">
                  {Number(sale.liters).toFixed(2)} L
                </td>
                <td className="px-6 py-4 text-sm text-gray-700 font-medium">
                  RWF {Number(sale.total_revenue).toFixed(2)}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  RWF {Number(sale.sale_price_per_liter).toFixed(2)}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">{sale.sale_date}</td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {sale.payment_mode}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">{sale.branch_name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  render() {
    const { loading, error } = this.state;

    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto p-6">
          {this.renderHeader()}
          
          <div className="bg-white rounded-lg shadow-lg p-6">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-[#007547]" />
                <span className="ml-3 text-gray-700 text-lg">Loading sales data...</span>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-600 font-semibold text-lg">{error}</p>
                <button
                  onClick={this.fetchSales}
                  className="mt-4 px-4 py-2 bg-[#007547] text-white rounded-lg hover:bg-[#006037]"
                >
                  Try Again
                </button>
              </div>
            ) : (
              this.renderTable()
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default AdminFuelSales;