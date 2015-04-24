self.addEventListener('push', function(event){
    console.log("***Received a push message.", event);
    
    var title = "Push Notification Test";
    var body =  "Testing Chrome's new push notification. -Daniel Wheeler";
    var icon =  "images/cloud_notifications_outlined_192.png";
    var tag =   "dew-push-demo-tag";
    
    event.waitUntil(
        self.registration.showNotification(title,{
            body: body,
            icon: icon,
            tag: tag
        }));
});