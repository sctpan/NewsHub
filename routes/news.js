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
        returnNewsList = getGuardianNews(data)
        res.json({'news': returnNewsList});
    })
});

function getGuardianNews(data) {
    let newsList = data.response.results;
    let processedNewsList = [];
    for(var i=0; i<newsList.length; i++) {
        let news = newsList[i];
        let processedNews = {};
        processedNews.id = news.id;
        processedNews.title = news.webTitle;
        let lastAssetIndex = news.blocks.main.elements[0].assets.length - 1;
        if(lastAssetIndex < 0) {
            processedNews.image = 'https://assets.guim.co.uk/images/eada8aa27c12fe2d5afa3a89d3fbae0d/fallback-logo.png';
        } else {
            processedNews.image = news.blocks.main.elements[0].assets[lastAssetIndex].file;
        }
        processedNews.section = news.sectionId;
        processedNews.date = news.webPublicationDate;
        processedNews.description = news.blocks.body[0].bodyTextSummary;
        processedNewsList.push(processedNews);
    }
    return processedNewsList;
}

module.exports = router;
