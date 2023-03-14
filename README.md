# Office status bot

Monitors the light at a light sensor (that outputs a light value between 0 and 1) and sets a Discord channel name corresponding to that.

## Setup

Runs on Linux. Make sure your user is in the `dialout` group:

```
sudo usermod -a -G dialout $USER
```

Reboot computer after this change.

Plug in the light sensor and make sure it outputs a luminance value between 0 and 1 (sample light sensor code for Adafruit APDS9960 in `code.py`). Figure out what serial device it outputs to (eg. `/dev/ttyACM0`). Create a file called `config.pii.js` as follows:

```js
module.exports = {
	token: 'YOUR_DISCORD_BOT_TOKEN',
	device: 'YOUR_DEVICE_FILENAME',
	threshold: 0.01
};
```

where `threshold` is the minimum value of light at the sensor that you want to consider the office open. Can be determined experimentally with `cat /dev/ttyACM0`.

Run the bot with:

```
$ node index.js
```
