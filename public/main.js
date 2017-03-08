var alarms = {};

var theTemplateScript = document.getElementById('content').innerHTML;
var theTemplate = Handlebars.compile(theTemplateScript);
var theCompiledHtml = theTemplate();

document.getElementById('root').innerHTML=theCompiledHtml;

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
    if(minute && !minute.value){
        minute.setAttribute('required', true);
        readySubmit=false
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

function updateTimerAndNotifs() { //update timer and notifications
    var smallestTime=Infinity;
    var date = new Date();
    var activeAlarms=0;
    Object.keys(alarms).forEach(function(key){//checks to see if alarm is active
        if(alarms[key].status==='active')
            activeAlarms++;
    });

    Object.keys(alarms).forEach(function(key){
        if(((alarms[key]["time"]-date.getTime()) < smallestTime) && (alarms[key]["time"]-date.getTime() > 0)){ //find the smallest number out of all the alarms
            smallestTime=alarms[key]["time"]-date.getTime();
        }
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

window.setInterval(getAlarms, 5000);
window.setInterval(updateTimerAndNotifs, 1000);