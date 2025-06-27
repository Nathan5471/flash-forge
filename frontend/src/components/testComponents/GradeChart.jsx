import { Doughnut } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip } from 'chart.js';

Chart.register(ArcElement, Tooltip);

export default function GradeChart({ grade }) {
    const data = {
        datasets: [{
            data: [grade, 100 - grade],
            backgroundColor: ['green', 'red'],
            borderWidth: 0,
            cutout: '70%',
        },],
    };

    const options = {
        cutout: '70%',
        plugins: {
            tooltip: { enabled: false },
        },
    };

    return (
        <div className="relative w-64 h-64">
            <Doughnut data={data} options={options} />
            <div className="absolute inset-0 flex items-center justify-center">
                {grade.toFixed(2)}%
            </div>
        </div>
    )
}