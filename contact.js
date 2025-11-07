// contact.js — toggle the off-canvas contact panel
(function(){
  if (typeof window === 'undefined') return;
  var openBtn = document.querySelector('header .primary-button');
  var contact = document.getElementById('contact');
  var overlay = document.getElementById('contact-overlay');
  var closeBtn = document.querySelector('.contact-close');
  if (!openBtn || !contact || !overlay) return;

  function openContact(){
    contact.classList.add('open');
    document.body.classList.add('contact-open');
    overlay.setAttribute('aria-hidden','false');
    // move focus into the form
    var firstInput = contact.querySelector('input, textarea, button');
    if (firstInput) firstInput.focus();
  }
  function closeContact(){
    contact.classList.remove('open');
    document.body.classList.remove('contact-open');
    overlay.setAttribute('aria-hidden','true');
    // return focus to the opener
    openBtn.focus();
  }

  openBtn.addEventListener('click', function(e){
    e.preventDefault();
    openContact();
  });

  overlay.addEventListener('click', function(){ closeContact(); });

  if (closeBtn) closeBtn.addEventListener('click', function(){ closeContact(); });

  document.addEventListener('keydown', function(e){
    if (e.key === 'Escape' && contact.classList.contains('open')) {
      closeContact();
    }
  });

    /* Mailto fallback: try to open mailto, and if no handler, show a small copy dialog
       This is heuristic — browsers don't expose success/failure for external handlers.
    */
    function showMailFallback(email) {
      // avoid creating multiple dialogs
      if (document.getElementById('mailto-fallback')) return;
      var wrap = document.createElement('div');
      wrap.id = 'mailto-fallback';
      wrap.setAttribute('role', 'dialog');
      wrap.setAttribute('aria-live', 'polite');
      wrap.style.position = 'fixed';
      wrap.style.left = '50%';
      wrap.style.top = '50%';
      wrap.style.transform = 'translate(-50%,-50%)';
      wrap.style.zIndex = 9999;
      wrap.style.background = '#fff';
      wrap.style.padding = '18px';
      wrap.style.borderRadius = '10px';
      wrap.style.boxShadow = '0 8px 30px rgba(0,0,0,0.18)';
      wrap.style.maxWidth = '90vw';
      wrap.style.fontFamily = 'Inter, system-ui, sans-serif';

      wrap.innerHTML = '<p style="margin:0 0 12px">It looks like your device may not have a mail app configured. You can copy the address below and paste it into your email app:</p>' +
        '<div style="display:flex;gap:8px;align-items:center"><input id="mailto-fallback-input" value="'+
        email+'" style="flex:1;padding:8px;border:1px solid #ddd;border-radius:6px;font-size:14px" readonly>' +
        '<button id="mailto-copy" style="padding:8px 10px;border-radius:6px;background:#dc325f;color:#fff;border:0;cursor:pointer">Copy</button></div>' +
        '<div style="text-align:right;margin-top:10px"><button id="mailto-close" style="background:transparent;border:0;color:#333;cursor:pointer">Close</button></div>';

      document.body.appendChild(wrap);

      var copyBtn = document.getElementById('mailto-copy');
      var closeBtn2 = document.getElementById('mailto-close');
      var input = document.getElementById('mailto-fallback-input');
      copyBtn.addEventListener('click', function(){
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(email).then(function(){
            copyBtn.textContent = 'Copied';
            setTimeout(function(){ copyBtn.textContent = 'Copy'; }, 1500);
          });
        } else {
          input.select();
          try { document.execCommand('copy'); copyBtn.textContent = 'Copied'; } catch(e){ /* ignore */ }
        }
      });
      closeBtn2.addEventListener('click', function(){ wrap.remove(); });
    }

    // attach to any mailto anchors on the page (including dynamic ones)
    function wireMailtoFallback() {
      var mailAnchors = document.querySelectorAll('a[href^="mailto:"]');
      mailAnchors.forEach(function(a){
        // avoid double-wiring
        if (a.__mailto_wired) return; a.__mailto_wired = true;
        a.addEventListener('click', function(evt){
          // allow normal navigation attempt first
          try {
            // Some browsers will launch an external handler; setting location is another attempt
            window.location.href = a.getAttribute('href');
          } catch(e){}
          // After a short delay, show fallback dialog so user can copy the address
          setTimeout(function(){
            showMailFallback(a.getAttribute('href').replace(/^mailto:/i,''));
          }, 700);
        });
      });
    }

    // wire immediately and also after DOM changes
    wireMailtoFallback();

  })();
