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

const axios = require('axios');

const WIKI_URL = 'http://ja.wikipedia.org/w/api.php?format=json&action=query&list=random&rnnamespace=0&rnlimit=1';

/**
 * @param {number} - 次のテキストに付けるID
 */
let nextTextId = 0;
/**
 * @param {object} - ID:名前として格納する
 */
const userList = {};
/**
 * @param {string} - 現在のトークテーマ
 */
let theme = '';
/**
 * 部屋名リスト
 */
const roomList = ['A', 'B', 'C'];

// socketイベントの設定
io.on('connection', (socket) => {
  console.log('connected:', socket.id);
  // ここで定義した変数はクライアントごとに異なる値を持つことができる.
  let roomName = '';
  let userName = '匿名希望';
  // 切断時
  socket.on('disconnect', () => {
    console.log('disconnected:', socket.id);
    const name = userList[socket.id];
    let text;
    if (name === undefined) {
      text = `だれかがが覗いて帰りました.`;
    } else {
      text = `${userList[socket.id].name}が退室しました.`;
    }
    io.emit('sendToC', systemComment(text));
    removeUserList(socket.id);
  });

  // ユーザの送信内容処理
  socket.on('sendToS', (message, roomName) => {
    const textDetail = {
      id: nextTextId,
      text: message.text,
      name: message.name,
      date: moment().format('YYYY/MM/DD HH:mm:ss'),
    };
    nextTextId++;
    console.log('sendToC:', textDetail);
    console.log(roomName);
    io.to(roomName).emit('sendToC', textDetail);
  });

  /**
   * 入室処理,入室されたユーザーへのコメント
   * ユーザーオブジェクトにIDと名前を格納
   */
  socket.on('entry', (entryName) => {
    const text = `${entryName}が参加しました.`;
    userName = entryName;
    const textDetail = systemComment(text);
    roomName = roomList[Math.floor(Math.random() * roomList.length)];
    addUserList(socket.id, entryName, roomName);
    socket.join(roomName);
    io.to(socket.id).emit('sendRoomName', roomName);
    socket.broadcast.emit('sendToC', textDetail);
  });
  /**
   * 入室したユーザーへのコメント
   */
  socket.on('entryMessageToYou', (entryName) => {
    const text = `ようこそ${entryName}さん.
現在は部屋${roomName}にいます.`;
    const textDetail = systemComment(text);
    const userId = socket.id;
    io.to(userId).emit('sendThemeToC', theme);
    io.to(userId).emit('sendToC', textDetail);
  });
  /**
   * 名前変更
   */
  socket.on('rename', (entryName, preName) => {
    const text = `${preName}が${entryName}に改名しました.`;
    userName = entryName;
    const textDetail = systemComment(text);
    addUserList(socket.id, entryName, roomName);
    io.emit('sendToC', textDetail);
    console.log(roomName);
  });

  socket.on('changeRoom', (room) => {
    // 退室
    socket.leave(roomName);
    const leaveText = `${userName}が${roomName}ルームを退室しました.`;
    const leaveTextDetail = systemComment(leaveText);
    io.to(roomName).emit('sendToC', leaveTextDetail);
    // 入室
    socket.join(room);
    console.log('changeRoom', `${socket.id} changes ${room} from ${roomName}`);
    const joinText = `${userName}が${room}ルームに入室してきました.`;
    const joinTextDetail = systemComment(joinText);
    socket.broadcast.to(room).emit('sendToC', joinTextDetail);
    // 部屋名変更
    roomName = room;
    addUserList(socket.id, userName, roomName);
  });
  /**
   * トークテーマを変える.API叩く.
   */
  socket.on('getWiki', () => {
    axios.get(WIKI_URL)
      .then(response => {
        theme = response.data.query.random[0].title;
        io.emit('sendThemeToC', theme);
      })
      .catch(function(error) {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          console.log(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('Error', error.message);
        }
        console.log(error.config);
      });
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
      date: moment().format('YYYY/MM/DD HH:mm:ss'),
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
  const addUserList = (id, name, room) => {
    userList[id] = { 'name': name, 'room': room };
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
