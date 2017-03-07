var express = require('express');
var request = require('request');
var _ = require('underscore');
var router = express.Router();

router.delete('/:id', deleteAlarm);
router.get('/:id', getAlarm);
router.get('/', getAlarms);
router.post('/', createAlarm);

module.exports = router;

const uuidV4 = require('uuid/v4');

// Store the alarms in a hash instead of persistent storage
var alarms = {};

function deleteAlarm(req, res) {
    // Ensure the id is valid.
    var id = req.params.id;
    if(!id || typeof id !== 'string' || id.length != 36) {
        return res.status(400).json({message: 'Invalid id provided.'});
    }

    // Try to locate the requested entry.
    if(alarms[id]) {
        clearTimeout(alarms[id].timeout);
        delete alarms[id];
    }

    return res.status(204).send();
}

function getAlarm(req, res) {
    // Ensure the id is valid.
    var id = req.params.id;
    if(!id || typeof id !== 'string' || id.length != 36) {
        return res.status(400).json({message: 'Invalid id provided.'});
    }

    // Try to locate the requested entry.
    var entry = alarms[id];
    if(!entry) {
        return res.status(404).json({message: 'No such alarm found.'});
    }

    return res.send(_.pick(entry, 'time', 'event'));
}

function getAlarms(req, res) {
    var alarmsCopy = _.mapObject(alarms, (alarm, key) => {
       return _.pick(alarm, 'time', 'event');
    });
    return res.send(alarmsCopy);
}

function createAlarm(req, res) {
    var uuid = uuidV4();
    alarms[uuid] = {
        time: 'now'
    };
    if(req.body && req.body.event)
        alarms[uuid].event = req.body.event;
    if(req.body && req.body.key)
        alarms[uuid].key = req.body.key;
    
    // Set an alarm to go off in a future time period from now, e.g. 5 minutes from now.
    var currentTime = new Date();
    currentTime.setSeconds(currentTime.getSeconds()+5);
    // currentTime.setMinutes(currentTime.getMinutes()+1);
    alarms[uuid].timeout = setTimeout(alarm, currentTime - Date.now(), uuid, 0);

    return res.send({ id: uuid });
}

function alarm(id, count) {
    // Repeat the alarm every 5 seconds, if it hasn't been cancelled.
    alarms[id].timeout = setTimeout((id, count) => {
        console.log(`Alarmed for ${ id } on count ${ count }`);
        // Turn off the alarm if there's no answer after some number of attempts
        if(count >= 5) {
            clearTimeout(alarms[id].timeout);
        } else {
            sendMessage(id);
            count++;
            // Try the alarm again
            alarm(id, count);
        }
    }, 5000, id, count++);
}

function sendMessage(id) {
    var event = alarms[id].event;
    var key = alarms[id].key;
    if(event && key) {
        console.log('Sending the message ' + event + ' ' + key);
        request.post('https://maker.ifttt.com/trigger/' +event + '/with/key/' + key, (err, res, body) => {
            if(err) {
                console.log('Error ' + err);
            } else {
                console.log(JSON.stringify(res,null,3));
                console.log(body);
            }
        });
    }
}