import * as admin from 'firebase-admin'
import shortid from 'shortid'
const axios = require('axios');

const notificationApiRequestInstance = axios.create({
    baseURL: 'https://fcm.googleapis.com/fcm/',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `key=${process.env.API_KEY}`,
        'project_id': process.env.PROJECT_ID
    }
})
let serviceAccount = require("./drug1market-firebase-adminsdk-oi8k5-b97d6e144a.json")

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://drug1market.firebaseio.com"
})

async function notificationOperations(pharmacies, title, body) {
    let payload = {
        notification: {
            title,
            body
        }
    }

    let regisTokens = getRegisTokens(pharmacies)

    while (regisTokens.length) {
        let subRegistTokensGroup = regisTokens.splice(0, 20),
            deviceGroupName = shortid.generate()
        let notificationKey = await createDeviceGroup(subRegistTokensGroup, deviceGroupName)
        console.log(notificationKey)
        sendNotification(notificationKey, payload)
        removeDevicesFromGroup(subRegistTokensGroup, deviceGroupName, notificationKey)
    }
}

function getRegisTokens(pharmacies) {
    let regisTokens = []
    for (let i = 0; i < pharmacies.length; i++) {
        if (pharmacies[i].registerationToken) {
            regisTokens.push(pharmacies[i].registerationToken)
        }
    }
    return regisTokens
}

async function createDeviceGroup(regisTokens, deviceGroupName) {
    let notificationKey = null
    await notificationApiRequestInstance.post('notification', {
        "operation": "create",
        "notification_key_name": deviceGroupName,
        "registration_ids": regisTokens
    }).then((res) => {
        notificationKey = res.data.notification_key
    }).catch((err) => {
        console.log(err.message)
    })
    return notificationKey
}

async function removeDevicesFromGroup(regisTokens, groupName, notificationKey) {
    let done = await notificationApiRequestInstance.post('notification', {
        "operation": "remove",
        "notification_key_name": groupName,
        "notification_key": notificationKey,
        "registration_ids": regisTokens
    }).then(() => {
        done = true
    }).catch((err) => {
        done = false
        console.log(err)
    })
    return done
}

function sendNotification(notificationKey, payload) {
    admin.messaging().sendToDeviceGroup(notificationKey, payload)
        .then((response) => {
            // Response is a message ID string.
            console.log('Successfully sent message:', response);
        })
        .catch((error) => {
            console.log('Error sending message:', error);
        })
}

export {
    notificationOperations
}