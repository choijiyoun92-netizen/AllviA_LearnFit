const state = {
  view: 'overview',
  period: 'month',
  lessonId: 'L1',
  assignmentId: 'A1',
  studentId: 'S1'
};

const students = [
  {id:'S1',name:'정민준',initial:'민',accuracy:61,completion:72,participation:78,trend:-9,behavior:'재시도 많음',question:5},
  {id:'S2',name:'김서연',initial:'서',accuracy:88,completion:96,participation:97,trend:3,behavior:'안정적',question:2},
  {id:'S3',name:'이도윤',initial:'도',accuracy:49,completion:58,participation:69,trend:-12,behavior:'후반 이탈',question:1},
  {id:'S4',name:'박하린',initial:'하',accuracy:76,completion:83,participation:90,trend:1,behavior:'토론 강점',question:7},
  {id:'S5',name:'최우진',initial:'우',accuracy:43,completion:41,participation:64,trend:-6,behavior:'미완료 반복',question:0},
  {id:'S6',name:'윤지아',initial:'지',accuracy:81,completion:87,participation:94,trend:4,behavior:'꾸준함',question:4},
];

const lessons = [
  {id:'L1',type:'상호작용 수업',title:'지구와 달의 운동',date:'09.16 3교시',joined:26,accuracy:74,completion:82,mode:'중1 과학',flow:[96,93,88,74,70],flowLabels:['자료 보기','퀴즈','화이트보드','토론','정리'],questions:14},
  {id:'L2',type:'발표형 수업',title:'힘과 운동',date:'09.14 2교시',joined:27,accuracy:79,completion:88,mode:'중1 과학',flow:[97,95,91,84,82],flowLabels:['도입','자료 보기','퀴즈','보드','정리'],questions:8},
  {id:'L3',type:'상호작용 수업',title:'생물의 다양성',date:'09.11 4교시',joined:25,accuracy:69,completion:77,mode:'중1 과학',flow:[92,89,80,75,73],flowLabels:['자료 보기','투표','퀴즈','토론','정리'],questions:11},
  {id:'L4',type:'퀴즈 중심',title:'상태 변화 복습',date:'09.09 1교시',joined:28,accuracy:81,completion:91,mode:'중1 과학',flow:[100,96,94,91,89],flowLabels:['도입','퀴즈1','퀴즈2','오답','정리'],questions:6},
];

const assignments = [
  {id:'A1',type:'개인',title:'지구와 달 개념 확인',status:'진행 중',date:'09.15 → 09.19',submitted:24,total:28,accuracy:73,completion:86,late:2,retry:9,dist:[1,2,3,5,7,6]},
  {id:'A2',type:'도전',title:'힘과 운동 심화 문제',status:'종료',date:'09.10 → 09.13',submitted:27,total:28,accuracy:68,completion:92,late:4,retry:12,dist:[2,3,6,7,5,4]},
  {id:'A3',type:'플래시 카드',title:'과학 핵심 용어 복습',status:'진행 중',date:'09.16 → 09.20',submitted:19,total:28,accuracy:84,completion:71,late:0,retry:15,dist:[0,1,2,4,5,7]},
];

const overviewPeriodData = {
  week: {participation:88,submission:93,accuracy:76,completion:84,delta:[2,1,3,2],trend:[80,82,84,88],labels:['월','화','수','목']},
  month:{participation:86.4,submission:91,accuracy:74,completion:82,delta:[-2,3,1,-1],trend:[91,89,88,86,87,85,86],labels:['8/1','8/2','8/3','9/1','9/2','9/3','9/4']},
  term: {participation:89.1,submission:90,accuracy:75,completion:85,delta:[1,2,2,3],trend:[84,86,89,88,90,89,89],labels:['3월','4월','5월','6월','7월','8월','9월']}
};

const titles = {
  overview:'학급 종합 현황',
  lesson:'수업 리포트',
  assignment:'과제 리포트',
  student:'학생 분석',
  insight:'인사이트·후속 조치'
};

function pct(v){ return `${v}%`; }
function statusBadge(text, cls='blue'){ return `<span class="badge ${cls}">${text}</span>`; }
function avatar(s){ return `<span class="mini-avatar">${s.initial}</span>`; }
function navTo(view){
  state.view=view;
  document.querySelectorAll('.nav-item').forEach(btn=>btn.classList.toggle('active',btn.dataset.view===view));
  document.querySelectorAll('.view').forEach(v=>v.classList.remove('active'));
  document.getElementById(`view-${view}`).classList.add('active');
  document.getElementById('pageTitle').textContent=titles[view];
  renderCurrent();
  window.scrollTo({top:0,behavior:'smooth'});
}

