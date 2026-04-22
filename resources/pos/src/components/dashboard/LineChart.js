import React from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { connect } from "react-redux";
import { weekSalePurchases } from "../../store/action/weeksalePurchaseAction";
import { yearlyTopProduct } from "../../store/action/yearlyTopProductAction";
import { placeholderText } from "../../shared/sharedMethod";

const LineChart = (props) => {
    const { weekSalePurchase, frontSetting } = props;

    ChartJS.register(
        CategoryScale,
        LinearScale,
        PointElement,
        LineElement,
        Title,
        Tooltip,
        Legend
    );

    const currency = frontSetting
        ? frontSetting.value && frontSetting.value.currency_symbol
        : " $";
    const cssVariables = getComputedStyle(document.documentElement);
    const axisColor = cssVariables
        .getPropertyValue("--stokapos-text-muted")
        .trim();
    const borderColor = cssVariables
        .getPropertyValue("--stokapos-border")
        .trim();

    const valueFormatter = (tooltipItems) => {
        const value = tooltipItems.dataset.data[tooltipItems.dataIndex];
        const label = tooltipItems.dataset.label;
        return label + " : " + `${currency ? currency : ""} ` + value.toFixed(2);
    };

    const yFormatter = (yValue) => {
        return `${currency ? currency : ""} ` + yValue.toFixed(2);
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: "top",
                labels: {
                    color: axisColor,
                    usePointStyle: true,
                    boxWidth: 10,
                },
            },
            tooltip: {
                backgroundColor: cssVariables
                    .getPropertyValue("--stokapos-surface")
                    .trim(),
                titleColor: cssVariables
                    .getPropertyValue("--stokapos-text-primary")
                    .trim(),
                bodyColor: axisColor,
                borderColor: borderColor,
                borderWidth: 1,
                callbacks: {
                    label: (tooltipItems) => valueFormatter(tooltipItems),
                },
            },
        },
        scales: {
            y: {
                grid: {
                    color: borderColor,
                    drawBorder: false,
                },
                ticks: {
                    callback: (value) => yFormatter(value),
                    color: axisColor,
                },
                title: {
                    display: true,
                    text: placeholderText("expense.input.amount.label"),
                    align: "center",
                    color: axisColor,
                },
            },
            x: {
                grid: {
                    display: false,
                },
                ticks: {
                    color: axisColor,
                },
            },
        },
    };

    const labels = weekSalePurchase ? weekSalePurchase.dates : "";

    const data = {
        labels,
        datasets: [
            {
                label: placeholderText("sales.title"),
                data: weekSalePurchase ? weekSalePurchase.sales : "",
                borderColor: "#0B6CFF",
                backgroundColor: "rgba(11, 108, 255, 0.16)",
                fill: true,
                tension: 0.4,
                pointRadius: 3,
                pointHoverRadius: 5,
            },
            {
                label: placeholderText("purchases.title"),
                data: weekSalePurchase ? weekSalePurchase.purchases : "",
                borderColor: "#22C55E",
                backgroundColor: "rgba(34, 197, 94, 0.16)",
                fill: true,
                tension: 0.4,
                pointRadius: 3,
                pointHoverRadius: 5,
            },
        ],
    };
    return <Line options={options} data={data} />;
};

const mapStateToProps = (state) => {
    const { weekSalePurchase, yearTopProduct } = state;
    return { weekSalePurchase, yearTopProduct };
};

export default connect(mapStateToProps, { weekSalePurchases, yearlyTopProduct })(
    LineChart
);
