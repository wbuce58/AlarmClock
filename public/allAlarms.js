var alarms={};
var notifs= {};
var alarmSeen=false;//xhr for alarms not made yet
var id='';

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

            if(document.getElementsByClassName('spinner')[0]){//delete spinner if present
                var spinner=document.getElementsByClassName('spinner')[0];
                spinner.parentNode.removeChild(spinner);
            }

            if(Object.keys(alarms).length === 0 ){//if alarm object is empty
                if(!document.getElementsByClassName('no-alarm')[0]) {//if no alarm div is not present
                    var noAlarm = document.createElement('div');
                    noAlarm.innerHTML = 'You have no alarm';
                    noAlarm.classList.add('no-alarm');
                    document.getElementById('main-content').appendChild(noAlarm);
                }
                if(document.getElementById('table')) { //if table exists and no alarm is present, delete table
                    var table=document.getElementById('table');
                    table.parentNode.removeChild(table);
                    var title=document.getElementById('title');//delete title as well
                    title.parentNode.removeChild(title);
                }
                if(id) {//if there is a update notif interval set, delete it
                    clearInterval(id);
                    id='';
                }
            }

            else if(!document.getElementById('table')){//if there are alarms but no table present, create table and title

                if(document.getElementsByClassName('no-alarm')[0]){
                    var noAlarm=document.getElementsByClassName('no-alarm')[0];
                    noAlarm.parentNode.removeChild(noAlarm);
                }

                var title=document.createElement('div');
                title.id='title';
                title.innerHTML='All Alarms';
                document.getElementById('main-content').appendChild(title);
                var table=document.createElement('table');
                table.id='table';
                table.setAttribute('cellspacing', '0');
                var tableRow=document.createElement('tr');
                var th1=document.createElement('th');
                th1.innerHTML='Alarm';
                var th2=document.createElement('th');
                th2.innerHTML='Name';
                var th3=document.createElement('th');
                th3.innerHTML='Status';
                var th4=document.createElement('th');
                th4.innerHTML='Action';
                tableRow.appendChild(th1);
                tableRow.appendChild(th2);
                tableRow.appendChild(th3);
                tableRow.appendChild(th4);
                table.appendChild(tableRow);
                document.getElementById('main-content').appendChild(table);

                updateTimerAndNotifs();//now that alarms are present, we can update timer and notifs
                id=window.setInterval(updateTimerAndNotifs, 1000);


                var deleteParam=window.location.search; //delete once all alarms have been loaded

                if(deleteParam){ //if the url has a query parameter called delete, delete the timer
                    var deleteId= deleteParam.slice(deleteParam.indexOf('=')+1);
                    deleteTimer(deleteId);
                }

            }
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
                document.getElementById(key).children[2].innerHTML =  alarms[key].status.charAt(0).toUpperCase() + alarms[key].status.slice(1);
            }
            else {
                document.getElementById(key).children[0].innerHTML = '00:00'; //otherwise set it to 00:00
                document.getElementById(key).children[2].innerHTML = alarms[key].status.charAt(0).toUpperCase() + alarms[key].status.slice(1);
            }
        }
        else{//create the row for the new timer
            var tableRow = document.createElement('tr');
            tableRow.id=key;
            var timeLeft = document.createElement('td');
            timeLeft.classList.add('time');
            var name =document.createElement('td');
            name.classList.add('name');
            if(alarms[key].name) {
                name.innerHTML = alarms[key].name;
            }
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
            if(alarms[key]["time"] - date.getTime()>0) {
                var diff = alarms[key]["time"] - date.getTime();
                var second = ('0' + Math.floor((diff / 1000) % 60)).slice(-2);
                var minute = ('0' + Math.floor((diff / 1000 / 60))).slice(-2);
                timeLeft.innerHTML = minute + ':' + second;
            }
            else{
                timeLeft.innerHTML='00:00';
            }
            status.innerHTML= alarms[key].status.charAt(0).toUpperCase() + alarms[key].status.slice(1);
            deleteBtn.innerHTML='Delete';
            tableRow.appendChild(timeLeft);
            tableRow.appendChild(name);
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
        text.classList.add('time-up');
        if(alarms[key].name) {
            var name = document.createElement('p');
            name.classList.add('notif-name');
            name.innerHTML = 'Name: ' + alarms[key].name;
        }
        var closeBtn= document.createElement('div');
        closeBtn.innerHTML='&times';
        closeBtn.classList.add('close');
        closeBtn.addEventListener('click', function(){
            var notif= closeBtn.parentNode;
            notif.parentNode.removeChild(notif);//remove the notification
        });
        notification.appendChild(text);
        notification.appendChild(closeBtn);
        if(alarms[key].name){
            notification.appendChild(name);
        }
        notification.classList.add('notification');
        notifs[key]=true; //means that notification for this timer has been set
        document.getElementsByClassName('container')[0].appendChild(notification);
    }
}
function deleteTimer(key){
    var row=document.getElementById(key);
    if(row) {
        row.parentNode.removeChild(row);//remove the row
        delete alarms[key];

        var xhr = new XMLHttpRequest();
        xhr.open('DELETE', '/alarm/' + key, true);
        xhr.setRequestHeader('Content-type', 'application/json');
        xhr.send(null);
    }
}
getAlarms();

window.setInterval(getAlarms, 3000);



