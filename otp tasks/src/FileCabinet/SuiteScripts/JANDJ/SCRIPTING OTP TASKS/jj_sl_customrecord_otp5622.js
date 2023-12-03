/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
/****************************************************************************
************************************************
**${OTP-5622} : ${External Custom Record form and actions}
* 
*****************************************************************************
*********************************************
* Author: Jobin & Jismi IT Services LLP
*
* Date Created : 14-November-2023
*
* Created By: Diya S, Jobin & Jismi IT Services LLP
*
* Description : 
Create a custom record and if there is a customer with the given email Id, link that customer to the custom record.

Whenever there is an entry in a custom record, send a notification to a static NetSuite Admin and if there is a Sales Rep for the customer, send a notification email to the Sales Rep as well.
* 
*****************************************************************************
*******************************************************/
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
                        title: 'CUSTOMER REGISTRATION FORM'
                    });
                form.addFieldGroup({
                        id: 'customerdetails',
                        label: 'CUSTOMER DETAILS'
                    });
                 form.addField({
                        id: 'customername',
                        type: serverWidget.FieldType.TEXT,
                        label: 'Customer Name',
                        container: 'customerdetails'
                    });
                form.addField({
                        id: 'customeremail',
                        type: serverWidget.FieldType.TEXT,
                        label: ' Customer Email',
                        container: 'customerdetails'
                    });
                form.addField({
                        id: 'subject',
                        type: serverWidget.FieldType.TEXT,
                        label: 'Subject',
                        container: 'customerdetails'
                    });
                form.addField({
                        id: 'message',
                        type: serverWidget.FieldType.TEXTAREA,
                        label: 'Message',
                        container: 'customerdetails'
                    });
                form.addSubmitButton({
                        label: 'Submit'
                    });
                    scriptContext.response.writePage(form);
                }
                else {
                    
                    let customerName      = scriptContext.request.parameters.customername;
                    let customerEmail    = scriptContext.request.parameters.customeremail;
                    let subjectField= scriptContext.request.parameters.subject;
                    let messageField    = scriptContext.request.parameters.message;
                    
                    let cusSearch = search.create({
                        type: search.Type.CUSTOMER,
                        id: 'cussearch_jj_customer',
                        title: "Customer Search",
                        columns: ['email','salesrep','internalId']
                    });
                    let flag = 0;
                    let customerId;
                    cusSearch.run().each(function(result){
                        let custEmail = result.getValue({
                            name: 'email'
                        });
                        if(custEmail == customerEmail){
                            flag=1;
                            customerId = result.id                                                             
                        }  
                        return true;                
                    }); 
                    email.send({
                        author:-5,
                        recipients: -5,
                        subject: subjectField,
                        body: messageField
                    });
                    if(flag == 1){
                        let cusRec = record.load({
                            type:record.Type.CUSTOMER,
                            id:customerId,
                            isDynamic:true
                        });
                        let salesRepId = cusRec.getValue({
                            fieldId:'salesrep'
                        });
                        if(salesRepId){
                        
                            email.send({
                                author:15,
                                recipients: salesRepId,
                                subject: subjectField,
                                body: messageField
                            });
                        }
                    }
                    scriptContext.response.write('</br><b><h2>DETAILS OF THE CUSTOMER:</h2>'
                        + '</br></br> Customer Name : ' + customerName
                        + '</br></br> Customer Email : ' + customerEmail
                        + '</br></br> Subject : ' + subjectField
                        + '</br></br> Message : ' + messageField
                    );               
                    let cusRecord = record.create({
                        type: 'customrecord_jj_customerdetails_otp5622',
                        isDynamic: true
                    });
                    cusRecord.setValue({
                        fieldId: 'custrecord_jj_customername',
                        value: customerName
                    });
                    cusRecord.setValue({
                        fieldId: 'custrecord_jj_customeremail',
                        value: customerEmail
                    });
                    if(flag == 1){
                        let link = 'https://';
                            let hostUrl = url.resolveDomain({
                                hostType: url.HostType.APPLICATION
                            });
                            let urlPath = url.resolveRecord({
                                recordType: record.Type.CUSTOMER,
                                recordId: customerId,
                                isEditMode: true
                            });
                            let customerUrl = link + hostUrl + urlPath;
                            cusRecord.setValue({
                                fieldId: 'custrecord_jj_customerreference',
                                value: customerUrl
                            });
                    }               
                    cusRecord.setValue({
                        fieldId: 'custrecord_jj_subject',
                        value: subjectField
                    });
                    cusRecord.setValue({
                        fieldId: 'custrecord_jj_message',
                        value: messageField
                    });
                    let cusId = cusRecord.save({
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