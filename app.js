//

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

fs = require("fs");
x = fs.readFileSync("page.html");
pr = fs.readFileSync("prototype.js");

hsh = require('crypto').createHash('md5').update(pr+x).digest('hex');

http.createServer(function (req, res) {
        request = decodeURIComponent(req.url.substring(7, req.url.length));
        if (req.url=="/proto")
                return res.writeHead(200, { 'Content-Type': 'text/javascript; charset=utf-8', 'Cache-Control': 'max-age=604800, must-revalidate', 'ETag': hsh}), res.end(pr);
        if (req.url.substring(1, 7) == "track/") {
                request = request.replace(/\:/gm, "").replace(/\//gm, "").replace(/\./gm, "").replace(/\_/gm, "").replace(/\?/gm, "").replace(/\&/gm, "").replace(/\=/gm, "").replace(/\(/gm, "").replace(/\)/gm, "").replace(/\'/gm, "").replace(/\"/gm, "");
                res.writeHead(200, {
                        'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'max-age=604800, must-revalidate', 'ETag': hsh
                });
                spotify.search({
                        type: 'track',
                        query: request
                }, function (err, data) {
                        if (err) return res.end('Error occurred: ' + err);
                        tracks = data.tracks;
                        for (item in tracks) {
                                track = tracks[item];
                                res.write("<center><b><a href='" + track.href + "'>" + track
                                        .name + "</a></b>" + " on " + track
                                        .album
                                        .name + " in " + track
                                        .album
                                        .released + "<br/></center>");
                        }
                        res.end( "<!--" + request + "-->");
                });
        } else {
                scatch = decodeURIComponent(req.url.substring(1, req.url.length));
                res.end(fs.readFileSync("page.html") + (scatch != "" ? "<script>_prepare(\"" + scatch + "\");</script>" : ""));
        }
}).listen(12);