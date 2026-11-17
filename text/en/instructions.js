/* =========================================================================
 * text/en/instructions.js — every participant-facing string, English.
 *
 * Nothing displayed to a participant is written anywhere else in the code.
 * text/ja/instructions.js holds the same keys in Japanese; CONFIG.language
 * (or ?lang=) selects between them, and validate.js checks the two key sets
 * match so a missing translation is caught before anyone runs the study.
 *
 * GROUP- AND EPISODE-DEPENDENT STRINGS
 * -------------------------------------
 * Participants (?group=participant) complete a derealization block and an
 * ordinary block; controls (?group=control) an ordinary block and an
 * expectation block. What differs is keyed in these objects:
 *   prompt.main.<episode>                 the question above the images
 *   reinstate.body.<episode>              the screen that opens each block
 *   episodes.screens.<group>.<episode>    the episode-selection screens
 *   words: instruction.<group>, question_short.<group>  (text/en/words.js)
 * with <episode> = derealization | ordinary | expectation. validate.js
 * checks every one has every version in both languages. Everything else
 * is the same for both groups, so it must not presume either one.
 *
 * FRAMING RULES — these wordings are deliberate, not incidental:
 *
 *  - The experience is never DESCRIBED with visual words: foggy, blurred,
 *    faded, dull, colourless, unreal, dreamlike, flat, veiled, as if behind
 *    glass. Those name perceptual qualities, and those qualities are
 *    exactly what the word ratings and the image manipulations measure.
 *    Using them would prime both. validate.js warns if one appears in an
 *    English instruction. (The rated words and the questionnaire items are
 *    exempt: their wording is the measure.)
 *
 *  - THE INTERVIEW: only participants were interviewed. Only text that
 *    only participants see may mention it — strings keyed `participant`
 *    or `derealization` (only participants have that episode). Controls
 *    must never see the word "interview". validate.js refuses any other
 *    string that mentions it, in either language.
 *
 *  - The judgment is anchored on SURROUNDINGS, not on the self. Every
 *    stimulus is a scene, so the instruction has to point at the world.
 *
 *  - The manipulation is ACKNOWLEDGED but UNSPECIFIED. Both images in a
 *    pair are the same scene, so participants will notice something was
 *    done. Saying "adjusted in different ways" closes the question without
 *    hinting at colour or contrast.
 *
 *  - Nothing may suggest this is a DETECTION task. "Which looks more
 *    edited/distorted/altered" would convert a judgment about resemblance
 *    into a discrimination task, which measures something else entirely.
 *
 * PLACEHOLDERS — to be replaced before recruiting
 * -----------------------------------------------
 *  - consent.*      the whole consent text (PLACEHOLDER, see below)
 *  - state.items    the four questionnaire items (paste the exact wording)
 *  - the session and block lengths, [TO COMPLETE after pilot]
 * Bracketed gaps like [researcher names] anywhere in this file are detected
 * by validate.js: a warning in debug mode, an error on index.html with
 * debug off.
 * ========================================================================= */

