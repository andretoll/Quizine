/* 
This is a service that is used to request and retrieve Push Notifications permission as well as to send notifications if browser supports it. 
It exposes functions to request and retrieve Push Notifications permission as well as to send notifications. 
*/

const isSupported = () =>
'Notification' in window &&
'serviceWorker' in navigator &&
'PushManager' in window;

export function getNotificationsPermission() {

    try {

        // Check if browser supports it
        if (!isSupported) {
            console.warn("Notifications not supported");
        }

        else {

            // Return notification permission
            return Notification.permission;
        }

    } catch (error) {
        console.error("Unexpected error when getting permission to push notifications")
    }
}

export function requestNotificationsPermission() {

    try {

        // Check if browser supports it
        if (!isSupported) {
            console.warn("Notifications not supported");
        }

        else {

            // Request permission and return response
            return Notification.requestPermission();
        }

    } catch (error) {
        console.error("Unexpected error when requesting permission to push notifications")
    }

}

export function sendNotification(title, message, onClick) {

    try {

        // Check if browser supports it
        if (!isSupported) {
            console.warn("Notifications not supported");
        }

        else {

            // If document is not hidden (active), return without sending notification
            if (!document.hidden)
                return;

            var notification = new Notification(title, { body: message });
            notification.onclick = onClick;
        }

    } catch (error) {
        console.error("Unexpected error when pushing notifications")
    }
}