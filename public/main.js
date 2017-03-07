
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
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        xhr.send('event=' + event.value + '&key=' + key.value + '&time=' + (minute.value * 60 * 1000));

        xhr.onreadystatechange = function() {
            if(xhr.readyState == 4 && xhr.status == 200) {
                console.log(xhr.responseText)
            }
        }
    }


};