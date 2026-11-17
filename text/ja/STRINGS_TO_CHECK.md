# Japanese strings to check

Every participant-facing string that is **new or changed** for the v4 and v5b designs, with its English, for a native speaker to check. Copied from `text/en/*.js` and `text/ja/*.js` when this list was made, so it matches what the experiment showed then (HTML tags stripped, **bold** kept). If the text files change, check them, not this list.

How to use: correct the Japanese **in `text/ja/instructions.js` or `text/ja/words.js`** (the key is given for each string), not in this file. Tick the box when a string is approved.

General rules that apply to every string (see the header of `text/en/instructions.js`):

- never describe the experience with visual words (no equivalents of foggy, blurred, faded, dull, colourless, unreal, dreamlike, flat, veiled, as if behind glass);
- the interview (面接) may be mentioned **only** in strings that only participants see (keyed `participant` or `derealization`); controls were not interviewed and must never see 面接 or インタビュー;
- refer to the **surroundings** (周囲の風景), not to the self;
- acknowledge that the pictures are adjusted, without saying how;
- the participant and control versions of a string should differ only where the English differs.

**Not listed here:** the ten rated words, which are the registered Japanese (霞がかった, 色あせた, ベールがかかったような, 生気のない, 現実味のない, 夢のような, 遠く感じる, 絵のような, 重苦しい, 不穏な), and the four state items, which are paste-in placeholders for the published wording.

The v5b strings come first, then the v4 strings that are still in use. The v4 anchoring, grid and normal-appearance grid strings were removed with those screens.

## v5b — Consent screen — v5b changes (PLACEHOLDER until the approved text arrives)

- [ ] **1. instructions.js → `consent.body`**  
  _v5b: “What you will do” now describes the episodes, the two parts and the rest; the session length is [TO COMPLETE after pilot]; the episode questions are part of the study and each can be answered with “Prefer not to say” (回答しない); OSF → Zenodo. Must not mention an interview: controls see it too._

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
  > As part of the study, you will be asked to write a few words of your own to identify each experience you bring to mind, and to answer a few short questions about it, such as when and where it happened. Each of these questions can be answered with “Prefer not to say”. Your answers, including anything you type, are stored with your responses, so please do not include names or other details that could identify you or anyone else.
  > 
  > **Voluntary participation:** taking part is voluntary. You may stop at any time by closing this page. Your responses are saved only at the end of the study, so if you close the page before then, none of them are saved. The exception is your name and email address: they are optional, and if you give them they are saved straight away, separately from your responses, even if you do not finish. If you take part without a participant ID, your name and email address are what links your responses to you. [How to withdraw data after submission.]
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
  > 研究の一環として、思い浮かべたそれぞれの体験について、あとでそれとわかるよう、ご自身の言葉で短く書いていただき、いつ・どこで起きたかなど、いくつかの短い質問にお答えいただきます。これらの質問には、いずれも「回答しない」と答えることができます。回答（入力した内容を含む）は回答データとともに保存されますので、ご自身や他の人の名前など、個人を特定できる情報は書かないでください。
  > 
  > **自由意思による参加：**参加は自由意思によるものです。このページを閉じることで、いつでも中止できます。回答は研究の最後にまとめて保存されるため、それより前にページを閉じた場合、回答は保存されません。ただし、お名前とメールアドレス（いずれも任意）を入力された場合は、最後まで終えなかったときでも、入力した時点で回答とは別に保存されます。参加者IDなしで参加された場合は、お名前とメールアドレスによって回答とあなたを照合します。[提出後のデータ撤回の方法]
  > 
  > **連絡先：**[研究者のメールアドレス]。参加者としての権利に関するご質問：[倫理委員会の連絡先]。[倫理審査承認番号]

