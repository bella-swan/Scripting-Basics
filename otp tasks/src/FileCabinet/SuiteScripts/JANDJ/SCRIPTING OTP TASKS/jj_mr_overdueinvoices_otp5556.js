/**
 * @NApiVersion 2.1
 * @NScriptType MapReduceScript
 */
/****************************************************************************
************************************************
**${OTP-5556} : ${Monthly Over Due Reminder for Customer}
* 
*****************************************************************************
*********************************************
* Author: Jobin & Jismi IT Services LLP
*
* Date Created : 7-November-2023
*
* Created By: Diya S, Jobin & Jismi IT Services LLP
*
* Description : 
Send a email notification to all Customers once a month if they have overdue Invoices.

We need to send the Overdue Invoice information till the previous month to the corresponding Customer.

The email notification should contain all of the customers overdue invoices.

This email notification should contain the Customer Name and Customer Email, Invoice document Number, Invoice Amount, Days Overdue which is attached as a CSV File to the email.

The sender of the email should be Sales Rep. If there is no Sales rep for the customer, sender will be a static NetSuite Admin
* 
*****************************************************************************
*******************************************************/
define(['N/currentRecord', 'N/email', 'N/file', 'N/record', 'N/search'],
    /**
 * @param{currentRecord} currentRecord
 * @param{email} email
 * @param{file} file
 * @param{record} record
 * @param{search} search
 */
    (currentRecord, email, file, record, search) => {
        /**
         * Defines the function that is executed at the beginning of the map/reduce process and generates the input data.
         * @param {Object} inputContext
         * @param {boolean} inputContext.isRestarted - Indicates whether the current invocation of this function is the first
         *     invocation (if true, the current invocation is not the first invocation and this function has been restarted)
         * @param {Object} inputContext.ObjectRef - Object that references the input data
         * @typedef {Object} ObjectRef
         * @property {string|number} ObjectRef.id - Internal ID of the record instance that contains the input data
         * @property {string} ObjectRef.type - Type of the record instance that contains the input data
         * @returns {Array|Object|Search|ObjectRef|File|Query} The input data to use in the map/reduce process
         * @since 2015.2
         */

        const getInputData = (inputContext) => {
            try {s
                let invSearch = search.create({
                    type: search.Type.INVOICE,
                    columns: ['tranid', 'entity'],
                    filters: [['mainline', 'is', true], 'and', ['status', 'anyof', 'CustInvc:A'], 'and', ['daysoverdue', 'greaterthan', '0'], 'and', ['duedate', 'onorbefore', 'lastmonth']]
                });
                return invSearch;
            }
            catch (e) {
                log.debug("error in getInputData", e);
            }

        }

        /**
         * Defines the function that is executed when the map entry point is triggered. This entry point is triggered automatically
         * when the associated getInputData stage is complete. This function is applied to each key-value pair in the provided
         * context.
         * @param {Object} mapContext - Data collection containing the key-value pairs to process in the map stage. This parameter
         *     is provided automatically based on the results of the getInputData stage.
         * @param {Iterator} mapContext.errors - Serialized errors that were thrown during previous attempts to execute the map
         *     function on the current key-value pair
         * @param {number} mapContext.executionNo - Number of times the map function has been executed on the current key-value
         *     pair
         * @param {boolean} mapContext.isRestarted - Indicates whether the current invocation of this function is the first
         *     invocation (if true, the current invocation is not the first invocation and this function has been restarted)
         * @param {string} mapContext.key - Key to be processed during the map stage
         * @param {string} mapContext.value - Value to be processed during the map stage
         * @since 2015.2
         */

        const map = (mapContext) => {
            try {
                var searchResult = JSON.parse(mapContext.value);
                log.debug('searchResult', searchResult);
                var invId = searchResult.id;

                var cusValue = searchResult.values['entity'];
                var cusId = cusValue.value

                var results = [];


                let invoiceObj = search.lookupFields({
                    type: search.Type.INVOICE,
                    id: invId,
                    columns: ['entity', 'email', 'tranid', 'daysoverdue', 'amount', 'salesrep']
                });

                let cusName = invoiceObj['entity'][0].text;

                results.push(cusName);
                results.push(invoiceObj.email);
                results.push(invoiceObj.tranid);
                results.push(invoiceObj.daysoverdue);
                results.push(invoiceObj.amount);


                mapContext.write({
                    key: cusId,
                    value: results
                });
            }
            catch (e) {
                log.debug("error in map", e);
            }

        }

        /**
         * Defines the function that is executed when the reduce entry point is triggered. This entry point is triggered
         * automatically when the associated map stage is complete. This function is applied to each group in the provided context.
         * @param {Object} reduceContext - Data collection containing the groups to process in the reduce stage. This parameter is
         *     provided automatically based on the results of the map stage.
         * @param {Iterator} reduceContext.errors - Serialized errors that were thrown during previous attempts to execute the
         *     reduce function on the current group
         * @param {number} reduceContext.executionNo - Number of times the reduce function has been executed on the current group
         * @param {boolean} reduceContext.isRestarted - Indicates whether the current invocation of this function is the first
         *     invocation (if true, the current invocation is not the first invocation and this function has been restarted)
         * @param {string} reduceContext.key - Key to be processed during the reduce stage
         * @param {List<String>} reduceContext.values - All values associated with a unique key that was passed to the reduce stage
         *     for processing
         * @since 2015.2
         */
        const reduce = (reduceContext) => {
            
                let reduceKey = reduceContext.key;
                let reduceValue = reduceContext.values;
                let len = reduceValue.length;


                var csvContent = " Customer Name ,Customer Email, Invoice document Number, Days Overdue,Invoice Amount "
                csvContent += "\n"

                for (let i = 0; i < len; i++) {
                    var c1 = JSON.parse(reduceContext.values[i]);
                    for (let j = 0; j < c1.length; j++) {
                        csvContent += c1[j];
                        csvContent += " , ";
                    }
                    csvContent += "\n";

                }
                let today = Date.now();
                let filename = `${today}_Invoice_Overdue_Details.csv`

                var fileObj = file.create({
                    name: filename,
                    fileType: file.Type.CSV,
                    contents: csvContent,
                    folder: 192
                });
                var fileId = fileObj.save();

                let cusRec = record.load({
                    type: record.Type.CUSTOMER,
                    id: reduceKey
                });
                let saleRep = cusRec.getValue({
                    fieldId: 'salesrep'
                });

                let adminid = -5;

                if (saleRep) {
                     e1=email.send({
                        author: saleRep,
                        recipients: reduceKey,
                        subject: "INVOICE OVERDUE DETAILS",
                        body: "Hi Sir/Ma'am,<br/> Please find the attached 'Monthly Invoice Overdue' details.<br/>We are hoping you to take the necessary action at the earliest.<br/>  Thank you.",
                        attachments: [fileObj]
                    });
                }

                else {

                    email.send({
                        author: adminid,
                        recipients: reduceKey,
                        subject: "INVOICE OVERDUE DETAILS",
                        body: "Hi Sir/Ma'am,<br/> Please find the attached 'Monthly Invoice Overdue' details. <br/>We are hoping you to take the necessary action at the earliest.<br/> Thank you. ",
                        attachments: [fileObj]
                    });
                }
            
           
        }


        /**
         * Defines the function that is executed when the summarize entry point is triggered. This entry point is triggered
         * automatically when the associated reduce stage is complete. This function is applied to the entire result set.
         * @param {Object} summaryContext - Statistics about the execution of a map/reduce script
         * @param {number} summaryContext.concurrency - Maximum concurrency number when executing parallel tasks for the map/reduce
         *     script
         * @param {Date} summaryContext.dateCreated - The date and time when the map/reduce script began running
         * @param {boolean} summaryContext.isRestarted - Indicates whether the current invocation of this function is the first
         *     invocation (if true, the current invocation is not the first invocation and this function has been restarted)
         * @param {Iterator} summaryContext.output - Serialized keys and values that were saved as output during the reduce stage
         * @param {number} summaryContext.seconds - Total seconds elapsed when running the map/reduce script
         * @param {number} summaryContext.usage - Total number of governance usage units consumed when running the map/reduce
         *     script
         * @param {number} summaryContext.yields - Total number of yields when running the map/reduce script
         * @param {Object} summaryContext.inputSummary - Statistics about the input stage
         * @param {Object} summaryContext.mapSummary - Statistics about the map stage
         * @param {Object} summaryContext.reduceSummary - Statistics about the reduce stage
         * @since 2015.2
         */
        const summarize = (summaryContext) => {

        }

        return { getInputData, map, reduce, summarize }

    });