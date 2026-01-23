// くじ引き結果
const results = [
  "スゥ",
  "まてぅもと",
  "黒川様",
  "たぬきち",
  "李",
  "みねやま",
  "かねこ"
];

function getResult() {
  var random = Math.floor(Math.random() * results.length);
  var result = results[random];
  if (Math.random() < 0.3) {
    // 30%の確率で虹色アニメーションを適用
    $("#result").addClass("rainbow-text");
    $("#gifContainer").append(
      '<img src="https://4boom.jp/blog/wp-content/uploads/2015/08/A4_PDF%E8%A1%A8%E3%80%90%EF%BC%A7%EF%BC%A9%EF%BC%A6%E3%80%91%E3%83%91%E3%83%88%E3%83%A9%E3%83%B3%E3%83%975.gif" width="100px">'
    );
    $("#result").html(result).hide().fadeIn(3000);
  } else {
    $("#result").removeClass("rainbow-text");
    $("#gifContainer img").remove();
    $("#result").html(result).hide().fadeIn(1000);
  }
}

