import { useEffect, useState } from 'react';

const withReportProtection = (WrappedComponent) => {
  return function ProtectedReportButton(props) {
    const [canReport, setCanReport] = useState(true);
    
    useEffect(() => {
      // Vérifier si l'utilisateur a déjà signalé ce contenu récemment
      const checkReportStatus = () => {
        const reports = JSON.parse(localStorage.getItem('user_reports') || '[]');
        const recentReport = reports.find(
          r => r.contentId === props.contentId && 
               r.contentType === props.contentType &&
               Date.now() - r.timestamp < 24 * 60 * 60 * 1000 // 24 heures
        );
        setCanReport(!recentReport);
      };
      
      checkReportStatus();
    }, [props.contentId, props.contentType]);

    if (!canReport) {
      return (
        <button
          disabled
          className="px-3 py-2 text-sm text-gray-400 cursor-not-allowed"
          title="Vous avez déjà signalé ce contenu récemment"
        >
          <FiFlag className="w-4 h-4" />
        </button>
      );
    }

    return <WrappedComponent {...props} />;
  };
};

// Utilisation
export default withReportProtection(ReportButton);