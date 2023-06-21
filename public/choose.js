
function chooseAlgo(){
    console.log("passst alles")
    var json = require('../data/boardgames_100.json');
    let json_1 = ''

    var fs = require('fs');
    fs.writeFile("task_2_data.json", json_1, function(err, result) {
        if(err) console.log('error', err);
    });
    return 0
}