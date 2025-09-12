'use client';

import React from 'react';
import { Card } from '@/components/ui/card';

export const RiskAnalysis = () => {
  // Mock data for risk analysis
  const riskData = {
    riskLevel: 'Medium',
    riskScore: 65,
    volatility: 'High',
    maxLossStreak: 5,
    recommendedBet: 20.00,
    bankrollPercentage: 2.5,
  };

  const riskFactors = [
    { factor: 'Bet Size', level: 'High', description: 'Bets are 5% of bankroll on average' },
    { factor: 'Game Selection', level: 'Medium', description: 'Mix of high and low volatility games' },
    { factor: 'Session Duration', level: 'Low', description: 'Average session 45 minutes' },
    { factor: 'Frequency', level: 'Medium', description: 'Playing 4-5 times per week' },
    { factor: 'Emotional Control', level: 'High', description: 'Consistent betting patterns' },
  ];

  const recommendations = [
    'Consider reducing bet size to 2-3% of bankroll',
    'Diversify game selection to include more low volatility options',
    'Set daily loss limits to manage downside risk',
    'Take regular breaks to maintain emotional control',
    'Track your wins and losses more consistently',
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 bg-gray-800 border-gray-700">
          <h3 className="text-gray-400 text-sm mb-1">Risk Level</h3>
          <p className={`text-2xl font-bold ${
            riskData.riskLevel === 'Low' ? 'text-green-400' : 
            riskData.riskLevel === 'Medium' ? 'text-yellow-400' : 'text-red-400'
          }`}>
            {riskData.riskLevel}
          </p>
        </Card>
        
        <Card className="p-4 bg-gray-800 border-gray-700">
          <h3 className="text-gray-400 text-sm mb-1">Risk Score</h3>
          <p className="text-2xl font-bold text-white">{riskData.riskScore}/100</p>
        </Card>
        
        <Card className="p-4 bg-gray-800 border-gray-700">
          <h3 className="text-gray-400 text-sm mb-1">Recommended Bet</h3>
          <p className="text-2xl font-bold text-purple-400">${riskData.recommendedBet.toFixed(2)}</p>
        </Card>
      </div>

      <Card className="p-6 bg-gray-800 border-gray-700">
        <h2 className="text-xl font-semibold text-white mb-4">Risk Factors</h2>
        <div className="space-y-4">
          {riskFactors.map((item, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
              <div>
                <p className="text-white font-medium">{item.factor}</p>
                <p className="text-gray-400 text-sm">{item.description}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                item.level === 'Low' ? 'bg-green-500/20 text-green-400' : 
                item.level === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'
              }`}>
                {item.level}
              </span>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6 bg-gray-800 border-gray-700">
        <h2 className="text-xl font-semibold text-white mb-4">Recommendations</h2>
        <ul className="space-y-2">
          {recommendations.map((rec, index) => (
            <li key={index} className="flex items-start">
              <span className="text-purple-400 mr-2">•</span>
              <span className="text-gray-300">{rec}</span>
            </li>
          ))}
        </ul>
      </Card>

      <Card className="p-6 bg-gray-800 border-gray-700">
        <h2 className="text-xl font-semibold text-white mb-4">Bankroll Management</h2>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-400">Current Bankroll</span>
            <span className="text-white">$1,250.00</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Percentage at Risk</span>
            <span className="text-yellow-400">{riskData.bankrollPercentage}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Max Recommended Bet</span>
            <span className="text-green-400">${riskData.recommendedBet.toFixed(2)}</span>
          </div>
          <div className="pt-3">
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-green-400 via-yellow-400 to-red-400 h-2 rounded-full" 
                style={{ width: `${Math.min(riskData.bankrollPercentage * 20, 100)}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>Safe</span>
              <span>Moderate</span>
              <span>Risky</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};