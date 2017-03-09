var alarms={};
var notifs= {};

var theTemplateScript = document.getElementById('content').innerHTML;
var theTemplate = Handlebars.compile(theTemplateScript);
var theCompiledHtml = theTemplate();

document.getElementById('root').innerHTML=theCompiledHtml;

var notifContainer = document.createElement('div'); //container(flex box) for notifications
notifContainer.classList.add('container');
document.body.appendChild(notifContainer);

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
    var date = new Date();

    Object.keys(alarms).forEach(function(key){
        if(document.getElementById(key)) { //check if timer exists
            if (alarms[key]["time"] - date.getTime() > 0){//if the time is positive
                var difference= alarms[key]["time"] - date.getTime();
                var seconds = ('0' + Math.floor((difference/1000)% 60)).slice(-2);
                var minutes = ('0' + Math.floor((difference/1000/60))).slice(-2);
                document.getElementById(key).children[0].innerHTML = minutes + ':' + seconds;
                document.getElementById(key).children[1].innerHTML =  alarms[key].status.charAt(0).toUpperCase() + alarms[key].status.slice(1);
            }
            else {
                document.getElementById(key).children[0].innerHTML = '00:00'; //otherwise set it to 00:00
                document.getElementById(key).children[1].innerHTML = alarms[key].status;
            }
        }
        else{//create the row for the new timer
            var tableRow = document.createElement('tr');
            tableRow.id=key;
            var timeLeft = document.createElement('td');
            timeLeft.classList.add('time');
            var status = document.createElement('td');
            status.classList.add('status');
            var delData = document.createElement('td');
            var deleteBtn= document.createElement('button');
            deleteBtn.classList.add('delete');
            deleteBtn.addEventListener('click', function(){//add event listener for deleting timer
                deleteTimer(key)
            });
            deleteBtn.classList.add('delete');
            delData.appendChild(deleteBtn);
            var diff= alarms[key]["time"] - date.getTime();//assume positive time difference
            var second = ('0' + Math.floor((diff/1000)% 60)).slice(-2);
            var minute = ('0' + Math.floor((diff/1000/60))).slice(-2);
            timeLeft.innerHTML=minute + ':' + second;
            status.innerHTML= alarms[key].status.charAt(0).toUpperCase() + alarms[key].status.slice(1);
            deleteBtn.innerHTML='Delete';
            tableRow.appendChild(timeLeft);
            tableRow.appendChild(status);
            tableRow.appendChild(delData);
            document.getElementById('table').appendChild(tableRow);
        }
        createNotification(key);
    });
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
function deleteTimer(key){
    var row=document.getElementById(key);
    row.parentNode.removeChild(row);//remove the row
    delete alarms[key];

    var xhr = new XMLHttpRequest();
    xhr.open('DELETE', '/alarm/' + key, true);
    xhr.setRequestHeader('Content-type', 'application/json');
    xhr.send(null);
}
getAlarms();
updateTimerAndNotifs();
window.setInterval(getAlarms, 5000);
window.setInterval(updateTimerAndNotifs, 1000);



