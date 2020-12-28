let express = require('express');
const router = express.Router();

/*Total number of flights per month*/
router.get('/', function (req, res) {
    req.getConnection(function (err, connection) {
        let q = "SELECT month, count(*) as 'number_of_flights' from `flights` group by month having COUNT(*)>=1 order by month";
        connection.query(q, function (error, results) {
            if (error) throw error;
            res.setHeader('content-type', 'application/json');
            res.send(results);
        });
    });
});

/*Total number of flights per month from the three origins in one plot.*/
router.get('/origin', function (req, res) {
    req.getConnection(function (err, connection) {
        let q = "SELECT month, origin,  count(*) as 'number_of_flights' from flights where origin = 'JFK' or origin ='EWR' or origin='LGA' group by origin,month order by month";
        connection.query(q, function (error, results) {
            if (error) throw error;
            res.setHeader('content-type', 'application/json');
            res.send(results);
        });
    });
});
/*The mean airtime of each of the origins in a table*/
router.get('/origin/airtime', function (req, res) {
    req.getConnection(function (err, connection) {
        let q = "select origin,  avg(air_time) as 'airtime' from flights  group by origin order by 'airtime' desc";
        connection.query(q, function (error, results) {
            if (error) throw error;
            res.setHeader('content-type', 'application/json');
            res.send(results);
        });
    });
});
/*The top-10 destinations and how many flights were made to these
- For these 10 destinations, make a visualization of the number of flights from the
three origins to the top-10 destination.*/
router.get('/top-10-destinations', function (req, res) {
    req.getConnection(function (err, connection) {
        let q = "SELECT  f.dest, f.origin, count(*) as 'number_of_flights'\n" +
            "FROM flights as f\n" +
            "INNER JOIN (\n" +
            "    select dest, count(*) 'no of flight'\n" +
            "    from flights\n" +
            "    group by dest\n" +
            "    having count(*)>1\n" +
            "    order by count(*) desc limit 10\n" +
            ") as `top10` on f.dest = top10.dest\n" +
            "group by f.dest,f.origin\n" +
            "order by f.dest, `no of flight`;";
        connection.query(q, function (error, results) {
            if (error) throw error;
            res.setHeader('content-type', 'application/json');
            res.send(results);
        });
    });
});



/*Mean departure and arrival delay for each origin in a table*/
router.get('/origin/mean-delay', function (req, res) {
    req.getConnection(function (err, connection) {
        let q = "select origin, avg(dep_delay) as 'dep_delay', avg(arr_delay) as 'arr_delay' from flights group by origin";
        connection.query(q, function (error, results) {
            if (error) throw error;
            res.setHeader('content-type', 'application/json');
            res.send(results);
        });
    });
});

module.exports = router;
