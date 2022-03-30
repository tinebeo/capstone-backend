/**
 * @file
 * Example 001: Use embedded signing
 * @author DocuSign
 */

const fs = require("fs-extra");
const docusign = require("docusign-esign");
const open = require('open');

require("dotenv").config({ path: "./config/config.env" })

const DOCUSIGN_ADMIN_USER_ID = process.env.DOCUSIGN_ADMIN_USER_ID
const DOCUSIGN_REDIRECT_URI = process.env.DOCUSIGN_REDIRECT_URI
const DOCUSIGN_INTEGRATION_KEY = process.env.DOCUSIGN_INTEGRATION_KEY
const DOCUSIGN_BASEPATH = process.env.DOCUSIGN_BASEPATH
const DOCUSIGN_BASEPATH_RESTAPI = process.env.DOCUSIGN_BASEPATH_RESTAPI
const DOCUSIGN_AUTH_BASEPATH = process.env.DOCUSIGN_AUTH_BASEPATH
const DOCUSIGN_PRIVATE_KEY = process.env.DOCUSIGN_PRIVATE_KEY
const DOCUSIGN_SECRET_KEY = process.env.DOCUSIGN_SECRET_KEY
const DOCUSIGN_API_ACCOUNT_ID = process.env.DOCUSIGN_API_ACCOUNT_ID
const DOCUSIGN_RETURN_URL = process.env.DOCUSIGN_RETURN_URL
const DOCUSIGN_PING_URL = process.env.DOCUSIGN_PING_URL

const dsApiClient = new docusign.ApiClient();

// TODO differentiate between signing and only getting documents
// i.e., if signing, redirect to docusigns root, else redirect somewhere else
const getAccessToken = async (args) => {

    dsApiClient.setBasePath(DOCUSIGN_BASEPATH)
    dsApiClient.setOAuthBasePath(DOCUSIGN_AUTH_BASEPATH)

    const rsaKey = DOCUSIGN_PRIVATE_KEY
    let consentUrl = dsApiClient.getJWTUri(DOCUSIGN_INTEGRATION_KEY, DOCUSIGN_REDIRECT_URI, DOCUSIGN_AUTH_BASEPATH);

    let accessToken;
    if (args.authorizationCode) {
        // call was from a redirect from consent request
        // exchange given code to access token
        const response = await dsApiClient.generateAccessToken(DOCUSIGN_INTEGRATION_KEY, DOCUSIGN_SECRET_KEY, args.authorizationCode)
        return response.accessToken

    } else {
        // call was from a user that already gave consent
        accessToken = await dsApiClient.requestJWTUserToken(
            DOCUSIGN_INTEGRATION_KEY, // integration key
            args.envelopeArgs.signerClientId, // user id (impersonator id)
            'signature',
            rsaKey,
            3600
        ).then((res) => {
            return res.body.access_token;

        }).catch((err) => {
            console.log(err.response.body)
            if (err.response) {
                // TODO handle reject
                if (err.response.body.error == "consent_required") {
                    console.log("Consent required");
                    open(consentUrl, { wait: true })
                }
            }
        })

        return accessToken
    }
}

/**
 * This function does the work of creating the envelope and the
 * embedded signing
 * @param {object} args
 */
const sendEnvelopeForEmbeddedSigning = async (args) => {
    // get the access token
    const accessToken = await getAccessToken(args)

    // don't do anything if you dont have the access token
    if (!accessToken) {
        return
    } else {
        console.log(accessToken)
    }

    // get user information
    const userInfo = await dsApiClient.getUserInfo(accessToken)
        .then((res) => {
            return res
        }).catch((err) => {
            console.log(err)
            return
        })

    // set user info
    args.envelopeArgs.signerEmail = userInfo.email
    args.envelopeArgs.signerName = userInfo.name
    args.envelopeArgs.signerClientId = userInfo.sub

    dsApiClient.setBasePath(DOCUSIGN_BASEPATH_RESTAPI);
    dsApiClient.addDefaultHeader("Authorization", "Bearer " + accessToken);

    let envelopesApi = new docusign.EnvelopesApi(dsApiClient),
        results = null;

    // Step 1. Make the envelope request body
    let envelope = makeEnvelope(args.envelopeArgs);

    // Step 2. call Envelopes::create API method
    // Exceptions will be caught by the calling function
    results = await envelopesApi.createEnvelope(DOCUSIGN_API_ACCOUNT_ID, {
        envelopeDefinition: envelope,
    });

    let envelopeId = results.envelopeId;
    console.log(`Envelope was created. EnvelopeId ${envelopeId}`);

    // Step 3. create the recipient view, the embedded signing
    let viewRequest = makeRecipientViewRequest(args.envelopeArgs);
    // Call the CreateRecipientView API
    // Exceptions will be caught by the calling function

    results = await envelopesApi.createRecipientView(DOCUSIGN_API_ACCOUNT_ID, envelopeId, {
        recipientViewRequest: viewRequest,
    });

    return { envelopeId: envelopeId, redirectUrl: results.url };

};