function kpiCard(title,value,foot,icon,delta){
  const cls = delta>0?'up':delta<0?'down':'neutral';
  const sign = delta>0?'+':'';
  return `<div class="card kpi">
    <div class="kpi-top"><span class="kpi-title">${title}</span><span class="kpi-icon">${icon}</span></div>
    <div class="kpi-value">${value}</div>
    <div class="kpi-foot"><span class="${cls}">${sign}${delta}%p</span> ${foot}</div>
  </div>`;
}

function lineChart(values, labels, secondary=null){
  const w=620,h=190,p=28;
  const all=secondary?values.concat(secondary):values;
  const min=Math.max(0,Math.min(...all)-8), max=Math.min(100,Math.max(...all)+8);
  const x=i=>p+(w-p*2)*(i/(values.length-1||1));
  const y=v=>h-p-(h-p*2)*((v-min)/(max-min||1));
  const points=values.map((v,i)=>`${x(i)},${y(v)}`).join(' ');
  const area=`${p},${h-p} ${points} ${w-p},${h-p}`;
  const secondaryPoints=secondary?secondary.map((v,i)=>`${x(i)},${y(v)}`).join(' '):'';
  let grids='';
  for(let i=0;i<4;i++){ const gy=p+i*(h-p*2)/3; grids += `<line class="chart-grid" x1="${p}" y1="${gy}" x2="${w-p}" y2="${gy}"/>`; }
  return `<svg class="chart-svg" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none">
    ${grids}
    <polygon class="chart-area" points="${area}"/>
    <polyline class="chart-line" points="${points}"/>
    ${secondary?`<polyline class="chart-line secondary" points="${secondaryPoints}"/>`:''}
    ${values.map((v,i)=>`<circle class="chart-dot" cx="${x(i)}" cy="${y(v)}" r="4"/><text class="value-label" x="${x(i)}" y="${y(v)-9}" text-anchor="middle">${v}</text>`).join('')}
    ${labels.map((l,i)=>`<text class="axis-label" x="${x(i)}" y="${h-5}" text-anchor="middle">${l}</text>`).join('')}
  </svg>`;
}

function progressRow(label,value){ return `<div class="progress-row"><span class="label">${label}</span><div class="progress"><span style="width:${value}%"></span></div><span class="value">${value}%</span></div>`; }

