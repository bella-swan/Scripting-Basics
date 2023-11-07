/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define(['N/log', 'N/record'],
    /**
     * @param{log} log
     * @param{record} record
     */
    function (log, record) {
 
        /**
         * Function to be executed after page is initialized.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.currentRecord - Current form record
         * @param {string} scriptContext.mode - The mode in which the record is being accessed (create, copy, or edit)
         *
         * @since 2015.2
         */
        function pageInit(scriptContext) {
 
        }
 
        /**
         * Function to be executed when field is changed.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.currentRecord - Current form record
         * @param {string} scriptContext.sublistId - Sublist name
         * @param {string} scriptContext.fieldId - Field name
         * @param {number} scriptContext.lineNum - Line number. Will be undefined if not a sublist or matrix field
         * @param {number} scriptContext.columnNum - Line number. Will be undefined if not a matrix field
         *
         * @since 2015.2
         */
        function fieldChanged(scriptContext) {
 
        }
 
        /**
         * Function to be executed when field is slaved.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.currentRecord - Current form record
         * @param {string} scriptContext.sublistId - Sublist name
         * @param {string} scriptContext.fieldId - Field name
         *
         * @since 2015.2
         */
        function postSourcing(scriptContext) {
 
        }
 
        /**
         * Function to be executed after sublist is inserted, removed, or edited.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.currentRecord - Current form record
         * @param {string} scriptContext.sublistId - Sublist name
         *
         * @since 2015.2
         */
        function sublistChanged(scriptContext) {
 
        }
 
        /**
         * Function to be executed after line is selected.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.currentRecord - Current form record
         * @param {string} scriptContext.sublistId - Sublist name
         *
         * @since 2015.2
         */
        function lineInit(scriptContext) {
 
        }
 
        /**
         * Validation function to be executed when field is changed.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.currentRecord - Current form record
         * @param {string} scriptContext.sublistId - Sublist name
         * @param {string} scriptContext.fieldId - Field name
         * @param {number} scriptContext.lineNum - Line number. Will be undefined if not a sublist or matrix field
         * @param {number} scriptContext.columnNum - Line number. Will be undefined if not a matrix field
         *
         * @returns {boolean} Return true if field is valid
         *
         * @since 2015.2
         */
        function validateField(scriptContext) {
 
        }
 
        /**
         * Validation function to be executed when sublist line is committed.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.currentRecord - Current form record
         * @param {string} scriptContext.sublistId - Sublist name
         *
         * @returns {boolean} Return true if sublist line is valid
         *
         * @since 2015.2
         */
        function validateLine(scriptContext) {
 
            if (scriptContext.sublistId === 'item' && scriptContext.fieldId === 'item') {
                var currentRecord = scriptContext.currentRecord;
                var line = scriptContext.line;
 
                var item = currentRecord.getCurrentSublistValue({
                    sublistId: 'item',
                    fieldId: 'item',
                    line: line
                });
 
                // Load the Item Record to retrieve length, breadth, and height
                var itemRecord = record.load({ type: record.Type.INVENTORY_ITEM, id: item });
                var length = itemRecord.getValue({ fieldId: 'custitem_jj_length' });
                var breadth = itemRecord.getValue({ fieldId: 'custitem_jj_bredth' });
                var height = itemRecord.getValue({ fieldId: 'custitem_jj_height' });
 
                // Calculate container box value
                var containerBox = length * breadth * height;
 
                // Set container box field value
                currentRecord.setCurrentSublistValue({
                    sublistId: 'item',
                    fieldId: 'custcol_jj_containerbox',
                    value: containerBox,
                    line: line
                });
            }
 
        }
 
        /**
         * Validation function to be executed when sublist line is inserted.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.currentRecord - Current form record
         * @param {string} scriptContext.sublistId - Sublist name
         *
         * @returns {boolean} Return true if sublist line is valid
         *
         * @since 2015.2
         */
        function validateInsert(scriptContext) {
 
        }
 
        /**
         * Validation function to be executed when record is deleted.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.currentRecord - Current form record
         * @param {string} scriptContext.sublistId - Sublist name
         *
         * @returns {boolean} Return true if sublist line is valid
         *
         * @since 2015.2
         */
        function validateDelete(scriptContext) {
 
        }
 
        /**
         * Validation function to be executed when record is saved.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.currentRecord - Current form record
         * @returns {boolean} Return true if record is valid
         *
         * @since 2015.2
         */
        function saveRecord(scriptContext) {
 
            if (scriptContext.type === scriptContext.UserEventType.CREATE || scriptContext.type === scriptContext.UserEventType.EDIT) {
                var currentRecord = scriptContext.currentRecord;
                var lineCount = currentRecord.getLineCount({ sublistId: 'item' });
 
                for (var line = 0; line < lineCount; line++) {
                    currentRecord.selectLine({ sublistId: 'item', line: line });
                    var rate = currentRecord.getCurrentSublistValue({
                        sublistId: 'item',
                        fieldId: 'rate',
                        line: line
                    });
                    var containerBox = currentRecord.getCurrentSublistValue({
                        sublistId: 'item',
                        fieldId: 'custcol_jj_containerbox',
                        line: line
                    });
                    var amount = currentRecord.getCurrentSublistValue({
                        sublistId: 'item',
                        fieldId: 'amount',
                        line: line
                    });
 
                    // Calculate the expected amount
                    var expectedAmount = rate * containerBox;
 
                    if (expectedAmount !== amount) {
                        alert('The amount does not match the expected value for line ' + (line + 1) + '.');
                        return false; // Prevent saving the record
                    }
                }
            }
            return true;
 
        }
 
        return {
            // pageInit: pageInit,
            // fieldChanged: fieldChanged,
            // postSourcing: postSourcing,
            // sublistChanged: sublistChanged,
            // lineInit: lineInit,
            // validateField: validateField,
            validateLine: validateLine,
            // validateInsert: validateInsert,
            // validateDelete: validateDelete,
            saveRecord: saveRecord
        };
 
    });
 