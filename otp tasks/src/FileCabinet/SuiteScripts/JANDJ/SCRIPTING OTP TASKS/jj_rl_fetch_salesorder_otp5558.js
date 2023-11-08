/**
 * @NApiVersion 2.1
 * @NScriptType Restlet
 */
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
                    filters: [[["status","is","SalesOrd:A"],"or",["status","is","SalesOrd:B"],"or",["status","is","SalesOrd:D"],"or",
                    ["status","is","SalesOrd:E"],"or",["status","is","SalesOrd:F"]],"and",["mainline","is","T"]]

                });
                let searchdetails = searchObj1.run().getRange({
                    start: 0,
                    end: 100
                });
                orderList = [];

                for (let j=0;j<searchdetails.length;j++){

                    var  internalid=searchdetails[j].getValue({name:"internalId"});
                    var documentNumber=searchdetails[j].getValue({name:"tranid"});
                    var date = searchdetails[j].getValue({name:"trandate"});
                    var total = searchdetails[j].getValue({name:"total"});

                    orderList.push({

                        Internalid:internalid,
                        DocumentNumber:documentNumber,
                        Date : date,
                        Total : total

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

                        sublistId : 'item'
        
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
    try{
     let soid=requestBody.salesorderid;
     let soob=record.load({
          type:record.Type.SALES_ORDER,
          id:soid
     });
     let fulfillob=record.transform({
        fromType:record.Type.SALES_ORDER,
        fromId:soid,
        toType:record.Type.ITEM_FULFILLMENT,
        isDynamic: true

     });


     fulfillob.setValue({
        fieldId: 'shipstatus',
        value: 'C'
    });

    // var lineCount = sales_order_fulfill.getLineCount({
    //     sublistId: 'item'
    // });
    // for (var i = 0; i < lineCount; i++) {
    //     fulfillob.setSublistValue({
    //         sublistId: 'item',
    //         line: i,
    //         fieldId: 'itemReceive',
    //         value: true
    //     });
    // }


     fulfillob.save();
     soob.setValue({
        fieldId: 'status',
        text: 'Pending Billing'
     });

     return "itemfulfillment record created successfully"
     
    }

    catch(e)
    {
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

}

return { get, put, post, delete: doDelete }

    });