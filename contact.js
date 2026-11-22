(function () {
  var form = document.getElementById('contact-form');
  if (!form) return;

  var type = document.getElementById('f-type');
  var structureWrap = document.getElementById('f-structure-wrap');
  var status = document.getElementById('f-statut');
  var btn = form.querySelector('button[type="submit"]');
  var TO = 'contact@freddylocquet.fr';

  function syncType() { structureWrap.hidden = type.value !== 'collectif'; }
  if (location.hash === '#collectif') { type.value = 'collectif'; }
  type.addEventListener('change', syncType);
  syncType();

  function say(msg, kind) { status.textContent = msg; status.className = 'hint ' + (kind || ''); }

  function mailtoFallback() {
    var collectif = type.value === 'collectif';
    var lines = ['Nom : ' + form.nom.value, 'E-mail : ' + form.email.value];
    if (collectif && form.structure.value) lines.push('Structure : ' + form.structure.value);
    lines.push('', form.message.value);
    window.location.href = 'mailto:' + TO + '?subject=' + encodeURIComponent(collectif ? 'Demande concernant un accompagnement collectif' : 'Demande de premier échange') + '&body=' + encodeURIComponent(lines.join('\n'));
  }

  var ENDPOINT = 'https://api.web3forms.com/submit';
  var subjectField = document.getElementById('f-subject');

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!form.checkValidity()) { form.reportValidity(); return; }

    // Piège à robots : champ caché rempli = faux succès, rien n'est envoyé.
    if (form.site.value) { form.reset(); syncType(); say('Merci, votre message est bien envoyé. Je vous réponds sous 48 h ouvrées.', 'ok'); return; }

    var collectif = type.value === 'collectif';
    subjectField.value = collectif ? 'Site – demande collective – ' + form.nom.value : 'Site – premier échange – ' + form.nom.value;

    btn.disabled = true; say('Envoi en cours…');
    fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        access_key: form.access_key.value,
        subject: subjectField.value,
        replyto: form.email.value,
        from_name: 'freddylocquet.fr',
        demande: collectif ? 'accompagnement collectif' : 'accompagnement individuel',
        nom: form.nom.value,
        email: form.email.value,
        structure: form.structure.value,
        message: form.message.value
      })
    }).then(function (r) { return r.json().then(function (j) { return { ok: r.ok && j.success === true, j: j }; }); })
      .then(function (res) {
        if (res.ok) { form.reset(); syncType(); say('Merci, votre message est bien envoyé. Je vous réponds sous 48 h ouvrées.', 'ok'); }
        else { say('L’envoi a échoué. Votre messagerie va s’ouvrir avec le message prêt.', 'err'); mailtoFallback(); }
      })
      .catch(function () { say('Connexion impossible : votre messagerie va s’ouvrir avec le message prêt à envoyer.', 'err'); mailtoFallback(); })
      .then(function () { btn.disabled = false; });
  });
})();
