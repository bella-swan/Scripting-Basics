/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['N/record', 'N/search', 'N/ui/serverWidget'],
    /**
 * @param{record} record
 * @param{search} search
 * @param{serverWidget} serverWidget
 */
    (record, search, serverWidget) => {
        /**
         * Defines the Suitelet script trigger point.
         * @param {Object} scriptContext
         * @param {ServerRequest} scriptContext.request - Incoming request
         * @param {ServerResponse} scriptContext.response - Suitelet response
         * @since 2015.2
         */
        const onRequest = (scriptContext) => {
            if (scriptContext.request.method === 'GET') {              
                let form = serverWidget.createForm({
                    title: 'Hospital Registration Form',
                });

                form.addField({
                    id: 'name',
                    type: serverWidget.FieldType.TEXT,
                    label: 'Name',
                    isMandatory: true,
                });

                form.addField({
                    id:'age',
                    type: serverWidget.FieldType.INTEGER,
                    label: 'Age',
                    isMandatory: true,
                })
                let sexField = form.addField({
                    id: 'sex',
                    type: serverWidget.FieldType.SELECT,
                   
                    label: 'Sex',
                    isMandatory: true,
                });
                sexField.addSelectOption({
                    value: 1,
                    text: 'M',
                });

sexField.addSelectOption({
                    value: 2,
                    text: 'F',
                });
                sexField.addSelectOption({
                    value: 3,
                    text: 'O',
                });

                form.addField({
                    id: 'address',
                    type: serverWidget.FieldType.TEXT,
                    label: 'Address',
                    isMandatory: true,
                });

                form.addSubmitButton({
                    label: 'Submit',
                });
                scriptContext.response.writePage(form);

            }
            else if (scriptContext.request.method === 'POST') {
                let formData = scriptContext.request.parameters;
                
                var customRecord = record.create({
                    type: 'customrecord_jj_patient_details_otp200', 
                });

                customRecord.setValue({
                    fieldId: 'custrecordjj_name_otp200',
                    value: formData.name,
                });
    
                customRecord.setValue({
                    fieldId: 'custrecord_jj_age_otp200',
                    value: formData.age,
                });
                customRecord.setValue({
                    fieldId: 'custrecord_jj_sex_otp200',
                    value: formData.sex,
                });
    
                customRecord.setValue({
                    fieldId: 'custrecord_jj_address_otp200',
                    value: formData.address,
                });
                let recordId = customRecord.save();
                scriptContext.response.write('Patient details recorded with ID: ' + recordId);
        
            }
        }

        return {onRequest}

    });
