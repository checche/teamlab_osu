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
/**
 * @param {object} - ID:名前として格納する
 */
const userList = {};

// socketイベントの設定
io.on('connection', (socket) => {
  console.log('connected:', socket.id);

  // 切断時
  socket.on('disconnect', () => {
    console.log('disconnected:', socket.id);
    const name = userList[socket.id];
    let text;
    if (name === undefined) {
      text = `だれかがが覗いて帰りました.`;
    } else {
      text = `${userList[socket.id]}が退室しました.`;
    }
    io.emit('sendToC', systemComment(text));
    removeUserList(socket.id);
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
   * 入室処理,入室されたユーザーへのコメント
   * ユーザーオブジェクトにIDと名前を格納
   */
  socket.on('entry', (entryName) => {
    const text = `${entryName}が入室しました.`;
    const textDetail = systemComment(text);
    addUserList(socket.id, entryName);
    socket.broadcast.emit('sendToC', textDetail);
  });
  /**
   * 入室したユーザーへのコメント
   */
  socket.on('entryMessageToYou', (entryName) => {
    const text = `ようこそ${entryName}さん.
まずはみんなにご挨拶しましょう.`;
    const textDetail = systemComment(text);
    const userId = socket.id;
    io.to(userId).emit('sendToC', textDetail);
  });
  /**
   * 名前変更
   */
  socket.on('rename', (entryName, preName) => {
    const text = `${preName}が${entryName}に改名しました.`;
    const textDetail = systemComment(text);
    addUserList(socket.id, entryName);
    io.emit('sendToC', textDetail);
  });

  /**
   * システムが指定したtextDetailを返す.
   * @param {string} texFromSys - システムのコメント内容
   */
  const systemComment = (texFromSys) => {
    const textDetail = {
      id: nextTextId,
      text: texFromSys,
      name: 'System',
      date: moment().format('YYYY/MM/DD HH:mm:ss')
    };
    nextTextId++;
    console.log('System:', textDetail);
    return textDetail;
  };

  /**
   * ユーザーリストを登録,変更する.
   * @param {string} id - ユーザーID
   * @param {string} name - 名前
   */
  const addUserList = (id, name) => {
    userList[id] = name;
    console.log('userlist:', userList);
    io.emit('sendUL', userList);
  };
  /**
   * ユーザーリストを削除する.
   * @param {string} id - ユーザーID
   */
  const removeUserList = (id) => {
    delete userList[id];
    console.log('userlist:', userList);
    io.emit('sendUL', userList);
  };
});
