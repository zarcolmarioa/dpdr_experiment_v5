# Japanese strings to check

Every participant-facing string that is **new or changed** for the v4 and v5b designs and for the later text changes, with its English, for a native speaker to check. Copied from `text/en/*.js` and `text/ja/*.js` when this list was made, so it matches what the experiment showed then (HTML tags stripped, **bold** kept). If the text files change, check them, not this list.

How to use: correct the Japanese **in `text/ja/instructions.js` or `text/ja/words.js`** (the key is given for each string), not in this file. Tick the box when a string is approved.

General rules that apply to every string (see the header of `text/en/instructions.js`):

- never describe the experience with visual words (no equivalents of foggy, blurred, faded, dull, colourless, unreal, dreamlike, flat, veiled, as if behind glass);
- the interview (面接) may be mentioned **only** in strings that only participants see (keyed `participant` or `derealization`); controls were not interviewed and must never see 面接 or インタビュー;
- refer to the **surroundings** (周囲の風景), not to the self;
- acknowledge that the pictures are adjusted, without saying how;
- the set-up screens (full screen, window check, set-up, brightness) never mention the pictures; they give neutral reasons;
- formal register (です・ます, お〜ください); no dashes (em dash, en dash or horizontal bar) in any string;
- the participant and control versions of a string should differ only where the English differs.

**Not listed here:** the ten rated words, which are the registered Japanese (霞がかった, 色あせた, ベールがかかったような, 生気のない, 現実味のない, 夢のような, 遠く感じる, 絵のような, 重苦しい, 不穏な), and the four state items, which are paste-in placeholders for the published wording.

The strings changed in the latest text revision (formal register, no dashes, the set-up and brightness screens, optional episode questions, the practice texts by episode) come first; then the v5b strings, then the v4 strings that are still in use, each listed once, under the revision that last changed it. The v4 anchoring, grid and normal-appearance grid strings were removed with those screens.

## Latest revision: Consent screen (PLACEHOLDER until the approved text arrives)

- [ ] **1. instructions.js → `consent.body`**  
  _Changed paragraph on the episode questions: a few questions are about the episodes, including how they felt emotionally (そのときに感情的にどのように感じたか); some are optional (質問の一部は任意です). The sentence about 回答しない is removed. Must not mention an interview: controls see it too._

  English:

  > You are invited to take part in a research study about how people perceive their surroundings. It is run by [researcher names] at [institution].
  > 
  > **What you will do:** bring to mind experiences from your own life and answer a few short questions about them, then look at pairs of photographs and choose between them, in two parts with a short rest in between, and finally answer a few more short questions. It takes about [TO COMPLETE after pilot] minutes.
  > 
  > **Risks:** we do not expect any risks beyond those of everyday computer use. Some questions ask about unusual experiences; you may stop at any time.
  > 
  > **Benefits:** there is no direct benefit to you. [Compensation, if any.]
  > 
  > **Your data:** your responses are stored under a study ID, without your name. Results are reported only for groups or without identifying information. [Storage period and who has access.] [Whether anonymised data may be shared publicly, e.g. on Zenodo.]
  > 
  > As part of the study, you will be asked to write a few words of your own to identify each experience you bring to mind, and to answer a few short questions about these experiences, including how they felt emotionally. Some of these questions are optional. Your answers, including anything you type, are stored with your responses, so please do not include names or other details that could identify you or anyone else.
  > 
  > **Voluntary participation:** taking part is voluntary. You may stop at any time by closing this page. Your responses are saved only at the end of the study, so if you close the page before then, none of them are saved. The exception is your name and email address: they are optional, and if you provide them, they are saved immediately, separately from your responses, even if you do not finish. If you take part without a participant ID, your name and email address are what links your responses to you. [How to withdraw data after submission.]
  > 
  > **Contact:** [researcher email]. For questions about your rights as a participant: [ethics committee contact]. [Ethics approval number.]

  日本語（下書き）:

  > 人が周囲をどのように知覚するかについての研究へのご協力をお願いしています。本研究は[所属機関]の[研究者名]が実施しています。
  > 
  > **参加内容：**ご自身の生活の中の体験を思い浮かべ、それについていくつかの短い質問にお答えいただきます。その後、2枚1組の写真を見てどちらかを選ぶ課題を、間に短い休憩をはさんで2回に分けて行い、最後にいくつかの短い質問にお答えいただきます。所要時間は約[TO COMPLETE after pilot]分です。
  > 
  > **リスク：**日常的なコンピュータの使用を超えるリスクは想定していません。一部の質問では、普段とは異なる体験についてお尋ねします。いつでも参加を中止できます。
  > 
  > **利益：**参加による直接の利益はありません。[謝礼がある場合はその内容]
  > 
  > **データの扱い：**回答はお名前ではなく研究用IDのもとで保存されます。結果は集団としてまとめるか、個人が特定できない形でのみ報告します。[保存期間とアクセスできる者][匿名化したデータを公開する可能性（例：Zenodo）]
  > 
  > 研究の一環として、思い浮かべたそれぞれの体験について、あとでそれとわかるよう、ご自身の言葉で短く書いていただき、そのときに感情的にどのように感じたかを含め、これらの体験についていくつかの短い質問にお答えいただきます。質問の一部は任意です。回答（入力した内容を含む）は回答データとともに保存されますので、ご自身や他の人の名前など、個人を特定できる情報は書かないでください。
  > 
  > **自由意思による参加：**参加は自由意思によるものです。このページを閉じることで、いつでも中止できます。回答は研究の最後にまとめて保存されるため、それより前にページを閉じた場合、回答は保存されません。ただし、お名前とメールアドレス（いずれも任意）を入力された場合は、最後まで終えなかったときでも、入力した時点で回答とは別に保存されます。参加者IDなしで参加された場合は、お名前とメールアドレスによって回答とあなたを照合します。[提出後のデータ撤回の方法]
  > 
  > **連絡先：**[研究者のメールアドレス]。参加者としての権利に関するご質問：[倫理委員会の連絡先]。[倫理審査承認番号]

