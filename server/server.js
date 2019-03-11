'use strict';
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

// タイムゾーンを設定する
const moment = require('moment');
require('moment-timezone');
moment.tz.setDefault('Asia/Tokyo');

const app = express();

// CORSを許可する
app.use(cors());

// POSTパラメータをJSONで取得できるようにする
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// public以下に配置したファイルは直リンクで見れるようにする
app.use(express.static(path.resolve(__dirname, 'public')));

// サーバーの動作確認
app.get('/time', (req, res) => {
  res.send(moment().format('YYYY/MM/DD HH:mm:ss'));
});

// サーバーを起動する
const server = app.listen(process.env.PORT || 4000, '0.0.0.0', () => {
  const host = server.address().address;
  const port = server.address().port;
  console.log(`START SERVER http://${host}:${port}`);
});

// socketサーバーを立ち上げる
const io = require('socket.io')(server, { origins: '*:*' });

/**
 * @param {number} - 次のテキストに付けるID
 */
let nextTextId = 0;
// socketイベントの設定
io.on('connection', (socket) => {
  console.log('connected:', socket.id);

  // 切断時
  socket.on('disconnect', () => {
    console.log('disconnected:', socket.id);
  });

  // ユーザの送信内容処理
  socket.on('sendToS', (message) => {
    const textDetail = {
      id: nextTextId,
      text: message.text,
      name: message.name,
      date: moment().format('YYYY/MM/DD HH:mm:ss')
    };
    nextTextId++;
    console.log('sendToC:', textDetail);
    io.emit('sendToC', textDetail);
  });

  /**
   * 入室処理
   */
  socket.on('entry', (entryName) => {
    const textDetail = {
      id: nextTextId,
      text: '',
      name: 'System',
      date: moment().format('YYYY/MM/DD HH:mm:ss')
    };
    textDetail['text'] = `${entryName}が入室しました.`;
    nextTextId++;
    console.log('sendToC:', textDetail);
    socket.broadcast.emit('sendToC', textDetail);
  });
  /**
   * 名前変更
   */
  socket.on('rename', (entryName, preName) => {
    const textDetail = {
      id: nextTextId,
      text: '',
      name: 'System',
      date: moment().format('YYYY/MM/DD HH:mm:ss')
    };
    textDetail['text'] = `${preName}が${entryName}に改名しました.`;
    nextTextId++;
    console.log('sendToC:', textDetail);
    io.emit('sendToC', textDetail);
    // socket.broadcast.emit('sendToC', textDetail);
  });
});
