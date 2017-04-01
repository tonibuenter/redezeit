var FUN = {};

$(function() {
  if (APP_base.IS_OFFLINE) {
    initOffline()
    //
  } else {
    //
    window.isphone = false;
    if (document.URL.indexOf("http://") === -1
        && document.URL.indexOf("https://") === -1) {
      window.isphone = true;
    }

    if (window.isphone) {
      $('#log').append(APP_ui.div('isphone'));
      document.addEventListener("deviceready", initMobile, false);
    } else {
      initWeb();
    }
  }
});

function initMobile() {
}

function initWeb() {
}

function initOffline() {
}

function einmaleins() {

  var POINTS_TO_AWARD = 20;
  var LEVEL_AWARDS = [ 'anchor', 'eye', 'lightbulb-o' ];

  var einmaleinsLocalStore = APP_base.ls('einmaleinsLocalStore') || {};

  // Variablen für die Bausteine
  var funs = questionFuns(), currentQuestion;
  var main, jPanel, levels, currentLevel, qPanel, question, resultInput, resultDiv, ok, notok, message, r = '', score, t, awardTrunk;

  levels = $('<div>').addClass('levels').append(t = levelButton(0, 'Anchor'),
      levelButton(1, 'Eye'), levelButton(2, 'Light'),
      awardTrunk = $('<div>').addClass('award-trunk'));

  window.setTimeout(function() {
    t.click();
  }, 10);

  qPanel = $('<div>').addClass('question-panel');
  question = $('<div>').addClass('question');

  resultInput = $('<input>', {
    'type' : 'number'
  }).addClass('result');
  resultDiv = $('<div>').addClass('result').hide();

  ok = $('<i>').addClass('ok-notok ok fa fa-check').hide();
  notok = $('<i>').addClass('ok-notok notok fa fa-times').hide();

  score = scorePanelUi(awardTrunk);

  main = $('#main').empty();
  jPanel = $('<div>').addClass('einmaleins').appendTo(main);

  jPanel.append(levels, qPanel.append(question, resultInput, resultDiv, ok,
      notok), score.view());

  function newQuestion() {
    var f, level = currentLevel;
    qPanel.hide();
    f = _.sample(funs[level]);
    currentQuestion = f();
    resultInput.show();
    resultInput.val('');
    resultDiv.hide();
    question.text(currentQuestion.q);
    qPanel.fadeIn(function() {
      resultInput.focus();
    });
  }

  function changeLevel(level) {
    currentLevel = level;
    score.reset(level);
    newQuestion();
  }

  function test() {

    var icon;
    var resultVal = resultInput.val();
    currentQuestion.result(resultVal);
    resultDiv.text(resultVal);

    resultInput.hide();
    resultDiv.show();

    var m = currentQuestion.m();
    if (currentQuestion.right()) {
      score.point(1);
      icon = ok;
    } else {
      icon = notok;
      score.point(-1);
    }
    icon.fadeIn();
    window.setTimeout(function() {
      icon.fadeOut(function() {
        newQuestion();
      });
    }, 500);

  }

  // check.click(test);

  resultInput.keyup(function(e) {
    if (currentQuestion.a.length > resultInput.val().length) {
      return;
    }
    test();
  });

  function levelButton(l, label) {
    var b = $('<a>', {
      'href' : '#',
      'text' : label,
      'class' : 'level-button'
    }).click(function() {
      changeLevel(l);
      jPanel.find('.level-button').removeClass('selected');
      b.addClass('selected');
    });
    return b;
  }

  function scorePanelUi(awardTrunk) {
    var view$ = $('<div>').addClass('score-panel');
    var currentPoints = 0;
    var stars = [];
    var level = 0;
    var awardPoints = POINTS_TO_AWARD;
    var levelAwards = LEVEL_AWARDS;

    initAwardTrunk();

    return {
      view : function() {
        return view$;
      },
      point : point,
      reset : reset
    };

    function point(n) {
      var icon;
      var spaceClass = (currentPoints != 0 && currentPoints % 5 == 0) ? 'space-before'
          : '';
      if (n == 1 && currentPoints >= 0) {
        icon = newStar(n).addClass(spaceClass);
        view$.append(icon);
        stars.push(icon);
        icon.fadeIn();
      }
      if (n == 1 && currentPoints < 0) {
        icon = stars.pop();
        icon.fadeOut(function() {
          icon.remove();
        });
      }
      if (n == -1 && currentPoints > 0) {
        icon = stars.pop();
        icon.fadeOut(function() {
          icon.remove();
        });
      }
      if (n == -1 && currentPoints <= 0) {
        icon = newStar(n).addClass(spaceClass);
        view$.append(icon);
        stars.push(icon);
        icon.fadeIn();
      }
      currentPoints += n;
      if (currentPoints == awardPoints) {
        addAndSaveAwards(levelAwards[level]);
        awardTrunk.append(newAward(levelAwards[level]));
        reset(level);
      }
    }
    function reset(arg0) {
      level = arg0;
      currentPoints = 0;
      view$.empty();
    }

    function initAwardTrunk() {
      if (!einmaleinsLocalStore.awards) {
        return;
      }

      _.each(LEVEL_AWARDS, function(name) {
        var awards = _.where(einmaleinsLocalStore.awards, {
          'awardName' : name
        });
        if (awards.length > 0) {
          awardTrunk.append(newNumber(awards.length),
              newAward(awards[0].awardName));
        }
      });

    }

    function newStar(n) {
      var s = $('<i>').addClass('score-star fa color-' + n).hide();
      return n == 1 ? s.addClass('fa-star') : s.addClass('fa-times');
    }

    function newAward(name) {
      var s = $('<i>').addClass('score-award fa fa-' + name).hide();
      window.setTimeout(function() {
        s.fadeIn();
      }, 500);
      return s;
    }

    function newNumber(number) {
      var s = $('<i>').addClass('score-award-amount').text(number).hide();
      window.setTimeout(function() {
        s.fadeIn();
      }, 500);
      return s;
    }
  }

  function addAndSaveAwards(name) {
    var awards, a;
    einmaleinsLocalStore.awards = einmaleinsLocalStore.awards || [];
    awards = einmaleinsLocalStore.awards;
    awards.push(a = {
      'time' : APP_base.currentTimeMillis(),
      'awardName' : name
    });
    APP_base.geoLocation(function(loc) {
      a.location = loc;
      APP_base.ls('einmaleinsLocalStore', einmaleinsLocalStore);
    });
    APP_base.ls('einmaleinsLocalStore', einmaleinsLocalStore);
  }

  function questionFuns() {
    var l0 = [], l1 = [], l2 = [];
    var funs = [ l0, l1, l2 ];

    // annina
    l0.push(addition(100));
    l0.push(multiplicationMaxResult(20));
    l0.push(subtraction(100));
    // elena
    l1.push(addition(100));
    l1.push(addition(200));
    l1.push(addition(500));
    l1.push(addition(1000));
    l1.push(addition(10000));
    l1.push(subtraction(200));
    l1.push(subtraction(3000));
    l1.push(multiplication(10));
    l1.push(multiplication(10));
    l1.push(division(10));
    l1.push(division(10));
    // livio
    l2.push(addition(200));
    l2.push(addition(900));
    l2.push(addition(20000));
    l2.push(addition(1000000));
    l2.push(subtraction(1000));
    l2.push(multiplication(18));
    l2.push(multiplication(18));
    l2.push(multiplication(12));
    l2.push(division(20));
    l2.push(division(20));
    l2.push(division(20));

    function addition(max) {
      var f = function() {
        var mq = MathQuestion();
        var z1, z2;
        z1 = _.random(0, max);
        z2 = _.random(0, max - z1);
        mq.a = '' + (z1 + z2);
        mq.q = z1 + ' + ' + z2 + ' = ';
        return mq;
      };
      return f;
    }

    function subtraction(max) {
      var f = function() {
        var mq = MathQuestion();
        var z1, z2;
        z1 = _.random(0, max);
        z2 = _.random(0, z1);
        mq.a = '' + (z1 - z2);
        mq.q = z1 + ' - ' + z2 + ' = ';
        return mq;
      };
      return f;
    }

    function multiplication(max) {
      var f = function() {
        var mq = MathQuestion();
        var z1, z2;
        z1 = _.random(0, max);
        z2 = _.random(0, max);
        mq.a = '' + (z1 * z2);
        mq.q = z1 + ' * ' + z2 + ' = ';
        return mq;
      };
      return f;
    }

    function multiplicationMaxResult(max) {
      var f = function() {
        var mq = MathQuestion();
        var z1, z2, m;
        m = Math.floor(Math.sqrt(max));
        z1 = _.random(1, m + 1);
        m = Math.floor(max / z1);

        z2 = _.random(0, m);
        mq.a = '' + (z1 * z2);
        mq.q = z1 + ' * ' + z2 + ' = ';
        return mq;
      };
      return f;
    }

    function division(max) {
      var f = function() {
        var mq = MathQuestion();
        var z1, z2;
        z1 = _.random(0, max);
        z2 = _.random(1, max);
        mq.a = '' + z1;
        mq.q = (z1 * z2) + ' : ' + z2 + ' = ';
        return mq;
      };
      return f;
    }

    return funs;

  }

  function MathQuestion() {
    return {
      'userAnswer' : '',
      'q' : '',
      'a' : '',
      'result' : function(arg0) {
        this.userAnswer = '' + arg0;
      },
      'right' : function() {
        return this.a == this.userAnswer;
      },
      m : function() {
        return this.q + this.userAnswer;
      }
    };
  }

}

