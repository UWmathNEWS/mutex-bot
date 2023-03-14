import time
import board
import neopixel
from adafruit_apds9960.apds9960 import APDS9960
import supervisor

supervisor.runtime.autoreload = False

i2c = board.I2C()  # uses board.SCL and board.SDA
# i2c = board.STEMMA_I2C()  # For using the built-in STEMMA QT connector on a microcontroller
apds = APDS9960(i2c)
pixels = neopixel.NeoPixel(board.NEOPIXEL, 2)

apds.enable_color = True

#pixels.fill((255, 0, 0))

while True:
    print(apds.color_data[3] / 65535 * 1.0)
    time.sleep(0.2)
