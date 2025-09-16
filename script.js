// Mobile nav toggle
const menuBtn = document.querySelector('.menu-btn');
const navLinks = document.getElementById('primary-nav');
if (menuBtn && navLinks){
  menuBtn.addEventListener('click', () => {
    const expanded = menuBtn.getAttribute('aria-expanded') === 'true';
    menuBtn.setAttribute('aria-expanded', String(!expanded));
    navLinks.style.display = expanded ? 'none' : 'flex';
  });
}

// Save Recipe buttons (toast-style feedback)
function toast(msg){
  const t = document.createElement('div');
  t.textContent = msg;
  Object.assign(t.style, {
    position: 'fixed', left: '50%', bottom: '24px', transform: 'translateX(-50%)',
    background: '#111', color: '#fff', padding: '10px 14px', borderRadius: '12px',
    boxShadow: '0 8px 26px rgba(0,0,0,.2)', zIndex: 2000, opacity: 0, transition: 'opacity .15s ease'
  });
  document.body.appendChild(t);
  requestAnimationFrame(()=>{ t.style.opacity = 1; });
  setTimeout(()=>{
    t.style.opacity = 0;
    setTimeout(()=> t.remove(), 200);
  }, 1400);
}

document.querySelectorAll('button[data-recipe]').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    const name = btn.getAttribute('data-recipe') || 'Recipe';
    toast(`${name} saved ✅`);
  });
});

// Recipes page dynamic list + search
const recipeData = [
  { title:'Avocado Salad', cals:250, img:'https://picsum.photos/seed/avocado/800/420', desc:'Fresh avocado with greens and olive oil.' },
  { title:'Grilled Salmon', cals:300, img:'https://picsum.photos/seed/salmon/800/420', desc:'High-protein salmon with steamed veggies.' },
  { title:'Berry Smoothie', cals:200, img:'https://picsum.photos/seed/berries/800/420', desc:'Refreshing smoothie perfect for breakfast.' },
  { title:'Quinoa Bowl', cals:320, img:'https://picsum.photos/seed/quinoa/800/420', desc:'Quinoa with roasted veggies and chickpeas.' },
  { title:'Chicken Wrap', cals:280, img:'https://picsum.photos/seed/wrap/800/420', desc:'Lean chicken, greens, and yogurt dressing.' },
  { title:'Greek Yogurt Parfait', cals:220, img:'https://picsum.photos/seed/yogurt/800/420', desc:'Yogurt with granola and fruits.' },
];

(function initRecipes(){
  const grid = document.getElementById('recipeGrid');
  const tpl = document.getElementById('recipe-card');
  if (!grid || !tpl) return;
  function render(list){
    grid.innerHTML = '';
    list.forEach(item=>{
      const node = tpl.content.cloneNode(true);
      node.querySelector('img').src = item.img;
      node.querySelector('img').alt = item.title;
      node.querySelector('h3').textContent = item.title;
      node.querySelector('p').textContent = `${item.desc} ~ ${item.cals} calories.`;
      node.querySelector('button').addEventListener('click', ()=> toast(`${item.title} saved ✅`));
      grid.appendChild(node);
    });
  }
  render(recipeData);

  const search = document.getElementById('search');
  if (search){
    search.addEventListener('input', ()=>{
      const q = search.value.toLowerCase().trim();
      const filtered = recipeData.filter(r => r.title.toLowerCase().includes(q) || r.desc.toLowerCase().includes(q));
      render(filtered);
    });
  }
})();

// Calorie tracker logic with local state
(function calorieLogic(){
  const form = document.getElementById('calorieForm');
  const list = document.getElementById('mealList');
  const totalOut = document.getElementById('totalCalories');
  const clearBtn = document.getElementById('clearMeals');
  if (!form || !list || !totalOut || !clearBtn) return;

  let total = 0;
  function addItem(name, cal){
    const li = document.createElement('li');
    li.textContent = `${name} — ${cal} calories`;
    li.className = 'card';
    li.style.listStyle = 'none';
    list.appendChild(li);
  }

  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const name = (document.getElementById('meal').value || '').trim();
    const cal = Number(document.getElementById('calories').value);
    if (!name || !(cal > 0)) { toast('Enter a meal and positive calories'); return; }
    addItem(name, cal);
    total += cal;
    totalOut.textContent = String(total);
    form.reset();
  });

  clearBtn.addEventListener('click', ()=>{
    list.innerHTML = ''; total = 0; totalOut.textContent = '0'; toast('Cleared ✅');
  });
})();

// Contact form
(function contactForm(){
  const form = document.getElementById('contactForm');
  const status = document.getElementById('contactStatus');
  if (!form || !status) return;
  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const name = (document.getElementById('name').value || 'there').trim();
    status.textContent = `Thanks, ${name}! Your message has been noted ✅`;
    toast('Message sent ✅');
    form.reset();
  });
})();
