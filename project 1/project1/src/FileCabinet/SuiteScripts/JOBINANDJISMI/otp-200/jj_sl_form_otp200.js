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
                    title: 'Registration Form'
                });
                form.addField({
                    id: 'name',
                    type: serverWidget.FieldType.TEXT,
                    label: 'Name',
                });

                form.addField({
                    id: 'age',
                    type: serverWidget.FieldType.INTEGER,
                    label: 'Age',
                });
                form.addField({
                    id: 'phone',
                    type: serverWidget.FieldType.PHONE,
                    label: 'Phone Number',
                });
            
            form.addField({
                id: 'email',
                type: serverWidget.FieldType.EMAIL,
                label: 'Email',
            });

            form.addField({
                id: 'father_name',
                type: serverWidget.FieldType.TEXT,
                label: "Father's Name",
            });

            form.addField({
                id: 'address',
                type: serverWidget.FieldType.TEXT,
                label: 'Address',
            });

           
            form.addSubmitButton({
                label: 'Submit',
            });

            
            scriptContext.response.writePage(form);
            
        } 
    }

    return {
        onRequest: onRequest,
    };
});



