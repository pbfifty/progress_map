import React, { useState } from 'react';
import CustomTreemap from './TreeMap';
import usEconomy from './market_hierarchy.json';
import vcFunding from './market_hierarchy_with_investment_sizes.json';
import competitionRatio from './market_hierarchy_op_ratio.json';

const example_healthcare_heirarchy = [
    { "id": "HealthCare", "parent": null, "size": null },
    { "id": "Therapeutics", "parent": "HealthCare", "size": null },
        { "id": "Cancer", "parent": "Therapeutics", "size": null },
            { "id": "Lung cancer", "parent": "Cancer", "size": 300 },
            { "id": "Breast cancer", "parent": "Cancer", "size": 500 },

        { "id": "Autoimmune", "parent": "Therapeutics", "size": null },
            { "id": "Rheumatoid arthritis", "parent": "Autoimmune", "size": 300 },
            { "id": "Other Autoimmune", "parent": "Autoimmune", "size": 400 },

        { "id": "Rare disease", "parent": "Therapeutics", "size": null },
            { "id": "Genetic disorders", "parent": "Rare disease", "size": 300 },
            { "id": "Other Rare disease", "parent": "Rare disease", "size": 200 },

    { "id": "Diagnostics", "parent": "HealthCare", "size": null },
        { "id": "Genetic sequencing screen", "parent": "Diagnostics", "size": 600 },
        { "id": "Imaging", "parent": "Diagnostics", "size": null },
            { "id": "MRI", "parent": "Imaging", "size": 500 },
            { "id": "Other Imaging", "parent": "Imaging", "size": 200 },
        { "id": "Other Diagnostics", "parent": "Diagnostics", "size": 200 },

    { "id": "Drug development", "parent": "HealthCare", "size": null },
        { "id": "Equipment", "parent": "Drug development", "size": 400 },
        { "id": "Materials", "parent": "Drug development", "size": 300 },
        { "id": "CRO type stuff", "parent": "Drug development", "size": null },
            { "id": "Vivariums", "parent": "CRO type stuff", "size": 100 },
            { "id": "Other CRO type stuff", "parent": "CRO type stuff", "size": 100 },
        
        { "id": "Clinical Trials", "parent": "Drug development", "size": null },
            { "id": "Phase I", "parent": "Clinical Trials", "size": 50 },
            { "id": "Phase II", "parent": "Clinical Trials", "size": 50 },
    
        { "id": "Second Clinical Trials", "parent": "Drug development", "size": null },
            { "id": "Phase B", "parent": "Second Clinical Trials", "size": 70 },
            { "id": "Phase C", "parent": "Second Clinical Trials", "size": 50 },

    { "id": "Health Tech", "parent": "HealthCare", "size": null },
        { "id": "Telemedicine", "parent": "Health Tech", "size": 300 },
        { "id": "EHR Systems", "parent": "Health Tech", "size": 200 },
]

export function MapTabs({ width, height }) {
  const [activeTab, setActiveTab] = useState('usEconomy');

  const getActiveData = () => {
    switch (activeTab) {
      case 'usEconomy':
        return usEconomy;
      case 'vcFunding':
        return vcFunding;
      case 'competitionRatio':
        return competitionRatio;
      default:
        return usEconomy;
    }
  };

  const getUnitType = () => {
    switch (activeTab) {
      case 'usEconomy':
        return 'dollars';
      case 'vcFunding':
        return 'dollars';
      case 'competitionRatio':
        return 'ratio';
      default:
        return 'dollars';
    }
  }

  return (
    <div>
      <div>
        {/* Treemap Visualization */}
        <CustomTreemap width={width} height={height} hierarchyData={getActiveData()} unitType={getUnitType()} />
      </div>
      <div>
        {/* Tab Headers */}
        <button className={`control-button ${activeTab === 'usEconomy' ? 'active' : ''}`} onClick={() => setActiveTab('usEconomy')}>US Economy</button>
        <button className={`control-button ${activeTab === 'vcFunding' ? 'active' : ''}`} onClick={() => setActiveTab('vcFunding')}>Dollars Invested</button>
        <button className={`control-button ${activeTab === 'competitionRatio' ? 'active' : ''}`} onClick={() => setActiveTab('competitionRatio')}>Competition Ratio</button>
      </div>
    </div>
  );
}

export default MapTabs;