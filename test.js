var http = require("http");

spotify = {
        lookup: function (b, c) {
                var a = "/lookup/1/.json?uri=spotify:" + b.type + ":" + b
                        .id;
                "artist" === b.type && (a += "&extras=album");
                this.get(a, c)
        },
        search: function (b, c) {
                this.get("/search/1/" + b.type + ".json?q=" + b
                        .query, c)
        },
        get: function (b, c) {
                var a = {
                        host: "ws.spotify.com",
                        path: encodeURI(b),
                        method: "GET"
                }, a = http.request(a, (function (b) {
                        var c = "";
                        return function (a) {
                                a.setEncoding("utf8");
                                a.on("data", function (a) {
                                        c += a
                                });
                                a.on("end", function () {
                                        var a, d;
                                        try {
                                                d = JSON.parse(c)
                                        } catch (e) {
                                                a = e, console.log(e)
                                        }
                                        b(a, d)
                                })
                        }
                })(c));
                a.end();
                a.on("error", function (a) {
                        c(a, {})
                })
        }
};

spotify.search({
        type: 'track',
        query: 'Chopin Nocturne 27'
}, function (err, data) {
        if (err) return res.end('Error occurred: ' + err);
        tracks = data.tracks;
        for (item in tracks) {
                track = tracks[item];
                console.log(
                        "\u001b[37m" + track.name,
                        "\u001b[0mon",
                        "\u001b[37m" + track.album.name,
                        "\u001b[0min",
                        "\u001b[37m" + track.album.released +
                        "\u001b[0m"
                );
        }
});