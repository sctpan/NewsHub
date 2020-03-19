var express = require('express');
var router = express.Router();
const axios = require('axios');

router.get('/nytimes', function(req, res) {
    let apiKey = 'BHkJfhRxGIACUgnwlKOuqmrUUOBASJ3F';
    let nyTimesUrl = 'https://api.nytimes.com/svc/topstories/v2/';
    let section = req.query.section;
    let url = nyTimesUrl + section + '.json';

    let params = {
        'api-key': apiKey
    }
    let data = null;
    let returnNewsList = null;
    axios.get(url, {
        params: params
    }).then(function (response) {
        data = response.data;
        returnNewsList = getNyTimesNews(data)
        res.json({'news': returnNewsList});
    })

});



router.get('/guardian', function(req, res) {
    let apiKey = '43326aea-0a7a-45e4-a0f6-7fc14af48780';
    let guardianUrl = 'https://content.guardianapis.com/';
    let section = req.query.section;
    let url = guardianUrl + section;

    let params = {
        'api-key': apiKey,
        'show-blocks': 'all',
        'page-size': 15
    };

    let data = null;
    let returnNewsList = null;
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

function checkJsonKey(json, keys) {
    for(var i=0; i<keys.length; i++) {
        if(!checkJsonKeyHelper(json, keys[i])) {
            return false;
        }
    }
    return true;
}

function checkJsonKeyHelper(json, key) {
    if(!json.hasOwnProperty(key) || json.key === '') {
        return false;
    }
    return true;
}


function getNyTimesNews(data) {
    let newsList = data.results;
    let processedNewsList = [];
    for(var i=0; i<newsList.length; i++) {
        let news = newsList[i];
        // console.log("news has title? " + checkJsonKeyHelper(news, 'title'));
        // console.log("news has section? " + checkJsonKeyHelper(news, 'section'));
        // console.log("news has multimedia? " + checkJsonKeyHelper(news, 'multimedia'));
        // console.log("news has published_date? " + checkJsonKeyHelper(news, 'published_date'));
        // console.log("news has abstract? " + checkJsonKeyHelper(news, 'abstract'));
        if(!checkJsonKey(news, ['title', 'section', 'multimedia', 'published_date', 'abstract', 'url'])) {
            continue;
        }
        let processedNews = {};
        processedNews.title = news.title;
        let flag = false;
        for(var j=0; j<news.multimedia.length; j++) {
            if(checkJsonKey(news.multimedia[j], ['width', 'url']) && news.multimedia[j].width >= 2000) {
                processedNews.image = news.multimedia[j].url;
                flag = true;
                break;
            }
        }
        if(!flag) processedNews.image = 'https://upload.wikimedia.org/wikipedia/commons/0/0e/Nytimes_hq.jpg';
        processedNews.section = news.section;
        processedNews.date = news.published_date;
        processedNews.description = news.abstract;
        processedNews.shareUrl = news.url
        processedNewsList.push(processedNews);
        if(processedNewsList.length === 10) break;
    }
    return processedNewsList;
}

function getGuardianNews(data) {
    let newsList = data.response.results;
    let processedNewsList = [];
    for(var i=0; i<newsList.length; i++) {
        let news = newsList[i];
        if(!checkJsonKey(news, ['id', 'webTitle', 'sectionId', 'webPublicationDate', 'blocks', 'webUrl'])
            || !checkJsonKeyHelper(news.blocks, 'body') || news.blocks.body.length === 0 || !checkJsonKeyHelper(news.blocks.body[0], 'bodyTextSummary')) continue;
        let processedNews = {};
        processedNews.title = news.webTitle;
        if(checkJsonKeyHelper(news.blocks, 'main') && checkJsonKeyHelper(news.blocks.main, 'elements')
            && news.blocks.main.elements.length > 0 && checkJsonKeyHelper(news.blocks.main.elements[0], 'assets')
            && news.blocks.main.elements[0].assets.length > 0) {
            let lastAssetIndex = news.blocks.main.elements[0].assets.length - 1;
            if(checkJsonKeyHelper(news.blocks.main.elements[0].assets[lastAssetIndex], 'file')) {
                processedNews.image = news.blocks.main.elements[0].assets[lastAssetIndex].file;
            } else {
                processedNews.image = 'https://assets.guim.co.uk/images/eada8aa27c12fe2d5afa3a89d3fbae0d/fallback-logo.png';
            }
        } else {
            processedNews.image = 'https://assets.guim.co.uk/images/eada8aa27c12fe2d5afa3a89d3fbae0d/fallback-logo.png';
        }
        processedNews.section = news.sectionId;
        processedNews.date = news.webPublicationDate;
        processedNews.description = news.blocks.body[0].bodyTextSummary;
        processedNews.shareUrl = news.webUrl;
        processedNewsList.push(processedNews);
        if(processedNewsList.length === 10) break;
    }
    return processedNewsList;
}

module.exports = router;
