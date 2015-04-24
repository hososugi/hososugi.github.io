<?php

/*
curl 
 --header "Authorization: key=AIzaSyCMcxdbY8D9OMXxgPOw40IBneEo9gkoe5g" 
 --header "Content-Type: application/json" 
 https://android.googleapis.com/gcm/send 
 -d "{\"registration_ids\":[\"APA91bG0Efc-FA3f2nEUnUi-h0uFhw4wdqmU13rly-f86WVx63EITxUohVXBNLblrWLkrRMJOW7CEvJHJ-rXrwuRfp3kggSmfW4Gki0aYtUEYuNdcxwqOgBDkIe2-QCqrRcxsk2GQaGcrplFYKQ1iCv-LwZ4uNxv1r44bdWe9e2yKNlHsSym2BU\"]}"
 */

$d = "{\"registration_ids\":[\"APA91bG0Efc-FA3f2nEUnUi-h0uFhw4wdqmU13rly-f86WVx63EITxUohVXBNLblrWLkrRMJOW7CEvJHJ-rXrwuRfp3kggSmfW4Gki0aYtUEYuNdcxwqOgBDkIe2-QCqrRcxsk2GQaGcrplFYKQ1iCv-LwZ4uNxv1r44bdWe9e2yKNlHsSym2BU\"]}";

$ch = curl_init();
curl_setopt($ch, array(
    CURLOPT_URL =>"https://android.googleapis.com/gcm/send",
    CURLOPT_CUSTOMREQUEST => "POST",
    CURLOPT_HTTPHEADER => array(
        "Authorization: key=AIzaSyCMcxdbY8D9OMXxgPOw40IBneEo9gkoe5g",
        "Content-Type: application/json"
    ),
    CURLOPT_POSTFIELDS => $d
)); 

echo 'Results: '.curl_exec($ch);

curl_close($ch); 

phpinfo();