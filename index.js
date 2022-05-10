import http from "http";
import fs from "fs";
import url from "url";
import formidable from "formidable";

const port = 8080;
const hostname = "localhost";

const server = http.createServer((req, res) => {
  let path = url.parse(req.url, true);

  if (req.method == "GET") {
    if (path.path === "/vlastitiHtml") {
      fs.readFile("index.html", (err, data) => {
        res.writeHead(200, { "content-type": "text/html" });
        res.write(data);
        return res.end();
      });
    } else if (path.pathname.startsWith("/uploads")) {
      let filename = "." + path.pathname;
      fs.readFile(filename, function (err, data) {
        if (err) {
          res.writeHead(404, { "Content-Type": "text/html" });
          return res.end("404 Not Found");
        }
        res.writeHead(200, { "Content-Type": "plain/text" });
        res.write(data);
        return res.end();
      });
    } else {
      res.write("Dobrodošao");
      res.end();
    }
  } else if (req.method == "POST") {
    const form = formidable({ multiples: true });

    form.parse(req, (err, fields) => {
      if (err) {
        res.writeHead(err.httpCode || 400, { "Content-Type": "text/plain" });
        res.end(String(err));
        return;
      }

      //pripremam upload file
      let putanjaZaUpload = `./uploads/${fields.naslov}.txt`;
      fs.writeFile(putanjaZaUpload, fields.sadrzaj, function (err) {
        if (err) throw err;
        console.log("Stvoren novi file");
      });

      //slažem odgovor korisniku
      res.writeHead(200, { "Content-Type": "text/html" });
      res.write(`<h1>Uspioješno si objavio file.</h1>
      <p>Unio si naslov novog filea: ${fields.naslov}</p>
      <p>Unio si sadržaj novog filea: ${fields.sadrzaj}</p>
      <hr/>
      <a href="${putanjaZaUpload}">Pogledaj svoj file na ovoj poveznici</a>
      `);
      res.end();
    });
    return;
  }
});

server.listen(port, hostname);

console.log(`Pokrenio sam server na http://${hostname}:${port}`);
