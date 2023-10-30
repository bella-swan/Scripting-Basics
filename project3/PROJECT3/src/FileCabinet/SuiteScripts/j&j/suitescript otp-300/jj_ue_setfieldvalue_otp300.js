/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 */
define(['N/record', 'N/search', 'N/runtime', 'N/ui/serverWidget'],
    /**
 * @param{record} record
 * @param{search} search
 */
    (record, search, runtime, serverWidget) => {
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
            if (scriptContext.type === scriptContext.UserEventType.CREATE || scriptContext.type === scriptContext.UserEventType.EDIT) {
                const administratorRole = 3;
                const user = runtime.getCurrentUser();
                let chk = scriptContext.newRecord.getValue({ fieldId: "custbody3" })

                log.debug('user', user);
                const userRoleId = user.role;
                log.debug('userRoleId', userRoleId);

                //

                if (userRoleId !== administratorRole) {

                    scriptContext.form.getField({
                        id: "custbody3"
                    }).updateDisplayType({
                        displayType: serverWidget.FieldDisplayType.DISABLED
                    });

                    if (chk) {
                        scriptContext.form.getField({
                            id: "custbody8"
                        }).updateDisplayType({
                            displayType: serverWidget.FieldDisplayType.DISABLED
                        });
                    }



                }

            }
        }

        /**
         * Defines the function definition that is executed before record is submitted.
         * @param {Object} scriptContext
         * @param {Record} scriptContext.newRecord - New record
         * @param {Record} scriptContext.oldRecord - Old record
         * @param {string} scriptContext.type - Trigger type; use values from the context.UserEventType enum
         * @since 2015.2
         */
        const beforeSubmit = (scriptContext) => {

        }

        /**
         * Defines the function definition that is executed after record is submitted.
         * @param {Object} scriptContext
         * @param {Record} scriptContext.newRecord - New record
         * @param {Record} scriptContext.oldRecord - Old record
         * @param {string} scriptContext.type - Trigger type; use values from the context.UserEventType enum
         * @since 2015.2
         */
        const afterSubmit = (scriptContext) => {

            if (scriptContext.type === scriptContext.UserEventType.CREATE || scriptContext.type === scriptContext.UserEventType.EDIT) {

                let salesOrderRecord = scriptContext.newRecord;

                let amount = salesOrderRecord.getValue({ fieldId: 'total' });
                // let soid = salesOrderRecord.getValue(id);
                let soid = scriptContext.newRecord.id;
                log.debug('salesid', soid);
                log.debug('amount', amount);
                let amountInWords = convertAmountToWords(amount);
                log.debug('amountInWords', amountInWords);
                function convertAmountToWords(amount) {
                    const ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"];
                    const teens = ["", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
                    const tens = ["", "Ten", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
                    const thousands = ["", "Thousand", "Million", "Billion"];

                    function toWords(n) {
                        let word = "";
                        if (n >= 100) {
                            word += ones[Math.floor(n / 100)] + " Hundred ";
                            n %= 100;
                        }
                        if (n >= 11 && n <= 19) {
                            word += teens[n - 11] + " ";
                        } else {
                            word += tens[Math.floor(n / 10)] + " " + ones[n % 10] + " ";
                        }
                        return word.trim();
                    }

                    if (amount === 0) {
                        return "Zero";
                    }

                    let words = "";
                    let i = 0;
                    while (amount > 0) {
                        if (amount % 1000 !== 0) {
                            words = toWords(amount % 1000) + thousands[i] + " " + words;
                        }
                        amount = Math.floor(amount / 1000);
                        i++;
                    }

                    return words.trim();

                }


                // salesOrderRecord.setValue({
                //     fieldId: 'custbody8',
                //     value: amountInWords
                // });
                record.submitFields({
                    type: record.Type.SALES_ORDER,
                    id: soid,
                    values: {
                        custbody8: amountInWords
                    },
                    options: {
                        enableSourcing: false,
                        ignoreMandatoryFields: true
                    }
                });
            }


        }



        return { beforeLoad, beforeSubmit, afterSubmit }

    });
