/**
 * @NApiVersion 2.1
 * @NScriptType Restlet
 */
/****************************************************************************
************************************************
**${OTP-5556} : ${Monthly Over Due Reminder for Customer}
* 
*****************************************************************************
*********************************************
* Author: Jobin & Jismi IT Services LLP
*
* Date Created : 9-November-2023
*
* Created By: Diya S, Jobin & Jismi IT Services LLP
*
* Description : 
Create a GET API for the following:

The application needs to fetch the list of sales order details with an open status. The details should include the following: Internal ID, document number, date, and total amount. The data should be in a JSON object. The application will use the API for fetching the sales order whose status is open.

The application needs to fetch the single sales order with item details (item name, quantity, rate, gross amount). The internal id of the sales order will be passed as a parameter in the API. The application needs to use the API for fetching the single sales order. If no sales order is found for the parameter id, then the message "RESULT: NOT FOUND needs to be shown.

Create a POST API for the following:

When the application sends an API request, then the item fulfilment needs to be created for the sales order. The id and details of the sales order will be passed as body in the HTTP request so that it can find the correct sales order and create the item fulfilment record for the sales order with the correct item details. The API should process the request as the body of the HTTP request.
* 
*****************************************************************************
*******************************************************/
define(['N/record', 'N/search'],
    /**
 * @param{record} record
 * @param{search} search
 */
    (record, search) => {
        /**
         * Defines the function that is executed when a GET request is sent to a RESTlet.
         * @param {Object} requestParams - Parameters from HTTP request URL; parameters passed as an Object (for all supported
         *     content types)
         * @returns {string | Object} HTTP response body; returns a string when request Content-Type is 'text/plain'; returns an
         *     Object when request Content-Type is 'application/json' or 'application/xml'
         * @since 2015.2
         */
        const get = (requestParams) => {

            let salesOrderId = requestParams.id;

            var statusSale = requestParams.status;
            // log.debug("status",statusSale);

            if (statusSale) {

                let searchObj1 = search.create({
                    type: search.Type.SALES_ORDER,
                    columns: ['internalid', 'tranid', 'total', 'trandate'],
                    filters: [[["status", "is", "SalesOrd:A"], "or", ["status", "is", "SalesOrd:B"], "or", ["status", "is", "SalesOrd:D"], "or",
                    ["status", "is", "SalesOrd:E"], "or", ["status", "is", "SalesOrd:F"]], "and", ["mainline", "is", "T"]]

                });
                let searchdetails = searchObj1.run().getRange({
                    start: 0,
                    end: 100
                });
                orderList = [];

                for (let j = 0; j < searchdetails.length; j++) {

                    var internalid = searchdetails[j].getValue({ name: "internalId" });
                    var documentNumber = searchdetails[j].getValue({ name: "tranid" });
                    var date = searchdetails[j].getValue({ name: "trandate" });
                    var total = searchdetails[j].getValue({ name: "total" });

                    orderList.push({

                        Internalid: internalid,
                        DocumentNumber: documentNumber,
                        Date: date,
                        Total: total

                    });
                }


                return {
                    orderList: orderList,

                };

            }

            if (salesOrderId) {

                let saleOrderSearch = search.create({
                    type: search.Type.SALES_ORDER,
                    id: 'customsearch_jj_rl_salesorders_1',
                    columns: ['item.itemid', 'rate', 'quantity', 'amount'],
                    filters: [['mainline', 'is', true], 'and', ['internalid', 'is', salesOrderId]]

                });

                var lines = saleOrderSearch.run().getRange({
                    start: 0,
                    end: 100
                });

                var itemList = [];

                if (lines.length === 0) {

                    return {
                        message: 'RESULT: NOT FOUND'
                    };
                }

                else {

                    var salesOrder = record.load({
                        type: record.Type.SALES_ORDER,
                        id: salesOrderId,
                        isDynamic: true
                    });

                    let lineCount = salesOrder.getLineCount({

                        sublistId: 'item'

                    });


                    for (var i = 0; i < lineCount; i++) {

                        var itemName = salesOrder.getSublistText({
                            sublistId: 'item',
                            fieldId: 'item',
                            line: i
                        });

                        var quantity = salesOrder.getSublistValue({
                            sublistId: 'item',
                            fieldId: 'quantity',
                            line: i
                        });
                        var rate = salesOrder.getSublistValue({
                            sublistId: 'item',
                            fieldId: 'rate',
                            line: i
                        });

                        var amount = salesOrder.getSublistValue({
                            sublistId: 'item',
                            fieldId: 'amount',
                            line: i
                        });

                        itemList.push({
                            itemName: itemName,
                            quantity: quantity,
                            rate: rate,
                            amount: amount
                        });
                    }

                    return {
                        itemList: itemList
                    };
                }
            }

        }


        /**
         * Defines the function that is executed when a PUT request is sent to a RESTlet.
         * @param {string | Object} requestBody - The HTTP request body; request body are passed as a string when request
         *     Content-Type is 'text/plain' or parsed into an Object when request Content-Type is 'application/json' (in which case
         *     the body must be a valid JSON)
         * @returns {string | Object} HTTP response body; returns a string when request Content-Type is 'text/plain'; returns an
         *     Object when request Content-Type is 'application/json' or 'application/xml'
         * @since 2015.2
         */
        const put = (requestBody) => {
            let fulid = requestBody.id;
            let memov = requestBody.memoval;
            let fulfillrec=record.load({
                type: record.Type.ITEM_FULFILLMENT,
                id: fulid,
                isDynamic: true
            });
            fulfillrec.setValue({
                fieldId:'memo',
                value:memov,
                ignoreFieldChange:true
            });
            fulfillrec.save(
                {
                    enableSourcing:true,
                    ignoreMandatoryFields:true
                }
            );
            return ("the item fulfillment record was successfully updated");
        }

        /**
         * Defines the function that is executed when a POST request is sent to a RESTlet.
         * @param {string | Object} requestBody - The HTTP request body; request body is passed as a string when request
         *     Content-Type is 'text/plain' or parsed into an Object when request Content-Type is 'application/json' (in which case
         *     the body must be a valid JSON)
         * @returns {string | Object} HTTP response body; returns a string when request Content-Type is 'text/plain'; returns an
         *     Object when request Content-Type is 'application/json' or 'application/xml'
         * @since 2015.2
         */
        const post = (requestBody) => {
            try {
                let soid = requestBody.salesorderid;
                let soob = record.load({
                    type: record.Type.SALES_ORDER,
                    id: soid
                });
                let fulfillob = record.transform({
                    fromType: record.Type.SALES_ORDER,
                    fromId: soid,
                    toType: record.Type.ITEM_FULFILLMENT,
                    isDynamic: true

                });

                fulfillob.setValue({
                    fieldId: 'shipstatus',
                    value: 'C'
                });


                fulfillob.save();
                soob.setValue({
                    fieldId: 'status',
                    text: 'Pending Billing'
                });

                return "itemfulfillment record created successfully"

            }

            catch (e) {
                log.debug(e);
                return e

            }


        }

        /**
         * Defines the function that is executed when a DELETE request is sent to a RESTlet.
         * @param {Object} requestParams - Parameters from HTTP request URL; parameters are passed as an Object (for all supported
         *     content types)
         * @returns {string | Object} HTTP response body; returns a string when request Content-Type is 'text/plain'; returns an
         *     Object when request Content-Type is 'application/json' or 'application/xml'
         * @since 2015.2
         */
        const doDelete = (requestParams) => {
            let fulfillmentid=requestParams.id;
            record.delete({
                type:record.Type.ITEM_FULFILLMENT,
                id:fulfillmentid
            });
            return("record with id "+fulfillmentid+"is deleted");


        }

        return { get, put, post, delete: doDelete }

    });