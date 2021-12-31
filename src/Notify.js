const notifier = require('node-notifier');
const { BrowserWindow } = require('electron')
const path = require('path');

class Notify
{
    constructor() {}

    toastConfirm(msg)
    {
        notifier.notify(
          {
            title: '인트라넷 메세지',
            message: msg,
            icon: path.join(__dirname, 'favicon.png'),
            actions: ['확인']
          },(err, data) => {
            if (!err) {
            }
          }
        );
    }
}

module.exports = new Notify();