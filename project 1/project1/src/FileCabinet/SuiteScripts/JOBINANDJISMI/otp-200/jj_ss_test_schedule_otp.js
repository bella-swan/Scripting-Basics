/**
* @NApiVersion 2.1
* @NScriptType ScheduledScript
*/
/****************************************************************************
************************************************
** Project Name | Task description**
* 
*****************************************************************************
*********************************************
* Author: Jobin & Jismi IT Services LLP
*
* Date Created : 19-october-2022
*
* Created By: DIYA S, Jobin & Jismi IT Services LLP
*
* Description : Created a new field in the customer record called Short name.

and update the field value in all record, the short name convention will be the customer name first two character : date created month(01).
* 
* REVISION HISTORY

*****************************************************************************
*******************************************************/
define(['N/search', 'N/record', 'N/error'], (search, record, error) => {
    /**
    * Defines the Scheduled script trigger point.
    * @param {Object} scriptContext
    * @param {string} scriptContext.type - Script execution context.
    * @since 2015.2
    */

    const execute = (scriptContext) => {
        try {

            let invSearch = search.create({
                type: search.Type.SALES_ORDER,
                id: 'customsearch_jj_open_invoice_search',
                title: 'JJ OPEN INVOICE SEARCH',
                columns: ['tranid', 'entity'],
                filters: [['mainline', 'is', true], 'and', ['status', 'anyof', 'CustInvc:A']]
            });
            var searchresult = invSearch.run().each(function (result) {
                let customername = result.getValue({
                    name: 'entity'
                });
                let documentno = result.getValue({
                    name: 'tranid'
                });
                log.debug("customer : " + customername);
                log.debug("documentno : " + documentno);
                return true
            });
            log.debug(searchresult);
            var resultSet = invSearch.run();
            var searchres = resultSet.getRange(0, 100);
            

            let emailBody = `<html><body><table border="1"><tr><th>Invoice Number</th><th>Customer Name</th></tr>`;
            for (var i = 0; i < searchres.length; i++) {
                var result = searchres[i];
                var invoiceNumber = result.getValue('tranid');
                var customerName = result.getText('entity');
            
                emailBody += '<tr><td>' + invoiceNumber + '</td><td> '+ customerName + '</td></tr>';
            }
    
                emailBody += '</table></body></html>';
    
                        let subject = `open invoice`
                        
                        email.send({
                            author: 493,
                            recipients: -5,
                            subject: subject,
                            body: emailBody,
                            
                        });

 


        } catch (error) {
            log.error('Error @ execute', error);
        }
    }

    return { execute };
});