import React from "react";

const SummarySection = ({ summary }) => {
  if (!summary) return null;

  return (
    <div className="bg-white rounded-2xl shadow p-6 mt-6">
      <h3 className="text-2xl font-semibold text-neutral-800 mb-4">AI Summary</h3>
      <p className="text-neutral-700 whitespace-pre-wrap">{summary}</p>
    </div>
  );
};

export default SummarySection;
