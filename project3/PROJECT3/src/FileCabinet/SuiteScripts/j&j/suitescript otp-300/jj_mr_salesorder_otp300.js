/**
 * @NApiVersion 2.1
 * @NScriptType MapReduceScript
 */
define(['N/record', 'N/search'], (record, search) => {


    const getInputData = (inputContext) => {
        try {
            let salsSearch = search.create({
                type: search.Type.SALES_ORDER,
                id: 'customsearch_jj_sales_order_search',
                title: 'JJ SALES ORDER SEARCH',
                columns: ['item', 'quantity'],
                filters: []
            });

            return salsSearch;
        }
        catch (e) {
            log.error('Error in getInputData', e);
        }

    }


    const map = (mapContext) => {
        try {

            let searchResult = JSON.parse(mapContext.value);
            // log.debug('title',searchResult);
            let itemId = searchResult.values.item.value;
            let itemName = searchResult.values.item.text
            let quantitySold = parseFloat(searchResult.values.quantity);
            // log.debug("itemname",itemName);
            // log.debug("quantitySold",quantitySold);
            mapContext.write({
                key: itemId,
                value: {
                    itemName: itemName,
                    quantity: quantitySold
                }
            });
            //  log.debug('Map- Item Name', itemName);
            // log.debug('Map - Quantity Sold', quantitysold);
        } catch (e) {
            log.error('Error in map', e);
        }


    }


    const reduce = (reduceContext) => {
        try {
            log.debug("reduceContext", reduceContext)
            var itemName = reduceContext.key;
            var totalQuantity = 0;

            reduceContext.values.forEach(function (value) {
                totalQuantity += parseFloat(value);
            });
            var logMessage = 'Reduce - Item Name: ' + itemName + ', Total Quantity Sold: ' + totalQuantity;
            log.debug('Item Name and total quantity sold:', logMessage);
                  log.debug('Reduce - Item Name', itemName);
            log.debug('Reduce - Total Quantity Sold', totalQuantity);

        } catch (e) {
            log.error('Error in reduce', e);
        }

    }



    const summarize = (summaryContext) => {

    }

    return { getInputData, map, reduce, summarize }

});
