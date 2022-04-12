const QlmLicense = require('./qlmLicense/QlmLicense');
const qlmHardware = require ('./qlmLicense/QlmHardware');
const qlmDb = require ('./qlmStoreLicense');

class LicenseValidator {

    #licenseDefinition;
    #licenseData;
    #computerID;
    #licenseObject;

    constructor () {
        this.#licenseDefinition = {
            publicKey: '<RSAKeyValue><Modulus>32MzAG1NiQV7wHJkKIS4cTnblAsQMFWsNCLVyS/wV9I3sLBQrgUx4buOCM3o7W1Oz6BnxlmsJbcWxx5edTWd1nAOA5KhFb+ZG8Vi07MaJxZEKAJiop62IhwpIjoHNnO76jyqpXSVG8YanIkexlmDc8LEAkI09oxbd2PxwsEc63U=</Modulus><Exponent>AQAB</Exponent></RSAKeyValue>',
            url: 'https://qlm3.net/logicalbeans/qlmlicenseserver/qlmservice.asmx',
            productID: 4,
            majorVersion: 1,
            minorVersion: 1	
        };
        this.#licenseData = qlmDb.readLicenseFile ();
        this.#computerID = qlmHardware.hw_getComputerName ();
        this.#initializeLicenseObject();
    }

    #initializeLicenseObject () {
        let licenseObject = new QlmLicense ();
        licenseObject.DefineProduct(this.#licenseDefinition.productID, this.#licenseDefinition.productName, this.#licenseDefinition.majorVersion, this.#licenseDefinition.minorVersion, this.#licenseDefinition.publicKey);
        licenseObject.ValidateLicense(this.#licenseData, this.#computerID);

        this.#licenseObject = licenseObject;
    }

    validateLicenseOnServer () {
        return new Promise(( resolve, reject ) => {
            // console.log("validateLicenseOnServer this.#licenseObject", this.#licenseObject);
            // console.log("validateLicenseOnServer this.#licenseData", this.#licenseData);
            if ( !this.#licenseData || !this.#licenseObject.activationKey ) {
                // console.log("validateLicenseOnServer if");
                resolve({
                    status1: false,
                    result1: this.#licenseObject.result
                });
            } else {
                // console.log("validateLicenseOnServer else");
                this.#licenseObject.ActivateLicense(this.#licenseDefinition.url, this.#licenseObject.activationKey, this.#licenseObject.getComputerKey(), this.#computerID, false, ( result1, status1, licenseFile ) => {
                    // console.log("validateLicenseOnServer status1", status1);
                    // console.log("validateLicenseOnServer result1", result1);
                    if ( status1 == true ) {
                        qlmDb.storeLicenseFile (licenseFile);      
                    }    
                    resolve({
                        status1,
                        result1
                    });
                });
            }
        });
    }

    getLincenseObjectState () {
        return {
            activationKey: this.#licenseObject.activationKey,
            result: this.#licenseObject.result,
            status: this.#licenseObject.status
        };
    }

    activateLicense ( activationKey ) {
        return new Promise(( resolve, reject ) => {
            this.#licenseObject.ActivateLicense(this.#licenseDefinition.url, activationKey, this.#licenseObject.getComputerKey(), this.#computerID, false, ( result, status, licenseFile ) => {
                if ( status == true ) {
                    qlmDb.storeLicenseFile (licenseFile);      
                }    
                resolve({
                    status,
                    result
                });
            });
        });
    }

    deactivateLicense ( activationKey ) {
        return new Promise(( resolve, reject ) => {
            // console.log('Deactivating License');
            this.#licenseObject.DeactivateLicense (licenseDefinition.url, activationKey, computerID, '', '', '', (result, status, licenseFile) => {        
                resolve(result);
            });
        });
    }

    getHtmlLayout ( state ) {
        return `
            <html>
                <head>
                    <meta charset="utf-8">
                    <title>Bot</title>
                    <style>
                        .loader .page-blocker{
                            display: block;
                        }
                        .page-blocker {
                            position: absolute;
                            width: 100vw;
                            height: 100vh;
                            background: rgba(230, 230, 230, 0.8);
                            display: none;
                            text-align: center;
                            line-height: 80vh;
                            top: 0px;
                            left: 0px;
                        }
                        .invisible {
                            visibility: hidden;
                        }
                        
                        h3 {
                            margin-top: 2rem;
                        }
                        
                        input[type="button"] {
                            margin-bottom: 0;
                        }
                        html {
                            font-family: sans-serif;
                            -ms-text-size-adjust: 100%;
                            -webkit-text-size-adjust: 100%;
                          }
                          
                          body {
                            margin: 0;
                            overflow: hidden;
                          }
                          
                          article,
                          aside,
                          details,
                          figcaption,
                          figure,
                          footer,
                          header,
                          hgroup,
                          main,
                          menu,
                          nav,
                          section,
                          summary {
                            display: block;
                          }
                          
                          audio,
                          canvas,
                          progress,
                          video {
                            display: inline-block;
                            vertical-align: baseline;
                          }
                          
                          audio:not([controls]) {
                            display: none;
                            height: 0;
                          }
                          
                          [hidden],
                          template {
                            display: none;
                          }
                          
                          a {
                            background-color: transparent;
                          }
                          
                          a:active,
                          a:hover {
                            outline: 0;
                          }
                          
                          abbr[title] {
                            border-bottom: 1px dotted;
                          }
                          
                          b,
                          strong {
                            font-weight: bold;
                          }
                          
                          
                          dfn {
                            font-style: italic;
                          }
                          
                          h1 {
                            font-size: 2em;
                            margin: 0.67em 0;
                          }
                          
                          mark {
                            background: #ff0;
                            color: #000;
                          }
                          
                          small {
                            font-size: 80%;
                          }
                          
                          sub,
                          sup {
                            font-size: 75%;
                            line-height: 0;
                            position: relative;
                            vertical-align: baseline;
                          }
                          
                          sup {
                            top: -0.5em;
                          }
                          
                          sub {
                            bottom: -0.25em;
                          }
                          
                          img {
                            border: 0;
                          }
                          
                          svg:not(:root) {
                            overflow: hidden;
                          }
                          
                          figure {
                            margin: 1em 40px;
                          }
                          
                          
                          hr {
                            -moz-box-sizing: content-box;
                            box-sizing: content-box;
                            height: 0;
                          }
                          
                          
                          pre {
                            overflow: auto;
                          }
                          
                          code,
                          kbd,
                          pre,
                          samp {
                            font-family: monospace, monospace;
                            font-size: 1em;
                          }
                          
                          button,
                          input,
                          optgroup,
                          select,
                          textarea {
                            color: inherit; /* 1 */
                            font: inherit; /* 2 */
                            margin: 0; /* 3 */
                          }
                          
                          button {
                            overflow: visible;
                          }
                          
                          button,
                          select {
                            text-transform: none;
                          }
                          
                          button,
                          html input[type="button"], /* 1 */
                          input[type="reset"],
                          input[type="submit"] {
                            -webkit-appearance: button; /* 2 */
                            cursor: pointer; /* 3 */
                          }
                          
                          button[disabled],
                          html input[disabled] {
                            cursor: default;
                          }
                          
                          button::-moz-focus-inner,
                          input::-moz-focus-inner {
                            border: 0;
                            padding: 0;
                          }
                          
                          input {
                            line-height: normal;
                          }
                          
                          input[type="checkbox"],
                          input[type="radio"] {
                            box-sizing: border-box; /* 1 */
                            padding: 0; /* 2 */
                          }
                          
                          input[type="number"]::-webkit-inner-spin-button,
                          input[type="number"]::-webkit-outer-spin-button {
                            height: auto;
                          }
                          
                          input[type="search"] {
                            -webkit-appearance: textfield; /* 1 */
                            -moz-box-sizing: content-box;
                            -webkit-box-sizing: content-box; /* 2 */
                            box-sizing: content-box;
                          }
                          
                          input[type="search"]::-webkit-search-cancel-button,
                          input[type="search"]::-webkit-search-decoration {
                            -webkit-appearance: none;
                          }
                          
                          fieldset {
                            border: 1px solid #c0c0c0;
                            margin: 0 2px;
                            padding: 0.35em 0.625em 0.75em;
                          }
                          
                          legend {
                            border: 0;
                            padding: 0;
                          }
                          
                          textarea {
                            overflow: auto;
                          }
                          optgroup {
                            font-weight: bold;
                          }
                          
                          table {
                            border-collapse: collapse;
                            border-spacing: 0;
                          }
                          
                          td,
                          th {
                            padding: 0;
                          }
                          
                          .container {
                            position: relative;
                            width: 100%;
                            max-width: 960px;
                            margin: 0 auto;
                            padding: 0 20px;
                            box-sizing: border-box; }
                          .column,
                          .columns {
                            width: 100%;
                            float: left;
                            box-sizing: border-box; }
                          
                          @media (min-width: 400px) {
                            .container {
                              width: 85%;
                              padding: 0; }
                          }
                          
                          @media (min-width: 550px) {
                            .container {
                              width: 80%; }
                            .column,
                            .columns {
                              margin-left: 4%; }
                            .column:first-child,
                            .columns:first-child {
                              margin-left: 0; }
                          
                            .one.column,
                            .one.columns                    { width: 4.66666666667%; }
                            .two.columns                    { width: 13.3333333333%; }
                            .three.columns                  { width: 22%;            }
                            .four.columns                   { width: 30.6666666667%; }
                            .five.columns                   { width: 39.3333333333%; }
                            .six.columns                    { width: 48%;            }
                            .seven.columns                  { width: 56.6666666667%; }
                            .eight.columns                  { width: 65.3333333333%; }
                            .nine.columns                   { width: 74.0%;          }
                            .ten.columns                    { width: 82.6666666667%; }
                            .eleven.columns                 { width: 91.3333333333%; }
                            .twelve.columns                 { width: 100%; margin-left: 0; }
                          
                            .one-third.column               { width: 30.6666666667%; }
                            .two-thirds.column              { width: 65.3333333333%; }
                          
                            .one-half.column                { width: 48%; }
                          
                            /* Offsets */
                            .offset-by-one.column,
                            .offset-by-one.columns          { margin-left: 8.66666666667%; }
                            .offset-by-two.column,
                            .offset-by-two.columns          { margin-left: 17.3333333333%; }
                            .offset-by-three.column,
                            .offset-by-three.columns        { margin-left: 26%;            }
                            .offset-by-four.column,
                            .offset-by-four.columns         { margin-left: 34.6666666667%; }
                            .offset-by-five.column,
                            .offset-by-five.columns         { margin-left: 43.3333333333%; }
                            .offset-by-six.column,
                            .offset-by-six.columns          { margin-left: 52%;            }
                            .offset-by-seven.column,
                            .offset-by-seven.columns        { margin-left: 60.6666666667%; }
                            .offset-by-eight.column,
                            .offset-by-eight.columns        { margin-left: 69.3333333333%; }
                            .offset-by-nine.column,
                            .offset-by-nine.columns         { margin-left: 78.0%;          }
                            .offset-by-ten.column,
                            .offset-by-ten.columns          { margin-left: 86.6666666667%; }
                            .offset-by-eleven.column,
                            .offset-by-eleven.columns       { margin-left: 95.3333333333%; }
                          
                            .offset-by-one-third.column,
                            .offset-by-one-third.columns    { margin-left: 34.6666666667%; }
                            .offset-by-two-thirds.column,
                            .offset-by-two-thirds.columns   { margin-left: 69.3333333333%; }
                          
                            .offset-by-one-half.column,
                            .offset-by-one-half.columns     { margin-left: 52%; }
                          
                          }
                          
                          html {
                            font-size: 62.5%; }
                          body {
                            font-size: 1.5em;
                            line-height: 1.6;
                            font-weight: 400;
                            font-family: "Raleway", "HelveticaNeue", "Helvetica Neue", Helvetica, Arial, sans-serif;
                            color: #222; }
                          
                          h1, h2, h3, h4, h5, h6 {
                            margin-top: 0;
                            margin-bottom: 2rem;
                            font-weight: 300; }
                          h1 { font-size: 4.0rem; line-height: 1.2;  letter-spacing: -.1rem;}
                          h2 { font-size: 3.6rem; line-height: 1.25; letter-spacing: -.1rem; }
                          h3 { font-size: 3.0rem; line-height: 1.3;  letter-spacing: -.1rem; }
                          h4 { font-size: 2.4rem; line-height: 1.35; letter-spacing: -.08rem; }
                          h5 { font-size: 1.8rem; line-height: 1.5;  letter-spacing: -.05rem; }
                          h6 { font-size: 1.5rem; line-height: 1.6;  letter-spacing: 0; }
                          
                          /* Larger than phablet */
                          @media (min-width: 550px) {
                            h1 { font-size: 5.0rem; }
                            h2 { font-size: 4.2rem; }
                            h3 { font-size: 3.6rem; }
                            h4 { font-size: 3.0rem; }
                            h5 { font-size: 2.4rem; }
                            h6 { font-size: 1.5rem; }
                          }
                          
                          p {
                            margin-top: 0; }
                          
                          
                          /* Links
                          –––––––––––––––––––––––––––––––––––––––––––––––––– */
                          a {
                            color: #1EAEDB; }
                          a:hover {
                            color: #0FA0CE; }
                          
                          
                          /* Buttons
                          –––––––––––––––––––––––––––––––––––––––––––––––––– */
                          .button,
                          button,
                          input[type="submit"],
                          input[type="reset"],
                          input[type="button"] {
                            display: inline-block;
                            height: 38px;
                            padding: 0 30px;
                            color: #555;
                            text-align: center;
                            font-size: 11px;
                            font-weight: 600;
                            line-height: 38px;
                            letter-spacing: .1rem;
                            text-transform: uppercase;
                            text-decoration: none;
                            white-space: nowrap;
                            background-color: transparent;
                            border-radius: 4px;
                            border: 1px solid #bbb;
                            cursor: pointer;
                            box-sizing: border-box; }
                          .button:hover,
                          button:hover,
                          input[type="submit"]:hover,
                          input[type="reset"]:hover,
                          input[type="button"]:hover,
                          .button:focus,
                          button:focus,
                          input[type="submit"]:focus,
                          input[type="reset"]:focus,
                          input[type="button"]:focus {
                            color: #333;
                            border-color: #888;
                            outline: 0; }
                          .button.button-primary,
                          button.button-primary,
                          input[type="submit"].button-primary,
                          input[type="reset"].button-primary,
                          input[type="button"].button-primary {
                            color: #FFF;
                            background-color: #33C3F0;
                            border-color: #33C3F0; }
                          .button.button-primary:hover,
                          button.button-primary:hover,
                          input[type="submit"].button-primary:hover,
                          input[type="reset"].button-primary:hover,
                          input[type="button"].button-primary:hover,
                          .button.button-primary:focus,
                          button.button-primary:focus,
                          input[type="submit"].button-primary:focus,
                          input[type="reset"].button-primary:focus,
                          input[type="button"].button-primary:focus {
                            color: #FFF;
                            background-color: #1EAEDB;
                            border-color: #1EAEDB; }
                          
                          
                          /* Forms
                          –––––––––––––––––––––––––––––––––––––––––––––––––– */
                          input[type="email"],
                          input[type="number"],
                          input[type="search"],
                          input[type="text"],
                          input[type="tel"],
                          input[type="url"],
                          input[type="password"],
                          textarea,
                          select {
                            height: 38px;
                            padding: 6px 10px; /* The 6px vertically centers text on FF, ignored by Webkit */
                            background-color: #fff;
                            border: 1px solid #D1D1D1;
                            border-radius: 4px;
                            box-shadow: none;
                            box-sizing: border-box; }
                          /* Removes awkward default styles on some inputs for iOS */
                          input[type="email"],
                          input[type="number"],
                          input[type="search"],
                          input[type="text"],
                          input[type="tel"],
                          input[type="url"],
                          input[type="password"],
                          textarea {
                            -webkit-appearance: none;
                               -moz-appearance: none;
                                    appearance: none; }
                          textarea {
                            min-height: 65px;
                            padding-top: 6px;
                            padding-bottom: 6px; }
                          input[type="email"]:focus,
                          input[type="number"]:focus,
                          input[type="search"]:focus,
                          input[type="text"]:focus,
                          input[type="tel"]:focus,
                          input[type="url"]:focus,
                          input[type="password"]:focus,
                          textarea:focus,
                          select:focus {
                            border: 1px solid #33C3F0;
                            outline: 0; }
                          label,
                          legend {
                            display: block;
                            margin-bottom: .5rem;
                            font-weight: 600; }
                          fieldset {
                            padding: 0;
                            border-width: 0; }
                          input[type="checkbox"],
                          input[type="radio"] {
                            display: inline; }
                          label > .label-body {
                            display: inline-block;
                            margin-left: .5rem;
                            font-weight: normal; }
                          
                          
                          /* Lists
                          –––––––––––––––––––––––––––––––––––––––––––––––––– */
                          ul {
                            list-style: circle inside; }
                          ol {
                            list-style: decimal inside; }
                          ol, ul {
                            padding-left: 0;
                            margin-top: 0; }
                          ul ul,
                          ul ol,
                          ol ol,
                          ol ul {
                            margin: 1.5rem 0 1.5rem 3rem;
                            font-size: 90%; }
                          li {
                            margin-bottom: 1rem; }
                          
                          
                          /* Code
                          –––––––––––––––––––––––––––––––––––––––––––––––––– */
                          code {
                            padding: .2rem .5rem;
                            margin: 0 .2rem;
                            font-size: 90%;
                            white-space: nowrap;
                            background: #F1F1F1;
                            border: 1px solid #E1E1E1;
                            border-radius: 4px; }
                          pre > code {
                            display: block;
                            padding: 1rem 1.5rem;
                            white-space: pre; }
                          
                          
                          /* Tables
                          –––––––––––––––––––––––––––––––––––––––––––––––––– */
                          th,
                          td {
                            padding: 12px 15px;
                            text-align: left;
                            border-bottom: 1px solid #E1E1E1; }
                          th:first-child,
                          td:first-child {
                            padding-left: 0; }
                          th:last-child,
                          td:last-child {
                            padding-right: 0; }
                          
                          
                          /* Spacing
                          –––––––––––––––––––––––––––––––––––––––––––––––––– */
                          button,
                          .button {
                            margin-bottom: 1rem; }
                          input,
                          textarea,
                          select,
                          fieldset {
                            margin-bottom: 1.5rem; }
                          pre,
                          blockquote,
                          dl,
                          figure,
                          table,
                          p,
                          ul,
                          ol,
                          form {
                            margin-bottom: 2.5rem; }
                          
                          
                          /* Utilities
                          –––––––––––––––––––––––––––––––––––––––––––––––––– */
                          .u-full-width {
                            width: 100%;
                            box-sizing: border-box; }
                          .u-max-full-width {
                            max-width: 100%;
                            box-sizing: border-box; }
                          .u-pull-right {
                            float: right; }
                          .u-pull-left {
                            float: left; }
                          
                          
                          /* Misc
                          –––––––––––––––––––––––––––––––––––––––––––––––––– */
                          hr {
                            margin-top: 3rem;
                            margin-bottom: 3.5rem;
                            border-width: 0;
                            border-top: 1px solid #E1E1E1; }
                          
                          
                          /* Clearing
                          –––––––––––––––––––––––––––––––––––––––––––––––––– */
                          
                          /* Self Clearing Goodness */
                          .container:after,
                          .row:after,
                          .u-cf {
                            content: "";
                            display: table;
                            clear: both; }
                          
                          
                          /* Media Queries
                          –––––––––––––––––––––––––––––––––––––––––––––––––– */
                          /*
                          Note: The best way to structure the use of media queries is to create the queries
                          near the relevant code. For example, if you wanted to change the styles for buttons
                          on small devices, paste the mobile query code up in the buttons section and style it
                          there.
                          */
                          
                          
                          /* Larger than mobile */
                          @media (min-width: 400px) {}
                          
                          /* Larger than phablet (also point when grid becomes active) */
                          @media (min-width: 550px) {}
                          
                          /* Larger than tablet */
                          @media (min-width: 750px) {}
                          
                          /* Larger than desktop */
                          @media (min-width: 1000px) {}
                          
                          /* Larger than Desktop HD */
                          @media (min-width: 1200px) {}
                          
                    </style>
                </head>
                <body class="${(state.validation === "inprogress" || state.validation === "success") ? "loader" : ""}">
                    <div class="container">
                        <h3>Activate Bot License</h3>
                        <div class="row">
                            <div class="six columns">
                                <label for="activation_key">Please enter your activation key and click activate to proceed</label>
                                <input class="u-full-width" placeholder="Activation Key" id="activation_key" type="text" width="500px" value=${state.activationKey ? state.activationKey : ""}>
                            </div>
                        </div>
                        <div class="row">
                            <div class="six columns">
                                <input class="button-primary" value="Activate" id="activate" type="button">
                            </div>
                        </div>
                        <div class="row">
                            <p></p>
                        </div>
                        <div class="row">
                            <div class="ten columns">
                                <label id="activation_result" >${state.validation !== "inprogress" ? state.result : ""}</label>     
                            </div>      
                        </div>
                    </div>
                    <div class="page-blocker">${state.validation === "inprogress" ? "Activating License, Please wait..." : state.validation === "success" ? "Successfully validated. Redirecting now, Please wait..." : ""}</div>
                    <script>
                        document.getElementById("activate").addEventListener("click", ( event ) => {
                            if ( window.activate ) {
                                window.activate(document.getElementById("activation_key").value);
                            }
                        });
                    </script>
                </body>
            </html>
        `;
    }
}

module.exports = LicenseValidator;