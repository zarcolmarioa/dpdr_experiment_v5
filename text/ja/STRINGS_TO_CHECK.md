# Japanese strings to check

Every participant-facing string that is **new or changed** for the v4 and v5b designs and for the later revisions, with its English, for a native speaker to check. Copied from `text/en/*.js` and `text/ja/*.js` when this list was made, so it matches what the experiment showed then (HTML tags stripped, **bold** kept). If the text files change, check them, not this list.

How to use: correct the Japanese **in `text/ja/instructions.js` or `text/ja/words.js`** (the key is given for each string), not in this file. Tick the box when a string is approved.

General rules that apply to every string (see the header of `text/en/instructions.js`):

- never describe the experience with visual words (no equivalents of foggy, blurred, faded, dull, colourless, unreal, dreamlike, flat, veiled, as if behind glass);
- the interview (面接) may be mentioned **only** in strings that only participants see (keyed `participant` or `derealization`); controls were not interviewed and must never see 面接 or インタビュー;
- refer to the **surroundings** (周囲の風景), not to the self;
- acknowledge that the pictures are adjusted, without saying how;
- the set-up screens (full screen, window check, set-up, brightness) never mention the pictures; they give neutral reasons;
- formal register (です・ます, お〜ください); no dashes (em dash, en dash or horizontal bar) in any string;
- the participant and control versions of a string should differ only where the English differs.

**Not listed here:** the ten rated words, which are the registered Japanese (霞がかった, 色あせた, ベールがかかったような, 生気のない, 現実味のない, 夢のような, 遠く感じる, 絵のような, 重苦しい, 不穏な). The four CDS items are listed (they are verbatim from the published Japanese CDS, so check them against that version rather than for style).

The strings of the latest revision come first: the approved consent text (listed for reference, not to check) and the reminder on the episode screens. Then those of the resume and CDS revision (reload warning, resuming, completion message, the CDS items); then those of the text revision (formal register, no dashes, the set-up and brightness screens, optional episode questions, the practice texts by episode); then the v5b strings, then the v4 strings that are still in use, each listed once, under the revision that last changed it. The v4 anchoring, grid and normal-appearance grid strings were removed with those screens.

## Latest revision: Approved consent text

The consent title, text and checkbox are the **ethics-approved text** (source: the ethics-approved consent forms), as approved and lightly edited by the research team. They are listed for reference only: **not translations to check**, and not to be changed here. The English is the translation of the approved Japanese. `consent.body` and `consent.body_results_file` hold the same text. On screen, the headings are in bold without 【】, 【研究責任者】 and 【共同研究者】 are kept as written, and each researcher is on a line of their own.

- [x] **1. instructions.js → `consent.title`**  
  _Approved text (source: the ethics-approved consent forms). Not to check._

  English (translation):

  > Consent to participate in the online image selection task

  日本語（承認済み）:

  > オンライン画像選択課題参加への同意確認

