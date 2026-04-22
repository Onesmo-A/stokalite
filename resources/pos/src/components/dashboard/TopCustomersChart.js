import React from "react";
import { Card } from "react-bootstrap";
import moment from "moment";
import { getFormattedMessage } from "../../shared/sharedMethod";
import ReactECharts from "echarts-for-react";

const TopCustomersChart = (props) => {
    const { frontSetting, topCustomers, allConfigData, languageCode } = props;
    const month = new Date();
    const currency = frontSetting
        ? frontSetting.value && frontSetting.value.currency_symbol
        : " $";
    const allAopCustomersNames = Array.isArray(topCustomers?.name)
        ? topCustomers.name
        : [];
    const allAopCustomers = Array.isArray(topCustomers?.grand_total)
        ? topCustomers.grand_total
        : [];
    const cssVariables = getComputedStyle(document.documentElement);

    const allData = allAopCustomers.map((value, i) => ({
        value: allAopCustomers[i].toFixed(2),
        name: allAopCustomersNames[i],
    }));

    const option = {
        backgroundColor: "transparent",
        color: ["#7B3FE4", "#0B6CFF", "#00C2FF", "#22C55E", "#F59E0B"],
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
            formatter:
                allConfigData?.is_currency_right === "true"
                    ? `{b} : {c} ${currency} ({d}%)`
                    : `{b} : ${currency} {c} ({d}%)`,
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
                radius: ["46%", "72%"],
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

    return (
        <div className="col-xxl-4 col-12">
            <Card className="stokapos-card stokapos-chart-card h-100">
                <Card.Header className="pb-0 px-0 justify-content-center border-0 text-center">
                    <h5 className="mb-1">
                        {getFormattedMessage("dashboard.top-customers.title")}
                    </h5>
                    <p className="stokapos-card__subtitle mb-0">
                        Customer contribution for{" "}
                        {moment(month).locale(languageCode).format("MMMM")}
                    </p>
                </Card.Header>
                <Card.Body className="p-3 stokapos-chart-card__body">
                    <ReactECharts option={option} style={{ height: 360 }} />
                </Card.Body>
            </Card>
        </div>
    );
};

export default TopCustomersChart;