- [ ] **2. instructions.js → `consent.body_results_file`**  
  _Pavlovia version; the same change._

  English:

  > You are invited to take part in a research study about how people perceive their surroundings. It is run by [researcher names] at [institution].
  > 
  > **What you will do:** bring to mind experiences from your own life and answer a few short questions about them, then look at pairs of photographs and choose between them, in two parts with a short rest in between, and finally answer a few more short questions. It takes about [TO COMPLETE after pilot] minutes.
  > 
  > **Risks:** we do not expect any risks beyond those of everyday computer use. Some questions ask about unusual experiences; you may stop at any time.
  > 
  > **Benefits:** there is no direct benefit to you. [Compensation, if any.]
  > 
  > **Your data:** your responses are stored under a study ID. If you provide your name and email address, they are stored in the same file as your responses, which only the research team can access. Results are reported only for groups or without identifying information. [Storage period and who has access.] [Whether anonymised data may be shared publicly, e.g. on Zenodo; your name and email address are never shared.]
  > 
  > As part of the study, you will be asked to write a few words of your own to identify each experience you bring to mind, and to answer a few short questions about these experiences, including how they felt emotionally. Some of these questions are optional. Your answers, including anything you type, are stored with your responses, so please do not include names or other details that could identify you or anyone else.
  > 
  > **Voluntary participation:** taking part is voluntary. You may stop at any time by closing this page. Your responses are saved only at the end of the study, so if you close the page before then, none of them are saved. The same applies to your name and email address: they are optional, and if you provide them, they are saved together with your responses at the end. If you take part without a participant ID, your name and email address are what links your responses to you. [How to withdraw data after submission.]
  > 
  > **Contact:** [researcher email]. For questions about your rights as a participant: [ethics committee contact]. [Ethics approval number.]

  日本語（下書き）:

  > 人が周囲をどのように知覚するかについての研究へのご協力をお願いしています。本研究は[所属機関]の[研究者名]が実施しています。
  > 
  > **参加内容：**ご自身の生活の中の体験を思い浮かべ、それについていくつかの短い質問にお答えいただきます。その後、2枚1組の写真を見てどちらかを選ぶ課題を、間に短い休憩をはさんで2回に分けて行い、最後にいくつかの短い質問にお答えいただきます。所要時間は約[TO COMPLETE after pilot]分です。
  > 
  > **リスク：**日常的なコンピュータの使用を超えるリスクは想定していません。一部の質問では、普段とは異なる体験についてお尋ねします。いつでも参加を中止できます。
  > 
  > **利益：**参加による直接の利益はありません。[謝礼がある場合はその内容]
  > 
  > **データの扱い：**回答は研究用IDのもとで保存されます。お名前とメールアドレスを入力された場合は、回答と同じファイルに保存され、研究チームのみが閲覧できます。結果は集団としてまとめるか、個人が特定できない形でのみ報告します。[保存期間とアクセスできる者][匿名化したデータを公開する可能性（例：Zenodo）。お名前とメールアドレスは公開しません]
  > 
  > 研究の一環として、思い浮かべたそれぞれの体験について、あとでそれとわかるよう、ご自身の言葉で短く書いていただき、そのときに感情的にどのように感じたかを含め、これらの体験についていくつかの短い質問にお答えいただきます。質問の一部は任意です。回答（入力した内容を含む）は回答データとともに保存されますので、ご自身や他の人の名前など、個人を特定できる情報は書かないでください。
  > 
  > **自由意思による参加：**参加は自由意思によるものです。このページを閉じることで、いつでも中止できます。回答は研究の最後にまとめて保存されるため、それより前にページを閉じた場合、回答は保存されません。お名前とメールアドレス（いずれも任意）も同様で、入力された場合は最後に回答と一緒に保存されます。参加者IDなしで参加された場合は、お名前とメールアドレスによって回答とあなたを照合します。[提出後のデータ撤回の方法]
  > 
  > **連絡先：**[研究者のメールアドレス]。参加者としての権利に関するご質問：[倫理委員会の連絡先]。[倫理審査承認番号]

## Latest revision: Full screen and window check

- [ ] **3. instructions.js → `screen.fs_body`**  
  _Changed: a neutral reason (同様の条件で表示されるよう); must NOT mention the pictures._

  English:

  > This study runs in full screen, so that it is shown under similar conditions for everyone.
  > 
  > Please remain in full screen until the study ends.

  日本語（下書き）:

  > すべての参加者に同様の条件で表示されるよう、この実験は全画面表示で行います。
  > 
  > 実験が終わるまで、全画面表示のままにしてください。