- [ ] **2. instructions.js → `consent.body_results_file`**  
  _Pavlovia version of consent.body; the same v5b changes._

  English:

  > You are invited to take part in a research study about how people perceive their surroundings. It is run by [researcher names] at [institution].
  > 
  > **What you will do:** bring to mind experiences from your own life and answer a few short questions about them, then look at pairs of photographs and choose between them, in two parts with a short rest in between, and finally answer a few more short questions. It takes about [TO COMPLETE after pilot] minutes.
  > 
  > **Risks:** we do not expect any risks beyond those of everyday computer use. Some questions ask about unusual experiences; you may stop at any time.
  > 
  > **Benefits:** there is no direct benefit to you. [Compensation, if any.]
  > 
  > **Your data:** your responses are stored under a study ID. If you give your name and email address, they are stored in the same file as your responses, which only the research team can access. Results are reported only for groups or without identifying information. [Storage period and who has access.] [Whether anonymised data may be shared publicly, e.g. on Zenodo; your name and email address are never shared.]
  > 
  > As part of the study, you will be asked to write a few words of your own to identify each experience you bring to mind, and to answer a few short questions about it, such as when and where it happened. Each of these questions can be answered with “Prefer not to say”. Your answers, including anything you type, are stored with your responses, so please do not include names or other details that could identify you or anyone else.
  > 
  > **Voluntary participation:** taking part is voluntary. You may stop at any time by closing this page. Your responses are saved only at the end of the study, so if you close the page before then, none of them are saved. The same applies to your name and email address: they are optional, and if you give them they are saved together with your responses at the end. If you take part without a participant ID, your name and email address are what links your responses to you. [How to withdraw data after submission.]
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
  > 研究の一環として、思い浮かべたそれぞれの体験について、あとでそれとわかるよう、ご自身の言葉で短く書いていただき、いつ・どこで起きたかなど、いくつかの短い質問にお答えいただきます。これらの質問には、いずれも「回答しない」と答えることができます。回答（入力した内容を含む）は回答データとともに保存されますので、ご自身や他の人の名前など、個人を特定できる情報は書かないでください。
  > 
  > **自由意思による参加：**参加は自由意思によるものです。このページを閉じることで、いつでも中止できます。回答は研究の最後にまとめて保存されるため、それより前にページを閉じた場合、回答は保存されません。お名前とメールアドレス（いずれも任意）も同様で、入力された場合は最後に回答と一緒に保存されます。参加者IDなしで参加された場合は、お名前とメールアドレスによって回答とあなたを照合します。[提出後のデータ撤回の方法]
  > 
  > **連絡先：**[研究者のメールアドレス]。参加者としての権利に関するご質問：[倫理委員会の連絡先]。[倫理審査承認番号]

## v5b — Episode selection (after calibration, before part 1)

- [ ] **3. instructions.js → `episodes.screens.participant.derealization.title`**  
  _Participants only. May mention the interview (面接)._

  English:

  > The episode you described in the interview

  日本語（下書き）:

  > 面接でお話しいただいたエピソード

- [ ] **4. instructions.js → `episodes.screens.participant.derealization.body`**  
  _LOAD-BEARING. Participants only: the episode they described in the interview._

  English:

  > In the interview, you described an episode in which your surroundings felt different from usual. Please bring that episode to mind now.
  > 
  > Write a few words below that will let you recognise it later, such as where you were or what you were doing. The questions after that are there to help you bring it back.

  日本語（下書き）:

  > 面接では、周囲がいつもと違って感じられたエピソードについてお話しいただきました。今、そのエピソードを思い浮かべてください。
  > 
  > あとで見てそれとわかるように、下の欄にいくつかの言葉で書いてください（どこにいたか、何をしていたか、など）。その後の質問は、そのエピソードを思い出しやすくするためのものです。

- [ ] **5. instructions.js → `episodes.screens.participant.ordinary.title`**

  English:

  > An ordinary episode

  日本語（下書き）:

  > いつもどおりだったエピソード

- [ ] **6. instructions.js → `episodes.screens.participant.ordinary.body`**  
  _LOAD-BEARING. Participants only. Similar setting (place, time of day, lighting = 明るさ), about as long ago, surroundings looked as usual. Shows their own words for the derealization episode ({DR_WORDS})._

  English:

  > Now please bring to mind a different episode: one in a **similar setting** to the episode you described in the interview ({DR_WORDS}) — a similar place, time of day and lighting — from **about as long ago**, in which your surroundings looked **as usual**.
  > 
  > Write a few words below that will let you recognise it later. The questions after that are there to help you bring it back.

  日本語（下書き）:

  > 次に、別のエピソードを思い浮かべてください。面接でお話しいただいたエピソード（{DR_WORDS}）と**似た状況**（似た場所・時間帯・明るさ）で、**同じくらい前**に起きた、周囲の風景が**いつもどおりに見えていた**エピソードです。
  > 
  > あとで見てそれとわかるように、下の欄にいくつかの言葉で書いてください。その後の質問は、そのエピソードを思い出しやすくするためのものです。

