# コーディング規約（.tsx, .ts）

## 必須

- ローカル変数宣言には `const` か `let` を使うこと
- 変数宣言には基本的に `const` を使うこと。変数に初期化時以外に代入する必要がある時のみ、`let` を使うこと
- 変数宣言は各行に一個だけの変数を宣言すること。ただし、分割代入はこの限りではない
- ローカル変数は、できるだけスコープが小さくなるように、合理的な範囲で必要になる直前に宣言すること
- if/for/do/while 文の本体は、必ず brace{}で囲むこと

  ```javascript
  // NG
  if (foo === "foo") return "bar";

  // OK
  if (foo === "foo") {
    return "bar";
  }
  ```

- 等価演算子(==)は使わず、厳密等価演算子(===)を使うこと。ただしヌルチェックの場合のみ `== null` を使ってもよい
- number 型、string 型、any 型をそのまま真偽値として利用しないこと
- string への型変換は `String(hoge)` を使うこと
- Number 型へ型変換する場合は `Number` か `parseFloat` を使うこと
- インデントはスペース 2 個とすること
- 1 行の文字数の管理は、フォーマッタに任せること
  - prettier プラグインを使用し、設定は `.prettierrc` で管理する
- page router ではなく app router を使用すること。ただし、自動生成されたコードの使用時においては例外的に page router の使用を認める。
- app 配下の `page.tsx`, `layout.tsx`　などのファイルでのみデフォルトエクスポート（`export default XXX`）を使用し、それ以外の場合は名前付きエクスポート（`export const XXX`）を使用すること。
- app 配下のファイル名はスネークケース（snake_case）とすること
  - ユーザーに見える URL に表示されるので、命名には十分注意を払うこと
- import は src からの相対パスを用いること(scss は除く)
  - OK `components/hoge.tsx`
  - NG `../components/hoge.tsx`
- 重複した記述はしない
  - 安易に同じ処理のコピー＆ペーストでプログラムを書かない。※ただし、テストコードにおいては準備処理をべた書きしてもよい
  - 重複したコードが同一ブロック内に存在する場合は、それをブロックの外に出す
  - 重複したコードが同一ファイル内の複数のメソッド・関数に存在する場合は、重複部分を抽出して新しいメソッド・関数に外出しし、元のメソッド・関数から呼び出すようにする
- 不要な変数・インポートは削除する
- let で宣言するが変数に入る値が限定されている場合は、型宣言にリテラル型を用いる。(interface における型宣言でも同様)
  - 型を取りうる値に限定することで、より typescript の型安全のメリットを享受する
- 型定義には type ではなく interface を用いる
  - 実現できる機能に差異はほとんどなし
  - 拡張の仕方が type よりも一般的なオブジェクト指向に近く、TypeScript の経験がないメンバーの参画時にも相対的に抵抗が小さいと思われる
  - 但し、Union と Tuple の場合のみ、type を用いる
- 明示的に型を記述する必要がない場合は、typescript による型推論に任せる
- 読み取り専用の宣言は `readonly`、再帰的に行う場合は、`as const` を用いる
  - 例えば配列の場合には `ReadonlyArray<T>` も用いることができるが、違いは書き方のみであるため、上記の通りに統一する
- アーリーリターン・ガード節を心がける
  - 条件を満たした時点でリターンしてよい(他の条件を評価する必要がない)場合、その時点でリターンする。(アーリーリターン)
  - 対象外としたいパターンは冒頭に寄せて記述する。(ガード節)
- 保守性・可読性、パフォーマンスの観点から、多重ループの記述は回避する
  - そもそも、多重ループの使用を検討するような実装方針に必然性があるかを自問する
  - 必然性がある場合、ループ処理自体を多重にするのではなく、`処理対象となる配列を作成→作成した配列の各要素に対してループ処理をする`という方針で実装することで、多重ループの記述を回避する
- 関数内の似たような処理は同様の方法で実装する
- 一つの関数では単一の機能を提供する
  - ユニットテスト作成の観点からも、関数間の責務が分離されていることが望ましい
- 関数コンポーネントの引数（props）は、関数の最初の一行目に分割代入で記述する
  - `const Hoge: React.FC<Props> = (props) => {\n const { fuga, piyo = "hoge" } = props;`

## 推奨