- [ ] **4. instructions.js → `screen.small_body`**  
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

## Latest revision: Set-up screen (new, before the brightness screen)

- [ ] **5. instructions.js → `calibration.setup_title`**  
  _New. Must not mention the pictures._

  English:

  > Before you start

  日本語（下書き）:

  > はじめる前に

- [ ] **6. instructions.js → `calibration.setup_body`**  
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

## Latest revision: Brightness screen

- [ ] **7. instructions.js → `calibration.brightness_intro`**  
  _Changed: no longer mentions the pictures or their darker areas; a neutral reason instead._

  English:

  > Please set your screen brightness to its **highest setting** now, and leave it there for the whole session, so that the study is shown under similar conditions for everyone.

  日本語（下書き）:

  > すべての参加者に同様の条件で表示されるよう、画面の明るさを**最大**に設定し、実験中はそのままにしてください。

- [ ] **8. instructions.js → `calibration.brightness_charger`**  
  _New._

  English:

  > **Charger:** please connect the computer to its charger, because many devices dim the screen when running on battery.

  日本語（下書き）:

  > **充電器：**多くの機器はバッテリーで動作しているときに画面を暗くするため、コンピュータを充電器に接続してください。

- [ ] **9. instructions.js → `calibration.brightness_auto`**  
  _New. True Tone and Night Shift are the names Apple uses in its Japanese settings; please check the other feature names are the ones Japanese users see (明るさの自動調節, ナイトモード, ブルーライトカット, バッテリー節約機能)._

  English:

  > **Automatic features:** if possible, please switch off automatic brightness (also called adaptive or auto brightness), True Tone, Night Shift or night mode, blue light filters and battery saver. If you do not know whether these are on, you may continue.

  日本語（下書き）:

  > **自動機能：**可能であれば、明るさの自動調節（アダプティブブライトネス、自動輝度調整などとも呼ばれます）、True Tone、Night Shift やナイトモード、ブルーライトカット、バッテリー節約機能をオフにしてください。これらがオンになっているかわからない場合は、そのままお進みいただいて構いません。

- [ ] **10. instructions.js → `calibration.brightness_lighting`**  
  _New._

  English:

  > **Lighting:** please sit in a room with good, steady lighting, and avoid changing daylight or light falling directly on the screen. Screens can adjust their brightness to the light in the room.

  日本語（下書き）:

  > **照明：**明るく安定した照明のある部屋でご参加ください。変化する日差しや、画面に直接当たる光は避けてください。画面は部屋の明るさに合わせて明るさを調節することがあります。

- [ ] **11. instructions.js → `calibration.lighting_checkbox`**  
  _New. Second required checkbox, recorded as lighting_confirmed._

  English:

  > The room I am in has good, steady lighting.

  日本語（下書き）:

  > 今いる部屋は、明るく安定した照明です。

## Latest revision: Screen calibration

- [ ] **12. instructions.js → `calibration.gamma_intro`**  
  _Changed: the sentence about sitting back or squinting (少し離れて見たり、目を細めたり) is removed._

  English:

  > Next we will measure a property of your screen that affects how brightness is displayed. You will do a short matching task **three times**.
  > 
  > Each time, you will see two patterns side by side. Please adjust the right one until the two look like the same shade of grey.

  日本語（下書き）:

  > 次に、明るさの表示のしかたに関わる画面の特性を測定します。短いマッチング課題を**3回**行います。
  > 
  > 2つのパターンが並んで表示されます。右側を調整して、2つが同じ灰色に見えるようにしてください。

- [ ] **13. instructions.js → `calibration.gamma_prompt`**  
  _English changed for the formal register only; the Japanese is unchanged. Please check it still matches._

  English:

  > Please adjust the square on the right until both squares look the same shade of grey, then click **Confirm match**.

  日本語（下書き）:

  > 2つの四角が同じ灰色に見えるまで右の四角を調整し、**「確定」**を押してください。

- [ ] **14. instructions.js → `calibration.gamma_hint`**  
  _Changed slightly: “and” between the keys; formal._

  English:

  > Please drag the slider, or use the ← and → keys.

  日本語（下書き）:

  > スライダーをドラッグするか、← と → のキーで調整してください。

## Latest revision: Participant details

- [ ] **15. instructions.js → `id.body`**  
  _English changed for the formal register only; the Japanese is unchanged. Please check it still matches._

  English:

  > Please enter your participant ID from your invitation email. If you opened this page from the link in the email, it has already been filled in.

  日本語（下書き）:

  > 案内メールに記載された参加者IDを入力してください。メール内のリンクからこのページを開いた場合は、すでに入力されています。

- [ ] **16. instructions.js → `id.id_hint`**  
  _English changed for the formal register only; the Japanese is unchanged. Please check it still matches._

  English:

  > R_ followed by 15 letters and numbers. Capital and small letters are distinguished.

  日本語（下書き）:

  > R_ に続いて英数字15文字です。大文字と小文字は区別されます。

- [ ] **17. instructions.js → `id.invalid`**  
  _Changed: no dash; two sentences._

  English:

  > This ID was not recognised. Please check your invitation email. Capital and small letters are distinguished.

  日本語（下書き）:

  > このIDを確認できませんでした。案内メールをご確認ください。大文字と小文字は区別されます。