- [ ] **7. instructions.js → `episodes.screens.control.ordinary.title`**

  English:

  > An ordinary episode

  日本語（下書き）:

  > いつもどおりだったエピソード

- [ ] **8. instructions.js → `episodes.screens.control.ordinary.body`**  
  _LOAD-BEARING. Controls: must NOT mention an interview._

  English:

  > Please bring to mind an ordinary episode from the **last six months**: a time when you were somewhere and your surroundings looked as usual.
  > 
  > Write a few words below that will let you recognise it later, such as where you were or what you were doing. The questions after that are there to help you bring it back.

  日本語（下書き）:

  > **この6か月以内**の、いつもどおりだったエピソードを一つ思い浮かべてください。どこかにいて、周囲の風景がいつもどおりに見えていたときのことです。
  > 
  > あとで見てそれとわかるように、下の欄にいくつかの言葉で書いてください（どこにいたか、何をしていたか、など）。その後の質問は、そのエピソードを思い出しやすくするためのものです。

- [ ] **9. instructions.js → `episodes.screens.control.expectation.title`**

  English:

  > Derealization

  日本語（下書き）:

  > 現実感喪失

- [ ] **10. instructions.js → `episodes.screens.control.expectation.body`**  
  _LOAD-BEARING. The v4 control anchoring text, last sentence reworded to match the new expectation question. 現実感喪失 should match the Japanese CDS-29. Must not mention an interview._

  English:

  > Derealization is an experience in which one’s surroundings feel strange or detached, as if one were cut off from the world.
  > 
  > In one part of this study, please imagine how you think the surroundings look to someone experiencing derealization.

  日本語（下書き）:

  > 現実感喪失とは、周囲が奇妙に、あるいはよそよそしく感じられ、まるで自分が世界から切り離されているかのように感じられる体験です。
  > 
  > この研究の一部では、現実感喪失を体験している人には周囲の風景がどのように見えていると思うかを想像してお答えください。

- [ ] **11. instructions.js → `episodes.words.label`**  
  _Required free-text field._

  English:

  > A few words to identify this episode

  日本語（下書き）:

  > このエピソードを表すいくつかの言葉

- [ ] **12. instructions.js → `episodes.words.hint`**  
  _Example beside the field. Keep it free of visual words and of anything identifying._

  English:

  > e.g. walking home after work

  日本語（下書き）:

  > 例：仕事帰りに歩いていたとき

- [ ] **13. instructions.js → `episodes.questions_intro`**

  English:

  > Questions to help you bring it back. Please answer each one; if you prefer not to answer, choose “Prefer not to say”.

  日本語（下書き）:

  > エピソードを思い出しやすくするための質問です。すべての質問にお答えください。答えたくない場合は「回答しない」を選んでください。

- [ ] **14. instructions.js → `episodes.questions.when.label`**  
  _Unchanged from v4 (was anchoring.questions.when)._

  English:

  > When was it?

  日本語（下書き）:

  > それはいつでしたか？

- [ ] **15. instructions.js → `episodes.questions.when.hint`**  
  _Unchanged from v4._

  English:

  > e.g. last week, about two months ago

  日本語（下書き）:

  > 例：先週、2か月ほど前

- [ ] **16. instructions.js → `episodes.questions.duration.label`**  
  _Unchanged from v4._

  English:

  > How long did it last?

  日本語（下書き）:

  > どのくらい続きましたか？

- [ ] **17. instructions.js → `episodes.questions.duration.hint`**  
  _Unchanged from v4._

  English:

  > e.g. a few seconds, about an hour

  日本語（下書き）:

  > 例：数秒、1時間ほど