function renderOverview(){
  const d=overviewPeriodData[state.period];
  document.getElementById('view-overview').innerHTML=`
    <div class="page-grid grid-4">
      ${kpiCard('평균 수업 참여율',pct(d.participation),'이전 기간 대비','참여',d.delta[0])}
      ${kpiCard('과제 제출률',pct(d.submission),'이전 기간 대비','제출',d.delta[1])}
      ${kpiCard('평균 정답률',pct(d.accuracy),'이전 기간 대비','성과',d.delta[2])}
      ${kpiCard('평균 완료율',pct(d.completion),'이전 기간 대비','완료',d.delta[3])}

      <div class="card pad span-3">
        <div class="card-head"><div><h3>참여·성과 변화 추이</h3><p>일회성 결과보다 최근 흐름을 함께 봅니다.</p></div><div class="legend"><span><i class="dot-primary"></i>참여율</span></div></div>
        <div class="chart-wrap">${lineChart(d.trend,d.labels)}</div>
      </div>
      <div class="ai-card">
        <div class="ai-head"><div class="ai-mark">AI</div><b>오늘의 학급 인사이트</b></div>
        <p>최근 수업 참여는 완만하게 감소하고 있습니다. 특히 <b>토론 활동 이후 참여 하락</b>이 반복되고 있어 수업 후반부 활동 구조를 확인해볼 필요가 있습니다.</p>
        <ul><li>주목 학생 3명</li><li>반복 미제출 학생 2명</li><li>질문 집중 활동 1개</li></ul>
      </div>

      <div class="card pad span-2">
        <div class="card-head"><div><h3>최근 수업·과제 현황</h3><p>학급 단위 타임라인으로 최근 활동을 복기합니다.</p></div><button class="card-link" onclick="navTo('lesson')">전체 보기</button></div>
        <div class="activity-list">
          <div class="activity-item"><div class="activity-type">수업</div><div><h4>지구와 달의 운동</h4><p>09.16 · 참여 26/28 · 정답률 74% · 완료율 82%</p></div>${statusBadge('수업 종료','blue')}</div>
          <div class="activity-item"><div class="activity-type">과제</div><div><h4>지구와 달 개념 확인</h4><p>09.15~09.19 · 제출 24/28 · 평균 정답률 73%</p></div>${statusBadge('진행 중','good')}</div>
          <div class="activity-item"><div class="activity-type">수업</div><div><h4>힘과 운동</h4><p>09.14 · 참여 27/28 · 정답률 79% · 완료율 88%</p></div>${statusBadge('수업 종료','blue')}</div>
          <div class="activity-item"><div class="activity-type">과제</div><div><h4>힘과 운동 심화 문제</h4><p>09.10~09.13 · 제출 27/28 · 평균 정답률 68%</p></div>${statusBadge('종료')}</div>
        </div>
      </div>

      <div class="card pad">
        <div class="card-head"><div><h3>주목 학생</h3><p>반복 패턴을 기준으로 우선 확인합니다.</p></div><button class="card-link" onclick="navTo('student')">학생 분석</button></div>
        ${[
          ['정민준','최근 3회 참여율 하락 · 재시도 8회','warn'],
          ['이도윤','수업 후반 이탈 증가 · 완료율 58%','danger'],
          ['최우진','과제 미완료 2회 · 질문 없음','danger']
        ].map(([n,p,c],i)=>`<div class="student-alert clickable" onclick="openStudent('${['S1','S3','S5'][i]}')"><div class="avatar">${n[0]}</div><div class="body"><h4>${n}</h4><p>${p}</p></div>${statusBadge(i===0?'주의':'확인 필요',c)}</div>`).join('')}
      </div>

      <div class="card pad">
        <div class="card-head"><div><h3>활동 유형별 반응</h3><p>우리 반이 잘 반응하는 활동 형태를 비교합니다.</p></div></div>
        <div class="progress-list">
          ${progressRow('퀴즈',91)}
          ${progressRow('화이트보드',86)}
          ${progressRow('자료 보기',88)}
          ${progressRow('토론',72)}
          ${progressRow('질문',64)}
        </div>
      </div>
    </div>`;
}

function lessonStudentsRows(){
  return students.map(s=>`<tr class="clickable" onclick="openStudent('${s.id}')"><td><div class="name-cell">${avatar(s)}<b>${s.name}</b></div></td><td>${s.participation>=70?'참여':'부분 참여'}</td><td class="score">${s.accuracy}%</td><td>${s.completion}%</td><td>${s.question}건</td><td>${statusBadge(s.trend<-8?'주의':s.accuracy<50?'확인 필요':'양호',s.trend<-8?'warn':s.accuracy<50?'danger':'good')}</td></tr>`).join('');
}

function quadrantDots(){
  const pts=[
    ['S2',88,96,'good'],['S6',81,87,'good'],['S4',76,83,'good'],['S1',61,72,'warn'],['S3',49,58,'warn'],['S5',43,41,'danger']
  ];
  return pts.map(([id,a,c,cls])=>{ const s=students.find(x=>x.id===id); return `<button class="person-dot ${cls}" style="left:${a}%;bottom:${c}%" title="${s.name}" onclick="openStudent('${id}')">${s.initial}</button>`; }).join('');
}