- [ ] **18. instructions.js → `id.optional_note`**  
  _English changed for the formal register only; the Japanese is unchanged. Please check it still matches._

  English:

  > Your **name** and **email address** are **optional**. If you provide them, they are stored separately from your answers and used only to contact you about this study.

  日本語（下書き）:

  > **お名前**と**メールアドレス**の入力は**任意**です。入力された場合は回答データとは別に保存され、本研究に関するご連絡にのみ使用します。

- [ ] **19. instructions.js → `id.optional_note_results_file`**  
  _English changed for the formal register only; the Japanese is unchanged. Please check it still matches._

  English:

  > Your **name** and **email address** are **optional**. If you provide them, they are stored with your answers, which only the research team can access, and used only to contact you about this study.

  日本語（下書き）:

  > **お名前**と**メールアドレス**の入力は**任意**です。入力された場合は回答データと一緒に保存され（研究チームのみが閲覧できます）、本研究に関するご連絡にのみ使用します。

- [ ] **20. instructions.js → `id.body_no_pid`**  
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

- [ ] **21. instructions.js → `id.body_no_pid_results_file`**  
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

- [ ] **22. instructions.js → `id.privacy`**  
  _New. Shown on the ID screen in every variant._

  English:

  > Your personal details will not be shared with anyone outside the research team.

  日本語（下書き）:

  > あなたの個人情報が研究チーム以外の人に共有されることはありません。

- [ ] **23. instructions.js → `id.retry_hint`**  
  _Changed: “enter it again” (もう一度入力できます)._

  English:

  > Please press **SPACE** to enter it again.

  日本語（下書き）:

  > **スペースキー**を押すと、もう一度入力できます。

## Latest revision: Episode selection

- [ ] **24. instructions.js → `episodes.screens.participant.derealization.body`**  
  _Formal register (お書きください). Participants only._

  English:

  > In the interview, you described an episode in which your surroundings felt different from usual. Please bring that episode to mind now.
  > 
  > Please write a few words below that will allow you to recognise it later, such as where you were or what you were doing. The questions that follow are intended to help you recall it.

  日本語（下書き）:

  > 面接では、周囲がいつもと違って感じられたエピソードについてお話しいただきました。今、そのエピソードを思い浮かべてください。
  > 
  > あとで見てそれとわかるように、下の欄にいくつかの言葉でお書きください（どこにいたか、何をしていたか、など）。その後の質問は、そのエピソードを思い出しやすくするためのものです。

- [ ] **25. instructions.js → `episodes.screens.participant.ordinary.body`**  
  _Formal register; no dashes in the English. Participants only._

  English:

  > Please now bring to mind a different episode, in a **similar setting** to the episode you described in the interview ({DR_WORDS}), that is, a similar place, time of day and lighting. It should be from **about as long ago**, and your surroundings should have looked **as usual**.
  > 
  > Please write a few words below that will allow you to recognise it later. The questions that follow are intended to help you recall it.

  日本語（下書き）:

  > 次に、別のエピソードを思い浮かべてください。面接でお話しいただいたエピソード（{DR_WORDS}）と**似た状況**（似た場所・時間帯・明るさ）で、**同じくらい前**に起きた、周囲の風景が**いつもどおりに見えていた**エピソードです。
  > 
  > あとで見てそれとわかるように、下の欄にいくつかの言葉でお書きください。その後の質問は、そのエピソードを思い出しやすくするためのものです。

- [ ] **26. instructions.js → `episodes.screens.control.ordinary.body`**  
  _Formal register. Controls: must NOT mention an interview._

  English:

  > Please bring to mind an ordinary episode from the **last six months**: a time when you were somewhere and your surroundings looked as usual.
  > 
  > Please write a few words below that will allow you to recognise it later, such as where you were or what you were doing. The questions that follow are intended to help you recall it.

  日本語（下書き）:

  > **この6か月以内**の、いつもどおりだったエピソードを一つ思い浮かべてください。どこかにいて、周囲の風景がいつもどおりに見えていたときのことです。
  > 
  > あとで見てそれとわかるように、下の欄にいくつかの言葉でお書きください（どこにいたか、何をしていたか、など）。その後の質問は、そのエピソードを思い出しやすくするためのものです。

- [ ] **27. instructions.js → `episodes.questions_intro`**  
  _Changed: some questions are optional and may be left blank._

  English:

  > The following questions are intended to help you recall the episode. The questions marked as optional may be left blank.

  日本語（下書き）:

  > 以下は、エピソードを思い出しやすくするための質問です。「任意」と記された質問は、空欄のままでも構いません。

- [ ] **28. instructions.js → `episodes.optional_tag`**  
  _New. Shown after the label of when / how long / where._

  English:

  > (optional)

  日本語（下書き）:

  > （任意）

- [ ] **29. instructions.js → `episodes.incomplete`**  
  _Changed: the words, the tone and the intensity are required._

  English:

  > To continue, please write a few words to identify the episode and answer both questions about how it felt emotionally.

  日本語（下書き）:

  > 続けるには、エピソードを表す言葉を書き、そのときの気分と感情の強さについての2つの質問にお答えください。

## Latest revision: Reinstatement

