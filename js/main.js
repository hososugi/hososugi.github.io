
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
    
    registerServiceWorker();
});

function registerServiceWorker(){
	// Check for service workers.
	if('serviceWorker' in navigator){
        console.log("--- Service workers supported.");
		navigator.serviceWorker
            .register('service-worker.js')  
            .then(initializeState);  
	} 
	else{
		//$("input#pushSwitch").bootstrapSwitch('toggleDisabled', true);
		console.warn("--- Service workers aren't supported in this browser.");  
	} 
}

function initializeState(){
    console.log("--- initializeState() called.");
    
	// Check notifications.
	if(!'showNotification' in ServiceWorkerRegistration.prototype){
		console.warn("--- Notifications aren't supported.");
		return;
	}
    console.log("--- Notifications supported.");
	
	// Check for push messaging.
	if(!'PushManager' in window){
		console.warn("---Push messaging isn't supported.");
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
                    $("input#pushSwitch").bootstrapSwitch('disabled', true);
                } 
                else{
                    console.warn('--- Unable to subscribe.');
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
                $("input#pushSwitch").bootstrapSwitch('disabled', false);
            });
        })
        .catch(function(error){
            console.error("--- Push manager unsubscription error. ", error);
        });
    });
}