- クラスコンポーネントを避け、関数コンポーネントを利用すること
- function 式を避け、できるだけアロー関数式を利用すること
- SSR（getServerSideProps）、SSG（getStaticProps）、ISR を理解し、適切に運用すること
- 組込み式の文字列を生成する場合はテンプレートリテラルで記述する（バッククォート (`) を用いる）こと
- モジュールの読み込みには、標準の `import`/`export` を使うこと
- クラス、`export` されている要素、メンバ変数、メンバ関数にはコメントを記載すること
- コードからすぐに明白に読み取ることができるような内容は、コメントとして記載しないこと
- 単一行コメントには `//` を使うこと
- 必要に応じて[アノテーションコメント](https://qiita.com/taka-kawa/items/673716d77795c937d422)を用いること
- キャメルケース（camelCase）にする方法は「[Google Java Style Guide#s5.3-camel-case(日本語訳)](https://google.github.io/styleguide/javaguide.html#s5.3-camel-case)」に従うこと。意味が分かりにくくなる場合、コメントで補うこと
  - "supports IPv6 on iOS?"　 → 　`supportsIpv6OnIos`
- ファイルから単一の要素(クラス、インターフェース、関数、定数、etc)を `export` している場合、`export` している要素の名前をファイル名にすること
- ファイルから複数の要素を `export` している場合、代表的な要素の名前をファイル名にすること
- クラス/インターフェースの命名には、アッパーキャメルケース（UpperCamelCase） / パスカルケース（PascalCase）を使うこと
- 変数と関数の命名には、ローワーキャメルケース（lowerCamelCase）を使うこと
- 定数(実行前に確定しており、アプリの実行中常に不変であることを意図した値)には、コンスタントケース(CONSTANT_CASE)を使うこと
  - const.ts に記述すること
- 不要なフラグメント `<React.Fragment></React.Fragment>` `<></>` は削除すること
- インラインスタイルを避けること
  - module.scss に記述することで、明確に役割を分ける
- 三項演算子の使用は避けること
  - 三項演算子の中に三項演算子を記述するのは、可読性の面で禁止とする
  - 三項演算子を用いることで、可読性が上がる場合もあるので、ケースごとに判断する
  - 使用する場合は、基本的に１行に収め、超える場合は使用をやめる
- if 文と switch 文を適切に運用すること
  - javascript, typescript の switch 文は fall through のリスク(break;を書き忘れると次の case 以降も実行されてしまう)があるため、なるべく使用は避ける
  - 可読性の兼ね合いで、条件分岐が複数にわたる場合は switch 文を使用する
- なるべく素の for 文の使用は回避し、map, filter, forEach などを利用する
  - 名称と役割が一致する関数を用いることで、可読性を向上させる
- ネスト（ if 文の中の if 文など）の深さは 3 以下を推奨とする
  - アーリーリターンなどを外に出し、見やすいコードを心掛ける
- 通例的なものを除き、人間にとって意味のある変数名を用いること
  - 非推奨：map(v, i) → 推奨：map(value, index)
- import の記述順は ライブラリ（next, react, その他）→ コンポーネント（atoms, organisms）→ 共通（interface, utils, const）→styles の順が望ましい

# API 連携（src/utils/Api.ts および、 src/utils/openapi/\*）

- API 連携は、`openapi-generator-cli`によって自動生成されたコードを用いる
- 自動生成された関数をフロントエンドで用いるときは Api.ts にラップ関数を作成し、それを用いる
- Api.ts におけるラップ関数の命名規則は以下の通り
  - request + [GET/POST/PUT/DELETE] + [Class] + [(To) 役割関数名]
  - 例）Class が SalonsApi の場合
    - requestGetSalonsToGetSalons
    - requestGetSalonsToGetSalonById
    - requestPostSalonsToAddSalon
    - requestPutSalonsToUpdateSalonById
    - requestDeleteSalonsToDeleteSalonById
  - 動詞から始まらない関数名つけようとしたときは(To)をいい感じにする

以下の内容については協議中

```
# フロントエンドのエラーハンドリング
`Error.getInitialProps = async ({ res, err }: NextPageContext) => {}`
の内部にて処理を行う。基本的には `_error.tsx` を用いる。

`  const statusCode = res ? res.statusCode : err ? err.statusCode ?? 500 : 404;`
- statusCodeを算出する。
- resが存在する時はSSRであり、res.statusCodeをそのまま利用すれば良い。
- resがない場合はCSRである。
  - err.statusCodeがあればそれをそのまま利用する
  - 意図しない例外が起きてerrがここに渡ってくる場合、単なるErrorオブジェクトが入っていてstatusCodeプロパティがない。errがある時点でISEなので500にする

See Also: https://nextjs.org/docs/advanced-features/custom-error-page
```

# その他のルール

- public に入るデータや画像のファイル名はスネークケース（snake_case） とする
- フォルダ名を変更しない
- 以下のファイルは、フレームワーク等によって認識されたり、共通で用いている特別な命名のため、変更しない
  - favicon.ico
  - src/components/Layout.tsx
  - pages/index.tsx
  - pages/\_app.tsx
  - pages/\_document.tsx
  - pages/404.tsx
  - styles/\_variables.scss
  - styles/global.scss
  - 他設定ファイル等
- これまでに記述の無い内容の規約について、以下を参考にすること
  - [Google HTML / CSS スタイルガイド](https://google.github.io/styleguide/htmlcssguide.html)
  - [スタイルガイド（コーディング規約） - TypeScript Deep Dive 日本語版](https://typescript-jp.gitbook.io/deep-dive/styleguide)
- デバッグツールの console や ESLint のエラーを残さないこと。理由があって残す場合は[アノテーションコメント](https://qiita.com/taka-kawa/items/673716d77795c937d422)で誰でもわかる状態にすること
