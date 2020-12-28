let express = require('express');
const router = express.Router();

/*How many weather observations there are for the origins in a table*/
router.get('/origin', function (req, res) {
    req.getConnection(function (err, connection) {
        let q = "select origin, count(origin) as 'observation_count' from weather group by origin order by 'observation_count' desc";
        connection.query(q, function (error, results) {
            if (error) throw error;
            res.setHeader('content-type', 'application/json');
            res.send(results);
        });
    });
});

 /*The daily mean temperature (in Celsius) for each origin in the same plot*/
router.get('/origin/mean-temperature', function (req, res) {
    req.getConnection(function (err, connection) {
        let q = "select origin, avg(temp) as 'mean_temperature', month, day from weather group by day, month, origin order by month,day";
        connection.query(q, function (error, results) {
            if (error) throw error;
            res.setHeader('content-type', 'application/json');
            res.send(results);
        });
    });
});
 
  /*For each of the three origins, all temperature attributes (i.e. attributes involving a
temperature unit) in degree Celsius (i.e. you need to convert from Fahrenheit to Celsius)*/
router.get('/temperature', function (req, res) {
    req.getConnection(function (err, connection) {
        let q = "select origin, year, month ,day, hour,((dewp-32)*5/9) as 'Dew point in C', ((temp-32)*5/9) as 'temperature in C' from weather order by origin, year, month ,day, hour";

        connection.query(q, function (error, results) {
            if (error) throw error;
            res.setHeader('content-type', 'application/json');
            res.send(results);
        });
    });
});
 
 



module.exports = router;
