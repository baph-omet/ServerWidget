console.clear();

function ping() {
    console.log("ping");
}

// Create each instance of the widget
function buildWidgets() {
    var servers = document.getElementsByClassName("server");
    for (var i = 0; i < servers.length; i++) {
        widgetConstructor(servers[i]);
        nameAdjust();
    }
}

function adjustFillbar(fillbar, currentplayers, maxplayers) {
    // Dynamically set width of fillbars
    fillbar.style.width = (currentplayers * 250 / maxplayers) + "px";
    if (currentplayers / maxplayers > 0.95) fillbar.style.borderBottomRightRadius = 10 + "px";
    console.log("fillbar adjusted");
}

// Adjust margin of player head
function nameAdjust() {
    var playernames = document.getElementsByClassName("playername");
    for (var k = 0; k < playernames.length; k++) {
        var adjust = playernames[k].width;
        playernames[k].style = "margin-left:-" + adjust + "px;";
    }
}

// Build a single widget
function widgetConstructor(serv) {

    // Get information about the server from the div's ID
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
        port = ':' + servdata[4];
    }
    var qport = port;
    if (servdata[5]) {
        qport = ":" + servdata[5];
    }

    var baseQuery = 'https://api.mcsrvstat.us/2/' + address;

    // Initialize output variables
    var icon = "https://secure.static.tumblr.com/zztymp9/TBQn2wsea/ask.png";
    var online;
    var maxplayers;
    var currentplayers;
    var players;
    var status;
    var playerheads = [];
    var version;

    // Status and basic info query
    $.getJSON(baseQuery, function (json) {
        console.log("JSON Info File for " + servname + ":");
        console.log(json);

        online = json.online;
        if (!json) console.log("API couldn't find " + servname + ", no JSON returned.");

        if (online) {
            status = "ONLINE";
            maxplayers = json.players.max;
            currentplayers = json.players.online;
            icon = json.icon;
            version = json.version;
        } else {
            status = "OFFLINE";
        }

        serv.innerHTML = '<div class="serverheader ' + status + '">' +
            '<img src="' + icon + '">' +
            '<div><h3>' + servname + '</h3>' +
            '<input title="Copy and paste into Minecraft!" readonly="true" value="' + address + '" onclick="this.select();" />' +
            '</div><a href="http://the-minecraft-blog.com/' + servid + '" target="_blank">&#10162;</a>' +
            '</div>';

        if (online) {
            serv.innerHTML += '<div class="serverinfo"><div class="fillbar" style="width:' + (currentplayers * 250 / maxplayers) + 'px;"></div>' +
                '<p>Players: ' + currentplayers + '/' + maxplayers + '</p></div>';
        } else {
            serv.innerHTML += '<p style="font-size:8pt;margin:5px;">The ' + servname + ' is offline. Either the server is down for maintenance or the <a href="http://mcsrvstat.us/">API</a> is offline. Sorry!</p>';
        }
    });
    
    players = json.players.list;
    for (var j = 0; j < players.length; j++) {
      playerheads[j] = '<li><img src="https://minotar.net/avatar/' + players[j].name + '/32">' +
        '<div class="playername">' + players[j].name + '</div></li>';
    }
    serv.innerHTML += '<ul>' + playerheads.join("") + '</ul>';
}

$(document).ready(function () {
    buildWidgets();
    $('.serverheader').hover(function () {
        $('a', this).fadeIn(100);
    }, function () {
        $('a', this).fadeOut(100);
    });
});
