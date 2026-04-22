import React, { useEffect } from "react";
import { Col, Row } from "react-bootstrap";
import { connect } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faShoppingCart,
    faCartPlus,
    faArrowRight,
    faArrowLeft,
    faDollar,
    faSquareMinus,
    faMoneyBill,
} from "@fortawesome/free-solid-svg-icons";
import { getFormattedMessage } from "../../shared/sharedMethod";
import { todaySalePurchaseCount } from "../../store/action/dashboardAction";
import Widget from "../../shared/Widget/Widget";
import { useNavigate } from "react-router-dom";
import { fetchAllSalePurchaseCount } from "../../store/action/allSalePurchaseAction";

const TodaySalePurchaseCount = (props) => {
    const {
        todaySalePurchaseCount,
        todayCount,
        frontSetting,
        config,
        allSalePurchase,
        fetchAllSalePurchaseCount,
        allConfigData,
    } = props;
    const navigate = useNavigate();

    useEffect(() => {
        todaySalePurchaseCount();
        fetchAllSalePurchaseCount();
    }, []);

    const onClick = (redirect, permission) => {
        if (
            config &&
            config.filter((item) => item === permission).length !== 0
        ) {
            navigate(`/${redirect}`);
        }
    };

    const cards = [
        {
            title: getFormattedMessage("sales.title"),
            redirect: "app/sales",
            permission: "manage_sale",
            accentClass: "stokapos-kpi-card--minimal",
            iconClass: "stokapos-kpi-icon stokapos-kpi-icon--minimal",
            icon: faShoppingCart,
            value: allSalePurchase.all_sales_count,
            badgeText: "+12%",
            trendDirection: "up",
        },
        {
            title: getFormattedMessage("purchases.title"),
            redirect: "app/purchases",
            permission: "manage_purchase",
            accentClass: "stokapos-kpi-card--minimal",
            iconClass: "stokapos-kpi-icon stokapos-kpi-icon--minimal",
            icon: faCartPlus,
            value: allSalePurchase.all_purchases_count,
            badgeText: "+8%",
            trendDirection: "up",
        },
        {
            title: getFormattedMessage("sales-return.title"),
            redirect: "app/sale-return",
            permission: "manage_sale_return",
            accentClass: "stokapos-kpi-card--minimal",
            iconClass: "stokapos-kpi-icon stokapos-kpi-icon--minimal",
            icon: faArrowRight,
            value: allSalePurchase.all_sale_return_count,
            badgeText: "-3%",
            trendDirection: "down",
        },
        {
            title: getFormattedMessage("purchases.return.title"),
            redirect: "app/purchase-return",
            permission: "manage_purchase_return",
            accentClass: "stokapos-kpi-card--minimal",
            iconClass: "stokapos-kpi-icon stokapos-kpi-icon--minimal",
            icon: faArrowLeft,
            value: allSalePurchase.all_purchase_return_count,
            badgeText: "-2%",
            trendDirection: "down",
        },
        {
            title: getFormattedMessage(
                "dashboard.widget.today-total-sales.label"
            ),
            redirect: "app/sales",
            permission: "manage_sale",
            accentClass: "stokapos-kpi-card--minimal",
            iconClass: "stokapos-kpi-icon stokapos-kpi-icon--minimal",
            icon: faDollar,
            value: todayCount.today_sales,
            badgeText: "+24%",
            trendDirection: "up",
        },
        {
            title: getFormattedMessage(
                "dashboard.widget.today-payment-received.label"
            ),
            redirect: "app/sales",
            permission: "manage_sale",
            accentClass: "stokapos-kpi-card--minimal",
            iconClass: "stokapos-kpi-icon stokapos-kpi-icon--minimal",
            icon: faMoneyBill,
            value: todayCount.today_sales_received_count,
            badgeText: "+15%",
            trendDirection: "up",
        },
        {
            title: getFormattedMessage(
                "dashboard.widget.today-total-purchases.label"
            ),
            redirect: "app/purchases",
            permission: "manage_purchase",
            accentClass: "stokapos-kpi-card--minimal",
            iconClass: "stokapos-kpi-icon stokapos-kpi-icon--minimal",
            icon: faCartPlus,
            value: todayCount.today_purchases,
            badgeText: "+5%",
            trendDirection: "up",
        },
        {
            title: getFormattedMessage(
                "dashboard.widget.today-total-expense.label"
            ),
            redirect: "app/expenses",
            permission: "manage_expenses",
            accentClass: "stokapos-kpi-card--minimal",
            iconClass: "stokapos-kpi-icon stokapos-kpi-icon--minimal",
            icon: faSquareMinus,
            value: todayCount.today_expense_count,
            badgeText: "-6%",
            trendDirection: "down",
        },
    ];

    return (
        <Row className="g-4">
            <Col className="col-12 mb-4">
                <Row className="g-4">
                    {cards.map((card) => {
                        const canOpen =
                            config &&
                            config.filter(
                                (item) => item === card.permission
                            ).length !== 0;

                        return (
                            <Widget
                                key={card.title}
                                title={card.title}
                                onClick={() =>
                                    onClick(card.redirect, card.permission)
                                }
                                allConfigData={allConfigData}
                                className={canOpen ? "cursor-pointer" : ""}
                                accentClass={card.accentClass}
                                badgeText={card.badgeText}
                                trendDirection={card.trendDirection}
                                iconClass={card.iconClass}
                                icon={
                                    <FontAwesomeIcon
                                        icon={card.icon}
                                        className="fs-6"
                                    />
                                }
                                currency={
                                    frontSetting.value &&
                                    frontSetting.value.currency_symbol
                                }
                                value={
                                    card.value
                                        ? parseFloat(card.value).toFixed(2)
                                        : "0.00"
                                }
                            />
                        );
                    })}
                </Row>
            </Col>
        </Row>
    );
};
const mapStateToProps = (state) => {
    const { todayCount, allSalePurchase, config, allConfigData } = state;
    return { todayCount, allSalePurchase, config, allConfigData };
};

export default connect(mapStateToProps, {
    todaySalePurchaseCount,
    fetchAllSalePurchaseCount,
})(TodaySalePurchaseCount);
