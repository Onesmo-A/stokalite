import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import { Card, NavDropdown } from "react-bootstrap";
import {
    getFormattedMessage,
    placeholderText,
    currencySymbolHandling,
} from "../../shared/sharedMethod";
import { Row } from "react-bootstrap-v5";
import { connect } from "react-redux";
import { weekSalePurchases } from "../../store/action/weeksalePurchaseAction";
import { yearlyTopProduct } from "../../store/action/yearlyTopProductAction";
import moment from "moment";
import TopSellingProductChart from "./TopSellingProductChart";
import LineChart from "./LineChart";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";

const ThisWeekSalePurchaseChart = (props) => {
    ChartJS.register(
        CategoryScale,
        LinearScale,
        BarElement,
        Title,
        Tooltip,
        Legend
    );

    const {
        frontSetting,
        weekSalePurchases,
        weekSalePurchase,
        yearTopProduct,
        yearlyTopProduct,
        allConfigData,
    } = props;

    const [isLineChart, isSetLineChart] = useState(false);
    const year = new Date();
    const cssVariables = getComputedStyle(document.documentElement);
    const axisColor = cssVariables
        .getPropertyValue("--stokapos-text-muted")
        .trim();
    const borderColor = cssVariables
        .getPropertyValue("--stokapos-border")
        .trim();

    useEffect(() => {
        weekSalePurchases();
        yearlyTopProduct();
    }, []);

    const currency = frontSetting
        ? frontSetting.value && frontSetting.value.currency_symbol
        : "$";

    const valueFormatter = (tooltipItems) => {
        const value = tooltipItems.dataset.data[tooltipItems.dataIndex];
        const label = tooltipItems.dataset.label;
        const currencySymbol = currency ? currency : "";
        return (
            label +
            " : " +
            currencySymbolHandling(allConfigData, currencySymbol, value, true)
        );
    };

    const yFormatter = (yValue) => {
        const currencySymbol = currency ? currency : "";

        return currencySymbolHandling(
            allConfigData,
            currencySymbol,
            yValue,
            true
        );
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
                backgroundColor: "rgba(11, 108, 255, 0.9)",
                borderRadius: 12,
            },
            {
                label: placeholderText("purchases.title"),
                data: weekSalePurchase ? weekSalePurchase.purchases : "",
                backgroundColor: "rgba(34, 197, 94, 0.9)",
                borderRadius: 12,
            },
        ],
    };

    return (
        <Row className="g-4">
            <div className="col-xxl-8 col-12">
                <Card className="stokapos-card stokapos-chart-card h-100">
                    <Card.Header className="pb-0 px-10 border-0 d-flex align-items-start justify-content-between">
                        <div>
                            <h5 className="mb-1">
                                {getFormattedMessage(
                                    "dashboard.ThisWeekSales&Purchases.title"
                                )}
                            </h5>
                            <p className="stokapos-card__subtitle mb-0">
                                Revenue and purchase movement across the current
                                week
                            </p>
                        </div>
                        <div className="mb-2 chart-dropdown">
                            <NavDropdown
                                title={<FontAwesomeIcon icon={faBars} />}
                            >
                                <NavDropdown.Item
                                    href="#/"
                                    className={`${
                                        isLineChart === true
                                            ? ""
                                            : "text-primary"
                                    } fs-6`}
                                    onClick={() => isSetLineChart(false)}
                                >
                                    {getFormattedMessage("bar.title")}
                                </NavDropdown.Item>
                                <NavDropdown.Item
                                    href="#"
                                    className={`${
                                        isLineChart === true
                                            ? "text-primary"
                                            : ""
                                    } fs-6`}
                                    onClick={() => isSetLineChart(true)}
                                >
                                    {getFormattedMessage("line.title")}
                                </NavDropdown.Item>
                            </NavDropdown>
                        </div>
                    </Card.Header>
                    <Card.Body className="stokapos-chart-card__body">
                        <div className="stokapos-chart-canvas">
                            {data && currency && isLineChart === false && (
                                <Bar options={options} data={data} />
                            )}
                            {data && currency && isLineChart === true && (
                                <LineChart
                                    weekSalePurchase={weekSalePurchase}
                                    frontSetting={frontSetting}
                                    allConfigData={allConfigData}
                                />
                            )}
                        </div>
                    </Card.Body>
                </Card>
            </div>
            <div className="col-xxl-4 col-12">
                <Card className="stokapos-card stokapos-chart-card h-100">
                    <Card.Header className="pb-0 px-0 justify-content-center border-0 text-center">
                        <h4 className="mb-1">
                            {getFormattedMessage(
                                "dashboard.TopSellingProducts.title"
                            )}
                        </h4>
                        <p className="stokapos-card__subtitle mb-0">
                            Best movers for {moment(year).format("YYYY")}
                        </p>
                    </Card.Header>
                    <Card.Body className="p-3 stokapos-chart-card__body">
                        <TopSellingProductChart
                            yearTopProduct={yearTopProduct}
                            frontSetting={frontSetting}
                        />
                    </Card.Body>
                </Card>
            </div>
        </Row>
    );
};

const mapStateToProps = (state) => {
    const { weekSalePurchase, yearTopProduct, allConfigData } = state;
    return { weekSalePurchase, yearTopProduct, allConfigData };
};

export default connect(mapStateToProps, {
    weekSalePurchases,
    yearlyTopProduct,
})(ThisWeekSalePurchaseChart);
