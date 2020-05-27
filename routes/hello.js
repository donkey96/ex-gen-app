var express = require('express');
var router = express.Router();

var mysql = require('mysql');

// MySQLの設定情報
var mysql_setting = {
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'my-nodeapp-db'
};

// デフォルトページ
router.get('/', (req, res, next) => {

  // コネクションの用意
  var connection = mysql.createConnection(mysql_setting);

  // データベースに接続
  connection.connect();

  // データを取り出す
  connection.query('SELECT * from mydata',
    function (error, results, fields) {
      // データベースアクセス完了時の処理
      if (error == null) {
        var data = { title: 'mysql', content: results };
        res.render('hello/index', data);
      }
  });
  // 接続を解除
  connection.end();
});

// 新規作成ページへのアクセス
router.get('/add', (req, res, next) => {
  var data = {
    title: 'Hello/Add',
    content: '新しいレコードを入力:',
    form: { name: '', mail: '', age: 0 }
  }
  res.render('hello/add', data);
});

// 新規作成フォーム送信の処理
router.post('/add', (req, res, next) => {
  req.check('name', 'NAME は必ず入力して下さい。').notEmpty();
  req.check('mail', 'MAIL はメールアドレスを記入して下さい。').isEmail();
  req.check('age', 'AGE は年齢(整数)を入力下さい。').isInt();

  req.getValidationResult().then((result) => {
    if (!result.isEmpty()) {
      var re = '<ul class="error">';
      var result_arr = result.array();
      for(var n in result_arr) {
        re += '<li>' + result_arr[n].msg + '</li>'
      }
      re += '</ul>';
      var data = {
        title: 'Hello/Add',
        content: re,
        form: req.body
      }
      res.render('hello/add', data);
    } else {
      var nm = req.body.name;
      var ml = req.body.mail;
      var ag = req.body.age;
      var data = { 'name': nm, 'mail': ml, 'age': ag };
    
      // データベースの設定情報
      var connection = mysql.createConnection(mysql_setting);
    
      // データベースに接続
      connection.connect();
    
      // データを取り出す
      connection.query('insert into mydata set ?', data,
        function (error, results, fields) {
          res.redirect('/hello');
        });
      // 接続を解除
      connection.end();    
    }
  });
});

// 指定IDのレコードを表示する
router.get('/show', (req, res, next) => {
  var id = req.query.id;

  // データベースの設定情報
  var connection = mysql.createConnection(mysql_setting);

  // データベースに接続
  connection.connect();

  // データを取り出す
  connection.query('SELECT * from mydata where id=?', id,
    function (error, results, fields) {
      // データベースアクセス完了時の処理
      if (error == null) {
        var data = {
          title: 'Hello/Show',
          content: 'id = ' + id + 'のレコード:',
          mydata: results[0]
        }
        res.render('hello/show', data);
      }
    // 接続を解除 
    connection.end();
    });
});

// 指定レコードを編集
router.get('/edit', (req, res, next) => {
  var id = req.query.id;

  // データベースの設定情報
  var connection = mysql.createConnection(mysql_setting);

  // データベースに接続
  connection.connect();

  // データを取り出す
  connection.query('SELECT * from mydata where id=?', id,
    function (error, results, fields) {
      if (error == null) {
        var data = {
          title: 'Hello/Edit',
          content: 'id = ' + id + 'のレコード:',
          mydata: results[0]
        }
        res.render('hello/edit', data);
      }
    });

    // 接続を解除
    connection.end();
});

// 編集フォーム送信の処理
router.post('/edit', (req, res, next) => {
  var id = req.body.id;
  var nm = req.body.name;
  var ml = req.body.mail;
  var ag = req.body.age;
  var data = { 'name': nm, 'mail': ml, 'age': ag };

  // データベースの設定情報
  var connection = mysql.createConnection(mysql_setting);

  // データベースに接続
  connection.connect();

  // データを取り出す
  connection.query('update mydata set ? where id = ?', [data, id],
    function (error, results, fields) {
      res.redirect('/hello');
    });
  // 接続を解除
  connection.end();
});

// 指定レコードを削除
router.get('/delete', (req, res, next) => {
  var id = req.query.id;

  // データベースの設定情報
  var connection = mysql.createConnection(mysql_setting);

  // データベースに接続
  connection.connect();

  // データを取り出す
  connection.query('SELECT * from mydata where id=?', id,
    function (error, results, fields) {
      // データベースアクセス完了時の処理
      if (error == null) {
        var data = {
          title: 'Hello/Delete',
          content: 'id = ' + id + 'のレコード:',
          mydata: results[0]
        }
        res.render('hello/delete', data);
      }
    });
  // 接続を解除
  connection.end();
});

// 削除フォームの送信処理
router.post('/delete', (req, res, next) => {
  var id = req.body.id;

  // データベースの設定情報
  var connection = mysql.createConnection(mysql_setting);

  // データベースへの接続
  connection.connect();

  // データを取り出す
  connection.query('delete from mydata where id=?', id,
    function (error, results, fields) {
      res.redirect('/hello');
    });
  // 接続を解除
  connection.end();
});

module.exports = router;