function renderLesson(){
  const l=lessons.find(x=>x.id===state.lessonId)||lessons[0];
  document.getElementById('view-lesson').innerHTML=`
    <div class="split-layout">
      <div class="card side-list-card">
        <div class="filter-bar"><select><option>전체 유형</option><option>상호작용 수업</option><option>발표형 수업</option></select><input placeholder="수업명 검색" /></div>
        ${lessons.map(x=>`<div class="select-card ${x.id===l.id?'active':''}" onclick="selectLesson('${x.id}')"><div class="top"><h4>${x.title}</h4>${statusBadge(x.type==='상호작용 수업'?'상호작용':'수업','blue')}</div><p>${x.date} · ${x.mode}</p><div class="metrics"><span>참여 <b>${x.joined}/28</b></span><span>정답 <b>${x.accuracy}%</b></span><span>완료 <b>${x.completion}%</b></span></div></div>`).join('')}
      </div>

      <div class="detail-stack">
        <div class="card pad">
          <div class="card-head"><div><div class="eyebrow">${l.date}</div><h3>${l.title}</h3><p>${l.type} · ${l.mode}</p></div>${statusBadge('수업 종료','good')}</div>
          <div class="section-kpis">
            <div class="mini-kpi"><span>참여 학생</span><b>${l.joined}/28</b></div>
            <div class="mini-kpi"><span>평균 정답률</span><b>${l.accuracy}%</b></div>
            <div class="mini-kpi"><span>평균 완료율</span><b>${l.completion}%</b></div>
          </div>
        </div>

        <div class="page-grid grid-2">
          <div class="card pad">
            <div class="card-head"><div><h3>학생 상태 분포</h3><p>정답률 × 완료율로 빠르게 살펴봅니다.</p></div><div class="legend"><span><i class="dot-good"></i>양호</span><span><i class="dot-warn"></i>주의</span><span><i class="dot-danger"></i>확인 필요</span></div></div>
            <div class="quadrant"><span class="quad-label ql1">낮은 정답 · 높은 완료</span><span class="quad-label ql2">양호</span><span class="quad-label ql3">집중 확인 필요</span><span class="quad-label ql4">높은 정답 · 낮은 완료</span>${quadrantDots()}</div>
          </div>
          <div class="card pad">
            <div class="card-head"><div><h3>수업 흐름별 참여 변화</h3><p>활동 순서에 따라 참여가 어디서 떨어졌는지 봅니다.</p></div>${statusBadge('행태 분석','purple')}</div>
            <div class="flow-chart">${l.flow.map((v,i)=>`<div class="flow-col"><div class="flow-bar ${v<78?'warn':''}" style="height:${v}%"><em>${v}%</em></div><span>${l.flowLabels[i]}</span></div>`).join('')}</div>
            <p class="small-note">토론 활동 진입 이후 참여가 ${l.flow[2]-l.flow[3]}%p 감소했습니다. 이후 정리 활동에서도 회복되지 않았습니다.</p>
          </div>
        </div>

        <div class="card pad">
          <div class="card-head"><div><h3>학생별 활동 현황</h3><p>학생 한 명을 선택하면 활동 상세와 행태 타임라인을 확인할 수 있습니다.</p></div><div class="legend">정렬: 입장 시간 · 이름</div></div>
          <div class="table-wrap"><table><thead><tr><th>학생</th><th>참여</th><th>정답률</th><th>완료율</th><th>질문</th><th>상태</th></tr></thead><tbody>${lessonStudentsRows()}</tbody></table></div>
        </div>

        <div class="page-grid grid-2">
          <div class="card pad"><div class="card-head"><div><h3>활동별 참여·성과 비교</h3><p>어떤 활동이 효과적이었는지 비교합니다.</p></div></div><div class="progress-list">${progressRow('자료 보기',96)}${progressRow('퀴즈',88)}${progressRow('화이트보드',84)}${progressRow('토론',69)}${progressRow('정리 활동',71)}</div></div>
          <div class="card pad"><div class="card-head"><div><h3>질문·도움 요청</h3><p>질문이 집중된 활동과 반복 질문을 요약합니다.</p></div>${statusBadge(`${l.questions}건`,'blue')}</div><div class="activity-list"><div class="activity-item"><div class="activity-type">Q</div><div><h4>“달의 위상 변화가 왜 생기나요?”</h4><p>퀴즈 2번 이후 · 5명 유사 질문</p></div>${statusBadge('반복','warn')}</div><div class="activity-item"><div class="activity-type">Q</div><div><h4>“삭과 망의 차이가 뭐예요?”</h4><p>정리 활동 · 3명 유사 질문</p></div>${statusBadge('확인','blue')}</div></div></div>
        </div>
      </div>
    </div>`;
}

function assignmentRows(a){
  const rows=[
    ['S2','제출',92,100,'09.17 09:10','1회'],['S6','제출',85,100,'09.17 10:02','2회'],['S4','제출',78,90,'09.17 11:21','1회'],['S1','부분 완료',66,80,'09.18 21:48','4회'],['S3','미제출',0,45,'-','2회'],['S5','미제출',0,30,'-','3회']
  ];
  return rows.map(([id,status,acc,comp,time,retry])=>{const s=students.find(x=>x.id===id); const cls=status==='미제출'?'danger':status==='부분 완료'?'warn':'good'; return `<tr class="clickable" onclick="openStudent('${id}')"><td><div class="name-cell">${avatar(s)}<b>${s.name}</b></div></td><td>${statusBadge(status,cls)}</td><td>${acc?acc+'%':'-'}</td><td>${comp}%</td><td>${time}</td><td>${retry}</td></tr>`}).join('');
}