- [ ] **30. instructions.js → `reinstate.body.derealization`**  
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

- [ ] **31. instructions.js → `reinstate.body.ordinary`**  
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

## Latest revision: Practice

- [ ] **32. instructions.js → `practice.body.derealization`**  
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

- [ ] **33. instructions.js → `practice.body.ordinary`**  
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

- [ ] **34. instructions.js → `practice.body.expectation`**  
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

- [ ] **35. instructions.js → `practice.keys_line`**  
  _New (was the end of practice.body)._

  English:

  > Please use the **←** and **→** arrow keys to choose the picture on the left or on the right.

  日本語（下書き）:

  > **←** と **→** の矢印キーで、左または右の画像を選んでください。

- [ ] **36. instructions.js → `practice.count_line`**  
  _New (was the end of practice.body). {N} = 3._

  English:

  > We will begin with {N} practice trials.

  日本語（下書き）:

  > まず{N}回の練習から始めます。

- [ ] **37. instructions.js → `practice.intro_b2`**  
  _New (was practice.body_b2, without the count)._

  English:

  > The second part works in the same way as the first.

  日本語（下書き）:

  > 2つ目のパートも、1つ目と同じ方法で進みます。

- [ ] **38. instructions.js → `practice.body_b2.derealization`**  
  _LOAD-BEARING. New, before part 2, after the new question. Participants only._

  English:

  > As before, the pictures show places that are not where your episode occurred, and they differ only in how the place looks. Please bring the episode you described in the interview back to mind, and choose the picture that is closer to how your surroundings appeared to you at that time.

  日本語（下書き）:

  > 前のパートと同様に、画像に写っているのはあなたのエピソードが起きた場所ではなく、2枚が異なるのはその場所の見え方だけです。面接でお話しいただいたエピソードを思い浮かべ、そのときの周囲の風景の見え方により近いほうの画像を選んでください。

- [ ] **39. instructions.js → `practice.body_b2.ordinary`**  
  _LOAD-BEARING. New, before part 2. Must NOT mention an interview._

  English:

  > As before, the pictures show places that are not where your episode occurred, and they differ only in how the place looks. Please bring the ordinary episode you described back to mind, and choose the picture that is closer to how your surroundings appeared to you at that time.

  日本語（下書き）:

  > 前のパートと同様に、画像に写っているのはあなたのエピソードが起きた場所ではなく、2枚が異なるのはその場所の見え方だけです。あなたが書いた、いつもどおりだったエピソードを思い浮かべ、そのときの周囲の風景の見え方により近いほうの画像を選んでください。

- [ ] **40. instructions.js → `practice.body_b2.expectation`**  
  _LOAD-BEARING. New, before part 2. Must NOT mention an interview._

  English:

  > As before, the two pictures differ only in how the place looks. Please imagine the surroundings of a person experiencing derealization, and choose the picture that is closer to how you think those surroundings appear to them.

  日本語（下書き）:

  > 前のパートと同様に、2枚の画像が異なるのはその場所の見え方だけです。現実感喪失を体験している人の周囲の風景を想像し、その人にとっての見え方により近いと思うほうの画像を選んでください。

- [ ] **41. instructions.js → `practice.continue_hint`**  
  _English changed for the formal register only; the Japanese is unchanged. Please check it still matches._

  English:

  > Please press **SPACE** to begin the practice.

  日本語（下書き）:

  > **スペースキー**を押すと練習が始まります。

- [ ] **42. instructions.js → `practice.first_feedback.derealization`**  
  _LOAD-BEARING. New. Replaces the question for 3 s after the first practice trial, with only the chosen picture. Must confirm the participant’s own choice and never read as a correct answer._

  English:

  > This is the picture you chose as closer to how your surroundings appeared to you during that episode.

  日本語（下書き）:

  > これが、そのエピソード中の周囲の風景の見え方により近いとして、あなたが選んだ画像です。

- [ ] **43. instructions.js → `practice.first_feedback.ordinary`**  
  _LOAD-BEARING. New; as above._

  English:

  > This is the picture you chose as closer to how your surroundings appeared to you during the ordinary episode.

  日本語（下書き）:

  > これが、いつもどおりだったエピソード中の周囲の風景の見え方により近いとして、あなたが選んだ画像です。

- [ ] **44. instructions.js → `practice.first_feedback.expectation`**  
  _LOAD-BEARING. New; as above._

  English:

  > This is the picture you chose as closer to how you think the surroundings appear to a person experiencing derealization.

  日本語（下書き）:

  > これが、現実感喪失を体験している人にとっての周囲の風景の見え方により近いと思うとして、あなたが選んだ画像です。

- [ ] **45. instructions.js → `practice.end_body`**  
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

- [ ] **46. instructions.js → `practice.end_body_b2`**  
  _Changed: no number of trials._

  English:

  > This is the end of the practice.
  > 
  > As in the first part, there are short breaks along the way, and occasionally a screen without pictures will appear, asking you to press a particular arrow key.

  日本語（下書き）:

  > 練習はこれで終わりです。
  > 
  > 1つ目のパートと同様に、途中に短い休憩があり、ときどき画像のない画面が表示されて、特定の矢印キーを押すよう指示されます。

