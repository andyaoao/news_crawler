var request = require('request');
var cheerio = require('cheerio');
var ScrapeFilePathname = 'C:/Users/Andy/node/hw4/scrape.json';
var SegmentFilePathname = 'C:/Users/Andy/node/hw4/seg.json';
var fs = require('fs');

var is_done = 0;
var metas = [];

fs.readFile(ScrapeFilePathname, function read(err, data) {

	

    if (!err) { 
    	metas = JSON.parse(data); 
    }
  
	for (var pages=1; pages<6; pages++){
		
		var link = "http://www.appledaily.com.tw/realtimenews/section/new/"+pages;
		// console.log(url);
		request(link, function (error, response, html) {
	  	if (!error && response.statusCode == 200) {
	    	var $ = cheerio.load(html);
	    	$('li.rtddt').each(function(i, element){
	      		var a = $(this);
	      		var b = $(this).children();
	      		var time = a.find('time').text();
			    var catogory = a.find('h2').text();
			    var title = a.find('h1').text();
			    var url = b.attr('href'); 
			    var bool_vedio = a.hasClass('hsv');
			      //parse obj
	      		var metadata = {
	      			catogory: catogory,
					title: title,
	        		url: url,
	        		time: time,
	        		video: bool_vedio,
	        		// i: pages-1
	      		};
	      		metas.push(metadata);	
	      		fs.writeFileSync(ScrapeFilePathname, JSON.stringify(metas));     		
				// console.log(metas);
	  		});
		}
		});
	}
	is_done = 1;
});

// console.log(is_done);

function checkFlag() {
    if(is_done == 0) {
       setTimeout(checkFlag, 6000); /* this checks the flag every 6000 milliseconds*/
       console.log('scraping');
    } 
    else {

			var cnt = [];
			var seg = [];
			
			var name = ["動物","FUN","瘋啥","搜奇","正妹","體育","臉團","娛樂","時尚","生活","社會","國際","財經","地產","政治","論壇"];
			var max = 0;
			var max_name;
			for(var i=0; i<name.length; i++){
		    	cnt[i]=0;
			}

			for(var j=0; j<name.length; j++){
				var temp = [];
				for(var k=0; k<metas.length; k++){
					if(metas[k].catogory == name[j]){
						temp.push(metas[k]);
						// console.log(metas[k]);
						cnt[j]++;
						if(cnt[j]>max){
							max = cnt[j];
							max_name = name[j];
						}
					}
				}
				
				seg.push({
					catogory: name[j],
					count: cnt[j],
					news: temp
				});
			}
			console.log(cnt);
			console.log(max_name, max);

		    fs.writeFile(SegmentFilePathname, JSON.stringify(seg), function (err) {
				if (err) { throw err; }
			});

			fs.writeFile(ScrapeFilePathname, JSON.stringify(metas), function (err) {
				if (err) { throw err; }
			});

		// });

    }
}
checkFlag();

