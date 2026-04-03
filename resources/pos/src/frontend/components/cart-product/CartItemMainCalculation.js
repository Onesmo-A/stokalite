import React, { useRef, useState } from "react";
import { Button, Form, InputGroup, FormControl } from "react-bootstrap-v5";
import { Row } from "react-bootstrap";
import {
    currencySymbolHandling,
    decimalValidate,
    getFormattedMessage,
    numValidate,
    placeholderText,
} from "../../../shared/sharedMethod";

const CartItemMainCalculation = (props) => {
    const {
        totalQty,
        subTotal,
        cartItemValue,
        onChangeCart,
        grandTotal,
        frontSetting,
        allConfigData,
        onChangeTaxCart,
    } = props;

    const [showAdjustments, setShowAdjustments] = useState(false);
    const taxRef = useRef(null);
    const discountRef = useRef(null);
    const shippingRef = useRef(null);

    const currencySymbol =
        frontSetting.value && frontSetting.value.currency_symbol;

    const openAdjustmentsAndFocus = (ref) => {
        setShowAdjustments(true);
        setTimeout(() => {
            ref?.current?.focus?.({ preventScroll: true });
        }, 0);
    };

    return (
        <div className="calculation mt-5 pos-cart-totals">
            <Row className="total-price">
                {/* Desktop adjustments */}
                <div className="col-6 mb-2 d-none d-lg-block">
                    <Form.Group className="calculation__filed-grp mb-2">
                        <InputGroup>
                            <FormControl
                                type="text"
                                id="tax"
                                name="tax"
                                min="0"
                                step=".01"
                                placeholder={placeholderText(
                                    "globally.detail.tax"
                                )}
                                onChange={(e) => onChangeTaxCart(e)}
                                onKeyPress={(event) => numValidate(event)}
                                value={
                                    cartItemValue.tax === 0
                                        ? ""
                                        : cartItemValue.tax
                                }
                                className="rounded-1 pe-8"
                                ref={taxRef}
                            />
                            <InputGroup.Text className="position-absolute top-0 bottom-0 end-0 bg-transparent border-0">
                                %
                            </InputGroup.Text>
                        </InputGroup>
                    </Form.Group>
                    <Form.Group className="calculation__filed-grp mb-2">
                        <InputGroup>
                            <FormControl
                                type="text"
                                id="discount"
                                className="rounded-1 pe-8"
                                onChange={(e) => onChangeCart(e)}
                                value={
                                    cartItemValue.discount === 0
                                        ? ""
                                        : cartItemValue.discount
                                }
                                onKeyPress={(event) => decimalValidate(event)}
                                name="discount"
                                min="0"
                                step=".01"
                                placeholder={placeholderText(
                                    "purchase.order-item.table.discount.column.label"
                                )}
                                ref={discountRef}
                            />
                            <InputGroup.Text className="position-absolute top-0 bottom-0 end-0 bg-transparent border-0">
                                {currencySymbol}
                            </InputGroup.Text>
                        </InputGroup>
                    </Form.Group>
                    <Form.Group className="calculation__filed-grp mb-2">
                        <InputGroup>
                            <FormControl
                                type="text"
                                id="shipping"
                                name="shipping"
                                min="0"
                                step=".01"
                                placeholder={placeholderText(
                                    "purchase.input.shipping.label"
                                )}
                                onChange={(e) => onChangeCart(e)}
                                onKeyPress={(event) => decimalValidate(event)}
                                value={
                                    cartItemValue.shipping === 0
                                        ? ""
                                        : cartItemValue.shipping
                                }
                                className="rounded-1 pe-8"
                                ref={shippingRef}
                            />
                            <InputGroup.Text className="position-absolute top-0 bottom-0 end-0 bg-transparent border-0">
                                {currencySymbol}
                            </InputGroup.Text>
                        </InputGroup>
                    </Form.Group>
                </div>

                {/* Totals */}
                <div className="col-12 col-lg-6 d-flex flex-column justify-content-center text-end align-items-end mb-2">
                    <h4 className="fs-3 mb-2 custom-big-content text-gray-600">
                        {getFormattedMessage("pos-total-qty.title")} :{" "}
                        {totalQty ? totalQty : "0"}
                    </h4>
                    <h4 className="fs-3 mb-2 text-gray-600">
                        {getFormattedMessage("pos.subtotal.small.title")} :{" "}
                        {currencySymbolHandling(
                            allConfigData,
                            currencySymbol,
                            subTotal ? subTotal : "0.00"
                        )}
                    </h4>
                    <h2 className="fs-1 mb-2 text-gray-800">
                        {getFormattedMessage("pos-total.title")} :{" "}
                        {currencySymbolHandling(
                            allConfigData,
                            currencySymbol,
                            grandTotal ? grandTotal : "0.00"
                        )}
                    </h2>
                </div>
            </Row>

            {/* Mobile adjustments (collapsed by default) */}
            <div className="d-lg-none pos-cart-adjustments-mobile">
                <div className="d-flex align-items-center justify-content-between">
                    <div className="pos-cart-chips">
                        <button
                            type="button"
                            className="pos-cart-chip"
                            onClick={() => openAdjustmentsAndFocus(taxRef)}
                        >
                            <i className="bi bi-percent" />
                            <span>
                                {cartItemValue.tax ? cartItemValue.tax : 0}%
                            </span>
                        </button>
                        <button
                            type="button"
                            className="pos-cart-chip"
                            onClick={() =>
                                openAdjustmentsAndFocus(discountRef)
                            }
                        >
                            <i className="bi bi-tag" />
                            <span>
                                {currencySymbol}{" "}
                                {cartItemValue.discount
                                    ? cartItemValue.discount
                                    : 0}
                            </span>
                        </button>
                        <button
                            type="button"
                            className="pos-cart-chip"
                            onClick={() =>
                                openAdjustmentsAndFocus(shippingRef)
                            }
                        >
                            <i className="bi bi-truck" />
                            <span>
                                {currencySymbol}{" "}
                                {cartItemValue.shipping
                                    ? cartItemValue.shipping
                                    : 0}
                            </span>
                        </button>
                    </div>
                    <Button
                        type="button"
                        variant="light"
                        className="pos-cart-adjust-btn"
                        onClick={() => setShowAdjustments((v) => !v)}
                    >
                        <i className="bi bi-sliders2" />
                    </Button>
                </div>

                {showAdjustments && (
                    <div className="pos-cart-adjustments-fields mt-2">
                        <Form.Group className="calculation__filed-grp mb-2">
                            <InputGroup>
                                <FormControl
                                    type="text"
                                    id="tax_mobile"
                                    name="tax"
                                    min="0"
                                    step=".01"
                                    placeholder={placeholderText(
                                        "globally.detail.tax"
                                    )}
                                    onChange={(e) => onChangeTaxCart(e)}
                                    onKeyPress={(event) =>
                                        numValidate(event)
                                    }
                                    value={
                                        cartItemValue.tax === 0
                                            ? ""
                                            : cartItemValue.tax
                                    }
                                    className="rounded-1 pe-8"
                                    ref={taxRef}
                                />
                                <InputGroup.Text className="position-absolute top-0 bottom-0 end-0 bg-transparent border-0">
                                    %
                                </InputGroup.Text>
                            </InputGroup>
                        </Form.Group>
                        <Form.Group className="calculation__filed-grp mb-2">
                            <InputGroup>
                                <FormControl
                                    type="text"
                                    id="discount_mobile"
                                    className="rounded-1 pe-8"
                                    onChange={(e) => onChangeCart(e)}
                                    value={
                                        cartItemValue.discount === 0
                                            ? ""
                                            : cartItemValue.discount
                                    }
                                    onKeyPress={(event) =>
                                        decimalValidate(event)
                                    }
                                    name="discount"
                                    min="0"
                                    step=".01"
                                    placeholder={placeholderText(
                                        "purchase.order-item.table.discount.column.label"
                                    )}
                                    ref={discountRef}
                                />
                                <InputGroup.Text className="position-absolute top-0 bottom-0 end-0 bg-transparent border-0">
                                    {currencySymbol}
                                </InputGroup.Text>
                            </InputGroup>
                        </Form.Group>
                        <Form.Group className="calculation__filed-grp mb-2">
                            <InputGroup>
                                <FormControl
                                    type="text"
                                    id="shipping_mobile"
                                    name="shipping"
                                    min="0"
                                    step=".01"
                                    placeholder={placeholderText(
                                        "purchase.input.shipping.label"
                                    )}
                                    onChange={(e) => onChangeCart(e)}
                                    onKeyPress={(event) =>
                                        decimalValidate(event)
                                    }
                                    value={
                                        cartItemValue.shipping === 0
                                            ? ""
                                            : cartItemValue.shipping
                                    }
                                    className="rounded-1 pe-8"
                                    ref={shippingRef}
                                />
                                <InputGroup.Text className="position-absolute top-0 bottom-0 end-0 bg-transparent border-0">
                                    {currencySymbol}
                                </InputGroup.Text>
                            </InputGroup>
                        </Form.Group>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CartItemMainCalculation;
