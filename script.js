const views = ['dashboard','practice','sessions','progress'];
const titles = {dashboard:'Overview',practice:'Practice interview',sessions:'My sessions',progress:'My progress'};
let currentQuestion = {category:'Technical', text:'What is the difference between an array and a linked list?', hint:'Consider memory layout, access time and when you might choose each structure.'};
let practiceCount = 0;
let toastTimer;

function showToast(message){
  const toast=document.getElementById('toast'); toast.textContent=message; toast.classList.add('show');
  clearTimeout(toastTimer); toastTimer=setTimeout(()=>toast.classList.remove('show'),2800);
}
function goTo(view){
  views.forEach(v=>document.getElementById(`view-${v}`).classList.toggle('active',v===view));
  document.querySelectorAll('.nav-link').forEach(b=>b.classList.toggle('active',b.dataset.view===view));
  document.getElementById('crumbTitle').textContent=titles[view];
  document.getElementById('sidebar').classList.remove('open');
  window.scrollTo({top:0,behavior:'smooth'});
}
document.querySelectorAll('.nav-link').forEach(b=>b.addEventListener('click',()=>goTo(b.dataset.view)));
document.querySelectorAll('[data-go]').forEach(b=>b.addEventListener('click',()=>goTo(b.dataset.go)));
document.getElementById('mobileMenu').addEventListener('click',()=>document.getElementById('sidebar').classList.toggle('open'));

document.getElementById('roleSwitch').addEventListener('click',()=>{
  const label=document.getElementById('roleLabel');
  const isStudent=label.textContent==='Student view';
  label.textContent=isStudent?'Mentor view':'Student view';
  document.querySelector('.top-avatar').textContent=isStudent?'M':'S';
  document.querySelector('.profile-mini .avatar').textContent=isStudent?'M':'S';
  document.querySelector('.profile-copy strong').textContent=isStudent?'Mentor account':'Student account';
  showToast(isStudent?'Mentor preview selected.':'Student preview selected.');
});

const questionBank={
  Technical:[
    {text:'What is the difference between an array and a linked list?',hint:'Consider memory layout, access time and when you might choose each structure.'},
    {text:'Explain the difference between a primary key and a foreign key in a database.',hint:'Think about uniqueness, relationships and how tables connect.'},
    {text:'What is the purpose of version control in software development?',hint:'Mention collaboration, history and how teams manage code changes.'}
  ],
  Behavioural:[
    {text:'Tell me about a time you faced a challenge while working with a team.',hint:'Use a clear situation, your action and the outcome. Keep the example specific.'},
    {text:'How do you handle feedback when someone suggests improving your work?',hint:'Explain how you listen, evaluate the suggestion and apply what is useful.'}
  ],
  HR:[
    {text:'Can you introduce yourself and describe what you are looking for in your first role?',hint:'Connect your education, interests and the skills you hope to contribute.'},
    {text:'What are two strengths you would bring to a team?',hint:'Choose strengths and briefly support each with an example.'}
  ],
  Project:[
    {text:'Explain a project you have worked on and the problem it was designed to solve.',hint:'Cover the problem, your role, the approach and what you learned.'},
    {text:'What was one technical decision you made in your project, and why?',hint:'Describe the options you considered and the reason for your choice.'}
  ]
};
let questionIndex=0;
function beginPractice(){
  const cat=document.getElementById('categorySelect').value;
  const arr=questionBank[cat];
  currentQuestion={category:cat,...arr[questionIndex%arr.length]}; questionIndex++;
  document.getElementById('questionCategory').textContent=`${cat} interview question`;
  document.getElementById('questionText').textContent=currentQuestion.text;
  document.getElementById('questionHint').textContent=currentQuestion.hint;
  document.getElementById('answerInput').value=''; document.getElementById('charCount').textContent='0 / 2500 characters';
  document.getElementById('practiceSetup').classList.add('hidden');
  document.getElementById('questionPanel').classList.remove('hidden');
  document.getElementById('feedbackPanel').classList.add('hidden');
  document.getElementById('answerInput').focus();
}
document.getElementById('beginQuestion').addEventListener('click',beginPractice);
document.getElementById('answerInput').addEventListener('input',e=>document.getElementById('charCount').textContent=`${e.target.value.length} / 2500 characters`);
document.getElementById('backSetup').addEventListener('click',()=>{
  document.getElementById('questionPanel').classList.add('hidden'); document.getElementById('practiceSetup').classList.remove('hidden');
});
function createDemoFeedback(answer){
  const words=answer.trim().split(/\s+/).filter(Boolean).length;
  const hasExample=/for example|such as|in my project|when i|for instance/i.test(answer);
  const hasStructure=/first|second|finally|because|however|whereas/i.test(answer);
  const relevance=Math.min(94,Math.max(42,55+Math.min(words,100)*.32));
  const clarity=Math.min(92,Math.max(40,48+Math.min(words,120)*.28));
  const structure=Math.min(94,Math.max(40,52+(hasStructure?19:0)+Math.min(words,80)*.12));
  const examples=Math.min(94,Math.max(38,48+(hasExample?26:0)+Math.min(words,80)*.1));
  const overall=Math.round((relevance+clarity+structure+examples)/4);
  return {relevance:Math.round(relevance),clarity:Math.round(clarity),structure:Math.round(structure),examples:Math.round(examples),overall,words,hasExample,hasStructure};
}
function setRubricValue(id,value){
  document.getElementById(id).textContent=`${value}%`;
  document.getElementById(id).nextElementSibling.querySelector('i').style.width=`${value}%`;
}
document.getElementById('getFeedback').addEventListener('click',()=>{
  const answer=document.getElementById('answerInput').value.trim();
  if(answer.length<12){showToast('Add a little more detail before reviewing your answer.');document.getElementById('answerInput').focus();return;}
  const r=createDemoFeedback(answer);
  document.getElementById('scoreValue').textContent=r.overall;
  document.getElementById('scoreRing').style.background=`conic-gradient(#8174e1 0 ${r.overall}%,#efedf8 ${r.overall}% 100%)`;
  setRubricValue('relevanceScore',r.relevance);setRubricValue('clarityScore',r.clarity);setRubricValue('structureScore',r.structure);setRubricValue('examplesScore',r.examples);
  const strengths=[]; const improvements=[];
  if(r.words>=35) strengths.push('You included enough detail to give a reviewer something to evaluate.'); else improvements.push('Expand your answer with a little more explanation and context.');
  if(r.hasStructure) strengths.push('Your response uses linking or sequencing words to guide the listener.'); else improvements.push('Organise the response into clear steps or points.');
  if(r.hasExample) strengths.push('You included an example or practical context.'); else improvements.push('Add a specific example to make the explanation more memorable.');
  if(r.words<80) improvements.push('Aim to explain the key idea, why it matters and one example.');
  if(!strengths.length) strengths.push('You made an attempt and put your ideas into your own words.');
  document.getElementById('strengthList').innerHTML=strengths.map(s=>`<li>${s}</li>`).join('');
  document.getElementById('improveList').innerHTML=improvements.map(s=>`<li>${s}</li>`).join('');
  document.getElementById('questionPanel').classList.add('hidden');document.getElementById('feedbackPanel').classList.remove('hidden');
  practiceCount++;
  document.getElementById('feedbackPanel').scrollIntoView({behavior:'smooth',block:'start'});
});
document.getElementById('tryAgain').addEventListener('click',beginPractice);
document.getElementById('finishPractice').addEventListener('click',()=>{
  document.getElementById('feedbackPanel').classList.add('hidden');document.getElementById('practiceSetup').classList.remove('hidden');
  showToast('Practice review complete. Nice work!');
  goTo('dashboard');
});

