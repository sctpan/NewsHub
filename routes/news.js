var express = require('express');
var router = express.Router();
const axios = require('axios');

const nyTimesApiKey = 'BHkJfhRxGIACUgnwlKOuqmrUUOBASJ3F';
const guardianApiKey = '43326aea-0a7a-45e4-a0f6-7fc14af48780';

router.get('/nytimes', function(req, res) {
    let nyTimesUrl = 'https://api.nytimes.com/svc/topstories/v2/';
    let section = req.query.section;
    let url = nyTimesUrl + section + '.json';

    let params = {
        'api-key': nyTimesApiKey
    }
    let data = null;
    let returnNewsList = null;
    axios.get(url, {
        params: params
    }).then(function (response) {
        data = response.data;
        returnNewsList = getNyTimesNews(data);
        res.json({'news': returnNewsList});
    })

});



router.get('/guardian', function(req, res) {
    let guardianUrl = 'https://content.guardianapis.com/';
    let section = req.query.section;
    let url = guardianUrl + section;

    let params = {
        'api-key': guardianApiKey,
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

router.get('/guardian/article', function(req, res) {
    let guardianUrl = 'https://content.guardianapis.com/'
    let articleId = req.query.id;
    let params = {
        'api-key': guardianApiKey,
        'show-blocks': 'all',
    };
    let data;
    let returnNews;
    axios.get(guardianUrl + articleId, {
        params: params
    }).then(function (response) {
        data = response.data;
        returnNews = getDetailedGuardianNews(data)
        res.json({'news': returnNews});
    })
});

router.get('/nytimes/article', function(req, res) {
    let nyTimesUrl = 'https://api.nytimes.com/svc/search/v2/articlesearch.json';
    let articleId = req.query.id;
    let params = {
        'fq': 'web_url:(\"' + articleId + '\")',
        'api-key': nyTimesApiKey
    };
    let data;
    let returnNews;
    axios.get(nyTimesUrl, {
        params: params
    }).then(function (response) {
        data = response.data;
        returnNews = getDetailedNyTimesNews(data)
        res.json({'news': returnNews});
    })

});

function getDetailedNyTimesNews(data) {
    let news = data.response.docs[0];
    let processedNews = {};
    processedNews.title = news.headline.main;
    let flag = false;
    for(var j=0; j<news.multimedia.length; j++) {
        if(checkJsonKey(news.multimedia[j], ['width', 'url']) && news.multimedia[j].width >= 2000) {
            processedNews.image = 'https://www.nytimes.com/' + news.multimedia[j].url;
            flag = true;
            break;
        }
    }
    if(!flag) processedNews.image = 'https://upload.wikimedia.org/wikipedia/commons/0/0e/Nytimes_hq.jpg';
    processedNews.date = news.pub_date;
    processedNews.description = news.abstract;
    processedNews.shareUrl = news.web_url;
    return processedNews;
}

function getDetailedGuardianNews(data) {
    let news = data.response.content;
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
    processedNews.date = news.webPublicationDate;
    processedNews.description = news.blocks.body[0].bodyTextSummary;
    processedNews.shareUrl = news.webUrl;
    return processedNews;
}

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
        if(!checkJsonKey(news, ['title', 'section', 'multimedia', 'published_date', 'abstract', 'url'])) {
            continue;
        }
        let processedNews = {};
        processedNews.id = news.url;
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
        processedNews.shareUrl = news.url;
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
        processedNews.id = news.id;
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