var TEXT_EN = {

  lang_name: 'English',

  // --- Incomplete link: no valid ?group= or ?slot= -------------------------
  // Same kind of message as a missing participant ID.
  link: {
    missing_title: 'Incomplete link',
    missing_body:  '<p>This link is incomplete. Please use the full link from ' +
                   'your invitation email, or contact the researcher.</p>',
  },

  // --- Consent (the first screen) -------------------------------------------
  // >>> PLACEHOLDER — NOT THE APPROVED WORDING. <<<
  // Replace title/body/checkbox with the ethics-approved text, in this file
  // and in text/ja/instructions.js, and nowhere else. Every [bracketed gap]
  // must be filled: validate.js refuses a production session while any
  // remain.
  //
  // Facts the approved text must keep true to how the code behaves:
  //  - an optional name and email are uploaded AS SOON AS THEY ARE ENTERED
  //    (ID screen), separately from the responses, even if the session is
  //    not finished;
  //  - everything else is uploaded only at the very end; closing the page
  //    earlier saves nothing else;
  //  - the answers about the recalled episodes, including anything typed,
  //    are stored WITH the responses; the few identifying words are
  //    required, and every other episode question can be answered with
  //    "Prefer not to say";
  //  - controls are not told about any interview (they had none).
  //  - without a participant ID, the name and email are what link the
  //    responses to the person.
  consent: {
    title: 'Consent to take part',
    body:
      '<p>You are invited to take part in a research study about how people ' +
      'perceive their surroundings. It is run by [researcher names] at ' +
      '[institution].</p>' +
      '<p><b>What you will do:</b> bring to mind experiences from your own ' +
      'life and answer a few short questions about them, then look at pairs ' +
      'of photographs and choose between them, in two parts with a short ' +
      'rest in between, and finally answer a few more short questions. It ' +
      'takes about [TO COMPLETE after pilot] minutes.</p>' +
      '<p><b>Risks:</b> we do not expect any risks beyond those of everyday ' +
      'computer use. Some questions ask about unusual experiences; you may ' +
      'stop at any time.</p>' +
      '<p><b>Benefits:</b> there is no direct benefit to you. ' +
      '[Compensation, if any.]</p>' +
      '<p><b>Your data:</b> your responses are stored under a study ID, ' +
      'without your name. Results are reported only for groups or without ' +
      'identifying information. [Storage period and who has access.] ' +
      '[Whether anonymised data may be shared publicly, e.g. on Zenodo.]</p>' +
      '<p>As part of the study, you will be asked to write a few words of ' +
      'your own to identify each experience you bring to mind, and to answer ' +
      'a few short questions about it, such as when and where it happened. ' +
      'Each of these questions can be answered with &ldquo;Prefer not to ' +
      'say&rdquo;. Your answers, including anything you type, are stored ' +
      'with your responses, so please do not include names or other details ' +
      'that could identify you or anyone else.</p>' +
      '<p><b>Voluntary participation:</b> taking part is voluntary. You may ' +
      'stop at any time by closing this page. Your responses are saved only ' +
      'at the end of the study, so if you close the page before then, none of ' +
      'them are saved. The exception is your name and email address: they are ' +
      'optional, and if you give them they are saved straight away, ' +
      'separately from your responses, even if you do not finish. If you take ' +
      'part without a participant ID, your name and email address are what ' +
      'links your responses to you. ' +
      '[How to withdraw data after submission.]</p>' +
      '<p><b>Contact:</b> [researcher email]. For questions about your rights ' +
      'as a participant: [ethics committee contact]. [Ethics approval ' +
      'number.]</p>',
    // The same text for Pavlovia, where a name and email address, if
    // given, are kept in the response file and saved with it at the end
    // (CONFIG.participant.contact_storage 'results_file'). Only the 'Your
    // data' and 'Voluntary participation' paragraphs differ. Replace it
    // with the approved wording too if the study runs on Pavlovia.
    body_results_file:
      '<p>You are invited to take part in a research study about how people ' +
      'perceive their surroundings. It is run by [researcher names] at ' +
      '[institution].</p>' +
      '<p><b>What you will do:</b> bring to mind experiences from your own ' +
      'life and answer a few short questions about them, then look at pairs ' +
      'of photographs and choose between them, in two parts with a short ' +
      'rest in between, and finally answer a few more short questions. It ' +
      'takes about [TO COMPLETE after pilot] minutes.</p>' +
      '<p><b>Risks:</b> we do not expect any risks beyond those of everyday ' +
      'computer use. Some questions ask about unusual experiences; you may ' +
      'stop at any time.</p>' +
      '<p><b>Benefits:</b> there is no direct benefit to you. ' +
      '[Compensation, if any.]</p>' +
      '<p><b>Your data:</b> your responses are stored under a study ID. ' +
      'If you give your name and email address, they are stored in the same ' +
      'file as your responses, which only the research team can access. ' +
      'Results are reported only for groups or without identifying ' +
      'information. [Storage period and who has access.] [Whether ' +
      'anonymised data may be shared publicly, e.g. on Zenodo; your name and ' +
      'email address are never shared.]</p>' +
      '<p>As part of the study, you will be asked to write a few words of ' +
      'your own to identify each experience you bring to mind, and to answer ' +
      'a few short questions about it, such as when and where it happened. ' +
      'Each of these questions can be answered with &ldquo;Prefer not to ' +
      'say&rdquo;. Your answers, including anything you type, are stored ' +
      'with your responses, so please do not include names or other details ' +
      'that could identify you or anyone else.</p>' +
      '<p><b>Voluntary participation:</b> taking part is voluntary. You may ' +
      'stop at any time by closing this page. Your responses are saved only ' +
      'at the end of the study, so if you close the page before then, none of ' +
      'them are saved. The same applies to your name and email address: they ' +
      'are optional, and if you give them they are saved together with your ' +
      'responses at the end. If you take ' +
      'part without a participant ID, your name and email address are what ' +
      'links your responses to you. ' +
      '[How to withdraw data after submission.]</p>' +
      '<p><b>Contact:</b> [researcher email]. For questions about your rights ' +
      'as a participant: [ethics committee contact]. [Ethics approval ' +
      'number.]</p>',
    checkbox:
      'I have read the information above, I am at least 18 years old, and I ' +
      'agree to take part.',
    button_agree:   'I agree, continue',
    button_decline: 'I do not agree',

    // Shown after "I do not agree". Nothing has been saved at that point.
    declined_title: 'Thank you',
    declined_body:
      '<p>You have chosen not to take part. Nothing has been saved.</p>' +
      '<p>You may now close this page.</p>',
  },

  // --- Prompts shown above the image pair -------------------------------
  // EPISODE-DEPENDENT: the question depends on the block's episode, not on
  // the group. Shown on every image trial, practice included.
  prompt: {
    main: {
      derealization: 'Which looks more like how your surroundings looked during that episode?',
      ordinary:      'Which looks more like how your surroundings looked during the ordinary episode you described?',
      expectation:   'Which looks more like how you think the surroundings look to someone experiencing derealization?',
    },
  },

  // --- Episode selection (after calibration, before block 1) -------------
  // One screen per episode of the group (screens.<group>.<episode>). Each
  // RECALLED episode (not the expectation) asks for a few identifying
  // words (required) and the five questions below, each of which must be
  // answered — "Prefer not to say" is an answer. The questions only help
  // bring the episode back: never how it felt or looked, nothing about
  // clarity, vividness or colour. Keep the examples free of visual words
  // and of anything identifying.
  // {DR_WORDS} = the participant's own words for the derealization episode.
  episodes: {
    screens: {
      participant: {
        derealization: {
          title: 'The episode you described in the interview',
          body:
            '<p>In the interview, you described an episode in which your ' +
            'surroundings felt different from usual. Please bring that ' +
            'episode to mind now.</p>' +
            '<p>Write a few words below that will let you recognise it later, ' +
            'such as where you were or what you were doing. The questions ' +
            'after that are there to help you bring it back.</p>',
        },
        ordinary: {
          title: 'An ordinary episode',
          body:
            '<p>Now please bring to mind a different episode: one in a ' +
            '<b>similar setting</b> to the episode you described in the ' +
            'interview (<span class="ep-words">{DR_WORDS}</span>) &mdash; a ' +
            'similar place, time of day and lighting &mdash; from <b>about as ' +
            'long ago</b>, in which your surroundings looked <b>as usual</b>.</p>' +
            '<p>Write a few words below that will let you recognise it later. ' +
            'The questions after that are there to help you bring it back.</p>',
        },
      },
      control: {
        ordinary: {
          title: 'An ordinary episode',
          body:
            '<p>Please bring to mind an ordinary episode from the <b>last six ' +
            'months</b>: a time when you were somewhere and your surroundings ' +
            'looked as usual.</p>' +
            '<p>Write a few words below that will let you recognise it later, ' +
            'such as where you were or what you were doing. The questions ' +
            'after that are there to help you bring it back.</p>',
        },
        expectation: {
          title: 'Derealization',
          body:
            '<p>Derealization is an experience in which one&rsquo;s surroundings ' +
            'feel strange or detached, as if one were cut off from the world.</p>' +
            '<p>In one part of this study, please imagine how you think the ' +
            'surroundings look to someone experiencing derealization.</p>',
        },
      },
    },
    words: {
      label: 'A few words to identify this episode',
      hint:  'e.g. walking home after work',
    },
    questions_intro:
      'Questions to help you bring it back. Please answer each one; if you ' +
      'prefer not to answer, choose &ldquo;Prefer not to say&rdquo;.',
    questions: {
      when: {
        label: 'When was it?',
        hint:  'e.g. last week, about two months ago',
      },
      duration: {
        label: 'How long did it last?',
        hint:  'e.g. a few seconds, about an hour',
      },
      where: {
        label: 'Where were you?',
        hint:  'e.g. at home, on a train, in a shop',
      },
      tone: {
        label:       'How did it feel emotionally?',
        anchor_low:  'very unpleasant',
        anchor_high: 'very pleasant',
      },
      intensity: {
        label:       'How emotionally intense was it?',
        anchor_low:  'not at all intense',
        anchor_high: 'extremely intense',
      },
    },
    prefer_not: 'Prefer not to say',
    incomplete: 'Please answer every question to continue. ' +
                '&ldquo;Prefer not to say&rdquo; counts as an answer.',
    button:     'Continue',
  },

  // --- Reinstatement: the first screen of each block ----------------------
  // EPISODE-DEPENDENT. Names the block's episode; {WORDS} = the
  // participant's own identifying words for it. {N} = 1 or 2, {TOTAL} = 2.
  reinstate: {
    title: 'Part {N} of {TOTAL}',
    body: {
      derealization:
        '<p>In this part, please think of <b>the episode you described in ' +
        'the interview</b>, the one you called:</p>' +
        '<p><span class="ep-words">{WORDS}</span></p>' +
        '<p>Bring it back to mind as well as you can: where you were, what ' +
        'was around you, what you were doing.</p>',
      ordinary:
        '<p>In this part, please think of <b>the ordinary episode you ' +
        'described</b>, the one you called:</p>' +
        '<p><span class="ep-words">{WORDS}</span></p>' +
        '<p>Bring it back to mind as well as you can: where you were, what ' +
        'was around you, what you were doing.</p>',
      expectation:
        '<p>In this part, please imagine <b>how you think the surroundings ' +
        'look to someone experiencing derealization</b>.</p>' +
        '<p>Derealization is an experience in which one&rsquo;s surroundings ' +
        'feel strange or detached, as if one were cut off from the world.</p>',
    },
    button: 'Continue',
  },

  // --- Rest between the two blocks ---------------------------------------
  // A fixed minute (CONFIG.timing.rest_ms). Continue appears only when the
  // countdown reaches zero.
  rest: {
    title:  'Rest',
    body:   '<p>Please take a one-minute rest before the second part. You ' +
            'may look away from the screen. Please stay in full screen.</p>',
    wait:   'The Continue button will appear when the minute is over.',
    done:   'You can continue when you are ready.',
    button: 'Continue',
  },

  // --- Catch trials -----------------------------------------------------
  // No images are shown. The screen is large text on the plain background,
  // deliberately unlike both the trials and the break screens.
  catch: {
    lead:        'Attention check',
    instruction: 'Press the {KEYNAME} arrow key',
    key_up:      'UP',
    key_down:    'DOWN',
  },

  // --- Practice ---------------------------------------------------------
  // The same for both groups: the task is described mechanically, and the
  // question itself is the episode-dependent prompt above the pictures.
  // {N} = practice trials in this block, {TOTAL} = main trials in this
  // block, {QUESTION} = this block's question.
  practice: {
    title: 'The task',
    body:
      '<p>On each trial you will see two pictures of the same place, side ' +
      'by side. The two pictures have been adjusted in different ways.</p>' +
      '<p>A question is shown above the pictures. Choose the picture that ' +
      'fits the question better.</p>' +
      '<p>There is no right or wrong answer. Go with your first ' +
      'impression.</p>' +
      '<p>Use the <b>&#8592;</b> and <b>&#8594;</b> arrow keys to choose the ' +
      'picture on the left or on the right.</p>' +
      '<p>We will begin with {N} practice trials.</p>',
    // Before block 2's practice.
    body_b2:
      '<p>The second part works the same way as the first. We will begin ' +
      'with {N} practice trials.</p>',
    question_changed:
      '<p><b>The question has changed.</b> It is now:</p>' +
      '<p class="question-now">{QUESTION}</p>',
    continue_hint: 'Press <b>SPACE</b> to begin the practice.',

    // Shown after the first practice response of each block. Deliberately
    // says nothing about WHY the participant chose what they chose.
    feedback_first:
      'You chose this one. There is no right or wrong answer &mdash; just ' +
      'go with your impression.',

    end_title: 'End of practice',
    end_body:
      '<p>That is the end of the practice.</p>' +
      '<p>The main part works the same way. It has {TOTAL} trials and takes ' +
      'about [TO COMPLETE after pilot] minutes. There are short breaks along ' +
      'the way.</p>' +
      '<p><b>Occasionally a screen will appear with no pictures</b>, asking ' +
      'you to press a particular arrow key. These check that you are still ' +
      'reading the screen. Take your time on them &mdash; there is no time ' +
      'limit, and you only get one press.</p>',
    end_body_b2:
      '<p>That is the end of the practice.</p>' +
      '<p>This part also has {TOTAL} trials, with short breaks along the way, ' +
      'and occasional screens with no pictures asking you to press a ' +
      'particular arrow key.</p>',
    end_hint: 'Press <b>SPACE</b> to begin.',
  },

  // --- Full screen and the window check ---------------------------------
  // The window check is a HARD STOP: there is no "continue anyway".
  // {W} {H} = the participant's window, {MW} {MH} = the recommended minimum.
  screen: {
    fs_title:   'Full screen',
    fs_body:
      '<p>This study runs in full screen, so that the pictures are shown at ' +
      'the same size throughout.</p>' +
      '<p>Please stay in full screen until the study ends.</p>',
    fs_button:  'Enter full screen',

    small_title: 'This window is too small for the study',
    small_body:
      '<p>This study shows two pictures side by side at a fixed size, so ' +
      'that everyone sees them in the same way. In this window, part of the ' +
      'pictures or of the question would be cut off.</p>' +
      '<p>Please make your browser window larger, or use a computer with a ' +
      'larger screen, and then open the link from your invitation again.</p>' +
      '<p>If your browser is zoomed in, setting the zoom back to 100% ' +
      '(Ctrl + 0, or &#8984; + 0 on a Mac) may be enough.</p>',
    small_size:
      'Your display area is {W} &times; {H} pixels. At least {MW} &times; ' +
      '{MH} is recommended.',
  },

  // --- Calibration ------------------------------------------------------
  // Shown before the task. These screens exist because the manipulations
  // are colour and local contrast, so the display is part of the
  // measurement — see the module headers in src/calibration/.
  calibration: {
    button_continue: 'Continue',

    brightness_title: 'Screen brightness',
    brightness_intro:
      '<p>Some of the pictures in this study differ only in their darker ' +
      'areas. If your screen is dimmed, those differences disappear.</p>' +
      '<p>Please turn your screen brightness up to its <strong>highest ' +
      'setting</strong> now, and leave it there for the whole session.</p>',
    // Viewing-conditions note. Not confirmed, not recorded.
    brightness_filters:
      '<p>If you can, please also switch off night mode, blue-light filters ' +
      'or colour filters on this device. If you do not know whether these ' +
      'are on, or how to switch them off, do not worry and simply ' +
      'continue.</p>',
    brightness_checkbox:
      'My screen brightness is set to maximum.',

    gamma_title: 'Screen calibration',
    gamma_intro:
      '<p>Next we will measure a property of your screen that affects how ' +
      'brightness is displayed. You will do a short matching task ' +
      '<strong>three times</strong>.</p>' +
      '<p>Each time, you will see two patterns side by side. Adjust the ' +
      'right one until the two look like the same shade of grey.</p>' +
      '<p>Sitting back slightly, or squinting, can make the match easier ' +
      'to judge.</p>',
    gamma_button: 'Begin',
    gamma_prompt:
      'Adjust the square on the right until both squares look the same ' +
      'shade of grey, then click <b>Confirm match</b>.',
    gamma_confirm_button: 'Confirm match',
    gamma_progress:       'Match {N} of {TOTAL}',
    gamma_hint:           'Drag the slider, or use the &larr; &rarr; keys.',
    gamma_label_fixed:    'Reference',
    gamma_label_adjust:   'Adjust this one',
  },

  // --- Participant details: ONE screen with ID, name and email ------------
  // Only the fields switched on in CONFIG.participant are shown.
  id: {
    title:          'Before we begin',
    body:           '<p>Please enter your participant ID from your invitation ' +
                    'email. If you opened this page from the link in the ' +
                    'email, it is already filled in.</p>',
    id_label:       'Participant ID',
    id_hint:        '<code>R_</code> followed by 15 letters and numbers. ' +
                    'Capital and small letters matter.',
    // Plain text: shown by the browser in a small bubble if the ID is wrong.
    invalid:        'This ID was not recognised. Please check your invitation ' +
                    'email — capital and small letters matter.',
    optional_note:  '<p>Your <b>name</b> and <b>email address</b> are ' +
                    '<b>optional</b>. If you give them, they are stored ' +
                    'separately from your answers and used only to contact ' +
                    'you about this study.</p>',
    // Pavlovia (contact_storage 'results_file'): kept with the answers.
    optional_note_results_file:
                    '<p>Your <b>name</b> and <b>email address</b> are ' +
                    '<b>optional</b>. If you give them, they are stored with ' +
                    'your answers, which only the research team can access, ' +
                    'and used only to contact you about this study.</p>',
    name_label:     'Name (optional)',
    email_label:    'Email address (optional)',
    button:         'Continue',

    // When the link carries no participant ID: an ID, or a name AND an
    // email address, are needed to continue.
    body_no_pid:    '<p>Please enter your participant ID from your invitation ' +
                    'email.</p>' +
                    '<p>If you do not have it, enter your <b>name</b> and ' +
                    '<b>email address</b> instead. Giving all three is best.</p>' +
                    '<p>Your name and email address are stored separately from ' +
                    'your answers. They are used only to contact you about this ' +
                    'study and, if you give no ID, to link your answers to ' +
                    'you.</p>',
    // Pavlovia (contact_storage 'results_file'): kept with the answers.
    body_no_pid_results_file:
                    '<p>Please enter your participant ID from your invitation ' +
                    'email.</p>' +
                    '<p>If you do not have it, enter your <b>name</b> and ' +
                    '<b>email address</b> instead. Giving all three is best.</p>' +
                    '<p>Your name and email address are stored with your ' +
                    'answers, which only the research team can access. They ' +
                    'are used only to contact you about this study and, if you ' +
                    'give no ID, to link your answers to you.</p>',
    name_label_plain:  'Name',
    email_label_plain: 'Email address',
    // Plain text: shown by the browser in a small bubble.
    need_id_or_contact: 'Please enter your participant ID, or your name and ' +
                        'email address.',

    missing_title:  'Missing participant ID',
    missing_body:   '<p>This link is incomplete. Please use the full link from ' +
                    'your invitation email, or contact the researcher.</p>',

    retry_title:    'That ID was not recognised',
    retry_body:     '<p>Please check your invitation email and try again.</p>',
    retry_hint:     'Press <b>SPACE</b> to re-enter it.',
  },

  // --- End of session ------------------------------------------------------
  // {CONTACT} is replaced with CONFIG.researcher_contact.
  end: {
    // Shown by the DataPipe plugin while the file uploads.
    saving:       '<div class="card"><h2>Saving your responses</h2>' +
                  '<p>This usually takes a few seconds.</p>' +
                  '<p><b>Please do not close this page.</b></p></div>',

    title:        'Thank you',
    body:         '<p>Your responses have been saved.</p>' +
                  '<p>Thank you very much for taking part in this study. ' +
                  'You may now close this page.</p>',
    contact_line: 'If you have any questions about the study, please contact ' +
                  '{CONTACT}.',

    fail_title:   'Your responses could not be saved automatically',
    fail_body:    '<p>This is usually caused by a network problem.</p>' +
                  '<p>Please download your responses with the button below and ' +
                  'send the file by email to {CONTACT}.</p>' +
                  '<p><b>Please do not close this page until the file has ' +
                  'downloaded.</b></p>',
    fail_button:  'Download my responses',
    fail_done:    'The file has been downloaded. Thank you — once you have ' +
                  'emailed it, you may close this page.',
  },

  // --- State items (optional block at the end) --------------------------
  // >>> PLACEHOLDERS: paste the exact published English wording of items
  // 2, 13, 19 and 29 into `label`. Keep the ids and the order. <<<
  // Same 0-6 scale as the word ratings; every item must be answered.
  state: {
    lead_in:     'Right now, at this moment:',
    anchor_low:  'not at all',
    anchor_high: 'completely',
    items: [
      { id: 'q02', label: '[CDS item 2: paste wording]' },
      { id: 'q13', label: '[CDS item 13: paste wording]' },
      { id: 'q19', label: '[CDS item 19: paste wording]' },
      { id: 'q29', label: '[CDS item 29: paste wording]' },
    ],
    button_submit: 'Continue',
    progress:      '{DONE} of {TOTAL} answered',
  },

  // --- Breaks -----------------------------------------------------------
  // {DONE} and {TOTAL} are filled in per block (200 main trials, breaks
  // after trials 40, 80, 120 and 160 — design.json).
  brk: {
    title: 'Short break',
    body: '<p>You have completed {DONE} of {TOTAL} trials in this part.</p>' +
          '<p>Take a moment to rest if you like. Please stay in full screen.</p>',
    hint: 'Press <b>SPACE</b> when you are ready to continue.',
  },

  // --- Preloading -------------------------------------------------------
  preload: {
    message:
      '<div class="card">' +
      '<h2>Loading images</h2>' +
      '<p>The study is downloading the pictures it needs. On a slow ' +
      'connection this may take a minute.</p>' +
      '<p>Please do not close this page.</p>' +
      '</div>',
    error:
      '<div class="card">' +
      '<h2>Some images could not be loaded</h2>' +
      '<p>Please check your internet connection and reload the page.</p>' +
      '<p>If this keeps happening, please contact the researcher.</p>' +
      '</div>',
  },

  // --- Errors -----------------------------------------------------------
  error: {
    title: 'Something went wrong',
    body:
      '<p>The study could not start. Please reload the page.</p>' +
      '<p>If the problem continues, please contact the researcher.</p>',
  },
};
