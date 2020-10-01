const express = require('express');
const app = express();

const bodyParser = require('body-parser');

const MongoClient = require('mongodb').MongoClient;

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

let db;
MongoClient.connect(
  'mongodb+srv://jadefactory:hDHNAJyFhVKMHjmq@cluster0.69hjx.mongodb.net/<dbname>?retryWrites=true&w=majority',
  function (error, client) {
    if (error) {
      return console.log(error);
    }

    db = client.db('trashchecker');

    app.listen(8080, function () {
      console.log('database is connected to port 8080');
    });
  }
);

app.get('/', function (_, res) {
  res.sendFile(__dirname + '/index.html');
});

app.get('/report', function (_, res) {
  res.sendFile(__dirname + '/report.html');
});

app.post('/add', function (req, res) {
  res.render('./complete.ejs');
  console.log(req.body.trash);
  console.log(req.body.type);
  db.collection('list').insertOne(
    { trash: req.body.trash, type: req.body.type },
    function (error, result) {
      console.log('저장완료');
    }
  );
});

app.get('/result', function (req, res) {
  db.collection('list')
    .find()
    .toArray(function (error, result) {
      const container = [];
      for (let i = 0; i < result.length; i++) {
        container.push(result[i].trash);
        if (req.query.foodname === result[i].trash) {
          res.render('./result.ejs', { data: result[i] });
        }
      }
      if (container.indexOf(req.query.foodname) === -1) {
        res.render('./notFound.ejs');
      }
    });
});
