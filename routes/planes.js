let express = require('express');
const router = express.Router();

/*The manufacturers that have more than 200 planes*/
router.get('/manufactures', function (req, res) {
    req.getConnection(function (err, connection) {
        let q = "select manufacturer, count(*) as 'No of planes' from planes group by manufacturer having count(*) >= 200 order by 'No of planes' ";
             connection.query(q, function (error, results) {
            if (error) throw error;
            res.setHeader('content-type', 'application/json');
            res.send(results);
        });
    });
});
/*The number of planes of each Airbus Model*/
router.get('/manufactures/airbus', function (req, res) {
    req.getConnection(function (err, connection) {
        let q = "select  manufacturer,model, count(tailnum) as 'No of planes' from planes where manufacturer like 'AIRBUS%' group by model, manufacturer order by manufacturer, 'No of planes' ";

        connection.query(q, function (error, results) {
            if (error) throw error;
            res.setHeader('content-type', 'application/json');
            res.send(results);
        });
    });
});



/*The number of flights each manufacturer with more than 200 planes are responsible for*/
router.get('/manufactures/res', function (req, res) {
    console.log('here')
    req.getConnection(function (err, connection) {
        let q="select distinct (selection.a) as 'Manufacturer', sum(selection.c) as 'No of flights responsible for' from ( select p.manufacturer as 'a', count(f.tailnum) as 'c'  from flights f, planes p where f.tailnum = p.tailnum  and p.manufacturer in (select i.manufacturer from planes i group by i.manufacturer having count(*) >= 200 ) group by f.tailnum, p.manufacturer) as selection group by selection.a";
   
        connection.query(q, function (error, results) {
            if (error) throw error;
            res.setHeader('content-type', 'application/json');
            res.send(results);
        });
    });
});

module.exports = router;