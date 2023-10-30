/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 */
define(['N/record', 'N/search', 'N/error'],
    /**
 * @param{record} record
 * @param{search} search
 * @param{error} error
 */
    (record, search, error) => {
        /**
         * Defines the function definition that is executed before record is loaded.
         * @param {Object} scriptContext
         * @param {Record} scriptContext.newRecord - New record
         * @param {string} scriptContext.type - Trigger type; use values from the context.UserEventType enum
         * @param {Form} scriptContext.form - Current form
         * @param {ServletRequest} scriptContext.request - HTTP request information sent from the browser for a client action only.
         * @since 2015.2
         */
        const beforeLoad = (scriptContext) => {
            // log.debug("scriptcontext",scriptContext);
        };

        /**
         * Defines the function definition that is executed before record is submitted.
         * @param {Object} scriptContext
         * @param {Record} scriptContext.newRecord - New record
         * @param {Record} scriptContext.oldRecord - Old record
         * @param {string} scriptContext.type - Trigger type; use values from the context.UserEventType enum
         * @since 2015.2
         */
        const beforeSubmit = (scriptContext) => {


                log.debug("hi");

            if (scriptContext.type === scriptContext.UserEventType.CREATE || scriptContext.type === scriptContext.UserEventType.EDIT) {
                var salesOrderRecord = scriptContext.newRecord;
                log.debug("1");


                var customFieldValue = salesOrderRecord.getValue({ fieldId: 'memo' });

                if (!customFieldValue) {
                    log.debug("2");
                    var a = 'The custom field is required. Please fill in the custom field.';
                    log.error({
                        title:"Validation error",
                        details:"memo is required"
                    })
                    throw error.create({
                        name: 'CUSTOM_FIELD_REQUIRED',
                        message: a,
                    });
                }
                else{
                    log.debug("3");
                }


            }



        };


        /**
         * Defines the function definition that is executed after record is submitted.
         * @param {Object} scriptContext
         * @param {Record} scriptContext.newRecord - New record
         * @param {Record} scriptContext.oldRecord - Old record
         * @param {string} scriptContext.type - Trigger type; use values from the context.UserEventType enum
         * @since 2015.2
         */
        const afterSubmit = (scriptContext) => {

            // if (scriptContext.type === scriptContext.UserEventType.CREATE) {
            //     let salesOrderRecord = scriptContext.newRecord;
            //     let soId = salesOrderRecord.getValue({
            //         fieldId: 'id'
            //     });

            //     log.debug(1);
            //     let itemFulfillmentRecord = record.transform({
            //         fromType: record.Type.SALES_ORDER,
            //         fromId: soId,
            //         toType: record.Type.ITEM_FULFILLMENT
            //     });
            // }

            // let fulfillmentId = itemFulfillmentRecord.save();
            // if (fulfillmentId) {
            //     log.debug('Item Fulfillment Created', 'ID: ' + fulfillmentId);
            // }

         };



        return { beforeLoad, beforeSubmit, afterSubmit };


    });

