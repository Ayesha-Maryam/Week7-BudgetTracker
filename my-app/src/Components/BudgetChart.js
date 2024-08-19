import React, { useState, useEffect } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import annotationPlugin from 'chartjs-plugin-annotation';
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns';
import './BudgetChart.css';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    annotationPlugin
);

export default function BudgetChart({ entries, budgetLimit }) {
    const [filteredEntries, setFilteredEntries] = useState([]);
    const [filter, setFilter] = useState('last12Months');

    useEffect(() => {
        const today = new Date();
        let startDate;

        switch (filter) {
            case 'lastMonth':
                startDate = startOfMonth(subMonths(today, 0));
                break;
            case 'last6Months':
                startDate = startOfMonth(subMonths(today, 5));
                break;
            case 'last12Months':
            default:
                startDate = startOfMonth(subMonths(today, 11));
                break;
        }

        const filteredData = entries
            .filter(entry => {
                const entryDate = new Date(entry.date);
                return entryDate >= startDate && entryDate <= endOfMonth(today);
            })
            .map(entry => ({
                ...entry,
                date: format(new Date(entry.date), 'yyyy-MM-dd')
            }))
            .sort((a, b) => new Date(a.date) - new Date(b.date));

        const dateMap = new Map();

        filteredData.forEach(entry => {
            if (dateMap.has(entry.date)) {
                dateMap.set(entry.date, dateMap.get(entry.date) + entry.price);
            } else {
                dateMap.set(entry.date, entry.price);
            }
        });

        const cumulativeData = [];
        let cumulativeSum = 0;

        dateMap.forEach((price, date) => {
            cumulativeSum += price;
            cumulativeData.push({ date, price: cumulativeSum });
        });

        setFilteredEntries(cumulativeData);
    }, [entries, filter]);

    const data = {
        labels: filteredEntries.map(entry => entry.date),
        datasets: [
            {
                label: 'Budget',
                data: filteredEntries.map(entry => entry.price),
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 2,
                fill: false,
            },
        ],
    };

    const options = {
        scales: {
            x: {
              label: 'Date',
              title: {
                display: true,
                text: 'Date', 
            },
                ticks: {
                    callback: function (value, index) {
                        const date = new Date(filteredEntries[index].date);
                        return `${date.getDate()}/${date.getMonth() + 1}`;
                    }
                },
            },
            y: {
              title: {
                display: true,
                text: 'Budget', 
            },
                beginAtZero: true,
            },
        },
        plugins: {
            annotation: {
                annotations: {
                    budgetLimitLine: {
                        type: 'line',
                        yMin: budgetLimit,
                        yMax: budgetLimit,
                        borderColor: 'red',
                        borderWidth: 2,
                        label: {
                            content: `Budget Limit: ${budgetLimit}`,
                            enabled: true,
                            position: 'end',
                            backgroundColor: 'rgba(255, 99, 132, 0.8)',
                        },
                    },
                },
            },
            legend: {
                display: true,
            },
        },
    };

    return (
        <div>
            <div className='filter-menu'>
                
                <button className='filter-btn' onClick={(e) => setFilter('lastMonth')}>Last Month</button>
                <button className='filter-btn' onClick={(e) => setFilter('last6Months')}>Last 6 Month</button>
                <button className='filter-btn' onClick={(e) => setFilter('last12Months')}>Last 12 Month</button>
                
            </div>

            <Line data={data} options={options} />
        </div>
    );
}
