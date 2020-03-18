var express = require('express');
var router = express.Router();
const axios = require('axios');
router.get('/guardian', function(req, res) {
    let apiKey = '43326aea-0a7a-45e4-a0f6-7fc14af48780';
    let guardianUrl = 'https://content.guardianapis.com/';
    let section = req.query.section;
    let url = guardianUrl + section;

    let params = {
        'api-key': apiKey,
        'show-blocks': 'all'
    };

    let data = null;
    if(section === 'all') {
        section = '(sport|business|technology|politics)';
        url = guardianUrl + 'search';
        params['section'] = section;
    }
    axios.get(url, {
        params: params
    }).then(function (response) {
        data = response.data;
        res.json(data);
    }).catch(function (error) {
        res.send(error);
    })
});

module.exports = router;