- [x] **2. instructions.js → `consent.body` and `consent.body_results_file`** (the same text, `CONSENT_BODY_JA`)  
  _Approved text (source: the ethics-approved consent forms). Not to check. The full-width space at the start of each paragraph and 〔R6-26-1〕 are kept as given._

  English (translation; `CONSENT_BODY_EN`, with the two [GIVEN NAME] markers still to be filled in):

  > Please read all of the explanation below. If you understand it and agree to participate in the online image selection task, please select "I have understood the explanation above and, of my own free will, agree to participate in this study."
  > 
  > **Purpose of the study**
  > 
  > This study follows the questionnaire on psychological characteristics in which you previously participated. Experiences of derealization are known to occur temporarily even in healthy people. In this study, we ask a number of questions about what such experiences were like, with the aim of clarifying their characteristics.
  > 
  > **Voluntary participation**
  > 
  > Whether or not to participate in this study is your own decision. If you wish, you may print or save this explanation for your records. Even after giving your consent, you may withdraw it and stop participating at any time.
  > 
  > **What the study involves**
  > 
  > You will complete an online image selection task. You will be shown pairs of images that differ in appearance and, following the instructions on the screen, will choose one image from each pair. During the task, you will also answer a few questions about past experiences. The task takes approximately 30 minutes.
  > 
  > **Reward**
  > 
  > Participants in the image selection task will receive a reward of 700 yen. After we confirm that you have completed the study, the reward will be sent as an Amazon gift card to the email address you provide for this purpose.
  > 
  > **Possible disadvantages of participation**
  > 
  > Because this study asks you to recall past experiences, some people may feel anxiety or discomfort. You do not have to answer any question you do not wish to answer, and you may interrupt or withdraw from the online task at any time, for any reason. Withdrawing will not cause you any disadvantage other than not receiving the reward.
  > 
  > This study is a psychological investigation of everyday experiences that can occur in healthy people, and it does not involve any medical diagnosis or assessment. If you have any concerns about your physical or mental health, we recommend that you consult a medical institution or the university's counselling services.
  > 
  > **Handling of personal information**
  > 
  > The data obtained in this study will be anonymised before analysis, so no individual can be identified from the data. Records will use only a participant number, not your name. The list linking names to participant numbers will be kept separately from the data, as an electronic file protected by a password, on a computer owned by the university.
  > 
  > The image selection task is conducted on a web page. Your responses will be sent to a private and secure area of an online data storage service for research, then promptly transferred to a computer owned by the university and stored as an electronic file protected by a password.
  > 
  > The data collected in this study will be kept by the researchers as electronic files protected by a password. If you do not agree to the section "Publication of data" below, the data will be destroyed once the results have been published.
  > 
  > The data collected in this study will be used for academic papers and conference presentations and may be made public. Even in that case, no individual will be identified. Parts of your answers may be quoted to convey what the experiences were like. In such cases, names will not be used, and any content that could identify an individual will be removed or altered.
  > 
  > If you wish to withdraw your data, please contact the researchers by email at any time.
  > 
  > **Publication of data**
  > 
  > To increase the transparency of this research and to allow other researchers to verify and reuse it, the collected data may be published on the internet as open data. The data that may be published include basic information such as age and gender, and data such as task performance.
  > 
  > Published data may be used in future research that has not been specified at the time of consent. Because published data can be widely distributed, copies that have already been distributed cannot be recalled, even if you request withdrawal after publication. Before publication, you may withdraw your data at any time by contacting the researchers by email.
  > 
  > Even if you do not agree to the publication of your data, you may still participate in this study. In that case, your data will not be published.
  > 
  > **Ethical review**
  > 
  > This study has been approved by the Ethics Committee of the Center for Experimental Research in Social Sciences (CERSS), Hokkaido University (project title: "Experiments on perceptual discrimination tasks in joint action between humans and robots"; reference number: R6-26-1; amendment approval number: R6-26-1).
  > 
  > **Researchers**
  > 
  > Principal investigator:
  > 
  > Keisuke Suzuki, Associate Professor, Center for Human Nature, Artificial Intelligence, and Neuroscience (CHAIN), Hokkaido University (ksk@chain.hokudai.ac.jp)
  > 
  > Collaborating researchers:
  > 
  > Katsunori Miyahara, Associate Professor, CHAIN, Hokkaido University
  > 
  > Daisuke Sakamoto, Professor, Faculty of Information Science and Technology and CHAIN, Hokkaido University
  > 
  > [GIVEN NAME] Imai, Academic Researcher, Department of Psychology, Faculty of Humanities and Human Sciences, Hokkaido University
  > 
  > [GIVEN NAME] Sawada, Research Assistant, Psychology Laboratory, Division of Human Sciences, Graduate School of Humanities and Human Sciences, and CHAIN, Hokkaido University
  > 
  > If you have any questions or concerns about this study, please contact Keisuke Suzuki by email.

  日本語（承認済み）:

  > 下記の説明をすべてお読みになり、ご理解いただいたうえでオンライン画像選択課題への参加に同意していただける方は、「上記の説明について理解し、自らの意思で本調査への参加に同意する」を選択してください。
  > 
  > **研究の目的**
  > 
  > 　この調査は、あなたに先にご参加いただいた心理的特性に関する質問紙調査に続くものです。現実感喪失の体験は、健康な方にも一時的に生じることが知られています。この調査では、そうした体験がどのようなものであったかをいくつかの質問項目により詳しくうかがい、こうした体験の特徴を明らかにすることを目的としています。
  > 
  > **参加の任意性**
  > 
  > 　この調査に参加するかどうかは、あなた自身が決めることです。ご希望であれば、この説明書を印刷または保存して保管していただけます。参加に同意した後でも、いつでも同意を撤回し、調査を中止することができます。
  > 
  > **調査の内容**
  > 
  > 　オンライン上での画像選択課題に取り組んでいただきます。見え方の異なる画像を2枚ずつご覧いただき、画面に表示される教示にしたがって、いずれか一方をお選びいただきます。また、課題の中で、過去の体験に関するいくつかの質問にお答えいただきます。所要時間は30分程度です。
  > 
  > **謝礼**
  > 
  > 　画像選択課題にご参加いただいた方には700円分の謝礼をお渡しします。謝礼は、調査への参加完了を確認した後、謝礼の送付に必要なメールアドレス宛にAmazonギフトカードとして送付します。
  > 
  > **参加によるデメリット**
  > 
  > 　この調査では過去の体験を思い出していただくため、人によっては不安や違和感をお感じになることがあります。お答えになりたくない質問には答えなくてかまいませんし、いかなる理由であれ、あなたはいつでもオンライン課題を中断・辞退することができます。辞退することは、謝礼を受け取れなくなることを除けば、あなたに何ら不利益をもたらしません。
  > 
  > 　なお、この調査は健康な方に生じうる日常的な体験について心理学的に検討するものであり、医学的な診断や評価を行うものではありません。ご自身の心身の状態について気がかりなことがある場合は、医療機関や学内の相談窓口へのご相談をおすすめします。
  > 
  > **個人情報の扱い**
  > 
  > 　この調査で得られたデータは、匿名化されてから分析されるため、データから個人が特定されることはありません。記録には氏名ではなく参加者番号のみを用い、氏名と参加者番号を対応づけたリストは、データそのものとは切り離して、暗証番号つきの電子ファイルとして大学所有のコンピュータで保管します。
  > 
  > 　画像選択課題はウェブページ上で実施されます。ご回答は、研究用のオンラインデータ保管サービスの非公開かつ安全な領域に送信され、その後速やかに大学所有のコンピュータへ移し、暗証番号つきの電子ファイルとして保管します。
  > 
  > 　この調査で収集されたデータは、暗証番号つきの電子ファイルで研究実施者が保管します。下記「データの公開について」に同意されなかった場合、データは成果発表の終了後に廃棄します。
  > 
  > 　この調査で収集されたデータは、学術論文や学会発表のために用いられ、公表されることがあります。その場合も、個人が特定されることはありません。なお、体験の様子を伝えるためにご回答の一部を引用することがありますが、その際も氏名は用いず、個人が特定されうる内容は削除または変更したうえで用います。
  > 
  > 　データの取り下げをご希望の場合は、随時、研究実施者までメールにてご連絡ください。
  > 
  > **データの公開について**
  > 
  > 　この研究では、研究の透明性を高め、他の研究者による検証や再利用を可能にするため、収集したデータをオープンデータとしてインターネット上に公開する場合があります。公開の対象となりうるのは、年齢や性別といった基本的な情報、課題の成績などのデータです。
  > 
  > 　公開されたデータは、同意をいただく時点では特定されていない将来の研究に用いられる可能性があります。また、いったん公開されたデータは広く配布されうるため、公開後に取り下げをご希望されても、すでに配布されたものの回収はできません。公開前であれば、随時、研究実施者までメールにてご連絡いただくことで取り下げが可能です。
  > 
  > 　データの公開に同意されない場合でも、この調査にはご参加いただけます。その場合、あなたのデータが公開されることはありません。
  > 
  > **研究倫理の審査**
  > 
  > 　本研究は、北海道大学社会科学実験研究センター(CERSS)の倫理審査委員会の承認を得ています（研究課題名「人とロボットの共同行為における知覚判別課題の実験」、受付番号：〔R6-26-1〕、変更届 承認番号：〔R6-26-1〕）。
  > 
  > **研究実施者**
  > 
  > 【研究責任者】
  > 
  > 北海道大学人間知・脳・AI研究教育センター　准教授　鈴木啓介 (ksk@chain.hokudai.ac.jp)
  > 
  > 【共同研究者】
  > 
  > 北海道大学人間知・脳・AI研究教育センター　准教授　宮原克典
  > 
  > 北海道大学情報科学研究院／人間知・脳・AI研究教育センター　教授　坂本大介
  > 
  > 北海道大学大学院文学研究院心理学分野　学術研究員　今井史
  > 
  > 北海道大学大学院文学院人間科学専攻心理学研究室／人間知・脳・AI研究教育センター　リサーチアシスタント　沢田慕
  > 
  > 本研究についてご質問やご懸念がございましたら、鈴木啓介までメールにてご連絡ください。

- [x] **3. instructions.js → `consent.checkbox`**  
  _Approved text (source: the ethics-approved consent forms). Not to check. It no longer mentions being 18 or older._

  English (translation):

  > I have understood the explanation above and, of my own free will, agree to participate in this study.

  日本語（承認済み）:

  > 上記の説明について理解し、自らの意思で本調査への参加に同意する

## Latest revision: Reminder on the episode screens

- [ ] **4. instructions.js → `episodes.questions_intro`**  
  _Changed: a last sentence asks participants not to type names or other identifying details. Shown just above the fields on every recalled episode screen (the approved consent text does not say this). The sentence is the one from the earlier placeholder consent._

  English:

  > The following questions are intended to help you recall the episode. The questions marked as optional may be left blank. Please do not include names or other details that could identify you or anyone else.

  日本語（下書き）:

  > 以下は、エピソードを思い出しやすくするための質問です。「任意」と記された質問は、空欄のままでも構いません。ご自身や他の人の名前など、個人を特定できる情報は書かないでください。

## Resume and CDS revision: Reload warning, resume screen, completion message

- [ ] **5. instructions.js → `session.reload_warning`**  
  _New. On the set-up screen, before block 1's practice and on the resume screen._

  English:

  > Please do not reload or close this page until the final screen confirms that your responses have been saved. Doing so interrupts the study, and your responses may be lost.

  日本語（下書き）:

  > 回答が保存されたことが最後の画面で確認されるまで、このページを再読み込みしたり閉じたりしないでください。再読み込みしたり閉じたりすると実験が中断され、回答が失われる可能性があります。

- [ ] **6. instructions.js → `session.resume_title`**  
  _New. Shown when the link of an unfinished session is opened again in the same browser._

  English:

  > The study was interrupted

  日本語（下書き）:

  > 実験が中断されました

