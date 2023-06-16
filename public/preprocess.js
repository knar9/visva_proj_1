var json = require('../data/boardgames_100.json');
let json_1 = ''
let id = []
let id2 = []

var fs = require('fs');
fs.writeFile("task_1_data.json", json_1, function(err, result) {
    if(err) console.log('error', err);
});
var json1 = require('../data/task_1_data.json');

function mapYear(year){
    if(year<2005){
        return 1
    } else if(year>=2005 && year <2010){
        return 2
    } else if(year>=2010 && year <2015){
        return 3
    } else if(year>=2015 && year <2020){
        return 4
    } else if(year>=2020){
        return 5
    }
}
for(var i=0;i<100;i++){
    id.push(json[i].id)
    id2.push(json[i].id)
}

for(var i=0;i<100;i++){
    for(var j=0;j<json1[i].fans_liked.length;j++){
        id2.push(json1[i].fans_liked[j])
    }
}

id2.sort(function(a, b){return a-b});
let uniq = [...new Set(id2)];
let test = uniq.filter(n => !id.includes(n))
console.log(test)


for(var i=0;i<100;i++){
    id.push(json[i].id)
    id2.push(json[i].id)
    json_1 = json_1 + '{' + '"id":' + JSON.stringify(json[i].id) + ','
    json_1 = json_1  + '"title":'  + JSON.stringify(json[i].title)  + ','
    json_1 = json_1  + '"year":'  + JSON.stringify(json[i].year)  + ','
    json_1 = json_1  + '"fans_liked":'  + JSON.stringify(json[i].recommendations.fans_liked)  + ','
    json_1 = json_1  + '"categories":' + JSON.stringify(json[i].types.categories) + '}' + ','
}
json_1 = json_1.slice(0, -1)
json_1 = '[' + json_1 + ']'

let json_2 = '{ "nodes": ['
for(var i=0;i<100;i++){
    json_2 = json_2 + '{' + '"id":' + JSON.stringify(json1[i].id) + ','
    json_2 = json_2  + '"title":'  + JSON.stringify(json1[i].title)  + ','
    json_2 = json_2  + '"grp":'  + JSON.stringify(mapYear(json1[i].year))  + '},'
}
for(var k=0;k<test.length;k++){
    json_2 = json_2 + '{' + '"id":' + JSON.stringify(test[k]) + ','
    json_2 = json_2  + '"title":'  + JSON.stringify(test[k])  + ','
    json_2 = json_2  + '"grp":'  + JSON.stringify(6)  + '},'
}
json_2 = json_2.slice(0, -1)
json_2 = json_2 + '], ' + '"links": ['
for(var i=0;i<100;i++){
    for(var j=0;j<json1[i].fans_liked.length;j++){
        json_2 = json_2 + '{' + '"source":' + JSON.stringify(json1[i].id) + ','
        json_2 = json_2  + '"target":'  + JSON.stringify(json1[i].fans_liked[j])  + '},'
    }
}
json_2 = json_2.slice(0, -1)
json_2 = json_2 + ']}' 

fs.writeFile("node_link_all.json", json_2, function(err, result) {
    if(err) console.log('error', err);
});
