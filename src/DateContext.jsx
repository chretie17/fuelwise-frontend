import React, { createContext } from 'react';

// Create the context
export const DateContext = createContext();

// Date utility function to get local date and time
export const getLocalDateTime = () => {
  const now = new Date();
  const offsetMs = now.getTimezoneOffset() * 60 * 1000;
  const localDate = new Date(now.getTime() - offsetMs);
  return localDate.toISOString().slice(0, 19); // Returns "YYYY-MM-DDTHH:MM:SS"
};

// Function to format UTC dates into local date strings (YYYY-MM-DD format)
export const toLocalDateString = (utcDate) => {
  const date = new Date(utcDate);
  const offsetMs = date.getTimezoneOffset() * 60 * 1000;
  const localDate = new Date(date.getTime() - offsetMs);
  return localDate.toISOString().split('T')[0]; // Returns "YYYY-MM-DD"
};

// Date Context Provider component
const DateProvider = ({ children }) => {
  const value = {
    getLocalDateTime,
    toLocalDateString,
  };

  return <DateContext.Provider value={value}>{children}</DateContext.Provider>;
};

export default DateProvider;