- [ ] **7. instructions.js → `session.resume_body`**  
  _New. Only Continue is offered. 保持されており (kept in this browser), not 保存 (which could suggest the server)._

  English:

  > The study was interrupted before it was finished. Your earlier responses have been kept, and the study will continue from the point where it was interrupted. Part of the study may be shown again.
  > 
  > The study will return to full screen when you continue.

  日本語（下書き）:

  > 実験は終了する前に中断されました。それまでの回答は保持されており、中断した箇所から実験を再開します。一部の画面がもう一度表示される場合があります。
  > 
  > 続けると、全画面表示に戻ります。

- [ ] **8. instructions.js → `session.resume_button`**  
  _New._

  English:

  > Continue

  日本語（下書き）:

  > 続ける

- [ ] **9. instructions.js → `session.completed`**  
  _New. Shown, and nothing else, when the link of a completed session is opened again in the same browser._

  English:

  > You have already completed this study. Thank you for your participation.

  日本語（下書き）:

  > この実験はすでに完了しています。ご参加いただき、ありがとうございました。

## Resume and CDS revision: CDS items (replace the state items)

- [ ] **10. instructions.js → `cds.instructions`**  
  _VERBATIM from the published Japanese CDS; please check it against the version the participants complete, not for style. Note the half-width parentheses and the space before はっきり, kept as given._

  English:

  > PLEASE READ INSTRUCTIONS CAREFULLY:
  > 
  > This questionnaire describes strange and ‘funny’ experiences that normal people may have in their daily life. We are interested in their: (a) frequency, i.e. how often have you had these experiences OVER THE LAST SIX MONTHS; and (b) their approximate duration. For each question, please select the answers that suit you best. If you are not sure, give your best guess.

  日本語（下書き）:

  > 以下の質問は、ふつうの人も日常生活で体験するかもしれないちょっと変わった「不思議な」経験に関するものです。
  > 
  > (a)ここ半年の間にどれくらいこういった経験をしましたか。(頻度)
  > 
  > (b)また、頻度が 0 ではない場合、それらはどれくらい続きましたか。(持続時間)
  > 
  > それぞれの質問に、その最もあてはまるものを選択して答えてください。 はっきりと分からない場合には、推測でもかまいません。

- [ ] **11. instructions.js → `cds.items.0.label`**  
  _Item 2. VERBATIM from the published Japanese CDS; please check it against the version the participants complete, not for style._

  English:

  > What I see looks ‘flat’ or ‘lifeless’, as if I were looking at a picture.

  日本語（下書き）:

  > 私に見えているものは「平面的」で「生気がない」ように感じられる。まるで絵や写真のようである。

- [ ] **12. instructions.js → `cds.items.1.label`**  
  _Item 13. VERBATIM from the published Japanese CDS; please check it against the version the participants complete, not for style._

  English:

  > My surroundings feel detached or unreal, as if there were a veil between me and the outside world.

  日本語（下書き）:

  > まるで、自分と外の世界との間にベールがかかっているかのように、自分の周囲が、自分から隔てられている、あるいは、現実でないような感じがする。

- [ ] **13. instructions.js → `cds.items.2.label`**  
  _Item 19. VERBATIM from the published Japanese CDS; please check it against the version the participants complete, not for style._

  English:

  > Objects around me seem to look smaller or further away.

  日本語（下書き）:

  > 自分の周りのものが小さく、あるいは、ずっと遠くに見える。

- [ ] **14. instructions.js → `cds.items.3.label`**  
  _Item 29. VERBATIM from the published Japanese CDS; please check it against the version the participants complete, not for style._

  English:

  > Previously familiar places look unfamiliar, as if I had never seen them before.

  日本語（下書き）:

  > もともと慣れ親しんでいた場所が、まるで見たことのない知らない場所のように見える。

- [ ] **15. instructions.js → `cds.freq_options`**  
  _Frequency 0 to 4, in this order. VERBATIM from the published Japanese CDS; please check it against the version the participants complete, not for style._

  English:

  > never,rarely,often,very often,all the time

  日本語（下書き）:

  > まったくない,めったにない,ときどき,とてもよく,いつも

- [ ] **16. instructions.js → `cds.dur_heading`**  
  _**PLEASE CHECK:** the heading above the duration options. The English is “In general, it lasts:”; the Japanese is 持続時間, as given._

  English:

  > In general, it lasts:

  日本語（下書き）:

  > 持続時間

- [ ] **17. instructions.js → `cds.dur_options`**  
  _Duration 1 to 6, in this order. VERBATIM from the published Japanese CDS; please check it against the version the participants complete, not for style._

  English:

  > few seconds,few minutes,few hours,about a day,more than a day,more than a week

  日本語（下書き）:

  > 数秒間,数分間,数時間,一日程度,数日程度,一週間以上

- [ ] **18. instructions.js → `cds.incomplete`**  
  _New (not part of the CDS). Shown until every item is complete._

  English:

  > Please answer every item to continue. For each experience you have had, please also select how long it generally lasts.

  日本語（下書き）:

  > 続けるには、すべての項目にお答えください。経験のある項目については、持続時間も選択してください。

- [ ] **19. instructions.js → `cds.button_submit`**  
  _New._

  English:

  > Continue

  日本語（下書き）:

  > 次へ

## Texts, set-up and practice revision: Full screen and window check

- [ ] **20. instructions.js → `screen.fs_body`**  
  _Changed: a neutral reason (同様の条件で表示されるよう); must NOT mention the pictures._

  English:

  > This study runs in full screen, so that it is shown under similar conditions for everyone.
  > 
  > Please remain in full screen until the study ends.

  日本語（下書き）:

  > すべての参加者に同様の条件で表示されるよう、この実験は全画面表示で行います。
  > 
  > 実験が終わるまで、全画面表示のままにしてください。

