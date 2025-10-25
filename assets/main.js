async function loadResume() {
  const res = await fetch('data/resume.json', {cache:'no-store'});
  const data = await res.json();

  document.getElementById('site-title').textContent = `個人履歷｜${data.basics.name}`;
  document.getElementById('name').textContent = data.basics.name;
  document.getElementById('headline').textContent = data.basics.headline;
  document.getElementById('summary').textContent = data.basics.summary || '';
  document.getElementById('year').textContent = new Date().getFullYear();

  const person = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": data.basics.name,
    "jobTitle": data.basics.headline,
    "url": data.basics.website || location.href,
    "sameAs": [
      data.basics.profiles?.linkedin || "",
      data.basics.profiles?.github || "",
      data.basics.email ? `mailto:${data.basics.email}` : ""
    ].filter(Boolean)
  };
  document.getElementById('jsonld-person').textContent = JSON.stringify(person, null, 2);

  const badges = [];
  if (data.basics.location) badges.push(`📍 ${data.basics.location}`);
  if (data.basics.openToWork) badges.push('🟢 開放合作');
  if (data.basics.remote) badges.push('🌐 Remote OK');
  const $badges = document.getElementById('location-badges');
  badges.forEach(b => {
    const span = document.createElement('span');
    span.className = 'badge';
    span.textContent = b;
    $badges.appendChild(span);
  });

  const socials = [
    {label:'LinkedIn', url:data.basics.profiles?.linkedin},
    {label:'GitHub', url:data.basics.profiles?.github},
    {label:'Email', url: data.basics.email ? `mailto:${data.basics.email}` : null},
    {label:'Website', url:data.basics.website}
  ].filter(x => !!x.url);
  const $links = document.getElementById('social-links');
  socials.forEach(s => {
    const a = document.createElement('a');
    a.href = s.url;
    a.target = '_blank';
    a.rel = 'noopener';
    a.textContent = s.label;
    $links.appendChild(a);
  });

  const $high = document.getElementById('highlights');
  (data.basics.highlights || []).forEach(h => {
    const li = document.createElement('li');
    li.textContent = h;
    $high.appendChild(li);
  });

  const $groups = document.getElementById('skills-groups');
  (data.skills || []).forEach(g => {
    const wrap = document.createElement('div');
    wrap.className = 'skill-group';
    const h3 = document.createElement('h3');
    h3.textContent = g.name;
    const chips = document.createElement('div');
    chips.className = 'chips';
    (g.items || []).forEach(s => {
      const span = document.createElement('span');
      span.className = 'chip';
      span.textContent = s;
      chips.appendChild(span);
    });
    wrap.appendChild(h3);
    wrap.appendChild(chips);
    $groups.appendChild(wrap);
  });

  const $exp = document.getElementById('experience-timeline');
  (data.experience || []).forEach(e => {
    const card = document.createElement('div');
    card.className = 'exp';
    card.innerHTML = `
      <div class="exp-header">
        <div class="exp-title">${e.title} · ${e.company}</div>
        <div class="exp-meta">${e.start} – ${e.end || 'Present'}｜${e.location || ''}</div>
      </div>
    `;
    const ul = document.createElement('ul');
    (e.highlights || []).forEach(h => {
      const li = document.createElement('li');
      li.textContent = h;
      ul.appendChild(li);
    });
    card.appendChild(ul);
    $exp.appendChild(card);
  });

  const $proj = document.getElementById('project-cards');
  (data.projects || []).forEach(p => {
    const card = document.createElement('div');
    card.className = 'card';
    if (p.image) {
      const img = document.createElement('img');
      img.src = p.image;
      img.alt = p.name;
      card.appendChild(img);
    }
    const h3 = document.createElement('h3');
    h3.textContent = p.name;
    const desc = document.createElement('p');
    desc.textContent = p.description;
    const tech = document.createElement('div');
    tech.className = 'tech';
    (p.tech || []).forEach(t => {
      const s = document.createElement('span');
      s.textContent = t;
      tech.appendChild(s);
    });
    const actions = document.createElement('div');
    actions.className = 'actions';
    if (p.demo) {
      const a = document.createElement('a');
      a.href = p.demo; a.target = '_blank'; a.rel = 'noopener'; a.textContent = 'Demo';
      actions.appendChild(a);
    }
    if (p.repo) {
      const a = document.createElement('a');
      a.href = p.repo; a.target = '_blank'; a.rel = 'noopener'; a.textContent = 'Repo';
      actions.appendChild(a);
    }

    card.appendChild(h3);
    card.appendChild(desc);
    card.appendChild(tech);
    card.appendChild(actions);
    $proj.appendChild(card);
  });

  const $awards = document.getElementById('awards-list');
  (data.awards || []).forEach(a => {
    const li = document.createElement('li');
    li.textContent = `${a.title}（${a.issuer}${a.date ? '｜' + a.date : ''}）`;
    $awards.appendChild(li);
  });

  const $edu = document.getElementById('education-list');
  (data.education || []).forEach(ed => {
    const li = document.createElement('li');
    li.textContent = `${ed.school}｜${ed.degree}${ed.field ? ' ' + ed.field : ''}｜${ed.start} – ${ed.end}`;
    $edu.appendChild(li);
  });

  const $contact = document.getElementById('contact-list');
  (data.contact || []).forEach(c => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = c.href;
    a.textContent = c.label;
    if (c.newTab) { a.target = '_blank'; a.rel = 'noopener'; }
    li.appendChild(a);
    $contact.appendChild(li);
  });
}

loadResume().catch(console.error);