function renderAssignment(){
  const a=assignments.find(x=>x.id===state.assignmentId)||assignments[0];
  const rate=Math.round(a.submitted/a.total*100);
  document.getElementById('view-assignment').innerHTML=`
    <div class="split-layout">
      <div class="card side-list-card">
        <div class="filter-bar"><select><option>최신순</option><option>마감 임박순</option></select><select><option>전체 상태</option><option>진행 중</option><option>종료</option></select></div>
        ${assignments.map(x=>`<div class="select-card ${x.id===a.id?'active':''}" onclick="selectAssignment('${x.id}')"><div class="top"><h4>${x.title}</h4>${statusBadge(x.type,'purple')}</div><p>${x.date} · ${x.status}</p><div class="metrics"><span>제출 <b>${x.submitted}/${x.total}</b></span><span>정답 <b>${x.accuracy}%</b></span></div></div>`).join('')}
      </div>
      <div class="detail-stack">
        <div class="card pad">
          <div class="card-head"><div><div class="eyebrow">${a.date}</div><h3>${a.title}</h3><p>${a.type} 과제 · ${a.status}</p></div>${statusBadge(a.status,a.status==='종료'?'':'good')}</div>
          <div class="section-kpis"><div class="mini-kpi"><span>제출률</span><b>${rate}%</b></div><div class="mini-kpi"><span>평균 정답률</span><b>${a.accuracy}%</b></div><div class="mini-kpi"><span>평균 완료율</span><b>${a.completion}%</b></div></div>
        </div>

        <div class="page-grid grid-2">
          <div class="card pad"><div class="card-head"><div><h3>제출·완료 현황</h3><p>미제출과 부분 완료를 빠르게 확인합니다.</p></div></div><div class="donut-row"><div class="donut" style="background:conic-gradient(#4c6fff 0 ${rate}%,#e8ecf3 ${rate}% 100%)"><div class="donut-center"><b>${rate}%</b><span>${a.submitted}/${a.total}명 제출</span></div></div><div class="donut-legend"><span>제출 <b>${a.submitted}명</b></span><span>미제출 <b>${a.total-a.submitted}명</b></span><span>지연 제출 <b>${a.late}명</b></span><span>재시도 학생 <b>${a.retry}명</b></span></div></div></div>
          <div class="card pad"><div class="card-head"><div><h3>점수 분포</h3><p>학급 평균과 분포를 함께 봅니다.</p></div></div><div class="dist-chart" style="position:relative">${a.dist.map((v,i)=>`<div class="dist-col"><div class="dist-bar ${i>=3?'hot':''}" style="height:${Math.max(8,v*16)}px"></div><span>${['0~20','21~40','41~60','61~70','71~80','81~100'][i]}</span></div>`).join('')}<div class="avg-line" style="top:55px"><span class="avg-label">평균 ${a.accuracy}%</span></div></div></div>
        </div>

        <div class="card pad"><div class="card-head"><div><h3>학생별 수행 현황</h3><p>제출 결과뿐 아니라 재시도와 완료 과정도 함께 확인합니다.</p></div>${statusBadge('행태 포함','purple')}</div><div class="table-wrap"><table><thead><tr><th>학생</th><th>상태</th><th>정답률</th><th>완료율</th><th>제출 시각</th><th>재시도</th></tr></thead><tbody>${assignmentRows(a)}</tbody></table></div></div>

        <div class="page-grid grid-2">
          <div class="card pad"><div class="card-head"><div><h3>미제출·지연·재시도 분석</h3><p>결과가 아닌 수행 과정에서 주목할 패턴입니다.</p></div></div><div class="activity-list"><div class="activity-item"><div class="activity-type">지연</div><div><h4>마감 직전 집중 제출</h4><p>최근 3개 과제에서 4명이 반복적으로 마감 2시간 이내 제출</p></div>${statusBadge('패턴','warn')}</div><div class="activity-item"><div class="activity-type">재시도</div><div><h4>재시도 후 정답 도달</h4><p>9명이 2회 이상 재시도했고 6명은 최종 정답 도달</p></div>${statusBadge('긍정','good')}</div></div></div>
          <div class="card pad"><div class="card-head"><div><h3>문항·활동 유형별 어려움</h3><p>공통적으로 어려워한 유형을 찾습니다.</p></div></div><div class="progress-list">${progressRow('객관식',82)}${progressRow('단답형',74)}${progressRow('순서 배열',62)}${progressRow('서술형 완료',69)}</div><p class="small-note">※ 서술형은 자동 정답률에서 제외하고 별도 검토 대상으로 가정했습니다.</p></div>
        </div>
      </div>
    </div>`;
}