- [ ] **18. instructions.js → `episodes.questions.where.label`**  
  _Unchanged from v4._

  English:

  > Where were you?

  日本語（下書き）:

  > どこにいましたか？

- [ ] **19. instructions.js → `episodes.questions.where.hint`**  
  _Unchanged from v4._

  English:

  > e.g. at home, on a train, in a shop

  日本語（下書き）:

  > 例：自宅、電車の中、お店

- [ ] **20. instructions.js → `episodes.questions.tone.label`**  
  _New. Scale −3 … +3._

  English:

  > How did it feel emotionally?

  日本語（下書き）:

  > そのときの気分は、どのようなものでしたか？

- [ ] **21. instructions.js → `episodes.questions.tone.anchor_low`**

  English:

  > very unpleasant

  日本語（下書き）:

  > とても不快

- [ ] **22. instructions.js → `episodes.questions.tone.anchor_high`**

  English:

  > very pleasant

  日本語（下書き）:

  > とても心地よい

- [ ] **23. instructions.js → `episodes.questions.intensity.label`**  
  _New. Scale 0 … 6._

  English:

  > How emotionally intense was it?

  日本語（下書き）:

  > そのときの感情は、どのくらい強いものでしたか？

- [ ] **24. instructions.js → `episodes.questions.intensity.anchor_low`**

  English:

  > not at all intense

  日本語（下書き）:

  > まったく強くない

- [ ] **25. instructions.js → `episodes.questions.intensity.anchor_high`**

  English:

  > extremely intense

  日本語（下書き）:

  > 非常に強い

- [ ] **26. instructions.js → `episodes.prefer_not`**  
  _Unchanged from v4; now on every episode question._

  English:

  > Prefer not to say

  日本語（下書き）:

  > 回答しない

- [ ] **27. instructions.js → `episodes.incomplete`**  
  _Shown until every question is answered._

  English:

  > Please answer every question to continue. “Prefer not to say” counts as an answer.

  日本語（下書き）:

  > 続けるには、すべての質問にお答えください。「回答しない」も回答として扱われます。

- [ ] **28. instructions.js → `episodes.button`**  
  _Unchanged from v4._

  English:

  > Continue

  日本語（下書き）:

  > 次へ

## v5b — Reinstatement — the first screen of each part

- [ ] **29. instructions.js → `reinstate.title`**  
  _{N} = 1 or 2, {TOTAL} = 2._

  English:

  > Part {N} of {TOTAL}

  日本語（下書き）:

  > 第{N}部（全{TOTAL}部）

- [ ] **30. instructions.js → `reinstate.body.derealization`**  
  _LOAD-BEARING. Participants only. {WORDS} = their own words._

  English:

  > In this part, please think of **the episode you described in the interview**, the one you called:
  > 
  > {WORDS}
  > 
  > Bring it back to mind as well as you can: where you were, what was around you, what you were doing.

  日本語（下書き）:

  > このパートでは、**面接でお話しいただいたエピソード**について考えてください。あなたが次のように書いたエピソードです：
  > 
  > {WORDS}
  > 
  > どこにいたか、周りに何があったか、何をしていたかなど、できるだけ思い出してください。

- [ ] **31. instructions.js → `reinstate.body.ordinary`**  
  _LOAD-BEARING. Both groups: must NOT mention an interview._

  English:

  > In this part, please think of **the ordinary episode you described**, the one you called:
  > 
  > {WORDS}
  > 
  > Bring it back to mind as well as you can: where you were, what was around you, what you were doing.

  日本語（下書き）:

  > このパートでは、**あなたが書いた、いつもどおりだったエピソード**について考えてください。あなたが次のように書いたエピソードです：
  > 
  > {WORDS}
  > 
  > どこにいたか、周りに何があったか、何をしていたかなど、できるだけ思い出してください。

- [ ] **32. instructions.js → `reinstate.body.expectation`**  
  _LOAD-BEARING. Controls only: must NOT mention an interview._

  English:

  > In this part, please imagine **how you think the surroundings look to someone experiencing derealization**.
  > 
  > Derealization is an experience in which one’s surroundings feel strange or detached, as if one were cut off from the world.

  日本語（下書き）:

  > このパートでは、**現実感喪失を体験している人には周囲の風景がどのように見えていると思うか**を想像してください。
  > 
  > 現実感喪失とは、周囲が奇妙に、あるいはよそよそしく感じられ、まるで自分が世界から切り離されているかのように感じられる体験です。

