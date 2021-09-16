export function requestNotificationsPermission() {

    try {

        // Check if browser supports it
        if (!("Notification" in window)) {
            console.debug("Notifications not supported");
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
        if (!("Notification" in window)) {
            console.debug("Notifications not supported");
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