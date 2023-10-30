/**
 * @NApiVersion 2.1
 * @NScriptType ScheduledScript
 */
define(['N/email', 'N/record', 'N/render', 'N/search', 'N/xml'],
    /**
 * @param{email} email
 * @param{record} record
 * @param{render} render
 * @param{search} search
 * @param{xml} xml
 */
    (email, record, render, search, xml) => {

        /**
         * Defines the Scheduled script trigger point.
         * @param {Object} scriptContext
         * @param {string} scriptContext.type - Script execution context. Use values from the scriptContext.InvocationType enum.
         * @since 2015.2
         */
        const execute = (scriptContext) => {

            var today = new Date();
        
       
        var salesOrderSearch = search.create({
            type: search.Type.SALES_ORDER,
            filters: [
                ['trandate', 'on', today]
            ]
        });
      
        var searchresult = vendorObject.run().each(function(result){
                        let salesorderid = result.getValue({
                            name: 'id'
                        });
                       
                        log.debug('salesorderid',salesorderid);
                    });

        }

        return {execute}

    });
