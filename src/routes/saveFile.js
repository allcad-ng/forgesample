const fs = require('fs');
const express = require('express');

let router = express.Router();

// Middleware for obtaining a token for each request.
router.use(async (req, res, next) => {
    next();
});

router.get('/getProgress', async (req, res, next) => {
    try {
        if(req.query.ModelId === null){
            res.status(400).end("Invalid model id!");
        }
        else{
            let path = 'progressCache/' + req.query.ModelId + '.json';
                       
            if(fs.existsSync(path)){
                let rawdata = fs.readFileSync(path);
                res.status(200).end(JSON.stringify(JSON.parse(rawdata)));
            }
            else{
                res.status(400).end();
            }
        }
        
        
    } catch(err) {
        next(err);
    }
});

router.post('/saveProgress', async (req, res, next) => {
    try {
        
        let path = 'progressCache/' + req.body.ModelId + '.json';
        

        if(fs.existsSync(path)){
            let rawdata = fs.readFileSync(path);
            let existingData = JSON.parse(rawdata);
            let completed = req.body.AddCompleted;
            let active = req.body.AddActive;
            let planned = req.body.AddPlanned;
            if(completed !== null && completed.length >= 0)
            {

                existingData.AddCompleted = existingData.AddCompleted.concat(completed);
                existingData.AddCompleted = getUnique(existingData.AddCompleted, 'UniqueId');
               
            }
            if(active !== null && active.length >= 0)
            {
                existingData.AddActive = existingData.AddActive.concat(active);

                existingData.AddActive = getUnique(existingData.AddActive, 'UniqueId');
            }
            if(planned !== null && planned.length >= 0)
            {
                existingData.AddPlanned = existingData.AddPlanned.concat(planned);

                existingData.AddPlanned = getUnique(existingData.AddPlanned, 'UniqueId');
            }
            fs.writeFileSync(path, JSON.stringify(existingData));
        }
        else{
            fs.writeFileSync(path, JSON.stringify(req.body));
        }

        
        res.status(200).end();
    } catch(err) {
        console.log(err);
        next(err);
    }
});

function getUnique(arr, comp) {

    // store the comparison  values in array
    const unique =  arr.map(e => e[comp])

  // store the indexes of the unique objects
    .map((e, i, final) => final.indexOf(e) === i && i)

  // eliminate the false indexes & return unique objects
    .filter((e) => arr[e]).map(e => arr[e]);

return unique;
}

module.exports = router;