- [ ] **33. instructions.js → `reinstate.button`**

  English:

  > Continue

  日本語（下書き）:

  > 次へ

## v5b — Trial prompt (shown on every image trial, by episode)

- [ ] **34. instructions.js → `prompt.main.derealization`**  
  _LOAD-BEARING. Unchanged wording (was prompt.main.participant)._

  English:

  > Which looks more like how your surroundings looked during that episode?

  日本語（下書き）:

  > そのエピソード中の周囲の風景の見え方に、より近いのはどちらですか？

- [ ] **35. instructions.js → `prompt.main.ordinary`**  
  _LOAD-BEARING. New. Must fit above the pictures._

  English:

  > Which looks more like how your surroundings looked during the ordinary episode you described?

  日本語（下書き）:

  > あなたが書いた、いつもどおりだったエピソード中の周囲の風景の見え方に、より近いのはどちらですか？

- [ ] **36. instructions.js → `prompt.main.expectation`**  
  _LOAD-BEARING. English changed from “might look” to “you think … look”; the Japanese already said 思う and is unchanged — please check it still matches._

  English:

  > Which looks more like how you think the surroundings look to someone experiencing derealization?

  日本語（下書き）:

  > 現実感喪失を体験している人にとっての周囲の風景の見え方に、より近いと思うのはどちらですか？

## v5b — Practice

- [ ] **37. instructions.js → `practice.body`**  
  _Last sentence now gives the number of practice trials ({N} = 3)._

  English:

  > On each trial you will see two pictures of the same place, side by side. The two pictures have been adjusted in different ways.
  > 
  > A question is shown above the pictures. Choose the picture that fits the question better.
  > 
  > There is no right or wrong answer. Go with your first impression.
  > 
  > Use the **←** and **→** arrow keys to choose the picture on the left or on the right.
  > 
  > We will begin with {N} practice trials.

  日本語（下書き）:

  > 各試行では、同じ場所を写した2枚の画像が並んで表示されます。2枚は異なる方法で加工されています。
  > 
  > 画像の上に質問が表示されます。その質問により当てはまるほうの画像を選んでください。
  > 
  > 正解・不正解はありません。最初の印象で選んでください。
  > 
  > **←** と **→** の矢印キーで、左または右の画像を選びます。
  > 
  > まず{N}回の練習から始めます。

- [ ] **38. instructions.js → `practice.body_b2`**  
  _New. Before part 2’s practice._

  English:

  > The second part works the same way as the first. We will begin with {N} practice trials.

  日本語（下書き）:

  > 2つ目のパートも、1つ目と同じ方法で進みます。まず{N}回の練習から始めます。

- [ ] **39. instructions.js → `practice.question_changed`**  
  _New. {QUESTION} = the new question._

  English:

  > **The question has changed.** It is now:
  > 
  > {QUESTION}

  日本語（下書き）:

  > **質問が変わりました。**新しい質問は次のとおりです：
  > 
  > {QUESTION}

- [ ] **40. instructions.js → `practice.end_body`**  
  _{TOTAL} = 200; the duration is a placeholder until the pilot._

  English:

  > That is the end of the practice.
  > 
  > The main part works the same way. It has {TOTAL} trials and takes about [TO COMPLETE after pilot] minutes. There are short breaks along the way.
  > 
  > **Occasionally a screen will appear with no pictures**, asking you to press a particular arrow key. These check that you are still reading the screen. Take your time on them — there is no time limit, and you only get one press.

  日本語（下書き）:

  > 練習はこれで終わりです。
  > 
  > 本番も同じ方法で進みます。{TOTAL}試行で、約[TO COMPLETE after pilot]分かかります。途中に短い休憩があります。
  > 
  > **ときどき、画像のない画面が表示され**、特定の矢印キーを押すよう指示されます。これは画面を読んでいるかを確認するためのものです。制限時間はありませんので、ゆっくり読んでください。押せるのは一度だけです。

