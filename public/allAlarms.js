var alarms={};

var theTemplateScript = document.getElementById('content').innerHTML;
var theTemplate = Handlebars.compile(theTemplateScript);
var theCompiledHtml = theTemplate();

document.getElementById('root').innerHTML=theCompiledHtml;

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
                document.getElementById(key).children[1].innerHTML = alarms[key].status;
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
            status.innerHTML= alarms[key].status;
            deleteBtn.innerHTML='Delete';
            tableRow.appendChild(timeLeft);
            tableRow.appendChild(status);
            tableRow.appendChild(delData);
            document.getElementById('table').appendChild(tableRow);
        }
    });
}

function deleteTimer(key){
    var row=document.getElementById(key);
    row.parentNode.removeChild(row);//remove the row
    delete alarms[key];

    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/alarm/' + key, true);//////////////////////////////////////////check
    xhr.send(null);
}
getAlarms();
updateTimerAndNotifs();
window.setInterval(getAlarms, 5000);
window.setInterval(updateTimerAndNotifs, 1000);



