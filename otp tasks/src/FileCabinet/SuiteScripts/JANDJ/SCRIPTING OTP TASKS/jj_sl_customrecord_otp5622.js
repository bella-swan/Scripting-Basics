/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['N/email', 'N/record', 'N/search', 'N/ui/serverWidget', 'N/url'],
    /**
 
 * @param{email} email
 * @param{record} record

 * @param{search} search
 * @param{serverWidget} serverWidget
 * @param{url} url
 */
    ( email, record, search, serverWidget, url) => {
        /**
         * Defines the Suitelet script trigger point.
         * @param {Object} scriptContext
         * @param {ServerRequest} scriptContext.request - Incoming request
         * @param {ServerResponse} scriptContext.response - Suitelet response
         * @since 2015.2
         */
        const onRequest = (scriptContext) => {
            try
            {
                if (scriptContext.request.method === 'GET') {
                    let form = serverWidget.createForm({
                        title: 'CUSTOMER REGISTRATION FORM (OTP-4753)'
                    });
                    let cusdet = form.addFieldGroup({
                        id: 'cusdet',
                        label: 'CUSTOMER DETAILS'
                    });
                    let cusName = form.addField({
                        id: 'customername',
                        type: serverWidget.FieldType.TEXT,
                        label: 'Customer Name',
                        container: 'cusdet'
                    });
                    let cusEmail = form.addField({
                        id: 'cusemail',
                        type: serverWidget.FieldType.TEXT,
                        label: ' Customer Email',
                        container: 'cusdet'
                    });
                    let subject = form.addField({
                        id: 'subject',
                        type: serverWidget.FieldType.TEXT,
                        label: 'Subject',
                        container: 'cusdet'
                    });
                    let message = form.addField({
                        id: 'message',
                        type: serverWidget.FieldType.TEXTAREA,
                        label: 'Message',
                        container: 'cusdet'
                    });
                    let but = form.addSubmitButton({
                        label: 'Submit'
                    });
                    scriptContext.response.writePage(form);
                }
                else {
                    
                    let cusNameF      = scriptContext.request.parameters.customername;
                    let cusEmailF    = scriptContext.request.parameters.cusemail;
                    let subjectF      = scriptContext.request.parameters.subject;
                    let messageF     = scriptContext.request.parameters.message;
                    
                    let cusSearch = search.create({
                        type: search.Type.CUSTOMER,
                        id: 'cussearch_jj_customer',
                        title: "Customer Search",
                        columns: ['email','salesrep','internalId']
                    });
                    let flag = 0;
                    let custId;
                    cusSearch.run().each(function(result){
                        let custEmail = result.getValue({
                            name: 'email'
                        });
                        if(custEmail == cusEmailF){
                            flag=1;
                            custId = result.id                                                             
                        }  
                        return true;                
                    }); 
                    email.send({
                        author:-5,
                        recipients: -5,
                        subject: subjectF,
                        body: messageF
                    });
                    if(flag == 1){
                        let cusRec = record.load({
                            type:record.Type.CUSTOMER,
                            id:custId,
                            isDynamic:true
                        });
                        let salesRepId = cusRec.getValue({
                            fieldId:'salesrep'
                        });
                        if(salesRepId){
                        
                            email.send({
                                author:15,
                                recipients: salesRepId,
                                subject: subjectF,
                                body: messageF
                            });
                        }
                    }
                    scriptContext.response.write('</br><b><h2>DETAILS OF THE CUSTOMER:</h2>'
                        + '</br></br> Customer Name : ' + cusNameF
                        + '</br></br> Customer Email : ' + cusEmailF
                        + '</br></br> Subject : ' + subjectF
                        + '</br></br> Message : ' + messageF
                    );               
                    let cusRecord = record.create({
                        type: 'customrecord_jj_customerdetails_otp5622',
                        isDynamic: true
                    });
                    cusRecord.setValue({
                        fieldId: 'custrecord_jj_customername',
                        value: cusNameF
                    });
                    cusRecord.setValue({
                        fieldId: 'custrecord_jj_customeremail',
                        value: cusEmailF
                    });
                    if(flag == 1){
                        let link = 'https://';
                            let hostUrl = url.resolveDomain({
                                hostType: url.HostType.APPLICATION
                            });
                            let urlPath = url.resolveRecord({
                                recordType: record.Type.CUSTOMER,
                                recordId: custId,
                                isEditMode: true
                            });
                            let cusUrl = link + hostUrl + urlPath;
                            cusRecord.setValue({
                                fieldId: 'custrecord_jj_customerreference',
                                value: cusUrl
                            });
                    }               
                    cusRecord.setValue({
                        fieldId: 'custrecord_jj_subject',
                        value: subjectF
                    });
                    cusRecord.setValue({
                        fieldId: 'custrecord_jj_message',
                        value: messageF
                    });
                    var cusId = cusRecord.save({
                        ignoreMandatoryFields : true,
                        enableSourcing : true
                    });
                    scriptContext.response.write('</br></br> Record has been created with id '+cusId)
                }
            }
            catch(err){
                log.error("Error reported", err);
            }

        }

        return {onRequest}

    });