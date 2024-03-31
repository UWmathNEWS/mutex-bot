# Mutex bot

Updates a Discord channel to reflect whether or not a user is currently logged into a Windows computer, allowing safe remote user concurrency on single-user Windows licenses.

## Setup

Create a file called `config.pii.js` as follows:

```js
module.exports = {
	token: 'YOUR_DISCORD_BOT_TOKEN',
};
```

Initial setup (use git bash or command prompt or powershell):

```
$ git clone mutex-bot
$ cd mutex-bot 
$ npm install
```

Open Task Scheduler, and create a new task with the following settings:

* Mutex lock task
	- Trigger: on workstation *unlock*
	- Action: start a program
		- Program: path to `nodejs.exe`
		- Arguments: `<path to index.js of this repo> lock <machine-name>`

* Mutex unlock task
	- Trigger: on workstation *lock*
	- Action: start a program
		- Program: path to `nodejs.exe`
		- Arguments: `<path to index.js of this repo> unlock <machine-name>`

Open Group Policy Editor, and go to User Configuration -> Windows Settings -> Scripts (Logon/Logoff).

* Add a Logon script
	- Script Name: path to `nodejs.exe`
	- Script Parameters: `<path to index.js of this repo> lock <machine-name>`

* Add a Logoff script
	- Script Name: path to `nodejs.exe`
	- Script Parameters: `<path to index.js of this repo> unlock <machine-name>`

**Note** that you *must* add both the scheduled tasks and the logon/logoff scripts! Locking/unlocking an account and logging off/on are two separate things and we want the mutex state to change on both of them.

To automatically lock/unlock the system on inactivity (ie. when the screen goes black), go to the Power Settings to see what the timeout period is for the screen to go black, and then add a screensaver that starts that many minutes afterwards. Make sure to enable "On resume, display logon screen" in the screensaver settings. This will make it so that the computer locks whenever it is inactive, which unlocks the mutex for others.
