import React, { useEffect, useState } from "react";
import { IoMdCash } from "react-icons/io";
import { MdTimer } from "react-icons/md";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Area,
  AreaChart,
} from "recharts";
import axios from "axios";
import { API_BASE_URL } from "../api";

export default function Dashboard() {
  const [totalFuelSold, setTotalFuelSold] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [availableFuel, setAvailableFuel] = useState(0);
  const [totalPurchaseCosts, setTotalPurchaseCosts] = useState(0);
  const [fuelSoldByDate, setFuelSoldByDate] = useState([]);
  const [fuelSoldByType, setFuelSoldByType] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const currencyFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "RWF",
    minimumFractionDigits: 2,
  });

  const numberFormatter = (number) => {
    return new Intl.NumberFormat("en-US", {
      notation: "compact",
      compactDisplay: "short",
    }).format(number);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      await Promise.all([
        fetchTotalFuelSold(),
        fetchTotalRevenue(),
        fetchAvailableFuel(),
        fetchTotalPurchaseCosts(),
        fetchFuelSoldByDate(),
        fetchFuelSoldByType(),
      ]);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("An error occurred while fetching data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const fetchTotalFuelSold = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/dashboard/total-fuel-sold`);
      setTotalFuelSold(response.data.total_fuel_sold || 0);
    } catch (error) {
      console.error("Error fetching total fuel sold:", error);
    }
  };

  const fetchTotalRevenue = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/dashboard/total-revenue`);
      setTotalRevenue(response.data.total_revenue || 0);
    } catch (error) {
      console.error("Error fetching total revenue:", error);
    }
  };

  const fetchAvailableFuel = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/dashboard/available-fuel`);
      setAvailableFuel(response.data.available_fuel || 0);
    } catch (error) {
      console.error("Error fetching available fuel:", error);
    }
  };

  const fetchTotalPurchaseCosts = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/dashboard/total-purchase-costs`);
      setTotalPurchaseCosts(response.data.total_purchase_costs || 0);
    } catch (error) {
      console.error("Error fetching total purchase costs:", error);
    }
  };

  const fetchFuelSoldByDate = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/dashboard/fuel-sales-over-time`);
      const formattedData = response.data.map((item) => ({
        ...item,
        sale_date: new Date(item.sale_date).toLocaleDateString(),
      }));
      setFuelSoldByDate(formattedData);
    } catch (error) {
      console.error("Error fetching fuel sold by date:", error);
    }
  };

  const fetchFuelSoldByType = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/dashboard/top-performing-fuel-types`);
      setFuelSoldByType(response.data);
    } catch (error) {
      console.error("Error fetching fuel sold by type:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="p-8 bg-white rounded-3xl shadow-xl">
          <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
        <div className="w-full max-w-2xl p-8 bg-red-50 border-2 border-red-200 rounded-3xl shadow-lg">
          <div className="flex items-center space-x-3 text-red-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-bold text-lg">Error!</span>
          </div>
          <p className="mt-2 text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-emerald-50 p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
          <div className="space-y-2">
            <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-500 bg-clip-text text-transparent">
              Fuel Station Dashboard
            </h1>
            <p className="text-gray-600">Real-time monitoring and analytics</p>
          </div>
          <button 
            onClick={fetchData}
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 font-medium w-full lg:w-auto text-center"
          >
            Refresh Data
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Fuel Sold"
            value={`${numberFormatter(totalFuelSold)} Liters`}
            icon={<IoMdCash className="w-7 h-7" />}
            description="Fuel sold to customers"
            trend="+12.5%"
            trendUp={true}
          />
          <StatsCard
            title="Total Revenue"
            value={currencyFormatter.format(totalRevenue)}
            icon={<IoMdCash className="w-7 h-7" />}
            description="Revenue from fuel sales"
            trend="+8.3%"
            trendUp={true}
          />
          <StatsCard
            title="Available Fuel"
            value={`${numberFormatter(availableFuel)} Liters`}
            icon={<MdTimer className="w-7 h-7" />}
            description="Fuel available in stock"
            trend="-2.4%"
            trendUp={false}
          />
          <StatsCard
            title="Total Purchase Costs"
            value={currencyFormatter.format(totalPurchaseCosts)}
            icon={<IoMdCash className="w-7 h-7" />}
            description="Cost of fuel purchased"
            trend="+5.7%"
            trendUp={true}
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ChartCard
            title="Fuel Sold by Type"
            data={fuelSoldByType}
            dataKey="fuel_type"
            valueKey="fuel_sold"
            numberFormatter={numberFormatter}
          />
          <ChartCard
            title="Fuel Sold by Date"
            data={fuelSoldByDate}
            dataKey="sale_date"
            valueKey="fuel_sold"
            numberFormatter={numberFormatter}
          />
        </div>
      </div>
    </div>
  );
}

const StatsCard = ({ title, value, icon, description, trend, trendUp }) => (
  <div className="bg-white rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 lg:p-8 border border-gray-100">
    <div className="flex justify-between items-start mb-6">
      <div className="p-4 bg-emerald-50 rounded-2xl">
        <div className="text-emerald-600">{icon}</div>
      </div>
      <span className={`px-3 py-1.5 text-sm font-semibold rounded-xl flex items-center ${
        trendUp ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
      }`}>
        {trendUp ? (
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        ) : (
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
          </svg>
        )}
        {trend}
      </span>
    </div>
    <div className="space-y-3">
      <h4 className="text-lg text-gray-600 font-medium">{title}</h4>
      <div className="text-2xl lg:text-3xl font-bold text-gray-900">{value}</div>
      <p className="text-sm text-gray-500">{description}</p>
    </div>
  </div>
);

const ChartCard = ({ title, data, dataKey, valueKey, numberFormatter }) => (
  <div className="bg-white rounded-3xl shadow-lg p-6 lg:p-8 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
    <div className="mb-8">
      <h3 className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-500 bg-clip-text text-transparent">
        {title}
      </h3>
      <p className="text-gray-500 mt-2">Performance metrics</p>
    </div>
    

    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        >
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#059669" stopOpacity={0.2}/>
              <stop offset="95%" stopColor="#059669" stopOpacity={0}/>
            </linearGradient>
          </defs>
          
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
          
          <XAxis
            dataKey={dataKey}
            tick={{ fill: '#6B7280', fontSize: 12 }}
            axisLine={{ stroke: '#D1D5DB' }}
            tickLine={{ stroke: '#D1D5DB' }}
            dy={10}
          />
          
          <YAxis
            tickFormatter={(tick) => numberFormatter(tick)}
            domain={[0, 'auto']}
            tick={{ fill: '#6B7280', fontSize: 12 }}
            axisLine={{ stroke: '#D1D5DB' }}
            tickLine={{ stroke: '#D1D5DB' }}
            dx={-10}
          />
          
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: 'none',
              borderRadius: '1rem',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
              padding: '1rem',
            }}
            formatter={(value) => [numberFormatter(value), 'Value']}
            labelStyle={{ color: '#374151', fontWeight: 'bold' }}
            cursor={{ stroke: '#059669', strokeWidth: 1, strokeDasharray: '5 5' }}
          />
          
          <Legend
            wrapperStyle={{
              paddingTop: '2rem',
            }}
            formatter={(value) => (
              <span className="text-gray-600 font-medium">{value}</span>
            )}
          />
          
          <Area
            type="monotone"
            dataKey={valueKey}
            stroke="#059669"
            strokeWidth={3}
            fill="url(#colorValue)"
            dot={{ r: 4, fill: '#059669', strokeWidth: 2, stroke: '#fff' }}
            activeDot={{ 
              r: 8, 
              fill: '#059669',
              strokeWidth: 4,
              stroke: '#fff'
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>

    <div className="grid grid-cols-3 gap-4 mt-6 p-4 bg-emerald-50 rounded-2xl">
      <div className="text-center">
        
      <div className="grid grid-cols-3 gap-4 mt-6 p-4 bg-emerald-50 rounded-2xl">
      
      
    </div>
  </div>
  </div>
  </div>
);
