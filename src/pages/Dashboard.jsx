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
} from "recharts";
import axios from "axios";
import { API_BASE_URL } from "../api";

// CSS styles
const styles = {
  section: {
    padding: "2rem",
    backgroundColor: "#f9fafb",
    borderRadius: "12px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  title: {
    fontSize: "1.875rem",
    fontWeight: "bold",
    color: "#059669",
    marginBottom: "2rem",
  },
  topRow: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "1.5rem",
    marginBottom: "2rem",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    padding: "1.5rem",
    transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1rem",
  },
  cardTitle: {
    color: "#059669",
    fontSize: "1.1rem",
    fontWeight: "600",
  },
  cardIcon: {
    color: "#059669",
    fontSize: "1.5rem",
  },
  cardContent: {
    textAlign: "center",
  },
  cardValue: {
    color: "#111827",
    fontSize: "1.8rem",
    fontWeight: "700",
    marginBottom: "0.5rem",
  },
  cardDescription: {
    color: "#6B7280",
    fontSize: "0.9rem",
  },
  chartSection: {
    backgroundColor: "#ffffff",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    padding: "1.5rem",
    marginTop: "2rem",
  },
  chartHeader: {
    textAlign: "center",
    color: "#059669",
    fontSize: "1.3rem",
    fontWeight: "600",
    marginBottom: "1rem",
  },
};

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
    return new Intl.NumberFormat("en-US", { notation: "compact", compactDisplay: "short" }).format(number);
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
      const totalAvailableFuel = response.data.available_fuel;
      setAvailableFuel(totalAvailableFuel || 0);
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
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <div
          style={{
            animation: "spin 1s linear infinite",
            border: "4px solid #f3f3f3",
            borderTop: "4px solid #059669",
            borderRadius: "50%",
            width: "50px",
            height: "50px",
          }}
        ></div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          backgroundColor: "#FEE2E2",
          border: "1px solid #F87171",
          color: "#B91C1C",
          padding: "1rem",
          borderRadius: "0.375rem",
          margin: "1rem",
        }}
      >
        <strong>Error!</strong> {error}
      </div>
    );
  }

  return (
    <div style={styles.section}>
      <h1 style={styles.title}>Fuel Station Dashboard</h1>
      <div style={styles.topRow}>
        <Card
          title="Total Fuel Sold"
          value={`${numberFormatter(totalFuelSold)} Liters`}
          icon={<IoMdCash />}
          description="Fuel sold to customers"
        />
        <Card
          title="Total Revenue"
          value={currencyFormatter.format(totalRevenue)}
          icon={<IoMdCash />}
          description="Revenue from fuel sales"
        />
        <Card
          title="Available Fuel"
          value={`${numberFormatter(availableFuel)} Liters`}
          icon={<MdTimer />}
          description="Fuel available in stock"
        />
        <Card
          title="Total Purchase Costs"
          value={currencyFormatter.format(totalPurchaseCosts)}
          icon={<IoMdCash />}
          description="Cost of fuel purchased"
        />
      </div>

      <ChartSection
        title="Fuel Sold by Type"
        data={fuelSoldByType}
        dataKey="fuel_type"
        valueKey="fuel_sold"
        numberFormatter={numberFormatter}
      />

      <ChartSection
        title="Fuel Sold by Date"
        data={fuelSoldByDate}
        dataKey="sale_date"
        valueKey="fuel_sold"
        numberFormatter={numberFormatter}
      />
    </div>
  );
}

const Card = ({ title, value, icon, description }) => (
  <div style={styles.card}>
    <div style={styles.cardHeader}>
      <h4 style={styles.cardTitle}>{title}</h4>
      <div style={styles.cardIcon}>{icon}</div>
    </div>
    <div style={styles.cardContent}>
      <h2 style={styles.cardValue}>{value}</h2>
      <p style={styles.cardDescription}>{description}</p>
    </div>
  </div>
);

const ChartSection = ({ title, data, dataKey, valueKey, numberFormatter }) => (
  <div style={styles.chartSection}>
    <h3 style={styles.chartHeader}>{title}</h3>
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={dataKey} />
        <YAxis tickFormatter={(tick) => numberFormatter(tick)} />
        <Tooltip formatter={(value) => numberFormatter(value)} />
        <Legend />
        <Line type="monotone" dataKey={valueKey} stroke="#10B981" strokeWidth={2} dot={{ r: 4 }} />
      </LineChart>
    </ResponsiveContainer>
  </div>
);
