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
 * CONSENT
 * -------
 *  - consent.*      the ethics-approved text (English translation of the
 *                   approved Japanese), see CONSENT_BODY_EN below. The two
 *                   [GIVEN NAME] markers in the researcher list are to be
 *                   filled in by the research team.
 * Bracketed gaps like [GIVEN NAME] anywhere in this file are detected by
 * validate.js: a warning in debug mode, an error on index.html with debug
 * off.
 * ========================================================================= */

// --- The consent text ------------------------------------------------------
// The ethics-approved consent text (English translation of the approved
// Japanese, see text/ja/instructions.js), used as both consent.body and
// consent.body_results_file below: the approved text does not distinguish
// the two storage options, so the two keys hold the same text.
// Do not rephrase it. Only the two [GIVEN NAME] markers are to be filled in.
//
// Layout: section headings in bold on their own line (consent-heading),
// the researcher list one per line (consent-line), both left-aligned; every
// other paragraph is justified. The whole text is exempt from the rule that
// centres one-line text (src/text-align.js) and scrolls inside the card
// (css/experiment.css), which also prints it in full.
var CONSENT_BODY_EN =
  '<p>Please read all of the explanation below. If you understand it and ' +
  'agree to participate in the online image selection task, please select ' +
  '"I have understood the explanation above and, of my own free will, ' +
  'agree to participate in this study."</p>' +
  '<p class="consent-heading"><b>Purpose of the study</b></p>' +
  '<p>This study follows the questionnaire on psychological ' +
  'characteristics in which you previously participated. Experiences of ' +
  'derealization are known to occur temporarily even in healthy people. ' +
  'In this study, we ask a number of questions about what such ' +
  'experiences were like, with the aim of clarifying their ' +
  'characteristics.</p>' +
  '<p class="consent-heading"><b>Voluntary participation</b></p>' +
  '<p>Whether or not to participate in this study is your own decision. ' +
  'If you wish, you may print or save this explanation for your records. ' +
  'Even after giving your consent, you may withdraw it and stop ' +
  'participating at any time.</p>' +
  '<p class="consent-heading"><b>What the study involves</b></p>' +
  '<p>You will complete an online image selection task. You will be shown ' +
  'pairs of images that differ in appearance and, following the ' +
  'instructions on the screen, will choose one image from each pair. ' +
  'During the task, you will also answer a few questions about past ' +
  'experiences. The task takes approximately 30 minutes.</p>' +
  '<p class="consent-heading"><b>Reward</b></p>' +
  '<p>Participants in the image selection task will receive a reward of ' +
  '700 yen. After we confirm that you have completed the study, the ' +
  'reward will be sent as an Amazon gift card to the email address you ' +
  'provide for this purpose.</p>' +
  '<p class="consent-heading"><b>Possible disadvantages of ' +
  'participation</b></p>' +
  '<p>Because this study asks you to recall past experiences, some people ' +
  'may feel anxiety or discomfort. You do not have to answer any question ' +
  'you do not wish to answer, and you may interrupt or withdraw from the ' +
  'online task at any time, for any reason. Withdrawing will not cause ' +
  'you any disadvantage other than not receiving the reward.</p>' +
  '<p>This study is a psychological investigation of everyday experiences ' +
  'that can occur in healthy people, and it does not involve any medical ' +
  'diagnosis or assessment. If you have any concerns about your physical ' +
  'or mental health, we recommend that you consult a medical institution ' +
  'or the university\'s counselling services.</p>' +
  '<p class="consent-heading"><b>Handling of personal information</b></p>' +
  '<p>The data obtained in this study will be anonymised before analysis, ' +
  'so no individual can be identified from the data. Records will use ' +
  'only a participant number, not your name. The list linking names to ' +
  'participant numbers will be kept separately from the data, as an ' +
  'electronic file protected by a password, on a computer owned by the ' +
  'university.</p>' +
  '<p>The image selection task is conducted on a web page. Your responses ' +
  'will be sent to a private and secure area of an online data storage ' +
  'service for research, then promptly transferred to a computer owned by ' +
  'the university and stored as an electronic file protected by a ' +
  'password.</p>' +
  '<p>The data collected in this study will be kept by the researchers as ' +
  'electronic files protected by a password. If you do not agree to the ' +
  'section "Publication of data" below, the data will be destroyed once ' +
  'the results have been published.</p>' +
  '<p>The data collected in this study will be used for academic papers ' +
  'and conference presentations and may be made public. Even in that ' +
  'case, no individual will be identified. Parts of your answers may be ' +
  'quoted to convey what the experiences were like. In such cases, names ' +
  'will not be used, and any content that could identify an individual ' +
  'will be removed or altered.</p>' +
  '<p>If you wish to withdraw your data, please contact the researchers ' +
  'by email at any time.</p>' +
  '<p class="consent-heading"><b>Publication of data</b></p>' +
  '<p>To increase the transparency of this research and to allow other ' +
  'researchers to verify and reuse it, the collected data may be ' +
  'published on the internet as open data. The data that may be published ' +
  'include basic information such as age and gender, and data such as ' +
  'task performance.</p>' +
  '<p>Published data may be used in future research that has not been ' +
  'specified at the time of consent. Because published data can be widely ' +
  'distributed, copies that have already been distributed cannot be ' +
  'recalled, even if you request withdrawal after publication. Before ' +
  'publication, you may withdraw your data at any time by contacting the ' +
  'researchers by email.</p>' +
  '<p>Even if you do not agree to the publication of your data, you may ' +
  'still participate in this study. In that case, your data will not be ' +
  'published.</p>' +
  '<p class="consent-heading"><b>Ethical review</b></p>' +
  '<p>This study has been approved by the Ethics Committee of the Center ' +
  'for Experimental Research in Social Sciences (CERSS), Hokkaido ' +
  'University (project title: "Experiments on perceptual discrimination ' +
  'tasks in joint action between humans and robots"; reference number: ' +
  'R6-26-1; amendment approval number: R6-26-1).</p>' +
  '<p class="consent-heading"><b>Researchers</b></p>' +
  '<p class="consent-line">Principal investigator:</p>' +
  '<p class="consent-line">Keisuke Suzuki, Associate Professor, Center ' +
  'for Human Nature, Artificial Intelligence, and Neuroscience (CHAIN), ' +
  'Hokkaido University (ksk@chain.hokudai.ac.jp)</p>' +
  '<p class="consent-line">Collaborating researchers:</p>' +
  '<p class="consent-line">Katsunori Miyahara, Associate Professor, ' +
  'CHAIN, Hokkaido University</p>' +
  '<p class="consent-line">Daisuke Sakamoto, Professor, Faculty of ' +
  'Information Science and Technology and CHAIN, Hokkaido University</p>' +
  '<p class="consent-line">[GIVEN NAME] Imai, Academic Researcher, ' +
  'Department of Psychology, Faculty of Humanities and Human Sciences, ' +
  'Hokkaido University</p>' +
  '<p class="consent-line">[GIVEN NAME] Sawada, Research Assistant, ' +
  'Psychology Laboratory, Division of Human Sciences, Graduate School of ' +
  'Humanities and Human Sciences, and CHAIN, Hokkaido University</p>' +
  '<p>If you have any questions or concerns about this study, please ' +
  'contact Keisuke Suzuki by email.</p>';

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
  // The ethics-approved text. The same text is used for both groups and on
  // both platforms. body and body_results_file are IDENTICAL (both are
  // CONSENT_BODY_EN, above): the code still picks body_results_file when name
  // and email are kept in the response file (Pavlovia), so both keys stay.
  // The checkbox is the approved consent sentence (it no longer mentions
  // age). Keep button_agree, button_decline and the declined screen as they
  // are.
  consent: {
    title: 'Consent to participate in the online image selection task',
    body:              CONSENT_BODY_EN,
    body_results_file: CONSENT_BODY_EN,
    checkbox:
      'I have understood the explanation above and, of my own free will, ' +
      'agree to participate in this study.',
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
    // Shown just above the fields on every recalled episode screen. Its last
    // sentence asks participants not to type identifying details (the
    // approved consent text does not say this).
    questions_intro:
      'The following questions are intended to help you recall the episode. ' +
      'The questions marked as optional may be left blank. Please do not ' +
      'include names or other details that could identify you or anyone ' +
      'else.',
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
    // The reload warning (session.reload_warning) is added at the end.
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
    // storage), at the end of the text above the fields.
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

  // --- Session: reload, resuming, completion ----------------------------
  session: {
    // On the set-up screen and before block 1's practice (main.js,
    // pairs.js), and on the resume screen.
    reload_warning:
      '<p>Please do not reload or close this page until the final screen ' +
      'confirms that your responses have been saved. Doing so interrupts the ' +
      'study, and your responses may be lost.</p>',

    // Shown when the link of an unfinished session is opened again in the
    // same browser. Only Continue is offered.
    resume_title:  'The study was interrupted',
    resume_body:
      '<p>The study was interrupted before it was finished. Your earlier ' +
      'responses have been kept, and the study will continue from the point ' +
      'where it was interrupted. Part of the study may be shown again.</p>' +
      '<p>The study will return to full screen when you continue.</p>',
    resume_button: 'Continue',

    // Shown, and nothing else, when the link of a completed session is
    // opened again in the same browser.
    completed:
      '<p>You have already completed this study. Thank you for your ' +
      'participation.</p>',
  },

  // --- CDS items (after the word ratings) -------------------------------
  // Items 2, 13, 19 and 29 of the Cambridge Depersonalisation Scale, trait
  // format, in this order. The instructions and the items are VERBATIM
  // (only "circle" replaced by "select"); do not edit them for style.
  // Each item: the frequency (0-4, no default); when it is not 0, the
  // duration (1-6) appears and is required.
  cds: {
    instructions:
      '<p>PLEASE READ INSTRUCTIONS CAREFULLY:</p>' +
      '<p>This questionnaire describes strange and \u2018funny\u2019 ' +
      'experiences that normal people may have in their daily life. We are ' +
      'interested in their: (a) frequency, i.e. how often have you had these ' +
      'experiences OVER THE LAST SIX MONTHS; and (b) their approximate ' +
      'duration. For each question, please select the answers that suit you ' +
      'best. If you are not sure, give your best guess.</p>',
    items: [
      { id: 'q02', label: 'What I see looks \u2018flat\u2019 or \u2018lifeless\u2019, ' +
                          'as if I were looking at a picture.' },
      { id: 'q13', label: 'My surroundings feel detached or unreal, as if ' +
                          'there were a veil between me and the outside world.' },
      { id: 'q19', label: 'Objects around me seem to look smaller or further ' +
                          'away.' },
      { id: 'q29', label: 'Previously familiar places look unfamiliar, as if I ' +
                          'had never seen them before.' },
    ],
    // Frequency 0..4 and duration 1..6, in this order.
    freq_options: ['never', 'rarely', 'often', 'very often', 'all the time'],
    dur_heading:  'In general, it lasts:',
    dur_options:  ['few seconds', 'few minutes', 'few hours', 'about a day',
                   'more than a day', 'more than a week'],
    incomplete:
      'Please answer every item to continue. For each experience you have ' +
      'had, please also select how long it generally lasts.',
    button_submit: 'Continue',
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