- [ ] **47. instructions.js → `practice.end_hint`**  
  _English changed for the formal register only; the Japanese is unchanged. Please check it still matches._

  English:

  > Please press **SPACE** to begin.

  日本語（下書き）:

  > **スペースキー**を押すと本番が始まります。

## Latest revision: Attention check

- [ ] **48. instructions.js → `catch.instruction`**  
  _English changed for the formal register only; the Japanese is unchanged. Please check it still matches. Must stay unmistakable._

  English:

  > Please press the {KEYNAME} arrow key

  日本語（下書き）:

  > {KEYNAME}の矢印キーを押してください

## Latest revision: Breaks and rest

- [ ] **49. instructions.js → `brk.body`**  
  _Changed: rest your eyes, but avoid the phone or other devices. The progress line is unchanged._

  English:

  > You have completed {DONE} of {TOTAL} trials in this part.
  > 
  > You may take a moment to rest your eyes, but please avoid using your phone or other devices. Please remain in full screen.

  日本語（下書き）:

  > このパートの {TOTAL} 試行のうち {DONE} 試行が終わりました。
  > 
  > 少し目を休めていただいて構いませんが、スマートフォンやその他の機器の使用はお控えください。全画面表示のままにしてください。

- [ ] **50. instructions.js → `brk.hint`**  
  _English changed for the formal register only; the Japanese is unchanged. Please check it still matches._

  English:

  > Please press **SPACE** when you are ready to continue.

  日本語（下書き）:

  > 準備ができたら**スペースキー**を押してください。

- [ ] **51. instructions.js → `rest.body`**  
  _Changed: rest your eyes, but avoid the phone or other devices (was: you may look away from the screen)._

  English:

  > Please take a rest of one minute before the second part. You may rest your eyes, but please avoid using your phone or other devices. Please remain in full screen.

  日本語（下書き）:

  > 次のパートの前に、1分間休憩してください。目を休めていただいて構いませんが、スマートフォンやその他の機器の使用はお控えください。全画面表示のままにしてください。

- [ ] **52. instructions.js → `rest.done`**  
  _Formal register._

  English:

  > Please continue when you are ready.

  日本語（下書き）:

  > 準備ができましたら、次へお進みください。

## Latest revision: Word ratings

- [ ] **53. words.js → `instruction.participant`**  
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

- [ ] **54. words.js → `instruction.control`**  
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

## Latest revision: End, loading and error screens

- [ ] **55. instructions.js → `end.fail_done`**  
  _English changed for the formal register only; the Japanese is unchanged. Please check it still matches. (No dash.)_

  English:

  > The file has been downloaded. Thank you. Once you have emailed it, you may close this page.

  日本語（下書き）:

  > ダウンロードが完了しました。メールでお送りいただいた後、このページを閉じていただいて構いません。

- [ ] **56. instructions.js → `preload.message`**  
  _English changed for the formal register only; the Japanese is unchanged. Please check it still matches._

  English:

  > Loading imagesThe study is downloading the pictures it needs. On a slow connection, this may take a minute.
  > 
  > Please do not close this page.

  日本語（下書き）:

  > 画像を読み込んでいます実験に必要な画像をダウンロードしています。通信環境によっては1分ほどかかることがあります。
  > 
  > このページを閉じないでください。

- [ ] **57. instructions.js → `error.title`**  
  _English changed for the formal register only; the Japanese is unchanged. Please check it still matches._

  English:

  > An error has occurred

  日本語（下書き）:

  > エラーが発生しました

## v5b: Episode selection (after calibration, before part 1)

- [ ] **58. instructions.js → `episodes.screens.participant.derealization.title`**  
  _Participants only. May mention the interview (面接)._

  English:

  > The episode you described in the interview

  日本語（下書き）:

  > 面接でお話しいただいたエピソード

- [ ] **59. instructions.js → `episodes.screens.participant.ordinary.title`**

  English:

  > An ordinary episode

  日本語（下書き）:

  > いつもどおりだったエピソード

- [ ] **60. instructions.js → `episodes.screens.control.ordinary.title`**

  English:

  > An ordinary episode

  日本語（下書き）:

  > いつもどおりだったエピソード

- [ ] **61. instructions.js → `episodes.screens.control.expectation.title`**

  English:

  > Derealization

  日本語（下書き）:

  > 現実感喪失

- [ ] **62. instructions.js → `episodes.screens.control.expectation.body`**  
  _LOAD-BEARING. The v4 control anchoring text, last sentence reworded to match the new expectation question. 現実感喪失 should match the Japanese CDS-29. Must not mention an interview._

  English:

  > Derealization is an experience in which one’s surroundings feel strange or detached, as if one were cut off from the world.
  > 
  > In one part of this study, please imagine how you think the surroundings look to someone experiencing derealization.

  日本語（下書き）:

  > 現実感喪失とは、周囲が奇妙に、あるいはよそよそしく感じられ、まるで自分が世界から切り離されているかのように感じられる体験です。
  > 
  > この研究の一部では、現実感喪失を体験している人には周囲の風景がどのように見えていると思うかを想像してお答えください。

- [ ] **63. instructions.js → `episodes.words.label`**  
  _Required free-text field._

  English:

  > A few words to identify this episode

  日本語（下書き）:

  > このエピソードを表すいくつかの言葉

