function buildWidgets() {
    var servers = document.getElementsByClassName("server");
    for (var i = 0; i < servers.length; i++) {
        var serv = servers[i];
        widgetConstructor(serv);
        nameAdjust();
    }
}

function nameAdjust() {
    var playernames = document.getElementsByClassName("playername");
    for (var k = 0; k < playernames.length; k++) {
        var adjust = playernames[k].width;
        playernames[k].style = "margin-left:-" + adjust + "px;";
    }
}

function widgetConstructor(serv) {
    var servdata = serv.id.split(";");
    var address = servdata[0];
    var servname = servdata[1];
    var servid = servdata[2];
    var node = address;
    if (servdata[3]) {
        node = servdata[3];
    }
    var port = "";
    if (servdata[4]) {
        port = '&port=' + servdata[4];
    }

    $.getJSON('https://api.syfaro.net/server/status?ip=' + node + port + '&favicon=true&players=true&callback=?', function (json) {
        var icon;
        var online = json.online;
        var maxplayers;
        var currentplayers;
        var players;
        var status;
        var playerheads = [];
        if (!json) {
            console.log("API couldn't find " + servname + ", no JSON returned.");
        }
        if (online) {
            //console.log(json);
            icon = json.favicon;
            online = json.online;
            maxplayers = json.players.max;
            currentplayers = json.players.now;
            players = json.players.sample;
            status = "ONLINE";
            for (var j = 0; j < players.length; j++) {
                playerheads[j] = '<li><img src="https://minotar.net/avatar/' + players[j].name + '/32">' +
                    '<div class="playername">' + players[j].name + '</div></li>';
            }
        } else {
            status = "OFFLINE";
            icon = "https://secure.static.tumblr.com/zztymp9/TBQn2wsea/ask.png";
        }
        var widget = '<div class="serverheader ' + status + '">' +
            '<img src="' + icon + '">' +
            '<div><h3>' + servname + '</h3>' +
            '<input title="Copy and paste into Minecraft!" readonly="true" value="' + address + '" onclick="this.select();" />' +
            '</div><a href="http://the-minecraft-blog.com/' + servid + '">&#10162;</a>' +
            '</div>';

        if (online) {
            widget += '<div class="serverinfo">' +
                '<p>Players: ' + currentplayers + '/' + maxplayers + '</p>' +
                '<ul>' + playerheads.join("") + '</ul></div>';
        } else {
            widget += '<p style="font-size:8pt;margin:5px;">The ' + servname + ' is offline. Either the server is down for maintenance or the <a href="http://api.syfaro.net/">API</a> is offline. Sorry!</p>';
        }
        serv.innerHTML = widget;
    });
}

 $(document).ready(function() {
     buildWidgets();
     $('.serverheader').hover(function () {
         $('a', this).fadeIn(100);
     }, function () {
         $('a', this).fadeOut(100);
     });
     
 });