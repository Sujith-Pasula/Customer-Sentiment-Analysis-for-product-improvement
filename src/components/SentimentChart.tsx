import React from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js';
import { SentimentScore } from '../types';

ChartJS.register(ArcElement, Tooltip, Legend);

interface SentimentChartProps {
  sentiment: SentimentScore;
}

const SentimentChart: React.FC<SentimentChartProps> = ({ sentiment }) => {
  const data = {
    labels: ['Positive', 'Neutral', 'Negative'],
    datasets: [
      {
        data: [
          Math.round(sentiment.positive * 100),
          Math.round(sentiment.neutral * 100),
          Math.round(sentiment.negative * 100)
        ],
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(255, 99, 132, 0.6)'
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(255, 99, 132, 1)'
        ],
        borderWidth: 1,
      },
    ],
  };

  const options: ChartOptions<'pie'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right' as const,
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.label}: ${context.raw}%`;
          }
        }
      }
    }
  };

  return (
    <div className="w-full h-48">
      <Pie data={data} options={options} />
    </div>
  );
};

export default SentimentChart;