function renderStudent(){
  const s=students.find(x=>x.id===state.studentId)||students[0];
  const trend=[88,86,84,82,79,78,s.participation];
  document.getElementById('view-student').innerHTML=`
    <div class="card pad">
      <div class="student-header"><div class="avatar">${s.initial}</div><div><div class="eyebrow">중학교 1학년 3반</div><h2>${s.name}</h2><p>최근 수업·과제 데이터를 통합한 학생 분석 프로필</p></div><select class="student-select" onchange="selectStudent(this.value)">${students.map(x=>`<option value="${x.id}" ${x.id===s.id?'selected':''}>${x.name}</option>`).join('')}</select></div>
    </div>

    <div class="page-grid grid-4" style="margin-top:16px">
      ${kpiCard('최근 참여율',pct(s.participation),'4주 전 대비','참여',s.trend)}
      ${kpiCard('평균 정답률',pct(s.accuracy),'최근 수업·과제','성과',s.accuracy>=70?2:-3)}
      ${kpiCard('평균 완료율',pct(s.completion),'최근 수업·과제','완료',s.completion>=80?1:-4)}
      ${kpiCard('질문·도움 요청',`${s.question}건`,'최근 4주','질문',s.question>3?2:0)}

      <div class="card pad span-3"><div class="card-head"><div><h3>참여·성과 변화</h3><p>한 번의 결과보다 학생 개인의 변화 흐름을 봅니다.</p></div></div><div class="chart-wrap">${lineChart(trend,['8/1','8/2','8/3','9/1','9/2','9/3','9/4'])}</div></div>
      <div class="ai-card"><div class="ai-head"><div class="ai-mark">AI</div><b>학생 행태 요약</b></div><p>${s.name} 학생은 최근 참여율이 ${s.trend<0?'감소':'유지'}하고 있습니다. <b>${s.behavior}</b> 패턴이 반복되어 활동별 상세 확인을 권장합니다.</p><div class="behavior-tags" style="margin-top:12px"><span class="behavior-tag"><b>재시도</b>8회</span><span class="behavior-tag"><b>평균 체류</b>31분</span><span class="behavior-tag"><b>재진입</b>3회</span><span class="behavior-tag"><b>질문</b>${s.question}건</span></div></div>

      <div class="card pad span-2"><div class="card-head"><div><h3>반복 오답·어려움 패턴</h3><p>여러 수업과 과제에서 반복되는 어려움을 묶어봅니다.</p></div></div><div class="activity-list"><div class="activity-item"><div class="activity-type">개념</div><div><h4>지구·달 위치 관계</h4><p>최근 3개 활동 중 2회 오답 · 관련 질문 3건</p></div>${statusBadge('반복','warn')}</div><div class="activity-item"><div class="activity-type">유형</div><div><h4>순서 배열 활동</h4><p>정답률 52% · 평균보다 18%p 낮음</p></div>${statusBadge('확인','danger')}</div></div></div>
      <div class="card pad"><div class="card-head"><div><h3>활동 유형별 반응</h3><p>참여와 수행이 좋은 활동 형태를 비교합니다.</p></div></div><div class="progress-list">${progressRow('퀴즈',78)}${progressRow('화이트보드',84)}${progressRow('토론',66)}${progressRow('자료 보기',89)}</div></div>
      <div class="card pad"><div class="card-head"><div><h3>질문·도움 요청 이력</h3><p>어디서 도움을 요청했는지 맥락과 함께 봅니다.</p></div></div><div class="timeline"><div class="timeline-item"><h4>09.16 · 지구와 달의 운동</h4><p>“달이 매일 다른 모양으로 보이는 이유가 뭔가요?”</p></div><div class="timeline-item"><h4>09.14 · 힘과 운동</h4><p>퀴즈 3번 이후 힌트 확인 후 재시도 2회</p></div><div class="timeline-item"><h4>09.11 · 생물의 다양성</h4><p>토론 활동 미참여 · 별도 질문 없음</p></div></div></div>
    </div>`;
}

