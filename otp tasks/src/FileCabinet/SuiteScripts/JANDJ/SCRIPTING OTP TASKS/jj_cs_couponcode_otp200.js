/**
* Client Script to handle 'Apply Coupon' and 'Coupon Code' fields on the customer record.
*/
 
/**
* @NApiVersion 2.1
* @NScriptType ClientScript
* @NModuleScope Public
*/
define(['N/record', 'N/ui/message', 'N/ui/dialog'], function (record, message, dialog) {
 
    // Function to enable/disable 'Coupon Code' field based on 'Apply Coupon' checkbox
    // function enableDisableCouponCode(scriptContext) {
    //     var currentRecord = scriptContext.currentRecord;
    //     var applyCouponField = currentRecord.getValue({ fieldId: 'custentity_jj_apply_coupon' });
    //     var couponCodeField = currentRecord.getField({ fieldId: 'custentity_jj_coupon_code' });
 
    //     if (applyCouponField) {
    //         couponCodeField.isDisabled = false;
    //     } else {
    //         couponCodeField.isDisabled = true;
    //         // Clear the 'Coupon Code' field
    //         currentRecord.setValue({ fieldId: 'custentity_jj_coupon_code', value: null });
    //     }
    // }
 
    // Function to validate 'Coupon Code' length
    // function validateCouponCode(scriptContext) {
    //     var currentRecord = scriptContext.currentRecord;
    //     var couponCode = currentRecord.getValue({ fieldId: 'custentity_jj_coupon_code' });
 
    //     if (couponCode && couponCode.length !== 5) {
    //         dialog.alert({
    //             title: 'Invalid Coupon Code',
    //             message: 'Coupon Code must be 5 characters long.'
    //         });
 
    //         // Prevent the record from being saved
    //         scriptContext.cancel = true;
    //     }
    // }
 
    // Field Changed script trigger
    function fieldChanged(scriptContext) {
        if (scriptContext.fieldId === 'custentity_jj_apply_coupon') {
            var currentRecord = scriptContext.currentRecord;
            var applyCouponField = currentRecord.getValue({ fieldId: 'custentity_jj_apply_coupon' });
            var couponCodeField = currentRecord.getField({ fieldId: 'custentity_jj_coupon_code' });
     
            if (applyCouponField) {
                couponCodeField.isDisabled = false;
            } else {
                couponCodeField.isDisabled = true;
                // Clear the 'Coupon Code' field
                currentRecord.setValue({ fieldId: 'custentity_jj_coupon_code', value: null });
            }
        }
    }
 
    // Save Record script trigger
    function saveRecord(scriptContext) {
        try{
        var currentRecord = scriptContext.currentRecord;
       
        var couponCode = currentRecord.getValue({ fieldId: 'custentity_jj_coupon_code' });
        log.debug('hy');
       
        if (couponCode && couponCode.length !== 5 && currentRecord.getValue({ fieldId: 'custentity_jj_apply_coupon' })==true) {
            alert("length is restricted to 5");
            return false;
            log.debug("hy");
        }
        else{
       
        log.debug("hellooo");
            return true;// Allow the record to be saved
        }
    }
        catch(e)
        {
            log.debug('error',e);
        }
};
 
    return {
        fieldChanged: fieldChanged,
        saveRecord: saveRecord
    };
});