var Discord = require('discord.io');
var logger = require('winston');
var auth = require('./auth.json');
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';
// Initialize Discord Bot
var bot = new Discord.Client({
   token: auth.token,
   autorun: true
});
bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
});
bot.on('message', function (user, userID, channelID, message, evt) {
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!`
    if (message.substring(0, 1) == '!') {
        var args = message.substring(1).split(' ');
        var cmd = args[0];
       
        args = args.splice(1);
        switch(cmd) {
            // !ping
            case 'logs':
                bot.sendMessage({
                    to: channelID,
                    message: 'Panel logs: `tail -n 100 /var/www/pterodactyl/storage/logs/laravel-$(date +%F).log | nc bin.ptdl.co 99`'
                });
		sleep(100);
		bot.sendMessage({
                    to: channelID,
                    message: 'Daemon logs: `cd /srv/daemon/ && npm run diagnostics`'
                });
            break;
		case 'check':
		bot.sendMessage({
                    to: channelID,
                    message: 'This command can be useful to check for errors on the panel:\n`/usr/bin/php /var/www/pterodactyl/artisan queue:work --queue=high,standard,low --sleep=3 --tries=3`'       
                })
		break;
		case 'install':
		bot.sendMessage({
                    to: channelID,
                    message: 'Install with `bash <(curl -s https://raw.githubusercontent.com/vilhelmprytz/pterodactyl-installer/master/install.sh)`'       
                });
		break;
		case 'help':
		bot.sendMessage({
                    to: channelID,
                    message: 'Available commands:\n`!logs` shows how to retrieve logs for the panel and daemon\n`!install` gives the master installation script\n`!check` gives a useful command to check for panel errors\n`!firewall` gives directions on firewall setup'       
                });
		break;
		case 'firewall':     
                bot.sendMessage({
                    to: channelID,
                    message: '**Firewall setup**\nThe installation scripts do not configure your firewall automatically.\n\n*Debian/Ubuntu*\nOn Debian and Ubuntu, `ufw` can be used. Install it using `apt`.\n`apt install -y ufw`\nPanel\nThe script can automatically open the ports for SSH (22), HTTP (80) and HTTPS (443). The installer script should ask whether you\'d like it to configure UFW automatically or not.\n\nDaemon\nAllow 8080 and 2022.\n```ufw allow 8080\nufw allow 2022```\nEnable the firewall\nMake sure to also enable SSH (or allow SSH from your IP only, depending on your setup).\n`ufw allow ssh`\nEnable the firewall.\n`ufw enable`\n\n*CentOS*\nOn CentOS, `firewall-cmd` can be used.\n\nPanel\nAllow HTTP and HTTPS.\n```firewall-cmd --add-service=http --permanent\nfirewall-cmd --add-service=https --permanent```\nDaemon\nAllow 8080 and 2022.\n```firewall-cmd --add-port 8080/tcp --permanent\nfirewall-cmd --add-port 2022/tcp --permanent\nfirewall-cmd --permanent --zone=trusted --change-interface=docker0```\n\nEnable the firewall\nReload the firewall to enable the changes.\n`firewall-cmd --reload`'
		});
                break;          
            // Just add any case commands if you want to..
         }
     }
});