- [ ] **21. instructions.js → `screen.small_body`**  
  _Changed: a neutral reason; must NOT mention the pictures._

  English:

  > This study requires a window of a minimum size, so that it is shown under similar conditions for everyone. This window is smaller than that.
  > 
  > Please make your browser window larger, or use a computer with a larger screen, and then open the link from your invitation again.
  > 
  > If your browser is zoomed in, setting the zoom back to 100% (Ctrl + 0, or &#8984; + 0 on a Mac) may be sufficient.

  日本語（下書き）:

  > この実験では、すべての参加者に同様の条件で表示されるよう、一定以上の大きさのウィンドウが必要です。このウィンドウはそれより小さくなっています。
  > 
  > ブラウザのウィンドウを大きくするか、より大きな画面のコンピュータを使用して、案内メールのリンクをもう一度開いてください。
  > 
  > ブラウザが拡大表示になっている場合は、表示倍率を100%に戻す（Ctrl + 0、Macでは &#8984; + 0）だけで解決する場合があります。

## Texts, set-up and practice revision: Set-up screen (new, before the brightness screen)

- [ ] **22. instructions.js → `calibration.setup_title`**  
  _New. Must not mention the pictures._

  English:

  > Before you start

  日本語（下書き）:

  > はじめる前に

- [ ] **23. instructions.js → `calibration.setup_body`**  
  _New. Position, distractions, laptops and desktops alike. Must not mention the pictures._

  English:

  > **Position:** please place the computer on a desk or table, ideally with the screen at about eye level. If this is not possible, please keep the same position and the same distance from the screen throughout the study.
  > 
  > **Distractions:** please avoid looking at your phone or other devices during the study, including during the breaks.
  > 
  > This applies to laptops and desktop computers alike.

  日本語（下書き）:

  > **位置：**コンピュータを机やテーブルの上に置き、できれば画面がほぼ目の高さになるようにしてください。それが難しい場合は、実験中、同じ姿勢と画面からの同じ距離を保ってください。
  > 
  > **集中：**実験中は、休憩中も含め、スマートフォンやその他の機器を見ないようにしてください。
  > 
  > ノートパソコンとデスクトップパソコンのどちらにも当てはまります。

## Texts, set-up and practice revision: Brightness screen

- [ ] **24. instructions.js → `calibration.brightness_intro`**  
  _Changed: no longer mentions the pictures or their darker areas; a neutral reason instead._

  English:

  > Please set your screen brightness to its **highest setting** now, and leave it there for the whole session, so that the study is shown under similar conditions for everyone.

  日本語（下書き）:

  > すべての参加者に同様の条件で表示されるよう、画面の明るさを**最大**に設定し、実験中はそのままにしてください。

- [ ] **25. instructions.js → `calibration.brightness_charger`**  
  _New._

  English:

  > **Charger:** please connect the computer to its charger, because many devices dim the screen when running on battery.

  日本語（下書き）:

  > **充電器：**多くの機器はバッテリーで動作しているときに画面を暗くするため、コンピュータを充電器に接続してください。

- [ ] **26. instructions.js → `calibration.brightness_auto`**  
  _New. True Tone and Night Shift are the names Apple uses in its Japanese settings; please check the other feature names are the ones Japanese users see (明るさの自動調節, ナイトモード, ブルーライトカット, バッテリー節約機能)._

  English:

  > **Automatic features:** if possible, please switch off automatic brightness (also called adaptive or auto brightness), True Tone, Night Shift or night mode, blue light filters and battery saver. If you do not know whether these are on, you may continue.

  日本語（下書き）:

  > **自動機能：**可能であれば、明るさの自動調節（アダプティブブライトネス、自動輝度調整などとも呼ばれます）、True Tone、Night Shift やナイトモード、ブルーライトカット、バッテリー節約機能をオフにしてください。これらがオンになっているかわからない場合は、そのままお進みいただいて構いません。

- [ ] **27. instructions.js → `calibration.brightness_lighting`**  
  _New._

  English:

  > **Lighting:** please sit in a room with good, steady lighting, and avoid changing daylight or light falling directly on the screen. Screens can adjust their brightness to the light in the room.

  日本語（下書き）:

  > **照明：**明るく安定した照明のある部屋でご参加ください。変化する日差しや、画面に直接当たる光は避けてください。画面は部屋の明るさに合わせて明るさを調節することがあります。

- [ ] **28. instructions.js → `calibration.lighting_checkbox`**  
  _New. Second required checkbox, recorded as lighting_confirmed._

  English:

  > The room I am in has good, steady lighting.

  日本語（下書き）:

  > 今いる部屋は、明るく安定した照明です。

## Texts, set-up and practice revision: Screen calibration

- [ ] **29. instructions.js → `calibration.gamma_intro`**  
  _Changed: the sentence about sitting back or squinting (少し離れて見たり、目を細めたり) is removed._

  English:

  > Next we will measure a property of your screen that affects how brightness is displayed. You will do a short matching task **three times**.
  > 
  > Each time, you will see two patterns side by side. Please adjust the right one until the two look like the same shade of grey.

  日本語（下書き）:

  > 次に、明るさの表示のしかたに関わる画面の特性を測定します。短いマッチング課題を**3回**行います。
  > 
  > 2つのパターンが並んで表示されます。右側を調整して、2つが同じ灰色に見えるようにしてください。

- [ ] **30. instructions.js → `calibration.gamma_prompt`**  
  _English changed for the formal register only; the Japanese is unchanged. Please check it still matches._

  English:

  > Please adjust the square on the right until both squares look the same shade of grey, then click **Confirm match**.

  日本語（下書き）:

  > 2つの四角が同じ灰色に見えるまで右の四角を調整し、**「確定」**を押してください。

- [ ] **31. instructions.js → `calibration.gamma_hint`**  
  _Changed slightly: “and” between the keys; formal._

  English:

  > Please drag the slider, or use the ← and → keys.

  日本語（下書き）:

  > スライダーをドラッグするか、← と → のキーで調整してください。

## Texts, set-up and practice revision: Participant details

- [ ] **32. instructions.js → `id.body`**  
  _English changed for the formal register only; the Japanese is unchanged. Please check it still matches._

  English:

  > Please enter your participant ID from your invitation email. If you opened this page from the link in the email, it has already been filled in.

  日本語（下書き）:

  > 案内メールに記載された参加者IDを入力してください。メール内のリンクからこのページを開いた場合は、すでに入力されています。

- [ ] **33. instructions.js → `id.id_hint`**  
  _English changed for the formal register only; the Japanese is unchanged. Please check it still matches._

  English:

  > R_ followed by 15 letters and numbers. Capital and small letters are distinguished.

  日本語（下書き）:

  > R_ に続いて英数字15文字です。大文字と小文字は区別されます。

- [ ] **34. instructions.js → `id.invalid`**  
  _Changed: no dash; two sentences._

  English:

  > This ID was not recognised. Please check your invitation email. Capital and small letters are distinguished.

  日本語（下書き）:

  > このIDを確認できませんでした。案内メールをご確認ください。大文字と小文字は区別されます。

- [ ] **35. instructions.js → `id.optional_note`**  
  _English changed for the formal register only; the Japanese is unchanged. Please check it still matches._

  English:

  > Your **name** and **email address** are **optional**. If you provide them, they are stored separately from your answers and used only to contact you about this study.

  日本語（下書き）:

  > **お名前**と**メールアドレス**の入力は**任意**です。入力された場合は回答データとは別に保存され、本研究に関するご連絡にのみ使用します。

- [ ] **36. instructions.js → `id.optional_note_results_file`**  
  _English changed for the formal register only; the Japanese is unchanged. Please check it still matches._

  English:

  > Your **name** and **email address** are **optional**. If you provide them, they are stored with your answers, which only the research team can access, and used only to contact you about this study.

  日本語（下書き）:

  > **お名前**と**メールアドレス**の入力は**任意**です。入力された場合は回答データと一緒に保存され（研究チームのみが閲覧できます）、本研究に関するご連絡にのみ使用します。

- [ ] **37. instructions.js → `id.body_no_pid`**  
  _Changed: “Providing all three is preferable” (ご入力いただくことが望ましいです)._

  English:

  > Please enter your participant ID from your invitation email.
  > 
  > If you do not have it, please enter your **name** and **email address** instead. Providing all three is preferable.
  > 
  > Your name and email address are stored separately from your answers. They are used only to contact you about this study and, if you do not provide an ID, to link your answers to you.

  日本語（下書き）:

  > 案内メールに記載された参加者IDを入力してください。
  > 
  > IDがわからない場合は、代わりに**お名前**と**メールアドレス**を入力してください。3つすべてをご入力いただくことが望ましいです。
  > 
  > お名前とメールアドレスは回答データとは別に保存され、本研究に関するご連絡と、IDがない場合にあなたの回答を照合するためにのみ使用します。

- [ ] **38. instructions.js → `id.body_no_pid_results_file`**  
  _Pavlovia version; the same change._

  English:

  > Please enter your participant ID from your invitation email.
  > 
  > If you do not have it, please enter your **name** and **email address** instead. Providing all three is preferable.
  > 
  > Your name and email address are stored with your answers, which only the research team can access. They are used only to contact you about this study and, if you do not provide an ID, to link your answers to you.

  日本語（下書き）:

  > 案内メールに記載された参加者IDを入力してください。
  > 
  > IDがわからない場合は、代わりに**お名前**と**メールアドレス**を入力してください。3つすべてをご入力いただくことが望ましいです。
  > 
  > お名前とメールアドレスは回答データと一緒に保存され、研究チームのみが閲覧できます。本研究に関するご連絡と、IDがない場合にあなたの回答を照合するためにのみ使用します。

- [ ] **39. instructions.js → `id.privacy`**  
  _New. Shown on the ID screen in every variant._

  English:

  > Your personal details will not be shared with anyone outside the research team.

  日本語（下書き）:

  > あなたの個人情報が研究チーム以外の人に共有されることはありません。

- [ ] **40. instructions.js → `id.retry_hint`**  
  _Changed: “enter it again” (もう一度入力できます)._

  English:

  > Please press **SPACE** to enter it again.

  日本語（下書き）:

  > **スペースキー**を押すと、もう一度入力できます。

## Texts, set-up and practice revision: Episode selection

- [ ] **41. instructions.js → `episodes.screens.participant.derealization.body`**  
  _Formal register (お書きください). Participants only._

  English:

  > In the interview, you described an episode in which your surroundings felt different from usual. Please bring that episode to mind now.
  > 
  > Please write a few words below that will allow you to recognise it later, such as where you were or what you were doing. The questions that follow are intended to help you recall it.

  日本語（下書き）:

  > 面接では、周囲がいつもと違って感じられたエピソードについてお話しいただきました。今、そのエピソードを思い浮かべてください。
  > 
  > あとで見てそれとわかるように、下の欄にいくつかの言葉でお書きください（どこにいたか、何をしていたか、など）。その後の質問は、そのエピソードを思い出しやすくするためのものです。

- [ ] **42. instructions.js → `episodes.screens.participant.ordinary.body`**  
  _Formal register; no dashes in the English. Participants only._

  English:

  > Please now bring to mind a different episode, in a **similar setting** to the episode you described in the interview ({DR_WORDS}), that is, a similar place, time of day and lighting. It should be from **about as long ago**, and your surroundings should have looked **as usual**.
  > 
  > Please write a few words below that will allow you to recognise it later. The questions that follow are intended to help you recall it.

  日本語（下書き）:

  > 次に、別のエピソードを思い浮かべてください。面接でお話しいただいたエピソード（{DR_WORDS}）と**似た状況**（似た場所・時間帯・明るさ）で、**同じくらい前**に起きた、周囲の風景が**いつもどおりに見えていた**エピソードです。
  > 
  > あとで見てそれとわかるように、下の欄にいくつかの言葉でお書きください。その後の質問は、そのエピソードを思い出しやすくするためのものです。

- [ ] **43. instructions.js → `episodes.screens.control.ordinary.body`**  
  _Formal register. Controls: must NOT mention an interview._

  English:

  > Please bring to mind an ordinary episode from the **last six months**: a time when you were somewhere and your surroundings looked as usual.
  > 
  > Please write a few words below that will allow you to recognise it later, such as where you were or what you were doing. The questions that follow are intended to help you recall it.

  日本語（下書き）:

  > **この6か月以内**の、いつもどおりだったエピソードを一つ思い浮かべてください。どこかにいて、周囲の風景がいつもどおりに見えていたときのことです。
  > 
  > あとで見てそれとわかるように、下の欄にいくつかの言葉でお書きください（どこにいたか、何をしていたか、など）。その後の質問は、そのエピソードを思い出しやすくするためのものです。

- [ ] **44. instructions.js → `episodes.optional_tag`**  
  _New. Shown after the label of when / how long / where._

  English:

  > (optional)

  日本語（下書き）:

  > （任意）

- [ ] **45. instructions.js → `episodes.incomplete`**  
  _Changed: the words, the tone and the intensity are required._

  English:

  > To continue, please write a few words to identify the episode and answer both questions about how it felt emotionally.

  日本語（下書き）:

  > 続けるには、エピソードを表す言葉を書き、そのときの気分と感情の強さについての2つの質問にお答えください。

## Texts, set-up and practice revision: Reinstatement

- [ ] **46. instructions.js → `reinstate.body.derealization`**  
  _Formal register (できるだけ詳しく). Participants only._

  English:

  > In this part, please think of **the episode you described in the interview**, the one you called:
  > 
  > {WORDS}
  > 
  > Please bring it back to mind as well as you can: where you were, what was around you and what you were doing.

  日本語（下書き）:

  > このパートでは、**面接でお話しいただいたエピソード**について考えてください。あなたが次のように書いたエピソードです：
  > 
  > {WORDS}
  > 
  > どこにいたか、周りに何があったか、何をしていたかなど、できるだけ詳しく思い出してください。

- [ ] **47. instructions.js → `reinstate.body.ordinary`**  
  _Formal register. Must NOT mention an interview._

  English:

  > In this part, please think of **the ordinary episode you described**, the one you called:
  > 
  > {WORDS}
  > 
  > Please bring it back to mind as well as you can: where you were, what was around you and what you were doing.

  日本語（下書き）:

  > このパートでは、**あなたが書いた、いつもどおりだったエピソード**について考えてください。あなたが次のように書いたエピソードです：
  > 
  > {WORDS}
  > 
  > どこにいたか、周りに何があったか、何をしていたかなど、できるだけ詳しく思い出してください。

## Texts, set-up and practice revision: Practice

- [ ] **48. instructions.js → `practice.body.derealization`**  
  _LOAD-BEARING. New, before part 1 when it is the derealization episode. Bold: 同じ場所, あなたのエピソードが起きた場所ではありません, その場所の見え方だけであり、写っているものは同じです._

  English:

  > Both pictures in each pair show **the same place**, which is **not the place where your episode occurred**.
  > 
  > The two pictures differ **only in how the place looks, not in what it shows**.
  > 
  > For each pair, bring the episode back to mind and recall your surroundings as they appeared to you at that time. Then choose the picture that is closer to how your surroundings appeared to you then.
  > 
  > There is no right or wrong answer. Please respond according to your first impression.

  日本語（下書き）:

  > 各組の2枚の画像は、どちらも**同じ場所**を写したもので、**あなたのエピソードが起きた場所ではありません**。
  > 
  > 2枚の画像が異なるのは、**その場所の見え方だけであり、写っているものは同じです**。
  > 
  > 各組について、そのエピソードを思い浮かべ、そのときにあなたの目に映った周囲の風景を思い出してください。そのうえで、そのときの周囲の風景の見え方により近いほうの画像を選んでください。
  > 
  > 正解・不正解はありません。最初の印象に従ってお答えください。

- [ ] **49. instructions.js → `practice.body.ordinary`**  
  _LOAD-BEARING. New, before part 1 when it is the ordinary episode. Must NOT mention an interview._

  English:

  > Both pictures in each pair show **the same place**, which is **not the place where your episode occurred**.
  > 
  > The two pictures differ **only in how the place looks, not in what it shows**.
  > 
  > For each pair, bring the ordinary episode back to mind and recall your surroundings as they appeared to you at that time. Then choose the picture that is closer to how your surroundings appeared to you then.
  > 
  > There is no right or wrong answer. Please respond according to your first impression.

  日本語（下書き）:

  > 各組の2枚の画像は、どちらも**同じ場所**を写したもので、**あなたのエピソードが起きた場所ではありません**。
  > 
  > 2枚の画像が異なるのは、**その場所の見え方だけであり、写っているものは同じです**。
  > 
  > 各組について、いつもどおりだったエピソードを思い浮かべ、そのときにあなたの目に映った周囲の風景を思い出してください。そのうえで、そのときの周囲の風景の見え方により近いほうの画像を選んでください。
  > 
  > 正解・不正解はありません。最初の印象に従ってお答えください。

- [ ] **50. instructions.js → `practice.body.expectation`**  
  _LOAD-BEARING. New, before part 1 when it is the expectation. Must NOT mention an interview._

  English:

  > Both pictures in each pair show **the same place**. The two pictures differ **only in how the place looks, not in what it shows**.
  > 
  > For each pair, imagine the surroundings of a person experiencing derealization, as they would appear to that person. Then choose the picture that is closer to how you think those surroundings appear to them.
  > 
  > There is no right or wrong answer. Please respond according to your first impression.

  日本語（下書き）:

  > 各組の2枚の画像は、どちらも**同じ場所**を写したものです。2枚の画像が異なるのは、**その場所の見え方だけであり、写っているものは同じです**。
  > 
  > 各組について、現実感喪失を体験している人の周囲の風景を、その人の目に映るとおりに想像してください。そのうえで、その人にとっての周囲の風景の見え方により近いと思うほうの画像を選んでください。
  > 
  > 正解・不正解はありません。最初の印象に従ってお答えください。

- [ ] **51. instructions.js → `practice.keys_line`**  
  _New (was the end of practice.body)._

  English:

  > Please use the **←** and **→** arrow keys to choose the picture on the left or on the right.

  日本語（下書き）:

  > **←** と **→** の矢印キーで、左または右の画像を選んでください。

- [ ] **52. instructions.js → `practice.count_line`**  
  _New (was the end of practice.body). {N} = 3._

  English:

  > We will begin with {N} practice trials.

  日本語（下書き）:

  > まず{N}回の練習から始めます。

- [ ] **53. instructions.js → `practice.intro_b2`**  
  _New (was practice.body_b2, without the count)._

  English:

  > The second part works in the same way as the first.

  日本語（下書き）:

  > 2つ目のパートも、1つ目と同じ方法で進みます。

- [ ] **54. instructions.js → `practice.body_b2.derealization`**  
  _LOAD-BEARING. New, before part 2, after the new question. Participants only._

  English:

  > As before, the pictures show places that are not where your episode occurred, and they differ only in how the place looks. Please bring the episode you described in the interview back to mind, and choose the picture that is closer to how your surroundings appeared to you at that time.

  日本語（下書き）:

  > 前のパートと同様に、画像に写っているのはあなたのエピソードが起きた場所ではなく、2枚が異なるのはその場所の見え方だけです。面接でお話しいただいたエピソードを思い浮かべ、そのときの周囲の風景の見え方により近いほうの画像を選んでください。

- [ ] **55. instructions.js → `practice.body_b2.ordinary`**  
  _LOAD-BEARING. New, before part 2. Must NOT mention an interview._

  English:

  > As before, the pictures show places that are not where your episode occurred, and they differ only in how the place looks. Please bring the ordinary episode you described back to mind, and choose the picture that is closer to how your surroundings appeared to you at that time.

  日本語（下書き）:

  > 前のパートと同様に、画像に写っているのはあなたのエピソードが起きた場所ではなく、2枚が異なるのはその場所の見え方だけです。あなたが書いた、いつもどおりだったエピソードを思い浮かべ、そのときの周囲の風景の見え方により近いほうの画像を選んでください。

- [ ] **56. instructions.js → `practice.body_b2.expectation`**  
  _LOAD-BEARING. New, before part 2. Must NOT mention an interview._

  English:

  > As before, the two pictures differ only in how the place looks. Please imagine the surroundings of a person experiencing derealization, and choose the picture that is closer to how you think those surroundings appear to them.

  日本語（下書き）:

  > 前のパートと同様に、2枚の画像が異なるのはその場所の見え方だけです。現実感喪失を体験している人の周囲の風景を想像し、その人にとっての見え方により近いと思うほうの画像を選んでください。

- [ ] **57. instructions.js → `practice.continue_hint`**  
  _English changed for the formal register only; the Japanese is unchanged. Please check it still matches._

  English:

  > Please press **SPACE** to begin the practice.

  日本語（下書き）:

  > **スペースキー**を押すと練習が始まります。

- [ ] **58. instructions.js → `practice.first_feedback.derealization`**  
  _LOAD-BEARING. New. Replaces the question for 3 s after the first practice trial, with only the chosen picture. Must confirm the participant’s own choice and never read as a correct answer._

  English:

  > This is the picture you chose as closer to how your surroundings appeared to you during that episode.

  日本語（下書き）:

  > これが、そのエピソード中の周囲の風景の見え方により近いとして、あなたが選んだ画像です。

- [ ] **59. instructions.js → `practice.first_feedback.ordinary`**  
  _LOAD-BEARING. New; as above._

  English:

  > This is the picture you chose as closer to how your surroundings appeared to you during the ordinary episode.

  日本語（下書き）:

  > これが、いつもどおりだったエピソード中の周囲の風景の見え方により近いとして、あなたが選んだ画像です。

- [ ] **60. instructions.js → `practice.first_feedback.expectation`**  
  _LOAD-BEARING. New; as above._

  English:

  > This is the picture you chose as closer to how you think the surroundings appear to a person experiencing derealization.

  日本語（下書き）:

  > これが、現実感喪失を体験している人にとっての周囲の風景の見え方により近いと思うとして、あなたが選んだ画像です。

- [ ] **61. instructions.js → `practice.end_body`**  
  _Changed: no number of trials and no duration._

  English:

  > This is the end of the practice.
  > 
  > The main part works in the same way. There are short breaks along the way.
  > 
  > **Occasionally, a screen without pictures will appear**, asking you to press a particular arrow key. These screens check that you are still reading the screen. Please take your time with them: there is no time limit, and only one key press is accepted.

  日本語（下書き）:

  > 練習はこれで終わりです。
  > 
  > 本番も同じ方法で進みます。途中に短い休憩があります。
  > 
  > **ときどき、画像のない画面が表示され**、特定の矢印キーを押すよう指示されます。これは画面を読んでいるかを確認するためのものです。制限時間はありませんので、落ち着いてお読みください。押せるのは一度だけです。

- [ ] **62. instructions.js → `practice.end_body_b2`**  
  _Changed: no number of trials._

  English:

  > This is the end of the practice.
  > 
  > As in the first part, there are short breaks along the way, and occasionally a screen without pictures will appear, asking you to press a particular arrow key.

  日本語（下書き）:

  > 練習はこれで終わりです。
  > 
  > 1つ目のパートと同様に、途中に短い休憩があり、ときどき画像のない画面が表示されて、特定の矢印キーを押すよう指示されます。

- [ ] **63. instructions.js → `practice.end_hint`**  
  _English changed for the formal register only; the Japanese is unchanged. Please check it still matches._

  English:

  > Please press **SPACE** to begin.

  日本語（下書き）:

  > **スペースキー**を押すと本番が始まります。

## Texts, set-up and practice revision: Attention check

- [ ] **64. instructions.js → `catch.instruction`**  
  _English changed for the formal register only; the Japanese is unchanged. Please check it still matches. Must stay unmistakable._

  English:

  > Please press the {KEYNAME} arrow key

  日本語（下書き）:

  > {KEYNAME}の矢印キーを押してください

## Texts, set-up and practice revision: Breaks and rest

- [ ] **65. instructions.js → `brk.body`**  
  _Changed: rest your eyes, but avoid the phone or other devices. The progress line is unchanged._

  English:

  > You have completed {DONE} of {TOTAL} trials in this part.
  > 
  > You may take a moment to rest your eyes, but please avoid using your phone or other devices. Please remain in full screen.

  日本語（下書き）:

  > このパートの {TOTAL} 試行のうち {DONE} 試行が終わりました。
  > 
  > 少し目を休めていただいて構いませんが、スマートフォンやその他の機器の使用はお控えください。全画面表示のままにしてください。

- [ ] **66. instructions.js → `brk.hint`**  
  _English changed for the formal register only; the Japanese is unchanged. Please check it still matches._

  English:

  > Please press **SPACE** when you are ready to continue.

  日本語（下書き）:

  > 準備ができたら**スペースキー**を押してください。

- [ ] **67. instructions.js → `rest.body`**  
  _Changed: rest your eyes, but avoid the phone or other devices (was: you may look away from the screen)._

  English:

  > Please take a rest of one minute before the second part. You may rest your eyes, but please avoid using your phone or other devices. Please remain in full screen.

  日本語（下書き）:

  > 次のパートの前に、1分間休憩してください。目を休めていただいて構いませんが、スマートフォンやその他の機器の使用はお控えください。全画面表示のままにしてください。

- [ ] **68. instructions.js → `rest.done`**  
  _Formal register._

  English:

  > Please continue when you are ready.

  日本語（下書き）:

  > 準備ができましたら、次へお進みください。

## Texts, set-up and practice revision: Word ratings

- [ ] **69. words.js → `instruction.participant`**  
  _Changed: formal register; no dash in the English._

  English:

  > On the next screen you will see a list of words.
  > 
  > Please think again of **the episode you described in the interview** ({WORDS}).
  > 
  > **During that episode, how well does each word describe how your surroundings looked?**
  > 
  > Please rate every word from 0 (not at all) to 6 (exactly). Some words will not apply at all. This is expected; please rate every word nonetheless.

  日本語（下書き）:

  > 次の画面に言葉のリストが表示されます。
  > 
  > もう一度、**面接でお話しいただいたエピソード**（{WORDS}）について考えてください。
  > 
  > **そのエピソード中、それぞれの言葉は、あなたの周囲の風景の見え方をどの程度よく表していますか。**
  > 
  > すべての言葉について、0（まったく当てはまらない）から6（非常によく当てはまる）で評価してください。まったく当てはまらない言葉もありますが、その場合も、すべての言葉についてご回答ください。

- [ ] **70. words.js → `instruction.control`**  
  _Changed: formal register. Must NOT mention an interview._

  English:

  > On the next screen you will see a list of words.
  > 
  > **How well does each word describe how the surroundings might look to someone experiencing derealization?**
  > 
  > Please rate every word from 0 (not at all) to 6 (exactly). Some words will not apply at all. This is expected; please rate every word nonetheless.

  日本語（下書き）:

  > 次の画面に言葉のリストが表示されます。
  > 
  > **それぞれの言葉は、現実感喪失を体験している人にとっての周囲の風景の見え方を、どの程度よく表していると思いますか。**
  > 
  > すべての言葉について、0（まったく当てはまらない）から6（非常によく当てはまる）で評価してください。まったく当てはまらない言葉もありますが、その場合も、すべての言葉についてご回答ください。

## Texts, set-up and practice revision: End, loading and error screens

- [ ] **71. instructions.js → `end.fail_done`**  
  _English changed for the formal register only; the Japanese is unchanged. Please check it still matches. (No dash.)_

  English:

  > The file has been downloaded. Thank you. Once you have emailed it, you may close this page.

  日本語（下書き）:

  > ダウンロードが完了しました。メールでお送りいただいた後、このページを閉じていただいて構いません。

- [ ] **72. instructions.js → `preload.message`**  
  _English changed for the formal register only; the Japanese is unchanged. Please check it still matches._

  English:

  > Loading imagesThe study is downloading the pictures it needs. On a slow connection, this may take a minute.
  > 
  > Please do not close this page.

  日本語（下書き）:

  > 画像を読み込んでいます実験に必要な画像をダウンロードしています。通信環境によっては1分ほどかかることがあります。
  > 
  > このページを閉じないでください。

- [ ] **73. instructions.js → `error.title`**  
  _English changed for the formal register only; the Japanese is unchanged. Please check it still matches._

  English:

  > An error has occurred

  日本語（下書き）:

  > エラーが発生しました

## v5b: Episode selection (after calibration, before part 1)

- [ ] **74. instructions.js → `episodes.screens.participant.derealization.title`**  
  _Participants only. May mention the interview (面接)._

  English:

  > The episode you described in the interview

  日本語（下書き）:

  > 面接でお話しいただいたエピソード

- [ ] **75. instructions.js → `episodes.screens.participant.ordinary.title`**

  English:

  > An ordinary episode

  日本語（下書き）:

  > いつもどおりだったエピソード

- [ ] **76. instructions.js → `episodes.screens.control.ordinary.title`**

  English:

  > An ordinary episode

  日本語（下書き）:

  > いつもどおりだったエピソード

- [ ] **77. instructions.js → `episodes.screens.control.expectation.title`**

  English:

  > Derealization

  日本語（下書き）:

  > 現実感喪失

- [ ] **78. instructions.js → `episodes.screens.control.expectation.body`**  
  _LOAD-BEARING. The v4 control anchoring text, last sentence reworded to match the new expectation question. 現実感喪失 should match the Japanese CDS-29. Must not mention an interview._

  English:

  > Derealization is an experience in which one’s surroundings feel strange or detached, as if one were cut off from the world.
  > 
  > In one part of this study, please imagine how you think the surroundings look to someone experiencing derealization.

  日本語（下書き）:

  > 現実感喪失とは、周囲が奇妙に、あるいはよそよそしく感じられ、まるで自分が世界から切り離されているかのように感じられる体験です。
  > 
  > この研究の一部では、現実感喪失を体験している人には周囲の風景がどのように見えていると思うかを想像してお答えください。

- [ ] **79. instructions.js → `episodes.words.label`**  
  _Required free-text field._

  English:

  > A few words to identify this episode

  日本語（下書き）:

  > このエピソードを表すいくつかの言葉

- [ ] **80. instructions.js → `episodes.words.hint`**  
  _Example beside the field. Keep it free of visual words and of anything identifying._

  English:

  > e.g. walking home after work

  日本語（下書き）:

  > 例：仕事帰りに歩いていたとき

- [ ] **81. instructions.js → `episodes.questions.when.label`**  
  _Unchanged from v4 (was anchoring.questions.when)._

  English:

  > When was it?

  日本語（下書き）:

  > それはいつでしたか？

- [ ] **82. instructions.js → `episodes.questions.when.hint`**  
  _Unchanged from v4._

  English:

  > e.g. last week, about two months ago

  日本語（下書き）:

  > 例：先週、2か月ほど前

- [ ] **83. instructions.js → `episodes.questions.duration.label`**  
  _Unchanged from v4._

  English:

  > How long did it last?

  日本語（下書き）:

  > どのくらい続きましたか？

- [ ] **84. instructions.js → `episodes.questions.duration.hint`**  
  _Unchanged from v4._

  English:

  > e.g. a few seconds, about an hour

  日本語（下書き）:

  > 例：数秒、1時間ほど

- [ ] **85. instructions.js → `episodes.questions.where.label`**  
  _Unchanged from v4._

  English:

  > Where were you?

  日本語（下書き）:

  > どこにいましたか？

- [ ] **86. instructions.js → `episodes.questions.where.hint`**  
  _Unchanged from v4._

  English:

  > e.g. at home, on a train, in a shop

  日本語（下書き）:

  > 例：自宅、電車の中、お店

- [ ] **87. instructions.js → `episodes.questions.tone.label`**  
  _New. Scale −3 … +3._

  English:

  > How did it feel emotionally?

  日本語（下書き）:

  > そのときの気分は、どのようなものでしたか？

- [ ] **88. instructions.js → `episodes.questions.tone.anchor_low`**

  English:

  > very unpleasant

  日本語（下書き）:

  > とても不快

- [ ] **89. instructions.js → `episodes.questions.tone.anchor_high`**

  English:

  > very pleasant

  日本語（下書き）:

  > とても心地よい

- [ ] **90. instructions.js → `episodes.questions.intensity.label`**  
  _New. Scale 0 … 6._

  English:

  > How emotionally intense was it?

  日本語（下書き）:

  > そのときの感情は、どのくらい強いものでしたか？

- [ ] **91. instructions.js → `episodes.questions.intensity.anchor_low`**

  English:

  > not at all intense

  日本語（下書き）:

  > まったく強くない

- [ ] **92. instructions.js → `episodes.questions.intensity.anchor_high`**

  English:

  > extremely intense

  日本語（下書き）:

  > 非常に強い

- [ ] **93. instructions.js → `episodes.button`**  
  _Unchanged from v4._

  English:

  > Continue

  日本語（下書き）:

  > 次へ

## v5b: Reinstatement, the first screen of each part

- [ ] **94. instructions.js → `reinstate.title`**  
  _{N} = 1 or 2, {TOTAL} = 2._

  English:

  > Part {N} of {TOTAL}

  日本語（下書き）:

  > 第{N}部（全{TOTAL}部）

- [ ] **95. instructions.js → `reinstate.body.expectation`**  
  _LOAD-BEARING. Controls only: must NOT mention an interview._

  English:

  > In this part, please imagine **how you think the surroundings look to someone experiencing derealization**.
  > 
  > Derealization is an experience in which one’s surroundings feel strange or detached, as if one were cut off from the world.

  日本語（下書き）:

  > このパートでは、**現実感喪失を体験している人には周囲の風景がどのように見えていると思うか**を想像してください。
  > 
  > 現実感喪失とは、周囲が奇妙に、あるいはよそよそしく感じられ、まるで自分が世界から切り離されているかのように感じられる体験です。

- [ ] **96. instructions.js → `reinstate.button`**

  English:

  > Continue

  日本語（下書き）:

  > 次へ

## v5b: Trial prompt (shown on every image trial, by episode)

- [ ] **97. instructions.js → `prompt.main.derealization`**  
  _LOAD-BEARING. Unchanged wording (was prompt.main.participant)._

  English:

  > Which looks more like how your surroundings looked during that episode?

  日本語（下書き）:

  > そのエピソード中の周囲の風景の見え方に、より近いのはどちらですか？

- [ ] **98. instructions.js → `prompt.main.ordinary`**  
  _LOAD-BEARING. New. Must fit above the pictures._

  English:

  > Which looks more like how your surroundings looked during the ordinary episode you described?

  日本語（下書き）:

  > あなたが書いた、いつもどおりだったエピソード中の周囲の風景の見え方に、より近いのはどちらですか？

- [ ] **99. instructions.js → `prompt.main.expectation`**  
  _LOAD-BEARING. English changed from “might look” to “you think … look”; the Japanese already said 思う and is unchanged, please check it still matches._

  English:

  > Which looks more like how you think the surroundings look to someone experiencing derealization?

  日本語（下書き）:

  > 現実感喪失を体験している人にとっての周囲の風景の見え方に、より近いと思うのはどちらですか？

## v5b: Practice

- [ ] **100. instructions.js → `practice.question_changed`**  
  _New. {QUESTION} = the new question._

  English:

  > **The question has changed.** It is now:
  > 
  > {QUESTION}

  日本語（下書き）:

  > **質問が変わりました。**新しい質問は次のとおりです：
  > 
  > {QUESTION}

## v5b: Breaks and rest

- [ ] **101. instructions.js → `rest.title`**  
  _New._

  English:

  > Rest

  日本語（下書き）:

  > 休憩

- [ ] **102. instructions.js → `rest.wait`**

  English:

  > The Continue button will appear when the minute is over.

  日本語（下書き）:

  > 1分たつと「次へ」ボタンが表示されます。

- [ ] **103. instructions.js → `rest.button`**

  English:

  > Continue

  日本語（下書き）:

  > 次へ

## v5b: Word ratings

- [ ] **104. words.js → `title`**  
  _Unchanged._

  English:

  > Rating words

  日本語（下書き）:

  > 言葉の評価

- [ ] **105. words.js → `question_short.participant`**  
  _Changed: as instruction.participant._

  English:

  > During the episode you described in the interview (“{WORDS}”), how well does each word describe how your surroundings looked?

  日本語（下書き）:

  > 面接でお話しいただいたエピソード（「{WORDS}」）の間、それぞれの言葉は、あなたの周囲の風景の見え方をどの程度よく表していますか。

- [ ] **106. words.js → `question_short.control`**  
  _Unchanged._

  English:

  > How well does each word describe how the surroundings might look to someone experiencing derealization?

  日本語（下書き）:

  > それぞれの言葉は、現実感喪失を体験している人にとっての周囲の風景の見え方を、どの程度よく表していると思いますか。

## Consent screen: buttons and the screen after "I do not agree"

_Unchanged. The consent title, text and checkbox are the approved text, listed at the top._

- [ ] **107. instructions.js → `consent.button_agree`**

  English:

  > I agree, continue

  日本語（下書き）:

  > 同意して次へ

- [ ] **108. instructions.js → `consent.button_decline`**

  English:

  > I do not agree

  日本語（下書き）:

  > 同意しない

- [ ] **109. instructions.js → `consent.declined_title`**

  English:

  > Thank you

  日本語（下書き）:

  > ありがとうございました

- [ ] **110. instructions.js → `consent.declined_body`**

  English:

  > You have chosen not to take part. Nothing has been saved.
  > 
  > You may now close this page.

  日本語（下書き）:

  > 参加しないことを選択されました。何も保存されていません。
  > 
  > このページを閉じていただいて構いません。

## ID screen: link without a participant ID (ID, or name and email)

- [ ] **111. instructions.js → `id.name_label_plain`**

  English:

  > Name

  日本語（下書き）:

  > お名前

- [ ] **112. instructions.js → `id.email_label_plain`**

  English:

  > Email address

  日本語（下書き）:

  > メールアドレス

- [ ] **113. instructions.js → `id.need_id_or_contact`**  
  _Shown by the browser in a small bubble next to the ID field._

  English:

  > Please enter your participant ID, or your name and email address.

  日本語（下書き）:

  > 参加者ID、またはお名前とメールアドレスを入力してください。

## Incomplete link (no group, or no valid slot, in the link)

- [ ] **114. instructions.js → `link.missing_title`**

  English:

  > Incomplete link

  日本語（下書き）:

  > リンクが不完全です

- [ ] **115. instructions.js → `link.missing_body`**

  English:

  > This link is incomplete. Please use the full link from your invitation email, or contact the researcher.

  日本語（下書き）:

  > このリンクは不完全です。案内メールに記載されたリンクをそのまま使用するか、実験者にご連絡ください。

## Full screen and window check (hard stop)

- [ ] **116. instructions.js → `screen.small_title`**

  English:

  > This window is too small for the study

  日本語（下書き）:

  > このウィンドウはこの実験には小さすぎます

- [ ] **117. instructions.js → `screen.small_size`**  
  _Unchanged; listed for context._

  English:

  > Your display area is {W} × {H} pixels. At least {MW} × {MH} is recommended.

  日本語（下書き）:

  > 現在の表示領域は {W} × {H} ピクセルです。{MW} × {MH} ピクセル以上を推奨します。
