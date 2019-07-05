# Install nodejs
curl -sL https://deb.nodesource.com/setup_10.x | bash -
apt-get install -y nodejs

# 
git clone Hippymood
git checkout hippynyle
npm install

# Follow instructions to get the RFID RC522 tag reader on the raspberry
https://github.com/ocsacesar/rc522


(Utile ?)
sudo apt-get update
sudo apt-get upgrade
sudo apt-get dist-upgrade
sudo rpi-update
sudo apt-get clean

sudo apt-get install build-essential
sudo npm install -g node-gyp

wget http://www.airspayce.com/mikem/bcm2835/bcm2835-1.49.tar.gz
tar -zxf bcm2835-1.49.tar.gz
cd bcm2835-1.49
./configure
make
sudo make check
sudo make install
sudo modprobe spi_bcm2835
