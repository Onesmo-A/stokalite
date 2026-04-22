import React from "react";
import ReactECharts from "echarts-for-react";

const TopSellingProductChart = (props) => {
    const { yearTopProduct } = props;
    const allQuantity = Array.isArray(yearTopProduct?.total_quantity)
        ? yearTopProduct.total_quantity
        : [];
    const allName = Array.isArray(yearTopProduct?.name)
        ? yearTopProduct.name
        : [];
    const cssVariables = getComputedStyle(document.documentElement);

    const allData = allQuantity.map((value, i) => ({
        value: allQuantity[i],
        name: allName[i],
    }));

    const option = {
        backgroundColor: "transparent",
        color: ["#0B6CFF", "#7B3FE4", "#00C2FF", "#22C55E", "#F59E0B", "#EF4444"],
        tooltip: {
            trigger: "item",
            backgroundColor: cssVariables
                .getPropertyValue("--stokapos-surface")
                .trim(),
            borderColor: cssVariables
                .getPropertyValue("--stokapos-border")
                .trim(),
            textStyle: {
                color: cssVariables
                    .getPropertyValue("--stokapos-text-primary")
                    .trim(),
            },
        },
        legend: {
            orient: "vertical",
            right: 0,
            top: "center",
            textStyle: {
                color: cssVariables
                    .getPropertyValue("--stokapos-text-secondary")
                    .trim(),
            },
        },
        series: [
            {
                name: "",
                type: "pie",
                radius: ["48%", "74%"],
                data: allData,
                label: {
                    color: cssVariables
                        .getPropertyValue("--stokapos-text-secondary")
                        .trim(),
                },
                emphasis: {
                    itemStyle: {
                        shadowBlur: 22,
                        shadowOffsetX: 0,
                        shadowColor: "rgba(123, 63, 228, 0.35)",
                    },
                },
            },
        ],
    };

    return <ReactECharts option={option} style={{ height: 360 }} />;
};

export default TopSellingProductChart;