- [ ] **64. instructions.js → `episodes.words.hint`**  
  _Example beside the field. Keep it free of visual words and of anything identifying._

  English:

  > e.g. walking home after work

  日本語（下書き）:

  > 例：仕事帰りに歩いていたとき

- [ ] **65. instructions.js → `episodes.questions.when.label`**  
  _Unchanged from v4 (was anchoring.questions.when)._

  English:

  > When was it?

  日本語（下書き）:

  > それはいつでしたか？

- [ ] **66. instructions.js → `episodes.questions.when.hint`**  
  _Unchanged from v4._

  English:

  > e.g. last week, about two months ago

  日本語（下書き）:

  > 例：先週、2か月ほど前

- [ ] **67. instructions.js → `episodes.questions.duration.label`**  
  _Unchanged from v4._

  English:

  > How long did it last?

  日本語（下書き）:

  > どのくらい続きましたか？

- [ ] **68. instructions.js → `episodes.questions.duration.hint`**  
  _Unchanged from v4._

  English:

  > e.g. a few seconds, about an hour

  日本語（下書き）:

  > 例：数秒、1時間ほど

- [ ] **69. instructions.js → `episodes.questions.where.label`**  
  _Unchanged from v4._

  English:

  > Where were you?

  日本語（下書き）:

  > どこにいましたか？

- [ ] **70. instructions.js → `episodes.questions.where.hint`**  
  _Unchanged from v4._

  English:

  > e.g. at home, on a train, in a shop

  日本語（下書き）:

  > 例：自宅、電車の中、お店

- [ ] **71. instructions.js → `episodes.questions.tone.label`**  
  _New. Scale −3 … +3._

  English:

  > How did it feel emotionally?

  日本語（下書き）:

  > そのときの気分は、どのようなものでしたか？

- [ ] **72. instructions.js → `episodes.questions.tone.anchor_low`**

  English:

  > very unpleasant

  日本語（下書き）:

  > とても不快

- [ ] **73. instructions.js → `episodes.questions.tone.anchor_high`**

  English:

  > very pleasant

  日本語（下書き）:

  > とても心地よい

- [ ] **74. instructions.js → `episodes.questions.intensity.label`**  
  _New. Scale 0 … 6._

  English:

  > How emotionally intense was it?

  日本語（下書き）:

  > そのときの感情は、どのくらい強いものでしたか？

- [ ] **75. instructions.js → `episodes.questions.intensity.anchor_low`**

  English:

  > not at all intense

  日本語（下書き）:

  > まったく強くない

- [ ] **76. instructions.js → `episodes.questions.intensity.anchor_high`**

  English:

  > extremely intense

  日本語（下書き）:

  > 非常に強い

- [ ] **77. instructions.js → `episodes.button`**  
  _Unchanged from v4._

  English:

  > Continue

  日本語（下書き）:

  > 次へ

## v5b: Reinstatement, the first screen of each part

- [ ] **78. instructions.js → `reinstate.title`**  
  _{N} = 1 or 2, {TOTAL} = 2._

  English:

  > Part {N} of {TOTAL}

  日本語（下書き）:

  > 第{N}部（全{TOTAL}部）

- [ ] **79. instructions.js → `reinstate.body.expectation`**  
  _LOAD-BEARING. Controls only: must NOT mention an interview._

  English:

  > In this part, please imagine **how you think the surroundings look to someone experiencing derealization**.
  > 
  > Derealization is an experience in which one’s surroundings feel strange or detached, as if one were cut off from the world.

  日本語（下書き）:

  > このパートでは、**現実感喪失を体験している人には周囲の風景がどのように見えていると思うか**を想像してください。
  > 
  > 現実感喪失とは、周囲が奇妙に、あるいはよそよそしく感じられ、まるで自分が世界から切り離されているかのように感じられる体験です。

- [ ] **80. instructions.js → `reinstate.button`**

  English:

  > Continue

  日本語（下書き）:

  > 次へ

## v5b: Trial prompt (shown on every image trial, by episode)

- [ ] **81. instructions.js → `prompt.main.derealization`**  
  _LOAD-BEARING. Unchanged wording (was prompt.main.participant)._

  English:

  > Which looks more like how your surroundings looked during that episode?

  日本語（下書き）:

  > そのエピソード中の周囲の風景の見え方に、より近いのはどちらですか？

- [ ] **82. instructions.js → `prompt.main.ordinary`**  
  _LOAD-BEARING. New. Must fit above the pictures._

  English:

  > Which looks more like how your surroundings looked during the ordinary episode you described?

  日本語（下書き）:

  > あなたが書いた、いつもどおりだったエピソード中の周囲の風景の見え方に、より近いのはどちらですか？

- [ ] **83. instructions.js → `prompt.main.expectation`**  
  _LOAD-BEARING. English changed from “might look” to “you think … look”; the Japanese already said 思う and is unchanged, please check it still matches._

  English:

  > Which looks more like how you think the surroundings look to someone experiencing derealization?

  日本語（下書き）:

  > 現実感喪失を体験している人にとっての周囲の風景の見え方に、より近いと思うのはどちらですか？

## v5b: Practice

- [ ] **84. instructions.js → `practice.question_changed`**  
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

- [ ] **85. instructions.js → `rest.title`**  
  _New._

  English:

  > Rest

  日本語（下書き）:

  > 休憩

