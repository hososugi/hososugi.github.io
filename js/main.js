
$(document).ready(function()
{
    $("input#pushSwitch").bootstrapSwitch({
        state:              false,
        inverse:            true,
        disabled:           true,
        onSwitchChange:     function(e){
            if($(this).is(':checked')){
                subscribe();
            }
            else{
                unsubscribe();
            }
        }
    });
    
    if(checkBrowser())
        registerServiceWorker();
});

function checkBrowser(){
    valid = true;
    if(navigator.sayswho != "Chrome 42"){
        valid = false;
        $("#errorMessage").html("You must use Chrome desktop or mobile version 42 or higher.").show();
    }
    
    return valid;
}

function registerServiceWorker(){
	// Check for service workers.
	if('serviceWorker' in navigator){
        console.log("--- Service workers supported.");
		navigator.serviceWorker
            .register('service-worker.js')  
            .then(initializeState);  
	} 
	else{
		console.warn("--- Service workers aren't supported in this browser."); 
        $("#errorMessage").html("Service workers aren't supported in this browser.").show();
	} 
}

function initializeState(){
    console.log("--- initializeState() called.");
    
	// Check notifications.
	if(!'showNotification' in ServiceWorkerRegistration.prototype){
		console.warn("--- Notifications aren't supported.");
        $("#errorMessage").html("Notifications aren't supported.").show();
		return;
	}
    console.log("--- Notifications supported.");
	
	// Check for push messaging.
	if(!'PushManager' in window){
		console.warn("--- Push messaging isn't supported.");
        $("#errorMessage").html("Push messaging isn't supported.").show();
		return;
	}
    console.log("--- PushManager supported.");
	
    // Register the service worker.
	navigator.serviceWorker.ready.then(function(serviceWorkerRegistration){
		serviceWorkerRegistration.pushManager.getSubscription()
            .then(function(){
                console.log("--- Enable the switch button.");
        
                // Enable the switch button.
                $("input#pushSwitch").bootstrapSwitch('disabled', false);
            })
            .catch(function(error){
                console.error("--- Error during getSubscription() ", error);
                $("#errorMessage").html("Error during getSubscription(): "+error).show();
            });
	});
	
}

function subscribe(){
    console.log("--- subscribe() called.");
    
    // Disable the button while working.
    $("input#pushSwitch").bootstrapSwitch('disabled', true);
    
    navigator.serviceWorker.ready.then(function(serviceWorkerRegistration){
        serviceWorkerRegistration.pushManager.subscribe()
            .then(function(subscription){
                console.log("--- Subscription successful. subscription: "+JSON.stringify(subscription.subscriptionId));
                $("input#pushSwitch").bootstrapSwitch('disabled', false);
                $.cookie("subscriptionId", subscription.subscriptionId);
                
                $("#curlCommand").html('curl --header "Authorization: key=AIzaSyCMcxdbY8D9OMXxgPOw40IBneEo9gkoe5g" --header "Content-Type: application/json" https://android.googleapis.com/gcm/send -d "{\\"registration_ids\\":[\\"'+subscription.subscriptionId+'\\"]}"');
            })
            .catch(function(error){
                if(Notification.permission === 'denied'){
                    console.warn('--- Permission for Notifications was denied.');
                    $("#errorMessage").html("Permission for Notifications was denied.").show();
                    $("input#pushSwitch").bootstrapSwitch('disabled', true);
                } 
                else{
                    console.warn('--- Unable to subscribe.');
                    $("#errorMessage").html("Unable to subscribe.").show();
                    $("input#pushSwitch").bootstrapSwitch('disabled', true);
                }
            });
    });
}

function unsubscribe(){
    console.log("--- unsubscribe() called.");
    
    // Disable the button while working.
    $("input#pushSwitch").bootstrapSwitch('disabled', true);
    $.removeCookie("subscriptionId");
    
    navigator.serviceWorker.ready.then(function(ServiceWorkerRegistration){
        ServiceWorkerRegistration.pushManager.getSubscription().then(function(pushSubscription){
            if(!pushSubscription){
                console.error("--- No subscriptions.");
                $("input#pushSwitch").bootstrapSwitch('disabled', false);
                
                return;
            }
            
            var id = pushSubscription.subscriptionId;
            
            // Unsubscribe.
            pushSubscription.unsubscribe().then(function(success){
                $("input#pushSwitch").bootstrapSwitch('disabled', false);
                console.log("--- Unsubscribing successful. ", success);
            })
            .catch(function(error){
                console.error("--- Unsubscription error: ", error);
                $("#errorMessage").html("Unsubscription error: "+error).show();
                $("input#pushSwitch").bootstrapSwitch('disabled', false);
            });
        })
        .catch(function(error){
            console.error("--- Push manager unsubscription error. ", error);
            $("#errorMessage").html("Push manager unsubscription error.").show();
        });
    });
}

navigator.sayswho = (function(){
    var ua= navigator.userAgent, tem, 
    M= ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
    if(/trident/i.test(M[1])){
        tem=  /\brv[ :]+(\d+)/g.exec(ua) || [];
        return 'IE '+(tem[1] || '');
    }
    if(M[1]=== 'Chrome'){
        tem= ua.match(/\bOPR\/(\d+)/);
        if(tem!= null) return 'Opera '+tem[1];
    }
    M= M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
    if((tem= ua.match(/version\/(\d+)/i))!= null) M.splice(1, 1, tem[1]);
    return M.join(' ');
})();