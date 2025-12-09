import { createContext, useContext, useState } from 'react';

const ReportContext = createContext();

export const useReport = () => useContext(ReportContext);

export const ReportProvider = ({ children }) => {
  const [recentReports, setRecentReports] = useState([]);

  const addReport = (report) => {
    setRecentReports(prev => [report, ...prev.slice(0, 9)]);
  };

  const hasRecentlyReported = (contentId, contentType) => {
    return recentReports.some(
      r => r.contentId === contentId && r.contentType === contentType
    );
  };

  return (
    <ReportContext.Provider value={{
      addReport,
      hasRecentlyReported,
      recentReports
    }}>
      {children}
    </ReportContext.Provider>
  );
};