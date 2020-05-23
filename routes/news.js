var express = require('express');
var router = express.Router();
const axios = require('axios');
const googleTrends = require('google-trends-api');

const nyTimesApiKey = 'BHkJfhRxGIACUgnwlKOuqmrUUOBASJ3F';
const guardianApiKey = '43326aea-0a7a-45e4-a0f6-7fc14af48780';

router.get('/trend', function(req, res) {
    let keyword = req.query.keyword;
    let startDate = new Date("2019-06-01");
    googleTrends.interestOverTime({keyword: keyword, startTime: startDate})
        .then(function(result) {
            console.log(result)
            result = JSON.parse(result);
            let data = result.default.timelineData;
            let returnData = [];
            for(var i=0; i<data.length; i++) {
                returnData.push(data[i].value[0])
            }
            res.json({"data": returnData});
        })
        .catch(function(err) {
            console.log(err);
        })
});



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

router.get('/guardian/newest', function(req, res) {
   let guardianUrl = 'https://content.guardianapis.com/search'
    let params = {
       'api-key': guardianApiKey,
        'orderby': 'newest',
        'show-fields': 'starRating,headline,thumbnail,short-url',
        'page-size': 15
    };
   let data;
   let returnNews;
   axios.get(guardianUrl, {
       params: params
   }).then(function(response) {
       data = response.data;
       returnNews = getGuardianLatestNews(data);
       res.json({'news': returnNews});
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

router.get('/search', function(req, res) {
    let query = req.query.q;
    Promise.all([getGuardianSearchResults(query), getNyTimesSearchResults(query)]).then((result) => {
        res.json({'news': arrangeNews(result[0], result[1])});
    }).catch((error) => {
        console.log(error)
    })
});


function arrangeNews(guardian, nyTimes) {
    let newsList = [];
    if(guardian.length === 0) {
        newsList = newsList.concat(nyTimes);
    } else if(nyTimes.length === 0) {
        newsList = newsList.concat(guardian);
    } else {
        if(guardian.length >= 5 && nyTimes.length >= 5) {
            newsList = newsList.concat(guardian.slice(0, 5), nyTimes.slice(0, 5));
        } else if(guardian.length < 5 && nyTimes.length >= 5) {
            newsList = newsList.concat(guardian.slice(0, guardian.length - 1), nyTimes.slice(0, 5));
        } else if(guardian.length >= 5 && nyTimes.length < 5) {
            newsList = newsList.concat(guardian.slice(0, 5), nyTimes.slice(0, nyTimes.length - 1));
        } else {
            newsList = newsList.concat(guardian, nyTimes);
        }
    }
    return newsList;
}


async function getGuardianSearchResults(query) {
    let guardianUrl = 'https://content.guardianapis.com/search';
    let params = {
        'q': query,
        'api-key': guardianApiKey,
        'show-blocks': 'all'
    };
    let response = await axios.get(guardianUrl, {params: params});
    return getGuardianNews(response.data);
}

async function getNyTimesSearchResults(query) {
    let nyTimesUrl = 'https://api.nytimes.com/svc/search/v2/articlesearch.json';
    let params = {
        'q': query,
        'api-key': nyTimesApiKey
    };
    let response = await axios.get(nyTimesUrl, {params: params});
    return getSearchedNyTimesNews(response.data);
}

function getSearchedNyTimesNews(data) {
    let newsList = data.response.docs;
    let processedNewsList = [];
    for(var i=0; i<newsList.length; i++) {
        let news = newsList[i];
        let processedNews = {};
        processedNews.id = news.web_url;
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
        processedNews.section = news.news_desk;
        processedNews.shareUrl = news.web_url;
        processedNews.source = 'NYTIMES';
        processedNewsList.push(processedNews);
        if(processedNewsList.length === 10) break;
    }
    return processedNewsList;
}

function getDetailedNyTimesNews(data) {
    let news = data.response.docs[0];
    let processedNews = {};
    processedNews.id = news.web_url;
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
    processedNews.section = news.news_desk;
    processedNews.shareUrl = news.web_url;
    processedNews.source = 'NYTIMES';
    return processedNews;
}

function convertDate(dateStr) {
    var date = new Date(dateStr)
    const months = ["Jan", "Feb", "Mar","Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    let day = date.getDate();
    day = day < 10 ? "0" + day : day;
    let formatted_date = day + " " + months[date.getMonth()] + " " + date.getFullYear();
    return formatted_date
}

function getDetailedGuardianNews(data) {
    console.log(convertDate("2020-04-04T21:43:32Z"));
    let news = data.response.content;
    let processedNews = {};
    processedNews.id = news.id
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
    processedNews.date = convertDate(news.webPublicationDate);
    processedNews.section = news.sectionId;
    let bodyArray = news.blocks.body;
    let html = "";
    for(var i=0; i<bodyArray.length; i++) {
        if(checkJsonKeyHelper(bodyArray[i], 'bodyHtml')) {
            html = html + bodyArray[i].bodyHtml;
        }
    }
    processedNews.description = html;
    processedNews.shareUrl = news.webUrl;
    processedNews.source = 'GUARDIAN';
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
    if(!json.hasOwnProperty(key) || json[key] === '' || json[key] === null || json[key] === undefined) {
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
        processedNews.source = 'NYTIMES';
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
        processedNews.source = 'GUARDIAN';
        processedNewsList.push(processedNews);
        if(processedNewsList.length === 10) break;
    }
    return processedNewsList;
}

function getGuardianLatestNews(data) {
    let newsList = data.response.results;
    let processedNewsList = [];
    for(var i=0; i<newsList.length; i++) {
        let news = newsList[i];
        if(!checkJsonKey(news, ['id', 'webTitle', 'sectionName', 'webPublicationDate', 'webUrl']))
           continue;
        let processedNews = {};
        processedNews.id = news.id;
        processedNews.title = news.webTitle;
        processedNews.section = news.sectionName;
        processedNews.date = news.webPublicationDate;
        processedNews.shareUrl = news.webUrl;
        processedNews.timeDiff = getTimeDiff(news.webPublicationDate);
        if(checkJsonKeyHelper(news, 'fields') && checkJsonKeyHelper(news.fields, 'thumbnail')) {
            processedNews.image = news.fields.thumbnail
        } else {
            processedNews.image = "unavailable"
        }
        processedNewsList.push(processedNews);
        if(processedNewsList.length === 10) break;
    }
    return processedNewsList;
}

function getTimeDiff(dateStr) {
    let newsDate = new Date(dateStr);
    let now = new Date();
    let duration = now - newsDate;
    seconds = Math.floor((duration / 1000) );
    minutes = Math.floor(duration / (1000 * 60));
    hours = Math.floor(duration / (1000 * 60 * 60));
    let res = "";
    if(hours >= 1) {
        res = res + hours + "h ago";
    } else if(minutes >= 1) {
        res = res + minutes + "m ago";
    } else {
        res = res + seconds + "s ago";
    }
    return res;
}

module.exports = router;