FUN.einmaleins = einmaleins;

//
// JAZZIE
//

function jazzie() {

  // Variablen für die Bausteine
  var seite, jPanel, neuesSpiel, spielFeld, spielerEinfabe;
  var anzahlWuerfel = 5;
  var spiel = {};

  // Bausteine erstellen
  seite = $('#main');
  jPanel = $('<div>').addClass('jazzie');

  // Würfel-Button
  neuesSpiel = $('<a>', {
    'href' : '#',
    'text' : 'Neues Spiel!'
  }).addClass('neuesspiel-button');

  // Würfel-Ergebnis

  spielFeld = $('<div>').addClass('w-ergebnis');

  // Zusammensetzen
  seite.empty();
  seite.append(jPanel);
  jPanel.append(neuesSpiel, spielFeld);

  // Würfel-Funktion
  neuesSpiel.click(
  //
  function() {

    var ergebnis = _.random(1, 6);
    spielFeld.text('...');

    setTimeout(function() {
      spielFeld.text(ergebnis);
    }, 500);

  }
  //    
  );

  function diceSession() {
    var view$ = $().addClass('dice-session');

    start();

    return {
      'view' : function() {
        return view$;
      }
    };

  }

  function dice() {
    var i, t, view$ = $('<div>').addClass('dice');
    var dots = [];
    var pattern = [ [] ];
    for (i = 0; i < 6; i++) {
      view$.append(t = $('<div>').addClass(
          'fa fa-circle dot-' + i + ' o-' + (i % 2)));
      dots.push(t);
    }

    return {
      'view' : function() {
        return view$;
      }
    };

  }
}

FUN.jazzie = jazzie;

function wuerfeln() {

  // Variablen für die Bausteine
  var seite, wPanel, wButton, wErgebnis;

  // Bausteine erstellen
  seite = $('#main');
  wPanel = $('<div>').addClass('w-panel');

  // Würfel-Button
  wButton = $('<a>', {
    'href' : '#',
    'text' : 'Würfle!'
  }).addClass('w-button');

  // Würfel-Ergebnis

  wErgebnis = $('<div>').addClass('w-ergebnis');

  // Zusammensetzen
  seite.empty();
  seite.append(wPanel);
  wPanel.append(wButton, wErgebnis);

  // Würfel-Funktion
  wButton.click(
  //
  function() {

    var ergebnis = _.random(1, 6);
    wErgebnis.text('...');

    setTimeout(function() {
      wErgebnis.text(ergebnis);
    }, 500);

  }
  //    
  );

  function dice() {

  }
}

FUN.wuerfeln = wuerfeln;