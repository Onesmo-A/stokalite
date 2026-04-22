import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { currencySymbolHandling } from "../sharedMethod";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faEllipsisVertical,
    faArrowTrendUp,
    faArrowTrendDown,
} from "@fortawesome/free-solid-svg-icons";

const Widget = (props) => {
    const {
        title,
        value,
        currency,
        icon,
        className,
        iconClass,
        onClick,
        allConfigData,
        accentClass,
        badgeText,
        trendDirection,
    } = props;

    const renderTooltip = (props) => (
        <Tooltip id="button-tooltip" {...props}>
            {currency} {value}
        </Tooltip>
    );

    return (
        <div className="col-xxl-3 col-xl-4 col-sm-6 widget" onClick={onClick}>
            <div
                className={`stokapos-kpi-card ${className} ${accentClass || ""}`}
            >
                <div className="stokapos-kpi-card__content">
                    <div className="stokapos-kpi-card__topline">
                        <div className="stokapos-kpi-card__meta">
                            <div
                                className={`${iconClass} widget-icon rounded-10 d-flex align-items-center justify-content-center stokapos-kpi-card__icon`}
                            >
                                {icon}
                            </div>
                            <span className="stokapos-kpi-card__label">
                                {title}
                            </span>
                        </div>
                        <button
                            type="button"
                            className="stokapos-kpi-card__menu"
                            tabIndex={-1}
                            aria-label={`${title} options`}
                        >
                            <FontAwesomeIcon icon={faEllipsisVertical} />
                        </button>
                    </div>
                    <div className="stokapos-kpi-card__bottomline">
                        <OverlayTrigger
                            placement="bottom"
                            delay={{ show: 250, hide: 400 }}
                            overlay={renderTooltip}
                        >
                            <h2 className="stokapos-kpi-card__value">
                                {currencySymbolHandling(
                                    allConfigData,
                                    currency,
                                    value,
                                    true
                                )}
                            </h2>
                        </OverlayTrigger>
                        {badgeText ? (
                            <span
                                className={`stokapos-kpi-card__badge stokapos-kpi-card__badge--${
                                    trendDirection === "down"
                                        ? "down"
                                        : "up"
                                }`}
                            >
                                <FontAwesomeIcon
                                    icon={
                                        trendDirection === "down"
                                            ? faArrowTrendDown
                                            : faArrowTrendUp
                                    }
                                />
                                {badgeText}
                            </span>
                        ) : null}
                    </div>
                </div>
            </div>
        </div>
    );
};
export default Widget;
