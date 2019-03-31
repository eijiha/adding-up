'use strict';
//ファイルからデータを読み取る
//モジュール呼び出し
const fs = require('fs');
const readline = require('readline');
//Streamの作成
const rs = fs.ReadStream('./popu-pref.csv');
const rl = readline.createInterface({ 'input': rs, 'output': {} });
//key:都道府県 value: 集計データのオブジェクト
const prefectureMap = new Map();
//lineイベントが発生するタイミングで無名関数を呼び出す
//ファイルから2010年と2015年のデータを抜き出す
rl.on('line', (lineString) => {
    const columns = lineString.split(',');
    const year = parseInt(columns[0]);
    const prefecture = columns[2];
    const popu = parseInt(columns[7]);
    if (year === 2010 || year === 2015){
        let value = prefectureMap.get(prefecture);
        //その都道府県のデータが初めてだったら初期化処理を行う
        if(!value){
            value = {
                popu10: 0,
                popu15: 0,
                change: null
            };
        }
        if (year === 2010){
            value.popu10 += popu;
        }
        if (year === 2015){
            value.popu15 += popu;
        }
        prefectureMap.set(prefecture,value);
    }
});
rl.on('close', () => {
    for(let [key, value] of prefectureMap){
        value.change = value.popu15 / value.popu10;
    }
    const rankingArray = Array.from(prefectureMap).sort((pair1, pair2) => {
        return pair2[1].change - pair1[1].change;
    });

    //出力結果を整える
    const rankingStrings = rankingArray.map(([key, value]) => {
        return key + ': ' + value.popu10 + '=>' + value.popu15 + ' 変化率:' + value.change;
    });
    console.log(rankingStrings);
})