- [ ] **41. instructions.js → `practice.end_body_b2`**  
  _New. After part 2’s practice._

  English:

  > That is the end of the practice.
  > 
  > This part also has {TOTAL} trials, with short breaks along the way, and occasional screens with no pictures asking you to press a particular arrow key.

  日本語（下書き）:

  > 練習はこれで終わりです。
  > 
  > このパートも{TOTAL}試行で、途中に短い休憩があります。ときどき、画像のない画面が表示され、特定の矢印キーを押すよう指示されます。

## v5b — Breaks and rest

- [ ] **42. instructions.js → `brk.body`**  
  _Now “… in this part”._

  English:

  > You have completed {DONE} of {TOTAL} trials in this part.
  > 
  > Take a moment to rest if you like. Please stay in full screen.

  日本語（下書き）:

  > このパートの {TOTAL} 試行のうち {DONE} 試行が終わりました。
  > 
  > 必要であれば少し休んでください。全画面表示のままにしてください。

- [ ] **43. instructions.js → `rest.title`**  
  _New._

  English:

  > Rest

  日本語（下書き）:

  > 休憩

- [ ] **44. instructions.js → `rest.body`**

  English:

  > Please take a one-minute rest before the second part. You may look away from the screen. Please stay in full screen.

  日本語（下書き）:

  > 次のパートの前に、1分間休憩してください。画面から目を離してもかまいません。全画面表示のままにしてください。

- [ ] **45. instructions.js → `rest.wait`**

  English:

  > The Continue button will appear when the minute is over.

  日本語（下書き）:

  > 1分たつと「次へ」ボタンが表示されます。

- [ ] **46. instructions.js → `rest.done`**

  English:

  > You can continue when you are ready.

  日本語（下書き）:

  > 準備ができたら次へ進んでください。

- [ ] **47. instructions.js → `rest.button`**

  English:

  > Continue

  日本語（下書き）:

  > 次へ

## v5b — Word ratings

- [ ] **48. words.js → `title`**  
  _Unchanged._

  English:

  > Rating words

  日本語（下書き）:

  > 言葉の評価

- [ ] **49. words.js → `instruction.participant`**  
  _Changed: names the episode described in the interview, with the participant’s own words ({WORDS})._

  English:

  > On the next screen you will see a list of words.
  > 
  > Please think again of **the episode you described in the interview** ({WORDS}).
  > 
  > **During that episode, how well does each word describe how your surroundings looked?**
  > 
  > Rate every word from 0 (not at all) to 6 (exactly). Some words will not apply at all. That is expected — please rate every word anyway.

  日本語（下書き）:

  > 次の画面に言葉のリストが表示されます。
  > 
  > もう一度、**面接でお話しいただいたエピソード**（{WORDS}）について考えてください。
  > 
  > **そのエピソード中、それぞれの言葉は、あなたの周囲の風景の見え方をどの程度よく表していますか。**
  > 
  > すべての言葉について、0（まったく当てはまらない）から6（非常によく当てはまる）で評価してください。まったく当てはまらない言葉もあります。それで構いませんので、すべての言葉について回答してください。

- [ ] **50. words.js → `instruction.control`**  
  _Unchanged. Must NOT mention an interview._

  English:

  > On the next screen you will see a list of words.
  > 
  > **How well does each word describe how the surroundings might look to someone experiencing derealization?**
  > 
  > Rate every word from 0 (not at all) to 6 (exactly). Some words will not apply at all. That is expected — please rate every word anyway.

  日本語（下書き）:

  > 次の画面に言葉のリストが表示されます。
  > 
  > **それぞれの言葉は、現実感喪失を体験している人にとっての周囲の風景の見え方を、どの程度よく表していると思いますか。**
  > 
  > すべての言葉について、0（まったく当てはまらない）から6（非常によく当てはまる）で評価してください。まったく当てはまらない言葉もあります。それで構いませんので、すべての言葉について回答してください。

- [ ] **51. words.js → `question_short.participant`**  
  _Changed: as instruction.participant._

  English:

  > During the episode you described in the interview (“{WORDS}”), how well does each word describe how your surroundings looked?

  日本語（下書き）:

  > 面接でお話しいただいたエピソード（「{WORDS}」）の間、それぞれの言葉は、あなたの周囲の風景の見え方をどの程度よく表していますか。