const modal=document.getElementById('scheduleModal');
function openModal(){modal.classList.remove('hidden');document.getElementById('sessionDate').min='2026-11-23';}
function closeModal(){modal.classList.add('hidden');}
document.getElementById('openSchedule').addEventListener('click',openModal);
document.getElementById('closeSchedule').addEventListener('click',closeModal);
document.getElementById('cancelSchedule').addEventListener('click',closeModal);
modal.addEventListener('click',e=>{if(e.target===modal)closeModal();});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal();});
document.getElementById('scheduleForm').addEventListener('submit',e=>{
  e.preventDefault();
  const name=document.getElementById('sessionName').value.trim();
  const date=document.getElementById('sessionDate').value;
  const time=document.getElementById('sessionTime').value;
  const type=document.getElementById('sessionKind').value;
  const parsed=new Date(`${date}T${time}`);
  const day=String(parsed.getDate()).padStart(2,'0');
  const month=parsed.toLocaleString('en',{month:'short'}).toUpperCase();
  const year=parsed.getFullYear();
  const dateText=`${day} ${month} ${year}`;
  const item=document.createElement('article');item.className='session-card';item.dataset.status='upcoming';
  item.innerHTML=`<div class="session-date"><strong>${day}</strong><span>${month} ${year}</span></div><div class="session-main"><span class="session-type">${type.toUpperCase()} ROUND</span><h3></h3><p>${parsed.toLocaleTimeString('en',{hour:'numeric',minute:'2-digit'})} · Practice session</p></div><span class="status-tag upcoming-tag">Upcoming</span>`;
  item.querySelector('h3').textContent=name;
  document.getElementById('sessionList').prepend(item);
  const count=document.querySelectorAll('.session-card').length;document.getElementById('allCount').textContent=count;
  e.target.reset();closeModal();showToast(`Session scheduled for ${dateText}.`);goTo('sessions');
});

document.querySelectorAll('.tab-btn').forEach(btn=>btn.addEventListener('click',()=>{
  document.querySelectorAll('.tab-btn').forEach(b=>b.classList.toggle('active',b===btn));
  let shown=0;
  document.querySelectorAll('.session-card').forEach(card=>{const match=btn.dataset.filter==='all'||card.dataset.status===btn.dataset.filter;card.classList.toggle('hidden',!match);if(match)shown++;});
  document.getElementById('emptySessions').classList.toggle('hidden',shown!==0);
}));

document.getElementById('responsibleLink').addEventListener('click',e=>{e.preventDefault();showToast('Responsible AI: protect personal data, explain limitations and keep human mentor review in the loop.');});