/**
 * Creates envelope
 * @function
 * @param {Object} args parameters for the envelope:
 * @returns {Envelope} An envelope definition
 * @private
 */
function makeEnvelope(args) {
    // Data for this method
    // args.signerEmail
    // args.signerName
    // args.signerClientId
    // docFile 

    // document 1 (pdf) has tag /sn1/
    //
    // The envelope has one recipients.
    // recipient 1 - signer

    let docPdfBytes;
    // read file from a local directory
    // The read could raise an exception if the file is not available!
    docPdfBytes = fs.readFileSync(args.docFile);

    // create the envelope definition
    let env = new docusign.EnvelopeDefinition();
    env.emailSubject = "Please sign this document";

    // add the documents
    let doc1 = new docusign.Document(),
        doc1b64 = Buffer.from(docPdfBytes).toString("base64");
    doc1.documentBase64 = doc1b64;
    doc1.name = "Lorem Ipsum"; // can be different from actual file name
    doc1.fileExtension = "pdf";
    doc1.documentId = "3";

    // The order in the docs array determines the order in the envelope
    env.documents = [doc1];

    // Create a signer recipient to sign the document, identified by name and email
    // We set the clientUserId to enable embedded signing for the recipient
    // We're setting the parameters via the object creation
    let signer1 = docusign.Signer.constructFromObject({
        email: args.signerEmail,
        name: args.signerName,
        clientUserId: args.signerClientId,
        recipientId: 1,
    });

    // Create signHere fields (also known as tabs) on the documents,
    // We're using anchor (autoPlace) positioning
    //
    // The DocuSign platform seaches throughout your envelope's
    // documents for matching anchor strings.
    let signHere1 = docusign.SignHere.constructFromObject({
        anchorString: "/sn1/",
        anchorYOffset: "10",
        anchorUnits: "pixels",
        anchorXOffset: "20",
    });
    // Tabs are set per recipient / signer
    let signer1Tabs = docusign.Tabs.constructFromObject({
        signHereTabs: [signHere1],
    });
    signer1.tabs = signer1Tabs;

    // Add the recipient to the envelope object
    let recipients = docusign.Recipients.constructFromObject({
        signers: [signer1],
    });

    env.recipients = recipients;

    // Request that the envelope be sent by setting |status| to "sent".
    // To request that the envelope be created as a draft, set to "created"
    env.status = "sent";

    return env;
}

function makeRecipientViewRequest(args) {
    // Data for this method
    // args.dsReturnUrl
    // args.signerEmail
    // args.signerName
    // args.signerClientId
    // args.dsPingUrl

    let viewRequest = new docusign.RecipientViewRequest();

    // Set the url where you want the recipient to go once they are done signing
    // should typically be a callback route somewhere in your app.
    // The query parameter is included as an example of how
    // to save/recover state information during the redirect to
    // the DocuSign signing. It's usually better to use
    // the session mechanism of your web framework. Query parameters
    // can be changed/spoofed very easily.
    viewRequest.returnUrl = DOCUSIGN_RETURN_URL + "?rfq_number=" +args.rfqNumber;

    // How has your app authenticated the user? In addition to your app's
    // authentication, you can include authenticate steps from DocuSign.
    // Eg, SMS authentication
    viewRequest.authenticationMethod = "none";

    // Recipient information must match embedded recipient info
    // we used to create the envelope.
    viewRequest.email = args.signerEmail;
    viewRequest.userName = args.signerName;
    viewRequest.clientUserId = args.signerClientId;

    // DocuSign recommends that you redirect to DocuSign for the
    // embedded signing. There are multiple ways to save state.
    // To maintain your application's session, use the pingUrl
    // parameter. It causes the DocuSign signing web page
    // (not the DocuSign server) to send pings via AJAX to your
    // app,
    viewRequest.pingFrequency = 600; // seconds
    // NOTE: The pings will only be sent if the pingUrl is an https address
    viewRequest.pingUrl = DOCUSIGN_PING_URL; // optional setting

    return viewRequest;
}

const getEnvelopeDocument = async (args) => {

    const adminArgs = {
        envelopeArgs: {
            signerClientId: DOCUSIGN_ADMIN_USER_ID
        }
    };

    // get the access token
    const accessToken = await getAccessToken(adminArgs)

    // don't do anything if you dont have the access token
    if (!accessToken) {
        return
    } else {
        console.log(accessToken)
    }

    let dsApiClient = new docusign.ApiClient();

    dsApiClient.setBasePath(DOCUSIGN_BASEPATH_RESTAPI);
    dsApiClient.addDefaultHeader("Authorization", "Bearer " + accessToken);

    let envelopesApi = new docusign.EnvelopesApi(dsApiClient)
        , results = null;

    // EnvelopeDocuments::get.
    // Exceptions will be caught by the calling function
    results = await envelopesApi.getDocument(
        DOCUSIGN_API_ACCOUNT_ID, args.envelopeId, 1, null);

    return results
}

module.exports = { getAccessToken, sendEnvelopeForEmbeddedSigning, getEnvelopeDocument };