function renderInsight(){
  document.getElementById('view-insight').innerHTML=`
    <div class="ai-card" style="margin-bottom:16px"><div class="ai-head"><div class="ai-mark">AI</div><b>최근 4주 학급 요약</b></div><p><b>전체 성과는 유지되고 있지만 참여 흐름은 다소 약화</b>되고 있습니다. 수업 후반 토론 활동에서 참여가 반복적으로 감소하고, 3명의 학생에게 저참여·미완료 패턴이 누적되고 있습니다. 반면 재시도 후 정답에 도달하는 학생 비율은 높아, 즉시 정답 제시보다 재도전 기회를 주는 활동이 효과적일 수 있습니다.</p></div>

    <div class="page-grid grid-2">
      <div class="insight-card priority"><div class="insight-top"><div>${statusBadge('우선 확인','danger')}<h3 style="margin-top:9px">수업 후반 참여 급락이 반복되고 있습니다.</h3></div><span class="badge">수업 분석</span></div><p>최근 4회 수업 중 3회에서 토론 또는 개방형 활동 진입 이후 참여율이 10%p 이상 감소했습니다.</p><div class="evidence"><span>최근 4회 중 3회</span><span>평균 -13%p</span><span>토론·개방형 활동</span></div><div class="action-row"><button class="primary-btn" onclick="navTo('lesson')">수업 리포트 보기</button><button class="secondary-btn" onclick="showToast('후속 활동 설계 연결은 다음 단계에서 구체화합니다.')">후속 활동 설계</button></div></div>

      <div class="insight-card"><div class="insight-top"><div>${statusBadge('학생','warn')}<h3 style="margin-top:9px">정민준 학생의 참여가 3회 연속 감소했습니다.</h3></div><span class="badge purple">행태 분석</span></div><p>정답률은 큰 변화가 없지만 참여와 완료율이 함께 감소했습니다. 최근 수업에서는 재시도와 재진입이 증가했습니다.</p><div class="evidence"><span>참여 -9%p</span><span>재진입 3회</span><span>재시도 8회</span></div><div class="action-row"><button class="primary-btn" onclick="selectStudent('S1');navTo('student')">학생 분석 보기</button><button class="secondary-btn" onclick="showToast('학생 피드백 초안 예시를 표시합니다.')">피드백 초안</button></div></div>

      <div class="insight-card"><div class="insight-top"><div>${statusBadge('과제','blue')}<h3 style="margin-top:9px">재시도 후 성공 패턴이 긍정적으로 나타납니다.</h3></div><span class="badge good">긍정 신호</span></div><p>최근 과제에서 2회 이상 재시도한 학생 9명 중 6명이 최종 정답에 도달했습니다.</p><div class="evidence"><span>재시도 학생 9명</span><span>최종 성공 6명</span><span>성공률 67%</span></div><div class="action-row"><button class="primary-btn" onclick="navTo('assignment')">과제 리포트 보기</button><button class="subtle-btn" onclick="showToast('재도전형 활동 추천은 후속 조치 기능 후보입니다.')">활동 제안 보기</button></div></div>

      <div class="insight-card"><div class="insight-top"><div>${statusBadge('반복 질문','purple')}<h3 style="margin-top:9px">‘달의 위상 변화’ 질문이 집중되었습니다.</h3></div><span class="badge">질문 분석</span></div><p>09.16 수업에서 동일 개념에 대한 유사 질문이 5명에게서 발생했습니다. 정리 활동에서도 관련 질문이 이어졌습니다.</p><div class="evidence"><span>유사 질문 5명</span><span>퀴즈 2번 이후</span><span>정리 활동 재등장</span></div><div class="action-row"><button class="primary-btn" onclick="navTo('lesson')">질문 맥락 보기</button><button class="secondary-btn" onclick="showToast('관련 개념 재학습 자료 연결은 저작 영역과 연계할 수 있습니다.')">재학습 제안</button></div></div>
    </div>

    <div class="card pad" style="margin-top:16px"><div class="card-head"><div><h3>수업 복기 요약</h3><p>숫자를 나열하기보다 교사가 다음 수업을 준비할 수 있는 언어로 정리합니다.</p></div>${statusBadge('LearnFit 차별화 후보','purple')}</div><div class="note-box" style="margin:0"><b>09.16 ‘지구와 달의 운동’ 수업</b><br/>수업 초반 참여는 96%로 높았으나 토론 활동부터 74%로 감소했습니다. 학생 질문은 ‘달의 위상 변화’에 집중되었고, 정민준·이도윤 학생은 후반 활동에서 참여가 낮았습니다. 다음 수업에서는 해당 개념을 짧게 재확인하고, 토론 전 개인 응답 단계를 추가하는 방안을 검토할 수 있습니다.</div><div class="action-row"><button class="primary-btn" onclick="showToast('다음 단계에서는 저작/수업 준비 영역으로 연결하는 흐름을 검토할 수 있습니다.')">다음 수업에 반영</button></div></div>`;
}

