This is the official Node.js module for sending notifications through [Fyno.io.](https://fyno.io)

You can use this module to send notifications to any channel (SMS, Email, WhatsApp, Push, Discord, Teams, Slack, etc).

![Fyno: Fire your notifications](https://fynodev.s3.ap-south-1.amazonaws.com/others/Fyno_Banner.jpeg)

# Installation
``` js
npm install @fyno/node
OR
yarn add @fyno/node
```

# Prerequisite
You will need to:
- Own a [Fyno.io](https://fyno.io) account
- Create a Fyno API Key
- Obtain the Workspace ID for your account
- Create integrations, templates, routing (optional), events as per your requirement

# Environment Variables
We recommend using environment variables for storing your Workspace ID and API Key. To set values for these variables, use the following variable names:
- **FYNO_WSID:** To store the Workspace ID.
- **FYNO_API_KEY:** To store the API Key.
- **FYNO_VERSION:** To specify the version you wish to use for sending notifications. Possible values: test, live. Default: live.

# Getting Started
Here's a code snippet that can help you get started:

``` js
import { Fyno } from "@fyno/node";

// If you set the environment variables discussed earlier, use the following code:
const fyno = new Fyno();

// If you wish to provide the environment variables manually, uncomment the lines below and comment the line above.
// const fyno = new Fyno(
//     "<FYNO_WSID>",
//     "<FYNO_API_KEY>",
//     "<FYNO_VERSION>"
// );

fyno.fire("<EventName>", {
    to: {
        sms: "", // Enter number with country code
        whatsapp: "", // Enter WhatsApp number with country code
        email: "", // Enter email address
        slack: "", // Enter slack ID or email address
        discord: "", // Enter discord ID
        teams: "", // Enter channel name
        push: "" // Enter push token
    },
    data: {
        // Enter data here        
    },
})
```

The snippet above lets you fire notifications to a single user. If you wish to fire notifications to multiple users, see the code snippet below.

# Sending Bulk Notifications
To fire an event to multiple users, use the following code snippet:

``` js
fyno.fire("<EventName>", [
        {
            to: {
                // User 1 details
                sms: "", // Enter number with country code
                whatsapp: "", // Enter WhatsApp number with country code
                email: "", // Enter email address
                slack: "", // Enter slack ID or email address
                discord: "", // Enter discord ID
                teams: "", // Enter channel name
                push: "", // Enter push token
            },
            data: {
                // Enter data here
            },
        },
        {
            to: {
                // User 2 details
                sms: "", // Enter number with country code
                whatsapp: "", // Enter WhatsApp number with country code
                email: "", // Enter email address
                slack: "", // Enter slack ID or email address
                discord: "", // Enter discord ID
                teams: "", // Enter channel name
                push: "", // Enter push token
            },
            data: {
                // Enter data here
            },
        },
    ]);
```
**Caution:** The maximum accepted payload size (for bulk send) is 10 MB.

For more details, please visit our [API Reference guide](https://docs.fyno.io/reference).

# Creating a user profile
You can create a user profile using `identify()` method and update the existing profile with `updateProfile()` method, use the below snipped to create user profile in Fyno

```js
const profile = fyno.identify("<DISTINCTID>", {
    name: "<FULL NAME>",
    channel: {
        sms: "", // Enter mobile number for sms channel with country code
        whatsapp: "", // Enter mobile number for whatsapp channel with country code
        email: "", // Enter email address
        slack: "", // Enter Slack Id or Email address
        discord: "", // Enter Discord id
        teams: "", // Enter channel name
        inapp: [{
            token: "", // Enter Inapp token
            integration_id: "", // Enter Inapp integration ID to be used for this token.
            status: "" // Status of token
        }],
        push: [{
            token: "", // Enter Push token
            integration_id: "", // Enter Push integration ID to be used for this token.
            status: "" // Status of token
        }]
    }
})
profile.create()
```

use the below code to update the existing profile

```js
const profile = fyno.update("<DISTINCTID>", {
    name: "<MODIFIED_FULL NAME>",
    channel: {
        sms: "", // Enter mobile number for sms channel with country code
        whatsapp: "", // Enter mobile number for whatsapp channel with country code
        email: "", // Enter email address
        slack: "", // Enter Slack Id or Email address
        discord: "", // Enter Discord id
        teams: "", // Enter channel name
        inapp: [{
            token: "", // Enter Inapp token
            integration_id: "", // Enter Inapp integration ID to be used for this token.
            status: "" // Status of token
        }],
        push: [{
            token: "", // Enter Push token
            integration_id: "", // Enter Push integration ID to be used for this token.
            status: "" // Status of token
        }]
    }
})
```

# Adding and Removing Channels against a proflie
Once user is created you can use the returned object to add or remove channle data, use the below snippet to add/remove channle data

```js
const profile = fyno.identify("<DISTINCTID>")
//This will add sms number against the profile
profile.setSms("<MOBILE_NUMBER>")
//This will clear sms channel
profile.clearChannel(["sms", "whatsapp"])
```

> **_NOTE:_** For clearing channel you can just pass channel name except for inapp and push, for inapp and push you need to pass token like `profile.clearChannel("inapp", "<INAPP_TOKEN>")`