var alarms = {};
var notifs= {};

var theTemplateScript = document.getElementById('content').innerHTML;
var theTemplate = Handlebars.compile(theTemplateScript);
var theCompiledHtml = theTemplate();

document.getElementById('root').innerHTML=theCompiledHtml;

var notifContainer = document.createElement('div'); //container(flex box) for notifications
notifContainer.classList.add('container');
document.body.appendChild(notifContainer);

document.getElementsByClassName('button')[0].onclick= () => {
    var event=document.getElementsByClassName('event')[0];
    var key = document.getElementsByClassName('key')[0];
    var minute = document.getElementsByClassName('minute')[0];
    var readySubmit=true;

    if((event.value && !key.value) || (!event.value && key.value)){
        event.setAttribute('required', true);
        key.setAttribute('required', true);
        readySubmit=false;
    }
    else{
        event.removeAttribute('required');
        key.removeAttribute('required');
    }
    if(minute && !minute.value){
        minute.setAttribute('required', true);
        readySubmit=false
    }
    else{
        minute.removeAttribute('required');
    }
    if(readySubmit){
        var xhr = new XMLHttpRequest();
        xhr.open('POST', '/alarm', true);
        xhr.setRequestHeader('Content-type', 'application/json');
        xhr.send(JSON.stringify({'event': event.value, 'key': key.value, 'time': (minute.value * 60 * 1000)}));
    }
};

function getAlarms() {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            alarms = JSON.parse(xhr.responseText); //update alarm object
        }
    };
    xhr.open('GET', '/alarm', true);
    xhr.send(null);
}

function createNotification(key){
    var date = new Date();
    if((alarms[key].status==='active') && (alarms[key]["time"]-date.getTime() < 0) && !notifs[key]){//create notif only when active, time is less that zero, and when a notif has not already been made
        var notification= document.createElement('div');
        var text = document.createElement('p');
        text.innerHTML='Times up!';
        var closeBtn= document.createElement('div');
        closeBtn.innerHTML='&times';
        closeBtn.classList.add('close');
        closeBtn.addEventListener('click', function(){
           var notif= closeBtn.parentNode;
           notif.parentNode.removeChild(notif);//remove the notification
        });
        notification.appendChild(text);
        notification.appendChild(closeBtn);
        notification.classList.add('notification');
        notifs[key]=true; //means that notification for this timer has been set
        document.getElementsByClassName('container')[0].appendChild(notification);
    }
}

function updateTimerAndNotifs() { //update timer and notifications
    var smallestTime=Infinity;
    var date = new Date();
    var activeAlarms=0;
    Object.keys(alarms).forEach(function(key){
        if(alarms[key].status==='active')//checks to see if alarm is active
            activeAlarms++;

        if(((alarms[key]["time"]-date.getTime()) < smallestTime) && (alarms[key]["time"]-date.getTime() > 0)){ //find the smallest number out of all the alarms
            smallestTime=alarms[key]["time"]-date.getTime();
        }
        createNotification(key);
    });

    if(smallestTime!==Infinity){
        var seconds = ('0' + Math.floor((smallestTime/1000)% 60)).slice(-2);
        var minutes = ('0' + Math.floor((smallestTime/1000/60))).slice(-2);
        document.getElementsByClassName('time')[0].innerHTML=minutes + ':' + seconds;
    }
    else if(smallestTime===Infinity){
        document.getElementsByClassName('time')[0].innerHTML= '00:00';
    }

    document.getElementsByClassName('active')[0].innerHTML='Active alarms : ' + activeAlarms;//number of active alarms
}
getAlarms();
updateTimerAndNotifs();
window.setInterval(getAlarms, 5000);
window.setInterval(updateTimerAndNotifs, 1000);