function renderCurrent(){
  if(state.view==='overview') renderOverview();
  if(state.view==='lesson') renderLesson();
  if(state.view==='assignment') renderAssignment();
  if(state.view==='student') renderStudent();
  if(state.view==='insight') renderInsight();
}

function selectLesson(id){ state.lessonId=id; renderLesson(); }
function selectAssignment(id){ state.assignmentId=id; renderAssignment(); }
function selectStudent(id){ state.studentId=id; if(state.view==='student') renderStudent(); }

function openStudent(id){
  const s=students.find(x=>x.id===id)||students[0];
  state.studentId=s.id;
  document.getElementById('drawerTitle').textContent=s.name;
  document.getElementById('drawerBody').innerHTML=`
    <div class="section-kpis"><div class="mini-kpi"><span>정답률</span><b>${s.accuracy}%</b></div><div class="mini-kpi"><span>완료율</span><b>${s.completion}%</b></div><div class="mini-kpi"><span>참여율</span><b>${s.participation}%</b></div></div>
    <div class="divider"></div>
    <div class="section-title"><h2>수업 활동 타임라인</h2>${statusBadge('행태 포함','purple')}</div>
    <div class="timeline"><div class="timeline-item"><h4>09:03 수업 입장</h4><p>수업 시작 2분 후 입장했습니다.</p></div><div class="timeline-item"><h4>09:11 퀴즈 응답</h4><p>1차 오답 → 2회 재시도 후 정답에 도달했습니다.</p></div><div class="timeline-item"><h4>09:24 화이트보드</h4><p>응답 작성 후 1회 수정 · 활동 완료</p></div><div class="timeline-item"><h4>09:35 토론</h4><p>활동 진입 후 4분 체류 · 의견 미제출</p></div><div class="timeline-item"><h4>09:41 재진입</h4><p>화면 이탈 후 수업 화면으로 복귀했습니다.</p></div></div>
    <div class="divider"></div>
    <div class="section-title"><h2>교사 확인 포인트</h2></div>
    <div class="ai-card"><div class="ai-head"><div class="ai-mark">AI</div><b>요약</b></div><p>점수 자체보다 후반 활동의 참여 감소가 두드러집니다. 재시도 후 정답에 도달하는 경향이 있어 추가 시도 기회를 제공하는 방식이 적합할 수 있습니다.</p></div>
    <div class="action-row"><button class="primary-btn" onclick="closeDrawer();navTo('student')">학생 분석 전체 보기</button><button class="secondary-btn" onclick="showToast('피드백 초안 기능은 후속 조치 영역 후보입니다.')">피드백 초안</button></div>`;
  document.getElementById('drawer').classList.add('show');
  document.getElementById('drawerBackdrop').classList.add('show');
  document.getElementById('drawer').setAttribute('aria-hidden','false');
}
function closeDrawer(){document.getElementById('drawer').classList.remove('show');document.getElementById('drawerBackdrop').classList.remove('show');document.getElementById('drawer').setAttribute('aria-hidden','true');}
function openModal(){document.getElementById('modal').classList.add('show');document.getElementById('modalBackdrop').classList.add('show');document.getElementById('modal').setAttribute('aria-hidden','false');}
function closeModal(){document.getElementById('modal').classList.remove('show');document.getElementById('modalBackdrop').classList.remove('show');document.getElementById('modal').setAttribute('aria-hidden','true');}
let toastTimer;
function showToast(msg){const t=document.getElementById('toast');t.textContent=msg;t.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>t.classList.remove('show'),2300);}

window.navTo=navTo;window.selectLesson=selectLesson;window.selectAssignment=selectAssignment;window.selectStudent=selectStudent;window.openStudent=openStudent;window.closeDrawer=closeDrawer;window.showToast=showToast;

document.querySelectorAll('.nav-item').forEach(btn=>btn.addEventListener('click',()=>navTo(btn.dataset.view)));
document.querySelectorAll('#periodToggle button').forEach(btn=>btn.addEventListener('click',()=>{state.period=btn.dataset.period;document.querySelectorAll('#periodToggle button').forEach(x=>x.classList.toggle('active',x===btn));if(state.view==='overview')renderOverview();}));
document.getElementById('dataInfoBtn').addEventListener('click',openModal);
document.getElementById('modalClose').addEventListener('click',closeModal);
document.getElementById('modalBackdrop').addEventListener('click',closeModal);
document.getElementById('drawerClose').addEventListener('click',closeDrawer);
document.getElementById('drawerBackdrop').addEventListener('click',closeDrawer);
document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeDrawer();closeModal();}});

renderOverview();