- [ ] **52. words.js → `question_short.control`**  
  _Unchanged._

  English:

  > How well does each word describe how the surroundings might look to someone experiencing derealization?

  日本語（下書き）:

  > それぞれの言葉は、現実感喪失を体験している人にとっての周囲の風景の見え方を、どの程度よく表していると思いますか。

## Consent screen — PLACEHOLDER (to be replaced by the approved text)

- [ ] **53. instructions.js → `consent.title`**

  English:

  > Consent to take part

  日本語（下書き）:

  > 研究参加への同意

- [ ] **54. instructions.js → `consent.checkbox`**

  English:

  > I have read the information above, I am at least 18 years old, and I agree to take part.

  日本語（下書き）:

  > 上記の説明を読みました。18歳以上であり、本研究への参加に同意します。

- [ ] **55. instructions.js → `consent.button_agree`**

  English:

  > I agree, continue

  日本語（下書き）:

  > 同意して次へ

- [ ] **56. instructions.js → `consent.button_decline`**

  English:

  > I do not agree

  日本語（下書き）:

  > 同意しない

- [ ] **57. instructions.js → `consent.declined_title`**

  English:

  > Thank you

  日本語（下書き）:

  > ありがとうございました

- [ ] **58. instructions.js → `consent.declined_body`**

  English:

  > You have chosen not to take part. Nothing has been saved.
  > 
  > You may now close this page.

  日本語（下書き）:

  > 参加しないことを選択されました。何も保存されていません。
  > 
  > このページを閉じていただいて構いません。

## ID screen — link without a participant ID (ID, or name and email)

- [ ] **59. instructions.js → `id.body_no_pid`**

  English:

  > Please enter your participant ID from your invitation email.
  > 
  > If you do not have it, enter your **name** and **email address** instead. Giving all three is best.
  > 
  > Your name and email address are stored separately from your answers. They are used only to contact you about this study and, if you give no ID, to link your answers to you.

  日本語（下書き）:

  > 案内メールに記載された参加者IDを入力してください。
  > 
  > IDがわからない場合は、代わりに**お名前**と**メールアドレス**を入力してください。3つすべてを入力していただくのが最善です。
  > 
  > お名前とメールアドレスは回答データとは別に保存され、本研究に関するご連絡と、IDがない場合にあなたの回答を照合するためにのみ使用します。

- [ ] **60. instructions.js → `id.name_label_plain`**

  English:

  > Name

  日本語（下書き）:

  > お名前

- [ ] **61. instructions.js → `id.email_label_plain`**

  English:

  > Email address

  日本語（下書き）:

  > メールアドレス

- [ ] **62. instructions.js → `id.need_id_or_contact`**  
  _Shown by the browser in a small bubble next to the ID field._

  English:

  > Please enter your participant ID, or your name and email address.

  日本語（下書き）:

  > 参加者ID、またはお名前とメールアドレスを入力してください。

## Pavlovia only — name and email stored with the responses (contact_storage results_file)

- [ ] **63. instructions.js → `id.optional_note_results_file`**  
  _Shown instead of id.optional_note on Pavlovia._

  English:

  > Your **name** and **email address** are **optional**. If you give them, they are stored with your answers, which only the research team can access, and used only to contact you about this study.

  日本語（下書き）:

  > **お名前**と**メールアドレス**の入力は**任意**です。入力された場合は回答データと一緒に保存され（研究チームのみが閲覧できます）、本研究に関するご連絡にのみ使用します。

- [ ] **64. instructions.js → `id.body_no_pid_results_file`**  
  _Shown instead of id.body_no_pid on Pavlovia._

  English:

  > Please enter your participant ID from your invitation email.
  > 
  > If you do not have it, enter your **name** and **email address** instead. Giving all three is best.
  > 
  > Your name and email address are stored with your answers, which only the research team can access. They are used only to contact you about this study and, if you give no ID, to link your answers to you.

  日本語（下書き）:

  > 案内メールに記載された参加者IDを入力してください。
  > 
  > IDがわからない場合は、代わりに**お名前**と**メールアドレス**を入力してください。3つすべてを入力していただくのが最善です。
  > 
  > お名前とメールアドレスは回答データと一緒に保存され、研究チームのみが閲覧できます。本研究に関するご連絡と、IDがない場合にあなたの回答を照合するためにのみ使用します。

