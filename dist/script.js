let activeIndex = 0;
let limit = 0;
let disabled = false;
let $stage;
let $controls;
let canvas = false;

const SPIN_FORWARD_CLASS = 'js-spin-fwd';
const SPIN_BACKWARD_CLASS = 'js-spin-bwd';
const DISABLE_TRANSITIONS_CLASS = 'js-transitions-disabled';
const SPIN_DUR = 1000;

const appendControls = () => {
  for (let i = 0; i < limit; i++) {
    $('.carousel__control').append(`<a href="#" data-index="${i}"></a>`);
  }
  let height = $('.carousel__control').children().last().outerHeight();

  $('.carousel__control').css('height', 30 + limit * height);
  $controls = $('.carousel__control').children();
  $controls.eq(activeIndex).addClass('active');
};

const setIndexes = () => {
  $('.spinner').children().each((i, el) => {
    $(el).attr('data-index', i);
    limit++;
  });
};

const duplicateSpinner = () => {
  const $el = $('.spinner').parent();
  const html = $('.spinner').parent().html();
  $el.append(html);
  $('.spinner').last().addClass('spinner--right');
  $('.spinner--right').removeClass('spinner--left');
};

const paintFaces = () => {
  $('.spinner__face').each((i, el) => {
    const $el = $(el);
    let color = $(el).attr('data-bg');
    $el.children().css('backgroundImage', `url(${getBase64PixelByColor(color)})`);
  });
};

const getBase64PixelByColor = hex => {
  if (!canvas) {
    canvas = document.createElement('canvas');
    canvas.height = 1;
    canvas.width = 1;
  }
  if (canvas.getContext) {
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = hex;
    ctx.fillRect(0, 0, 1, 1);
    return canvas.toDataURL();
  }
  return false;
};

const prepareDom = () => {
  setIndexes();
  paintFaces();
  duplicateSpinner();
  appendControls();
};

const spin = (inc = 1) => {
  if (disabled) return;
  if (!inc) return;
  activeIndex += inc;
  disabled = true;

  if (activeIndex >= limit) {
    activeIndex = 0;
  }

  if (activeIndex < 0) {
    activeIndex = limit - 1;
  }

  const $activeEls = $('.spinner__face.js-active');
  const $nextEls = $(`.spinner__face[data-index=${activeIndex}]`);
  $nextEls.addClass('js-next');

  if (inc > 0) {
    $stage.addClass(SPIN_FORWARD_CLASS);
  } else {
    $stage.addClass(SPIN_BACKWARD_CLASS);
  }

  $controls.removeClass('active');
  $controls.eq(activeIndex).addClass('active');

  setTimeout(() => {
    spinCallback(inc);
  }, SPIN_DUR, inc);
};

const spinCallback = inc => {

  $('.js-active').removeClass('js-active');
  $('.js-next').removeClass('js-next').addClass('js-active');
  $stage.
  addClass(DISABLE_TRANSITIONS_CLASS).
  removeClass(SPIN_FORWARD_CLASS).
  removeClass(SPIN_BACKWARD_CLASS);

  $('.js-active').each((i, el) => {
    const $el = $(el);
    $el.prependTo($el.parent());
  });
  setTimeout(() => {
    $stage.removeClass(DISABLE_TRANSITIONS_CLASS);
    disabled = false;
  }, 100);

};

const attachListeners = () => {
  document.onkeyup = e => {
    switch (e.keyCode) {
      case 38:
        spin(-1);
        break;
      case 40:
        spin(1);
        break;
    }
  };

  $controls.on('click', e => {
    e.preventDefault();
    if (disabled) return;
    const $el = $(e.target);
    const toIndex = parseInt($el.attr('data-index'), 10);
    spin(toIndex - activeIndex);
  });

  // Swipe handling
  const hammerHandler = new Hammer($stage[0]);
  hammerHandler.on('swipeleft', () => spin(1));
  hammerHandler.on('swiperight', () => spin(-1));
};

const assignEls = () => {
  $stage = $('.carousel__stage');
};

const init = () => {
  assignEls();
  prepareDom();
  attachListeners();
};

$(document).ready(function () {
  init();
});

// text animation

var quotes = [
  {
      quote: "\"The craziest goddamn thing I've read in a long time.\"",
      author: "Alexander Payne",
      affiliation: "Academy-Award winning writer/director of Sideways and The Descendants"
  },
  {
      quote: "\" Strange genius mixed with stomach-turning madness. \"",
      author: "Matt Greenberg",
      affiliation: "screenwriter of 1408 and Pet Sematary"
  },
  {
      quote: "\" I'm sniffing a breakthrough. It's like Bret Easton Ellis and Philip K. Dick had a baby, and the baby wrote a book. \"",
      author: "Jerry Stahl",
      affiliation: "author of Permanent Midnight and Bad Sex on Speed"
  },
  {
      quote: "\" So successfully strange it's almost its own genre. Holding a mirror, if not a hall of mirrors to our culture where we disappear and find ourselves at the same time. \"",
      author: "Aris Janigan",
      affiliation: "author of Waiting for Lipchitz at Chateau Marmont"
  },
  {
      quote: "\" Adam Novak has a merciless eye for a society in which striving replaces every consideration of morality. \"",
      author: "Michael Tolkin",
      affiliation: "author of The Player"
  }
];

var part,
  i = 0,
  offset = 0,
  len = quotes.length,
  forwards = true,
  skip_count = 0,
  skip_delay = 15,
  speed = 70;

var wordflick = function () {
  setInterval(function () {
      if (forwards) {
          if (offset >= quotes[i].quote.length) {
              ++skip_count;
              if (skip_count == skip_delay) {
                  forwards = false;
                  skip_count = 0;
              }
          }
      } else {
          if (offset == 0) {
              forwards = true;
              i++;
              offset = 0;
              if (i >= len) {
                  i = 0;
              }
          }
      }
      part = quotes[i].quote.substr(0, offset);
      if (skip_count == 0) {
          if (forwards) {
              offset++;
          } else {
              offset--;
          }
      }

      $(".quote").text(part);
      $(".author").text("~ " + quotes[i].author);
      $(".affiliation").text(quotes[i].affiliation);
  }, speed);
};

$(document).ready(function () {
  wordflick();
});

