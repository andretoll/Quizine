
export function sendNotification(title, message, onClick) {

    // If document is not hidden (active), return without sending notification
    if (!document.hidden)
        return;

    var notification = new Notification(title, { body: message });
    notification.onclick = onClick;
}