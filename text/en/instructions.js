/* =========================================================================
 * text/en/instructions.js: every participant-facing string, English.
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
 * FRAMING RULES: these wordings are deliberate, not incidental:
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
 *    only participants see may mention it: strings keyed `participant`
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
 *  - The set-up screens (full screen, window check, set-up, brightness)
 *    never mention the pictures or how they might differ: that could bias
 *    the answers. They give neutral reasons ("so that the study is shown
 *    under similar conditions for everyone").
 *
 * STYLE
 *  - Formal register throughout ("please", "you may", "provide"); no
 *    casual phrases ("do not worry", "just", "go with").
 *  - No dashes (em or en dash, in any form): commas, parentheses or full
 *    stops instead. Hyphenated words are rephrased where possible ("a rest
 *    of one minute"). validate.js refuses a dash in any participant text.
 *  - Alignment is set by src/text-align.js and the CSS, not here: text
 *    that fits on one line is centred, text that wraps is justified.
 *
 * PLACEHOLDERS, to be replaced before recruiting
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
  // >>> PLACEHOLDER: NOT THE APPROVED WORDING. <<<
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
  //    are stored WITH the responses; a few questions are about the
  //    episodes, including how they felt emotionally (the identifying
  //    words, the emotional tone and the intensity are required; when,
  //    how long and where are optional);
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
      'a few short questions about these experiences, including how they ' +
      'felt emotionally. Some of these questions are optional. Your answers, ' +
      'including anything you type, are stored with your responses, so ' +
      'please do not include names or other details that could identify you ' +
      'or anyone else.</p>' +
      '<p><b>Voluntary participation:</b> taking part is voluntary. You may ' +
      'stop at any time by closing this page. Your responses are saved only ' +
      'at the end of the study, so if you close the page before then, none of ' +
      'them are saved. The exception is your name and email address: they are ' +
      'optional, and if you provide them, they are saved immediately, ' +
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
      'If you provide your name and email address, they are stored in the same ' +
      'file as your responses, which only the research team can access. ' +
      'Results are reported only for groups or without identifying ' +
      'information. [Storage period and who has access.] [Whether ' +
      'anonymised data may be shared publicly, e.g. on Zenodo; your name and ' +
      'email address are never shared.]</p>' +
      '<p>As part of the study, you will be asked to write a few words of ' +
      'your own to identify each experience you bring to mind, and to answer ' +
      'a few short questions about these experiences, including how they ' +
      'felt emotionally. Some of these questions are optional. Your answers, ' +
      'including anything you type, are stored with your responses, so ' +
      'please do not include names or other details that could identify you ' +
      'or anyone else.</p>' +
      '<p><b>Voluntary participation:</b> taking part is voluntary. You may ' +
      'stop at any time by closing this page. Your responses are saved only ' +
      'at the end of the study, so if you close the page before then, none of ' +
      'them are saved. The same applies to your name and email address: they ' +
      'are optional, and if you provide them, they are saved together with ' +
      'your responses at the end. If you take ' +
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
  // words and the five questions below. REQUIRED: the words, the emotional
  // tone and the intensity; OPTIONAL (may be left blank, marked with
  // optional_tag): when, how long and where. The questions only help bring
  // the episode back: nothing about how it looked, its clarity, vividness
  // or colour. Keep the examples free of visual words and of anything
  // identifying.
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
            '<p>Please write a few words below that will allow you to ' +
            'recognise it later, such as where you were or what you were ' +
            'doing. The questions that follow are intended to help you ' +
            'recall it.</p>',
        },
        ordinary: {
          title: 'An ordinary episode',
          body:
            '<p>Please now bring to mind a different episode, in a ' +
            '<b>similar setting</b> to the episode you described in the ' +
            'interview (<span class="ep-words">{DR_WORDS}</span>), that is, ' +
            'a similar place, time of day and lighting. It should be from ' +
            '<b>about as long ago</b>, and your surroundings should have ' +
            'looked <b>as usual</b>.</p>' +
            '<p>Please write a few words below that will allow you to ' +
            'recognise it later. The questions that follow are intended to ' +
            'help you recall it.</p>',
        },
      },
      control: {
        ordinary: {
          title: 'An ordinary episode',
          body:
            '<p>Please bring to mind an ordinary episode from the <b>last six ' +
            'months</b>: a time when you were somewhere and your surroundings ' +
            'looked as usual.</p>' +
            '<p>Please write a few words below that will allow you to ' +
            'recognise it later, such as where you were or what you were ' +
            'doing. The questions that follow are intended to help you ' +
            'recall it.</p>',
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
      'The following questions are intended to help you recall the episode. ' +
      'The questions marked as optional may be left blank.',
    // Added after the label of each optional question.
    optional_tag: '(optional)',
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
    incomplete: 'To continue, please write a few words to identify the ' +
                'episode and answer both questions about how it felt ' +
                'emotionally.',
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
        '<p>Please bring it back to mind as well as you can: where you were, ' +
        'what was around you and what you were doing.</p>',
      ordinary:
        '<p>In this part, please think of <b>the ordinary episode you ' +
        'described</b>, the one you called:</p>' +
        '<p><span class="ep-words">{WORDS}</span></p>' +
        '<p>Please bring it back to mind as well as you can: where you were, ' +
        'what was around you and what you were doing.</p>',
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
    body:   '<p>Please take a rest of one minute before the second part. You ' +
            'may rest your eyes, but please avoid using your phone or other ' +
            'devices. Please remain in full screen.</p>',
    wait:   'The Continue button will appear when the minute is over.',
    done:   'Please continue when you are ready.',
    button: 'Continue',
  },

  // --- Catch trials -----------------------------------------------------
  // No images are shown. The screen is large text on the plain background,
  // deliberately unlike both the trials and the break screens.
  catch: {
    lead:        'Attention check',
    instruction: 'Please press the {KEYNAME} arrow key',
    key_up:      'UP',
    key_down:    'DOWN',
  },

  // --- Practice ---------------------------------------------------------
  // EPISODE-DEPENDENT: the explanation before each block's practice is
  // keyed by the block's episode (body.<episode> before block 1,
  // body_b2.<episode> before block 2), as is the message after the first
  // practice response (first_feedback.<episode>). The question itself is
  // the episode-dependent prompt above the pictures.
  // Screen before block 1's practice:  body.<episode>, keys_line, count_line.
  // Screen before block 2's practice:  intro_b2, question_changed,
  //                                    body_b2.<episode>, count_line.
  // {N} = practice trials in this block, {QUESTION} = this block's question.
  practice: {
    title: 'The task',
    body: {
      derealization:
        '<p>Both pictures in each pair show <b>the same place</b>, which is ' +
        '<b>not the place where your episode occurred</b>.</p>' +
        '<p>The two pictures differ <b>only in how the place looks, not in ' +
        'what it shows</b>.</p>' +
        '<p>For each pair, bring the episode back to mind and recall your ' +
        'surroundings as they appeared to you at that time. Then choose the ' +
        'picture that is closer to how your surroundings appeared to you ' +
        'then.</p>' +
        '<p>There is no right or wrong answer. Please respond according to ' +
        'your first impression.</p>',
      ordinary:
        '<p>Both pictures in each pair show <b>the same place</b>, which is ' +
        '<b>not the place where your episode occurred</b>.</p>' +
        '<p>The two pictures differ <b>only in how the place looks, not in ' +
        'what it shows</b>.</p>' +
        '<p>For each pair, bring the ordinary episode back to mind and recall ' +
        'your surroundings as they appeared to you at that time. Then choose ' +
        'the picture that is closer to how your surroundings appeared to you ' +
        'then.</p>' +
        '<p>There is no right or wrong answer. Please respond according to ' +
        'your first impression.</p>',
      expectation:
        '<p>Both pictures in each pair show <b>the same place</b>. The two ' +
        'pictures differ <b>only in how the place looks, not in what it ' +
        'shows</b>.</p>' +
        '<p>For each pair, imagine the surroundings of a person experiencing ' +
        'derealization, as they would appear to that person. Then choose the ' +
        'picture that is closer to how you think those surroundings appear to ' +
        'them.</p>' +
        '<p>There is no right or wrong answer. Please respond according to ' +
        'your first impression.</p>',
    },
    keys_line:
      '<p>Please use the <b>&#8592;</b> and <b>&#8594;</b> arrow keys to ' +
      'choose the picture on the left or on the right.</p>',
    count_line: '<p>We will begin with {N} practice trials.</p>',

    // Before block 2's practice.
    intro_b2:
      '<p>The second part works in the same way as the first.</p>',
    question_changed:
      '<p><b>The question has changed.</b> It is now:</p>' +
      '<p class="question-now">{QUESTION}</p>',
    body_b2: {
      derealization:
        '<p>As before, the pictures show places that are not where your ' +
        'episode occurred, and they differ only in how the place looks. ' +
        'Please bring the episode you described in the interview back to ' +
        'mind, and choose the picture that is closer to how your surroundings ' +
        'appeared to you at that time.</p>',
      ordinary:
        '<p>As before, the pictures show places that are not where your ' +
        'episode occurred, and they differ only in how the place looks. ' +
        'Please bring the ordinary episode you described back to mind, and ' +
        'choose the picture that is closer to how your surroundings appeared ' +
        'to you at that time.</p>',
      expectation:
        '<p>As before, the two pictures differ only in how the place looks. ' +
        'Please imagine the surroundings of a person experiencing ' +
        'derealization, and choose the picture that is closer to how you ' +
        'think those surroundings appear to them.</p>',
    },
    continue_hint: 'Please press <b>SPACE</b> to begin the practice.',

    // After the FIRST practice response of each block, only the chosen
    // picture stays on screen, with this message, for
    // CONFIG.timing.first_feedback_ms; then the next practice trial starts.
    // It confirms the participant's own choice, never a correct answer.
    first_feedback: {
      derealization:
        'This is the picture you chose as closer to how your surroundings ' +
        'appeared to you during that episode.',
      ordinary:
        'This is the picture you chose as closer to how your surroundings ' +
        'appeared to you during the ordinary episode.',
      expectation:
        'This is the picture you chose as closer to how you think the ' +
        'surroundings appear to a person experiencing derealization.',
    },

    end_title: 'End of practice',
    end_body:
      '<p>This is the end of the practice.</p>' +
      '<p>The main part works in the same way. There are short breaks along ' +
      'the way.</p>' +
      '<p><b>Occasionally, a screen without pictures will appear</b>, asking ' +
      'you to press a particular arrow key. These screens check that you are ' +
      'still reading the screen. Please take your time with them: there is ' +
      'no time limit, and only one key press is accepted.</p>',
    end_body_b2:
      '<p>This is the end of the practice.</p>' +
      '<p>As in the first part, there are short breaks along the way, and ' +
      'occasionally a screen without pictures will appear, asking you to ' +
      'press a particular arrow key.</p>',
    end_hint: 'Please press <b>SPACE</b> to begin.',
  },

  // --- Full screen and the window check ---------------------------------
  // The window check is a HARD STOP: there is no "continue anyway".
  // {W} {H} = the participant's window, {MW} {MH} = the recommended minimum.
  screen: {
    fs_title:   'Full screen',
    fs_body:
      '<p>This study runs in full screen, so that it is shown under similar ' +
      'conditions for everyone.</p>' +
      '<p>Please remain in full screen until the study ends.</p>',
    fs_button:  'Enter full screen',

    small_title: 'This window is too small for the study',
    small_body:
      '<p>This study requires a window of a minimum size, so that it is ' +
      'shown under similar conditions for everyone. This window is smaller ' +
      'than that.</p>' +
      '<p>Please make your browser window larger, or use a computer with a ' +
      'larger screen, and then open the link from your invitation again.</p>' +
      '<p>If your browser is zoomed in, setting the zoom back to 100% ' +
      '(Ctrl + 0, or &#8984; + 0 on a Mac) may be sufficient.</p>',
    small_size:
      'Your display area is {W} &times; {H} pixels. At least {MW} &times; ' +
      '{MH} is recommended.',
  },

  // --- Calibration ------------------------------------------------------
  // Shown before the task. The display is part of the measurement (see the
  // module headers in src/calibration/), but these screens NEVER mention
  // the pictures or how they differ: they give neutral reasons only.
  calibration: {
    button_continue: 'Continue',

    // Set-up screen, before the brightness screen. No checkbox.
    setup_title: 'Before you start',
    setup_body:
      '<p><b>Position:</b> please place the computer on a desk or table, ' +
      'ideally with the screen at about eye level. If this is not possible, ' +
      'please keep the same position and the same distance from the screen ' +
      'throughout the study.</p>' +
      '<p><b>Distractions:</b> please avoid looking at your phone or other ' +
      'devices during the study, including during the breaks.</p>' +
      '<p>This applies to laptops and desktop computers alike.</p>',

    brightness_title: 'Screen brightness',
    brightness_intro:
      '<p>Please set your screen brightness to its <strong>highest ' +
      'setting</strong> now, and leave it there for the whole session, so ' +
      'that the study is shown under similar conditions for everyone.</p>',
    brightness_charger:
      '<p><b>Charger:</b> please connect the computer to its charger, ' +
      'because many devices dim the screen when running on battery.</p>',
    brightness_auto:
      '<p><b>Automatic features:</b> if possible, please switch off ' +
      'automatic brightness (also called adaptive or auto brightness), True ' +
      'Tone, Night Shift or night mode, blue light filters and battery ' +
      'saver. If you do not know whether these are on, you may ' +
      'continue.</p>',
    brightness_lighting:
      '<p><b>Lighting:</b> please sit in a room with good, steady lighting, ' +
      'and avoid changing daylight or light falling directly on the screen. ' +
      'Screens can adjust their brightness to the light in the room.</p>',
    // Both boxes must be ticked to continue; both are recorded
    // (brightness_confirmed, lighting_confirmed).
    brightness_checkbox:
      'My screen brightness is set to maximum.',
    lighting_checkbox:
      'The room I am in has good, steady lighting.',

    gamma_title: 'Screen calibration',
    gamma_intro:
      '<p>Next we will measure a property of your screen that affects how ' +
      'brightness is displayed. You will do a short matching task ' +
      '<strong>three times</strong>.</p>' +
      '<p>Each time, you will see two patterns side by side. Please adjust ' +
      'the right one until the two look like the same shade of grey.</p>',
    gamma_button: 'Begin',
    gamma_prompt:
      'Please adjust the square on the right until both squares look the ' +
      'same shade of grey, then click <b>Confirm match</b>.',
    gamma_confirm_button: 'Confirm match',
    gamma_progress:       'Match {N} of {TOTAL}',
    gamma_hint:           'Please drag the slider, or use the &larr; and &rarr; keys.',
    gamma_label_fixed:    'Reference',
    gamma_label_adjust:   'Adjust this one',
  },

  // --- Participant details: ONE screen with ID, name and email ------------
  // Only the fields switched on in CONFIG.participant are shown.
  id: {
    title:          'Before we begin',
    body:           '<p>Please enter your participant ID from your invitation ' +
                    'email. If you opened this page from the link in the ' +
                    'email, it has already been filled in.</p>',
    id_label:       'Participant ID',
    id_hint:        '<code>R_</code> followed by 15 letters and numbers. ' +
                    'Capital and small letters are distinguished.',
    // Plain text: shown by the browser in a small bubble if the ID is wrong.
    invalid:        'This ID was not recognised. Please check your invitation ' +
                    'email. Capital and small letters are distinguished.',
    optional_note:  '<p>Your <b>name</b> and <b>email address</b> are ' +
                    '<b>optional</b>. If you provide them, they are stored ' +
                    'separately from your answers and used only to contact ' +
                    'you about this study.</p>',
    // Pavlovia (contact_storage 'results_file'): kept with the answers.
    optional_note_results_file:
                    '<p>Your <b>name</b> and <b>email address</b> are ' +
                    '<b>optional</b>. If you provide them, they are stored ' +
                    'with your answers, which only the research team can ' +
                    'access, and used only to contact you about this ' +
                    'study.</p>',
    name_label:     'Name (optional)',
    email_label:    'Email address (optional)',
    button:         'Continue',

    // When the link carries no participant ID: an ID, or a name AND an
    // email address, are needed to continue.
    body_no_pid:    '<p>Please enter your participant ID from your invitation ' +
                    'email.</p>' +
                    '<p>If you do not have it, please enter your <b>name</b> ' +
                    'and <b>email address</b> instead. Providing all three is ' +
                    'preferable.</p>' +
                    '<p>Your name and email address are stored separately from ' +
                    'your answers. They are used only to contact you about this ' +
                    'study and, if you do not provide an ID, to link your ' +
                    'answers to you.</p>',
    // Pavlovia (contact_storage 'results_file'): kept with the answers.
    body_no_pid_results_file:
                    '<p>Please enter your participant ID from your invitation ' +
                    'email.</p>' +
                    '<p>If you do not have it, please enter your <b>name</b> ' +
                    'and <b>email address</b> instead. Providing all three is ' +
                    'preferable.</p>' +
                    '<p>Your name and email address are stored with your ' +
                    'answers, which only the research team can access. They ' +
                    'are used only to contact you about this study and, if you ' +
                    'do not provide an ID, to link your answers to you.</p>',
    // Shown on this screen in every variant (with or without an ID, either
    // storage), below the fields.
    privacy:        '<p>Your personal details will not be shared with anyone ' +
                    'outside the research team.</p>',
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
    retry_hint:     'Please press <b>SPACE</b> to enter it again.',
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
    fail_done:    'The file has been downloaded. Thank you. Once you have ' +
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
  // after trials 40, 80, 120 and 160, from design.json).
  brk: {
    title: 'Short break',
    body: '<p>You have completed {DONE} of {TOTAL} trials in this part.</p>' +
          '<p>You may take a moment to rest your eyes, but please avoid using ' +
          'your phone or other devices. Please remain in full screen.</p>',
    hint: 'Please press <b>SPACE</b> when you are ready to continue.',
  },

  // --- Preloading -------------------------------------------------------
  preload: {
    message:
      '<div class="card">' +
      '<h2>Loading images</h2>' +
      '<p>The study is downloading the pictures it needs. On a slow ' +
      'connection, this may take a minute.</p>' +
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
    title: 'An error has occurred',
    body:
      '<p>The study could not start. Please reload the page.</p>' +
      '<p>If the problem continues, please contact the researcher.</p>',
  },
};