- [ ] **86. instructions.js → `rest.wait`**

  English:

  > The Continue button will appear when the minute is over.

  日本語（下書き）:

  > 1分たつと「次へ」ボタンが表示されます。

- [ ] **87. instructions.js → `rest.button`**

  English:

  > Continue

  日本語（下書き）:

  > 次へ

## v5b: Word ratings

- [ ] **88. words.js → `title`**  
  _Unchanged._

  English:

  > Rating words

  日本語（下書き）:

  > 言葉の評価

- [ ] **89. words.js → `question_short.participant`**  
  _Changed: as instruction.participant._

  English:

  > During the episode you described in the interview (“{WORDS}”), how well does each word describe how your surroundings looked?

  日本語（下書き）:

  > 面接でお話しいただいたエピソード（「{WORDS}」）の間、それぞれの言葉は、あなたの周囲の風景の見え方をどの程度よく表していますか。

- [ ] **90. words.js → `question_short.control`**  
  _Unchanged._

  English:

  > How well does each word describe how the surroundings might look to someone experiencing derealization?

  日本語（下書き）:

  > それぞれの言葉は、現実感喪失を体験している人にとっての周囲の風景の見え方を、どの程度よく表していると思いますか。

## Consent screen: PLACEHOLDER (to be replaced by the approved text)

- [ ] **91. instructions.js → `consent.title`**

  English:

  > Consent to take part

  日本語（下書き）:

  > 研究参加への同意

- [ ] **92. instructions.js → `consent.checkbox`**

  English:

  > I have read the information above, I am at least 18 years old, and I agree to take part.

  日本語（下書き）:

  > 上記の説明を読みました。18歳以上であり、本研究への参加に同意します。

- [ ] **93. instructions.js → `consent.button_agree`**

  English:

  > I agree, continue

  日本語（下書き）:

  > 同意して次へ

- [ ] **94. instructions.js → `consent.button_decline`**

  English:

  > I do not agree

  日本語（下書き）:

  > 同意しない

- [ ] **95. instructions.js → `consent.declined_title`**

  English:

  > Thank you

  日本語（下書き）:

  > ありがとうございました

- [ ] **96. instructions.js → `consent.declined_body`**

  English:

  > You have chosen not to take part. Nothing has been saved.
  > 
  > You may now close this page.

  日本語（下書き）:

  > 参加しないことを選択されました。何も保存されていません。
  > 
  > このページを閉じていただいて構いません。

## ID screen: link without a participant ID (ID, or name and email)

- [ ] **97. instructions.js → `id.name_label_plain`**

  English:

  > Name

  日本語（下書き）:

  > お名前

- [ ] **98. instructions.js → `id.email_label_plain`**

  English:

  > Email address

  日本語（下書き）:

  > メールアドレス

- [ ] **99. instructions.js → `id.need_id_or_contact`**  
  _Shown by the browser in a small bubble next to the ID field._

  English:

  > Please enter your participant ID, or your name and email address.

  日本語（下書き）:

  > 参加者ID、またはお名前とメールアドレスを入力してください。

## Incomplete link (no group, or no valid slot, in the link)

- [ ] **100. instructions.js → `link.missing_title`**

  English:

  > Incomplete link

  日本語（下書き）:

  > リンクが不完全です

- [ ] **101. instructions.js → `link.missing_body`**

  English:

  > This link is incomplete. Please use the full link from your invitation email, or contact the researcher.

  日本語（下書き）:

  > このリンクは不完全です。案内メールに記載されたリンクをそのまま使用するか、実験者にご連絡ください。

## Full screen and window check (hard stop)

- [ ] **102. instructions.js → `screen.small_title`**

  English:

  > This window is too small for the study

  日本語（下書き）:

  > このウィンドウはこの実験には小さすぎます

- [ ] **103. instructions.js → `screen.small_size`**  
  _Unchanged; listed for context._

  English:

  > Your display area is {W} × {H} pixels. At least {MW} × {MH} is recommended.

  日本語（下書き）:

  > 現在の表示領域は {W} × {H} ピクセルです。{MW} × {MH} ピクセル以上を推奨します。

## State items (optional block at the end)

- [ ] **104. instructions.js → `state.lead_in`**  
  _Drafted. If the published Japanese version of the questionnaire has its own lead-in for the state form, use that instead._

  English:

  > Right now, at this moment:

  日本語（下書き）:

  > 今、この瞬間：

- [ ] **105. instructions.js → `state.anchor_low`**  
  _Same Japanese as the word-rating anchor, as requested (the English differs: “not at all”)._

  English:

  > not at all

  日本語（下書き）:

  > まったく当てはまらない

- [ ] **106. instructions.js → `state.anchor_high`**  
  _Same Japanese as the word-rating anchor, as requested (the English differs: “completely” vs the word ratings’ “exactly”)._

  English:

  > completely

  日本語（下書き）:

  > 非常によく当てはまる

- [ ] **107. instructions.js → `state.progress`**

  English:

  > {DONE} of {TOTAL} answered

  日本語（下書き）:

  > {TOTAL} 項目中 {DONE} 項目に回答済み

- [ ] **108. instructions.js → `state.button_submit`**

  English:

  > Continue

  日本語（下書き）:

  > 次へ
