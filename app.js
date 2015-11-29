var express = require("express"),
    swig = require("swig"),
    bluebird = require("bluebird"),
    bodyParser = require("body-parser"),
    morgan = require("morgan"),
    path = require("path"), 
    sass = require("node-sass");
    routes = require("./routes");

var app = express();

// Listening on port 1337
app.listen(1337, function(err){
  console.log("Listening on port 1337");
});

// Swig stuff
app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.set('views', path.join(__dirname, './views'));
swig.setDefaults({ cache: false });

app.use('/', routes);

// Static routing
app.use('/public', express.static(path.join(__dirname, './public')));
app.use('/node_modules', express.static(path.join(__dirname, './node_modules')));

// Morgan for logging middleware and body-parser
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Some error handling
// failed to catch req above means 404, forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// handle any errors
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  console.log({ error: err });
  res.render('error', {
    error: err
  });
});