## Incomplete link (no group, or no valid slot, in the link)

- [ ] **65. instructions.js → `link.missing_title`**

  English:

  > Incomplete link

  日本語（下書き）:

  > リンクが不完全です

- [ ] **66. instructions.js → `link.missing_body`**

  English:

  > This link is incomplete. Please use the full link from your invitation email, or contact the researcher.

  日本語（下書き）:

  > このリンクは不完全です。案内メールに記載されたリンクをそのまま使用するか、実験者にご連絡ください。

## Full screen and window check (hard stop)

- [ ] **67. instructions.js → `screen.small_title`**

  English:

  > This window is too small for the study

  日本語（下書き）:

  > このウィンドウはこの実験には小さすぎます

- [ ] **68. instructions.js → `screen.small_body`**

  English:

  > This study shows two pictures side by side at a fixed size, so that everyone sees them in the same way. In this window, part of the pictures or of the question would be cut off.
  > 
  > Please make your browser window larger, or use a computer with a larger screen, and then open the link from your invitation again.
  > 
  > If your browser is zoomed in, setting the zoom back to 100% (Ctrl + 0, or ⌘ + 0 on a Mac) may be enough.

  日本語（下書き）:

  > この実験では、すべての参加者に同じように見えるよう、2枚の画像を決まった大きさで並べて表示します。このウィンドウでは、画像または質問の一部が切れてしまいます。
  > 
  > ブラウザのウィンドウを大きくするか、より大きな画面のコンピュータを使用して、案内メールのリンクをもう一度開いてください。
  > 
  > ブラウザが拡大表示になっている場合は、表示倍率を100%に戻す（Ctrl + 0、Macでは ⌘ + 0）だけで解決することがあります。

- [ ] **69. instructions.js → `screen.small_size`**  
  _Unchanged; listed for context._

  English:

  > Your display area is {W} × {H} pixels. At least {MW} × {MH} is recommended.

  日本語（下書き）:

  > 現在の表示領域は {W} × {H} ピクセルです。{MW} × {MH} ピクセル以上を推奨します。

## Brightness screen — viewing-conditions note

- [ ] **70. instructions.js → `calibration.brightness_filters`**  
  _Check the usual Japanese names of these settings on phones/PCs (ナイトモード, ナイトシフト, ブルーライトカット, カラーフィルター)._

  English:

  > If you can, please also switch off night mode, blue-light filters or colour filters on this device. If you do not know whether these are on, or how to switch them off, do not worry and simply continue.

  日本語（下書き）:

  > 可能であれば、この端末のナイトモード、ブルーライトカット、カラーフィルターなどの機能もオフにしてください。これらがオンになっているかわからない場合や、オフにする方法がわからない場合は、気にせずそのまま進んでください。

## State items (optional block at the end)

- [ ] **71. instructions.js → `state.lead_in`**  
  _Drafted. If the published Japanese version of the questionnaire has its own lead-in for the state form, use that instead._

  English:

  > Right now, at this moment:

  日本語（下書き）:

  > 今、この瞬間：

- [ ] **72. instructions.js → `state.anchor_low`**  
  _Same Japanese as the word-rating anchor, as requested (the English differs: “not at all”)._

  English:

  > not at all

  日本語（下書き）:

  > まったく当てはまらない

- [ ] **73. instructions.js → `state.anchor_high`**  
  _Same Japanese as the word-rating anchor, as requested (the English differs: “completely” vs the word ratings’ “exactly”)._

  English:

  > completely

  日本語（下書き）:

  > 非常によく当てはまる

- [ ] **74. instructions.js → `state.progress`**

  English:

  > {DONE} of {TOTAL} answered

  日本語（下書き）:

  > {TOTAL} 項目中 {DONE} 項目に回答済み

- [ ] **75. instructions.js → `state.button_submit`**

  English:

  > Continue

  日本語（下書き）:

  > 次へ
