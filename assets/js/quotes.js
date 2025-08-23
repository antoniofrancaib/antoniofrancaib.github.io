(function(){
  const container=document.getElementById('site-quote');
  if(!container) return;
  const fullEl=container.querySelector('[data-quote-full]');
  const nextEl=container.querySelector('[data-quote-next]');
  let quotes=[]; let idx=0;

  async function loadQuotes(){
    try{
      const r=await fetch((window.siteBaseUrl||'') + '/assets/quotes.json');
      if(!r.ok) throw new Error('quotes load');
      quotes=await r.json();
      if(Array.isArray(quotes) && quotes.length){
        idx=Math.floor(Math.random()*quotes.length);
        render();
        container.hidden=false;
      }
    }catch(err){ /* silent */ }
  }

  function render(){
    const q=quotes[idx];
    if(!q) return;
    const authorPart = q.author ? (' — ' + q.author) : '';
    const formattedText = q.text.replace(/\\n/g, '\n');
    fullEl.innerHTML = '"' + formattedText.replace(/\n/g, '<br>') + '"' + authorPart;
  }

  function next(ev){
    if(ev) ev.preventDefault();
    if(!quotes.length) return;
    idx = (idx + 1) % quotes.length;
    render();
  }

  if(nextEl) nextEl.addEventListener('click', next);
  loadQuotes();
})();


