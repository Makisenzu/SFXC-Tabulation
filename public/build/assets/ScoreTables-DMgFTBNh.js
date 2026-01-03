import{r as h,j as e,R as z,a as ee}from"./app-CJQL5-s2.js";import{a as ze}from"./printLogo-Dw7oCvxT.js";import{c as L,F as te,R as W,C as We}from"./refresh-cw-BE22MEWN.js";/**
 * @license lucide-react v0.552.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Be=[["path",{d:"m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526",key:"1yiouv"}],["circle",{cx:"12",cy:"8",r:"6",key:"1vp47v"}]],ce=L("award",Be);/**
 * @license lucide-react v0.552.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ke=[["path",{d:"M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z",key:"1oefj6"}],["path",{d:"M14 2v5a1 1 0 0 0 1 1h5",key:"wfsgrz"}],["path",{d:"M12 18v-6",key:"17g6i2"}],["path",{d:"m9 15 3 3 3-3",key:"1npd3o"}]],xe=L("file-down",Ke);/**
 * @license lucide-react v0.552.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ve=[["path",{d:"M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z",key:"1oefj6"}],["path",{d:"M14 2v5a1 1 0 0 0 1 1h5",key:"wfsgrz"}],["path",{d:"M8 13h2",key:"yr2amv"}],["path",{d:"M14 13h2",key:"un5t4a"}],["path",{d:"M8 17h2",key:"2yhykz"}],["path",{d:"M14 17h2",key:"10kma7"}]],he=L("file-spreadsheet",Ve);/**
 * @license lucide-react v0.552.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const qe=[["path",{d:"M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2",key:"143wyd"}],["path",{d:"M6 9V3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v6",key:"1itne7"}],["rect",{x:"6",y:"14",width:"12",height:"8",rx:"1",key:"1ue0tg"}]],ae=L("printer",qe);/**
 * @license lucide-react v0.552.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Je=[["path",{d:"M18 6 6 18",key:"1bl5f8"}],["path",{d:"m6 6 12 12",key:"d8bk6v"}]],re=L("x",Je),He=({showModal:v,setShowModal:T,rounds:m,selectedRound:I,criteria:k,contestants:E,importingScores:c,handleImportScores:S})=>{const[N,B]=h.useState(""),[g,K]=h.useState(""),[b,F]=h.useState([]),_=x=>{F(O=>O.includes(x)?O.filter(G=>G!==x):[...O,x])},D=()=>{b.length===E.length?F([]):F(E.map(x=>x.id))},$=()=>{if(!N||!g||b.length===0){alert("Please select source round, target criteria, and at least one contestant");return}S(N,g,b)};return v?e.jsx("div",{className:"fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4",children:e.jsxs("div",{className:"bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto",children:[e.jsx("div",{className:"px-8 py-6 border-b border-gray-100 sticky top-0 bg-white z-10",children:e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsxs("div",{children:[e.jsx("h3",{className:"text-xl font-bold text-gray-900",children:"Import Scores from Previous Round"}),e.jsx("p",{className:"text-sm text-gray-500 mt-1",children:"Calculate and import weighted average scores"})]}),e.jsx("button",{onClick:()=>T(!1),className:"p-2 hover:bg-gray-100 rounded-xl transition-colors",disabled:c,children:e.jsx(re,{className:"w-5 h-5 text-gray-400"})})]})}),e.jsxs("div",{className:"px-8 py-6 space-y-6",children:[e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-semibold text-gray-700 mb-2",children:"1. Select Previous Round"}),e.jsxs("select",{value:N,onChange:x=>B(x.target.value),className:"w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:border-orange-500 transition-all",disabled:c,children:[e.jsx("option",{value:"",children:"Choose a round to import from"}),m.filter(x=>x.round_no<I).map(x=>e.jsxs("option",{value:x.round_no,children:["Round ",x.round_no]},x.round_no))]})]}),e.jsxs("div",{children:[e.jsxs("label",{className:"block text-sm font-semibold text-gray-700 mb-2",children:["2. Select Target Criteria (Current Round ",I,")"]}),e.jsxs("select",{value:g,onChange:x=>K(x.target.value),className:"w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:border-orange-500 transition-all",disabled:c,children:[e.jsx("option",{value:"",children:"Choose criteria to populate"}),k.map(x=>e.jsxs("option",{value:x.id,children:[x.criteria_desc," (",x.percentage,"%)"]},x.id))]})]}),e.jsxs("div",{children:[e.jsxs("div",{className:"flex items-center justify-between mb-2",children:[e.jsx("label",{className:"block text-sm font-semibold text-gray-700",children:"3. Select Contestants"}),e.jsx("button",{onClick:D,className:"text-sm text-orange-600 hover:text-orange-700 font-medium",disabled:c,children:b.length===E.length?"Deselect All":"Select All"})]}),e.jsxs("div",{className:"border-2 border-gray-200 rounded-xl max-h-64 overflow-y-auto",children:[E.map(x=>e.jsxs("label",{className:"flex items-center px-4 py-3 hover:bg-orange-50 cursor-pointer border-b border-gray-100 last:border-b-0",children:[e.jsx("input",{type:"checkbox",checked:b.includes(x.id),onChange:()=>_(x.id),disabled:c,className:"w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"}),e.jsx("span",{className:"ml-3 text-sm font-medium text-gray-900",children:x.contestant_name})]},x.id)),E.length===0&&e.jsx("p",{className:"text-sm text-gray-500 text-center py-4",children:"No contestants available"})]}),b.length>0&&e.jsxs("p",{className:"text-sm text-gray-600 mt-2",children:[b.length," contestant(s) selected"]})]})]}),e.jsx("div",{className:"px-8 py-6 bg-gray-50 border-t border-gray-100 rounded-b-2xl sticky bottom-0",children:e.jsxs("div",{className:"flex gap-3",children:[e.jsx("button",{onClick:()=>T(!1),className:"flex-1 px-6 py-3 border border-gray-300 rounded-xl text-sm font-semibold text-gray-700 hover:bg-white transition-colors",disabled:c,children:"Cancel"}),e.jsx("button",{onClick:$,disabled:c||!N||!g||b.length===0,className:"flex-1 px-6 py-3 bg-orange-600 text-white rounded-xl text-sm font-semibold hover:bg-orange-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2",children:c?e.jsxs(e.Fragment,{children:[e.jsx(W,{className:"w-4 h-4 animate-spin"}),"Importing..."]}):e.jsxs(e.Fragment,{children:[e.jsx(W,{className:"w-4 h-4"}),"Import Scores"]})})]})})]})}):null},Ze=()=>{const[v,T]=h.useState([]),[m,I]=h.useState(null),[k,E]=h.useState([]),[c,S]=h.useState(null),[N,B]=h.useState([]),[g,K]=h.useState([]),[b,F]=h.useState([]),[_,D]=h.useState([]),[$,x]=h.useState(!0),[O,G]=h.useState(!1),[C,ge]=h.useState([]),[pe,V]=h.useState(!1),[U,me]=h.useState([]),[se,q]=h.useState(!1),[J,H]=h.useState(null),[oe,M]=h.useState(""),Y=h.useRef(null),[ue,X]=h.useState(!1),[be,ne]=h.useState(!1),[Q,fe]=h.useState(!1),[ye,we]=h.useState({current_page:1,last_page:1,per_page:10,total:0}),[le,je]=h.useState(ze);h.useEffect(()=>{fetch("/api/settings/logo").then(t=>t.json()).then(t=>{t.logo&&je(`/storage/${t.logo}`)}).catch(t=>console.error("Error loading custom logo:",t))},[]),h.useEffect(()=>{Ne(1)},[]),h.useEffect(()=>{m&&ke(m)},[m]),h.useEffect(()=>{c&&Z(m,c)},[c]),h.useEffect(()=>{if(console.log("🔍 Broadcasting setup check:",{selectedEvent:m,selectedRound:c,hasEcho:!!window.Echo,echoType:window.Echo?.constructor?.name}),m&&c&&window.Echo){const t=`score-updates.${m}.${c}`;console.log("🟡 Attempting to subscribe to:",t);try{const o=window.Echo.private(t).listen(".score.updated",a=>{console.log("🟢 Score update received:",a),a.score&&ve(a.score)});return console.log("✅ Successfully subscribed to channel:",t),()=>{console.log("🔴 Leaving channel:",t),window.Echo.leave(t)}}catch(o){console.error("❌ Failed to subscribe to channel:",o)}}else console.warn("⚠️ Cannot subscribe - missing:",{selectedEvent:!!m,selectedRound:!!c,windowEcho:!!window.Echo})},[m,c]),h.useEffect(()=>{const t=o=>{Y.current&&!Y.current.contains(o.target)&&q(!1)};return document.addEventListener("mousedown",t),()=>document.removeEventListener("mousedown",t)},[]);const ve=t=>{D(o=>{const a=[...o],r=a.findIndex(n=>n.judge_id===t.judge_id&&n.contestant_id===t.contestant_id&&n.criteria_id===t.criteria_id),s={id:t.tabulation_id,judge_id:t.judge_id,contestant_id:t.contestant_id,criteria_id:t.criteria_id,score:t.score,is_lock:t.is_lock};return r>=0?a[r]=s:a.push(s),console.log("✅ Score updated in state:",s),a})},Ne=async(t=1)=>{try{x(!0);const a=await(await fetch(`/getEvents?page=${t}&per_page=100&show_past=true`)).json();if(a.data&&Array.isArray(a.data))T(a.data),we({current_page:a.current_page,last_page:a.last_page,per_page:a.per_page,total:a.total});else{const r=Array.isArray(a)?a:a?.events||a?.data||[];T(r)}}catch(o){console.error("Error fetching events:",o)}finally{x(!1)}},ke=async t=>{try{x(!0);const a=await(await fetch(`/getActiveRounds/${t}`)).json(),r=Array.isArray(a)?a:[];if(E(r),r.length>0){const s=r.find(n=>n.is_active===1||n.is_active===!0);S(s?s.round_no:r[0].round_no)}}catch(o){console.error("Error fetching rounds:",o)}finally{x(!1)}},Z=async(t,o)=>{try{x(!0);const r=await(await fetch(`/get-round-contestants/${t}/${o}`)).json();B(Array.isArray(r)?r:[]);const n=await(await fetch(`/getJudgesByEvent/${t}`)).json();K(Array.isArray(n)?n:n?.judges||[]);const d=await(await fetch(`/getCriteriaByRound/${t}/${o}`)).json();F(Array.isArray(d)?d:[]);const p=await(await fetch(`/getScoresByRound/${t}/${o}`)).json();D(Array.isArray(p)?p:[])}catch(a){console.error("Error fetching round data:",a)}finally{x(!1)}},_e=async(t,o)=>{try{(await ee.post("/admin/notify-judge",{judge_id:t,event_id:m,round_no:c,message:"Please enter your scores as soon as possible."})).data.success?alert(`Notification sent to ${o} successfully!`):alert("Failed to send notification. Please try again.")}catch(a){console.error("Error sending notification:",a),console.error("Error response:",a.response?.data),alert(`Failed to send notification: ${a.response?.data?.message||a.message}`)}},Ee=(t,o,a,r)=>{H({judgeId:t,contestantId:o,criteriaId:a}),M(r==="0.00"?"":r)},Re=t=>{const o=t.target.value;(o===""||/^\d*\.?\d*$/.test(o)&&parseFloat(o)<=10)&&M(o)},Se=async(t,o,a)=>{const r=parseFloat(oe)||0;if(r<0||r>10){alert("Score must be between 0 and 10");return}try{const s=await ee.post("/admin/update-score",{judge_id:t,contestant_id:o,criteria_id:a,event_id:m,round_no:c,score:r});if(s.data.success){const n={id:s.data.tabulation.id,judge_id:t,contestant_id:o,criteria_id:a,score:r,is_lock:s.data.tabulation.is_lock};D(l=>{const d=l.findIndex(i=>i.judge_id===t&&i.contestant_id===o&&i.criteria_id===a);if(d>=0){const i=[...l];return i[d]=n,i}else return[...l,n]}),H(null),M("")}}catch(s){console.error("Error updating score:",s),alert(`Failed to update score: ${s.response?.data?.message||s.message}`)}},ie=()=>{H(null),M("")},$e=(t,o,a,r)=>{t.key==="Enter"?Se(o,a,r):t.key==="Escape"&&ie()},Ce=(t,o,a)=>{const r=_.find(s=>s.judge_id===t&&s.contestant_id===o&&s.criteria_id===a);return r?parseFloat(r.score||0).toFixed(2):"0.00"},Ae=(t,o)=>{let a=0;return b.forEach(r=>{const s=_.find(n=>n.judge_id===t&&n.contestant_id===o&&n.criteria_id===r.id);s&&(a+=parseFloat(s.score||0))}),a.toFixed(2)},Pe=async(t,o,a)=>{if(!m||!c||!o||a.length===0){alert("Please select target criteria and at least one contestant");return}if(window.confirm(`Import weighted scores from Round ${t} to selected criteria? This will calculate and import aggregated scores for ${a.length} contestant(s).`)){ne(!0);try{const r=await ee.post("/admin/import-scores",{event_id:m,source_round_no:t,target_round_no:c,target_criteria_id:o,contestant_ids:a});r.data.success?(alert(r.data.message),X(!1),await Z(m,c)):alert(r.data.message||"Failed to import scores")}catch(r){console.error("Error importing scores:",r),alert(`Failed to import scores: ${r.response?.data?.message||r.message}`)}finally{ne(!1)}}},Te=(t,o)=>{let a=0;return b.forEach(r=>{const s=_.find(n=>n.judge_id===t&&n.contestant_id===o&&n.criteria_id===r.id);if(s){const n=parseInt(r.percentage)/100;a+=parseFloat(s.score||0)/10*n*100}}),a.toFixed(2)},Fe=t=>{const o=N.map(d=>({id:d.id,name:d.contestant_name,sequence_no:d.sequence_no,totalScore:parseFloat(Ae(t,d.id)),percentage:parseFloat(Te(t,d.id))})),a=[...o].sort((d,i)=>i.percentage-d.percentage);let r=1,s=null,n=0;a.forEach((d,i)=>{s!==null&&d.percentage<s?(r+=n,n=1):s===d.percentage?n++:n=1,s=d.percentage,d.rank=r});const l={};return a.forEach(d=>{l[d.id]=d.rank}),o.map(d=>({...d,rank:l[d.id]})).sort((d,i)=>d.sequence_no-i.sequence_no)},De=t=>{switch(t){case 1:return"bg-red-500 text-white";case 2:return"bg-green-500 text-white";case 3:return"bg-blue-500 text-white";case 4:return"bg-sky-400 text-white";default:return"bg-gray-400 text-white"}},Oe=()=>{if(console.log("Print Debug:",{contestants:N.length,judges:g.length,criteria:b.length,scores:_.length,contestantsData:N}),N.length===0){alert("No contestants data available. Please select an event and round first.");return}if(g.length===0){alert("No judges data available. Please ensure judges are assigned to this event.");return}const t=N.map(n=>{console.log("Processing contestant:",n);const l=g.map(i=>{const p=_.filter(j=>j.judge_id===i.id&&j.contestant_id===n.id);let w=0;return b.forEach(j=>{const u=p.find(f=>f.criteria_id===j.id);if(u&&u.score){const f=parseInt(j.percentage)/100;w+=parseFloat(u.score)/10*f*100}}),{judgeId:i.id,judgeName:i.name,percentage:w}}),d=l.length>0?l.reduce((i,p)=>i+p.percentage,0)/l.length:0;return{id:n.id,sequence_no:n.sequence_no||0,name:n.contestant_name||n.name||"Unknown",judgeData:l,avgPercentage:d}});console.log("General Data:",t),g.forEach(n=>{const l=[...t].sort((w,j)=>{const u=w.judgeData.find(y=>y.judgeId===n.id)?.percentage||0;return(j.judgeData.find(y=>y.judgeId===n.id)?.percentage||0)-u});let d=1,i=null,p=0;l.forEach((w,j)=>{const u=w.judgeData.find(y=>y.judgeId===n.id)?.percentage||0;i!==null&&u<i?(d+=p,p=1):i===u?p++:p=1,i=u;const f=w.judgeData.find(y=>y.judgeId===n.id);f&&(f.rank=d)})});const o=[...t].sort((n,l)=>l.avgPercentage-n.avgPercentage);let a=1,r=null,s=0;o.forEach((n,l)=>{r!==null&&n.avgPercentage<r?(a+=s,s=1):r===n.avgPercentage?s++:s=1,r=n.avgPercentage,n.overallRank=a}),t.sort((n,l)=>n.overallRank-l.overallRank),ge(t),G(!0)},Le=t=>{const o=b.find(i=>i.id===t);if(!o)return;const a=N.map(i=>{const p=g.map(u=>{const f=_.find(R=>R.judge_id===u.id&&R.contestant_id===i.id&&R.criteria_id===o.id),y=f?parseFloat(f.score||0):0,A=parseInt(o.percentage)/100,P=y/10*A*100;return{judgeId:u.id,judgeName:u.name,score:y,percentage:P}}),w=p.reduce((u,f)=>u+f.percentage,0),j=p.length>0?w/p.length:0;return{id:i.id,sequence_no:i.sequence_no,name:i.contestant_name,judgeData:p,avgPercentage:j}});g.forEach(i=>{const p=[...a].sort((f,y)=>{const A=f.judgeData.find(R=>R.judgeId===i.id)?.percentage||0;return(y.judgeData.find(R=>R.judgeId===i.id)?.percentage||0)-A});let w=1,j=null,u=0;p.forEach(f=>{const y=f.judgeData.find(P=>P.judgeId===i.id)?.percentage||0;j!==null&&y<j?(w+=u,u=1):j===y?u++:u=1,j=y;const A=f.judgeData.find(P=>P.judgeId===i.id);A&&(A.rank=w)})});const r=[...a].sort((i,p)=>p.avgPercentage-i.avgPercentage);let s=1,n=null,l=0;r.forEach(i=>{n!==null&&i.avgPercentage<n?(s+=l,l=1):n===i.avgPercentage?l++:l=1,n=i.avgPercentage,i.overallRank=s}),a.sort((i,p)=>i.sequence_no-p.sequence_no);const d={criteriaId:o.id,criteriaName:o.criteria_name||o.criteria_desc,percentage:o.percentage,contestants:a};me([d]),V(!0),q(!1)},Ie=()=>{v.find(s=>s.id==m)?.name,k.find(s=>s.round_no==c)?.round_no;let t=`General Tabulated Result

`;t+="NO,CONTESTANT,",g.forEach(s=>{t+=`${s.name} % SCORE,${s.name} RANK,`}),t+=`AVG PERCENTAGE,RANK
`,C.forEach((s,n)=>{t+=`${n+1},${s.name},`,s.judgeData.forEach(l=>{t+=`${l.percentage.toFixed(2)}%,${l.rank},`}),t+=`${s.avgPercentage.toFixed(2)}%,${s.overallRank}
`});const o=new Blob([t],{type:"text/csv"}),a=window.URL.createObjectURL(o),r=document.createElement("a");r.href=a,r.download="General_Tabulated_Result.csv",r.click(),window.URL.revokeObjectURL(a)},Ge=()=>{v.find(s=>s.id==m)?.name,k.find(s=>s.round_no==c)?.round_no;let t=`
            <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
            <head>
                <meta charset="UTF-8">
                <!--[if gte mso 9]>
                <xml>
                    <x:ExcelWorkbook>
                        <x:ExcelWorksheets>
                            <x:ExcelWorksheet>
                                <x:Name>General Results</x:Name>
                                <x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions>
                            </x:ExcelWorksheet>
                        </x:ExcelWorksheets>
                    </x:ExcelWorkbook>
                </xml>
                <![endif]-->
            </head>
            <body>
                <table>
                    <tr><td colspan="${2+g.length*2+2}"><b>General Tabulated Result</b></td></tr>
                    <tr></tr>
                    <tr>
                        <th>NO</th>
                        <th>CONTESTANT</th>
                        ${g.map(s=>`<th>${s.name} % SCORE</th><th>${s.name} RANK</th>`).join("")}
                        <th>AVG PERCENTAGE</th>
                        <th>RANK</th>
                    </tr>
                    ${C.map((s,n)=>`
                        <tr>
                            <td>${n+1}</td>
                            <td>${s.name}</td>
                            ${s.judgeData.map(l=>`<td>${l.percentage.toFixed(2)}%</td><td>${l.rank}</td>`).join("")}
                            <td>${s.avgPercentage.toFixed(2)}%</td>
                            <td>${s.overallRank}</td>
                        </tr>
                    `).join("")}
                </table>
            </body>
            </html>
        `;const o=new Blob([t],{type:"application/vnd.ms-excel"}),a=window.URL.createObjectURL(o),r=document.createElement("a");r.href=a,r.download="General_Tabulated_Result.xls",r.click(),window.URL.revokeObjectURL(a)},Ue=()=>{v.find(a=>a.id==m)?.name,k.find(a=>a.round_no==c)?.round_no;const t=le,o=window.open("","_blank");o.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>General Tabulated Result</title>
                <style>
                    @media print {
                        @page {
                            size: landscape;
                            margin: 0.5in;
                        }
                        * {
                            -webkit-print-color-adjust: exact !important;
                            print-color-adjust: exact !important;
                            color-adjust: exact !important;
                        }
                        body {
                            page-break-inside: avoid;
                        }
                        table {
                            page-break-inside: auto;
                        }
                        tr {
                            page-break-inside: avoid;
                            page-break-after: auto;
                        }
                        .certification-section {
                            page-break-inside: avoid !important;
                            page-break-before: avoid !important;
                        }
                        .signature-section {
                            page-break-inside: avoid !important;
                            page-break-before: avoid !important;
                        }
                    }
                    body {
                        font-family: Arial, sans-serif;
                        padding: 20px;
                        max-width: 100%;
                        position: relative;
                    }
                    .logo {
                        float: left;
                        margin-right: 20px;
                        margin-bottom: 20px;
                        width: 80px;
                        height: auto;
                    }
                    .header-content {
                        text-align: center;
                        margin-bottom: 30px;
                        overflow: hidden;
                    }
                    h1 {
                        text-align: center;
                        font-size: 20px;
                        margin: 0;
                        padding-top: 10px;
                    }
                    table {
                        width: 100%;
                        border-collapse: collapse;
                        margin-top: 10px;
                        font-size: 11px;
                    }
                    th, td {
                        border: 1px solid #000;
                        padding: 4px 6px;
                        text-align: center;
                    }
                    th {
                        border: 1px solid #000;
                        padding: 8px;
                        text-align: center;
                        font-weight: bold;
                    }
                    tr:nth-child(even) {
                        background-color: #f9f9f9;
                    }
                </style>
            </head>
            <body>
                <img src="${t}" alt="Logo" class="logo" />
                <div class="header-content">
                    <h1>GENERAL TABULATED RESULT</h1>
                </div>
                <div style="clear: both;"></div>
                
                <table>
                    <thead>
                        <tr>
                            <th rowspan="2">NO</th>
                            <th rowspan="2">CONTESTANT</th>
                            ${g.map(a=>`
                                <th colspan="2">${a.name.toUpperCase()}</th>
                            `).join("")}
                            <th rowspan="2">AVG<br/>PERCENTAGE</th>
                            <th rowspan="2">FINAL RANK</th>
                        </tr>
                        <tr>
                            ${g.map(()=>`
                                <th>% SCORE</th>
                                <th>RANK</th>
                            `).join("")}
                        </tr>
                    </thead>
                    <tbody>
                        ${C.length===0?`
                            <tr>
                                <td colspan="${2+g.length*2+2}" style="text-align: center; padding: 20px;">
                                    No data available
                                </td>
                            </tr>
                        `:C.map((a,r)=>{let s="#d1d5db";return a.overallRank===1?s="#ef4444":a.overallRank===2?s="#22c55e":a.overallRank===3?s="#3b82f6":a.overallRank===4&&(s="#38bdf8"),`
                            <tr>
                                <td style="background-color: ${s}; color: white; font-weight: bold;">${a.sequence_no}</td>
                                <td style="text-align: left; padding-left: 10px;"><strong>${a.name}</strong></td>
                                ${a.judgeData.map(n=>`
                                    <td>${n.percentage.toFixed(2)}%</td>
                                    <td><strong>${n.rank}</strong></td>
                                `).join("")}
                                <td><strong>${a.avgPercentage.toFixed(2)}%</strong></td>
                                <td style="background-color: ${s}; color: white; font-weight: bold;">
                                    ${a.overallRank}
                                </td>
                            </tr>
                            `}).join("")}
                    </tbody>
                </table>
                
                <!-- Certification Statement -->
                <div class="certification-section" style="margin-top: 20px; text-align: center; font-style: italic; font-size: 12px;">
                    <p style="margin: 5px 0;">We hereby certify that the above results are true and correct.</p>
                </div>
                
                <!-- Signature Section -->
                <div class="signature-section" style="margin-top: 20px; display: flex; justify-content: space-around; flex-wrap: wrap;">
                    ${g.map(a=>`
                        <div style="text-align: center; margin: 10px; min-width: 180px;">
                            <div style="border-bottom: 2px solid #000; width: 200px; margin: 0 auto 8px auto; height: 40px;"></div>
                            <div style="font-weight: bold; font-size: 12px;">${a.name.toUpperCase()}</div>
                            <div style="font-size: 10px; color: #666;">Signature</div>
                        </div>
                    `).join("")}
                </div>
                
                <script>
                    window.onload = function() {
                        window.print();
                    }
                <\/script>
            </body>
            </html>
        `),o.document.close()},Me=()=>{v.find(a=>a.id==m)?.name,k.find(a=>a.round_no==c)?.round_no;const t=le,o=window.open("","_blank");o.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Special Awards</title>
                <style>
                    @media print {
                        @page {
                            size: landscape;
                            margin: 0.5in;
                        }
                        * {
                            -webkit-print-color-adjust: exact !important;
                            print-color-adjust: exact !important;
                            color-adjust: exact !important;
                        }
                        body {
                            page-break-inside: avoid;
                        }
                        table {
                            page-break-inside: auto;
                        }
                        tr {
                            page-break-inside: avoid;
                            page-break-after: auto;
                        }
                        .certification-section {
                            page-break-inside: avoid !important;
                            page-break-before: avoid !important;
                        }
                        .signature-section {
                            page-break-inside: avoid !important;
                            page-break-before: avoid !important;
                        }
                    }
                    body {
                        font-family: Arial, sans-serif;
                        padding: 20px;
                        max-width: 100%;
                        position: relative;
                    }
                    .logo {
                        float: left;
                        margin-right: 20px;
                        margin-bottom: 20px;
                        width: 80px;
                        height: auto;
                    }
                    .header-content {
                        text-align: center;
                        margin-bottom: 30px;
                        overflow: hidden;
                    }
                    h1 {
                        text-align: center;
                        font-size: 20px;
                        margin: 0;
                        padding-top: 10px;
                    }
                    h2 {
                        text-align: center;
                        font-size: 18px;
                        margin-top: 30px;
                        margin-bottom: 15px;
                        font-weight: bold;
                    }
                    table {
                        width: 100%;
                        border-collapse: collapse;
                        margin-top: 10px;
                        font-size: 11px;
                    }
                    th, td {
                        border: 1px solid #000;
                        padding: 4px 6px;
                        text-align: center;
                    }
                    th {
                        border: 1px solid #000;
                        padding: 8px;
                        text-align: center;
                        font-weight: bold;
                    }
                    tr:nth-child(even) {
                        background-color: #f9f9f9;
                    }
                </style>
            </head>
            <body>
                <img src="${t}" alt="Logo" class="logo" />
                <div class="header-content">
                    <h1>SPECIAL AWARDS</h1>
                </div>
                <div style="clear: both;"></div>
                
                ${U.map(a=>`
                    <h2 style="text-align: center; margin: 20px 0 15px 0; font-size: 16px;">Best in ${a.criteriaName}</h2>
                    <table>
                        <thead>
                            <tr>
                                <th rowspan="2">NO</th>
                                <th rowspan="2">CONTESTANT</th>
                                ${g.map(r=>`
                                    <th colspan="2">${r.name.toUpperCase()}</th>
                                `).join("")}
                                <th rowspan="2">AVG<br/>PERCENTAGE</th>
                                <th rowspan="2">FINAL RANK</th>
                            </tr>
                            <tr>
                                ${g.map(()=>`
                                    <th>% SCORE</th>
                                    <th>RANK</th>
                                `).join("")}
                            </tr>
                        </thead>
                        <tbody>
                            ${a.contestants.map(r=>{let s="",n="";return r.overallRank===1?(s="#ef4444",n=`background-color: ${s}; color: white; font-weight: bold;`):n="font-weight: bold;",`
                                <tr>
                                    <td style="${r.overallRank===1?n:"font-weight: bold;"}">${r.sequence_no}</td>
                                    <td style="text-align: left; padding-left: 10px;"><strong>${r.name}</strong></td>
                                    ${r.judgeData.map(l=>`
                                        <td>${l.percentage.toFixed(2)}%</td>
                                        <td><strong>${l.rank}</strong></td>
                                    `).join("")}
                                    <td><strong>${r.avgPercentage.toFixed(2)}%</strong></td>
                                    <td style="${n}">
                                        ${r.overallRank}
                                    </td>
                                </tr>
                                `}).join("")}
                        </tbody>
                    </table>
                `).join("")}
                
                <script>
                    window.onload = function() {
                        window.print();
                    }
                <\/script>
            </body>
            </html>
        `),o.document.close()},de=h.useMemo(()=>{if(Q)return v;const t=new Date;return t.setHours(0,0,0,0),v.filter(o=>{const a=new Date(o.event_start),r=new Date(o.event_end);return a.setHours(0,0,0,0),r.setHours(0,0,0,0),a>=t||r>=t})},[v,Q]);return e.jsxs("div",{className:"h-screen flex flex-col overflow-hidden",children:[e.jsx("div",{className:"flex-shrink-0 px-4 py-6 bg-gray-50",children:e.jsxs("div",{className:"bg-white rounded-lg shadow-md p-6",children:[e.jsxs("div",{className:"mb-4 flex items-center justify-between",children:[e.jsxs("label",{className:"flex items-center cursor-pointer",children:[e.jsx("input",{type:"checkbox",checked:Q,onChange:t=>fe(t.target.checked),className:"w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"}),e.jsx("span",{className:"ml-2 text-sm font-medium text-gray-700",children:"Show past events"})]}),ye.total>0&&e.jsxs("span",{className:"text-sm text-gray-500",children:["Showing ",de.length," of ",v.length," events"]})]}),e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-4",children:[e.jsxs("div",{children:[e.jsxs("label",{className:"block text-sm font-medium text-gray-700 mb-2",children:[e.jsx(te,{className:"w-4 h-4 inline mr-2"}),"Select Event"]}),e.jsxs("select",{value:m||"",onChange:t=>{I(t.target.value),S(null)},className:"w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500",children:[e.jsx("option",{value:"",children:"-- Select Event --"}),de.map(t=>e.jsx("option",{value:t.id,children:t.event_name},t.id))]})]}),e.jsxs("div",{children:[e.jsxs("label",{className:"block text-sm font-medium text-gray-700 mb-2",children:[e.jsx(te,{className:"w-4 h-4 inline mr-2"}),"Select Round"]}),e.jsxs("select",{value:c||"",onChange:t=>S(t.target.value),className:"w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500",disabled:!m,children:[e.jsx("option",{value:"",children:"-- Select Round --"}),k.map(t=>e.jsxs("option",{value:t.round_no,children:["Round ",t.round_no,t.is_active?" (Active)":""]},t.id))]})]})]}),m&&c&&e.jsxs("div",{className:"mt-4 flex gap-4",children:[e.jsxs("button",{onClick:()=>Z(m,c),className:"px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors flex items-center",children:[e.jsx(W,{className:"w-4 h-4 mr-2"}),"Refresh Data"]}),e.jsxs("button",{onClick:Oe,className:"px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors flex items-center",children:[e.jsx(ae,{className:"w-4 h-4 mr-2"}),"Print General Tabulated Result"]}),e.jsxs("div",{className:"relative",ref:Y,children:[e.jsxs("button",{onClick:()=>q(!se),className:"px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors flex items-center",children:[e.jsx(ce,{className:"w-4 h-4 mr-2"}),"Special Awards",e.jsx(We,{className:"w-4 h-4 ml-2"})]}),se&&b.length>0&&e.jsx("div",{className:"absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50 min-w-[250px] max-h-[300px] overflow-y-auto",children:b.map(t=>e.jsx("button",{onClick:()=>Le(t.id),className:"w-full text-left px-4 py-2 hover:bg-slate-50 transition-colors border-b border-gray-200 last:border-b-0",children:e.jsx("div",{className:"font-medium text-gray-800",children:t.criteria_name||t.criteria_desc})},t.id))})]}),c>1&&e.jsxs("button",{onClick:()=>X(!0),className:"px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors flex items-center",children:[e.jsx(W,{className:"w-4 h-4 mr-2"}),"Import Scores"]})]})]})}),e.jsxs("div",{className:"flex-1 overflow-y-auto px-4 pb-6 bg-gray-50",children:[$&&e.jsx("div",{className:"flex justify-center items-center h-64",children:e.jsx("p",{className:"text-gray-600 text-lg",children:"Loading data..."})}),!$&&m&&c&&g.length>0&&e.jsx("div",{className:"space-y-8 py-4",children:g.map(t=>{const o=Fe(t.id);return e.jsxs("div",{className:"bg-white rounded-lg shadow overflow-hidden border border-gray-300",children:[e.jsxs("div",{className:"bg-white px-6 py-3 flex items-center justify-between border-b border-gray-300",children:[e.jsx("h2",{className:"text-xl font-bold text-gray-800",children:t.name}),e.jsxs("button",{onClick:()=>_e(t.id,t.name),className:"bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors",title:"Notify judge to enter scores",children:[e.jsx("svg",{className:"w-5 h-5",fill:"currentColor",viewBox:"0 0 20 20",children:e.jsx("path",{d:"M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"})}),"Notify"]})]}),e.jsx("div",{className:"overflow-x-auto",children:e.jsxs("table",{className:"w-full border-collapse",children:[e.jsx("thead",{children:e.jsxs("tr",{className:"border-b-2 border-gray-800",children:[e.jsx("th",{className:"px-4 py-3 text-left text-sm font-bold text-gray-900 uppercase border-r border-gray-300",children:"No"}),e.jsx("th",{className:"px-4 py-3 text-left text-sm font-bold text-gray-900 uppercase border-r border-gray-300",children:"Contestant"}),b.map(a=>e.jsxs("th",{className:"px-4 py-3 text-center text-sm font-bold text-gray-900 uppercase border-r border-gray-300",children:[e.jsx("div",{children:a.criteria_desc}),e.jsxs("div",{className:"text-xs text-gray-600 font-normal normal-case mt-1",children:["(",a.percentage,"%)"]})]},a.id)),e.jsx("th",{className:"px-4 py-3 text-center text-sm font-bold text-gray-900 uppercase border-r border-gray-300",children:"Total Score"}),e.jsx("th",{className:"px-4 py-3 text-center text-sm font-bold text-gray-900 uppercase border-r border-gray-300",children:"Total Percentage"}),e.jsx("th",{className:"px-4 py-3 text-center text-sm font-bold text-gray-900 uppercase",children:"Rank"})]})}),e.jsx("tbody",{children:o.map(a=>e.jsxs("tr",{className:"border-b border-gray-300 hover:bg-gray-50",children:[e.jsx("td",{className:"px-4 py-3 border-r border-gray-300",children:e.jsx("div",{className:"font-bold text-gray-900 flex items-center gap-2",children:e.jsx("span",{className:"text-black-500",children:a.sequence_no})})}),e.jsx("td",{className:"px-4 py-3 border-r border-gray-300",children:e.jsx("div",{className:"font-semibold text-gray-900 flex items-center gap-2",children:e.jsx("span",{children:a.name})})}),b.map(r=>{const s=Ce(t.id,a.id,r.id),n=parseFloat(s)>0,l=J?.judgeId===t.id&&J?.contestantId===a.id&&J?.criteriaId===r.id;return e.jsx("td",{className:`px-4 py-3 text-center border-r border-gray-300 cursor-pointer hover:bg-blue-50 ${n?"bg-yellow-300":""} ${l?"bg-blue-100":""}`,onClick:()=>!l&&Ee(t.id,a.id,r.id,s),children:l?e.jsx("input",{type:"text",value:oe,onChange:Re,onBlur:ie,onKeyDown:d=>$e(d,t.id,a.id,r.id),className:"w-16 px-2 py-1 text-center border border-blue-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-500",autoFocus:!0,placeholder:"0-10"}):e.jsx("span",{className:"text-gray-900 font-medium",children:s})},r.id)}),e.jsx("td",{className:"px-4 py-3 text-center border-r border-gray-300",children:e.jsxs("span",{className:"font-bold text-gray-900",children:[a.totalScore.toFixed(2),"%"]})}),e.jsx("td",{className:"px-4 py-3 text-center border-r border-gray-300",children:e.jsxs("span",{className:"font-bold text-gray-900",children:[a.percentage.toFixed(2),"%"]})}),e.jsx("td",{className:`px-4 py-3 text-center ${De(a.rank)}`,children:e.jsx("div",{className:"flex items-center justify-center",children:e.jsx("span",{className:"text-sm font-bold flex items-center gap-1",children:e.jsx("span",{children:a.rank})})})})]},a.id))})]})})]},t.id)})}),!$&&m&&c&&g.length===0&&e.jsxs("div",{className:"bg-white rounded-lg shadow-md p-12 text-center",children:[e.jsx("div",{className:"text-gray-400 mb-4",children:e.jsx(ce,{className:"w-16 h-16 mx-auto"})}),e.jsx("h3",{className:"text-xl font-semibold text-gray-700 mb-2",children:"No Data Available"}),e.jsx("p",{className:"text-gray-600",children:"No judges or scores found for the selected event and round."})]}),!$&&(!m||!c)&&e.jsxs("div",{className:"bg-white rounded-lg shadow-md p-12 text-center",children:[e.jsx("div",{className:"text-gray-400 mb-4",children:e.jsx(te,{className:"w-16 h-16 mx-auto"})}),e.jsx("h3",{className:"text-xl font-semibold text-gray-700 mb-2",children:"Select Event and Round"}),e.jsx("p",{className:"text-gray-600",children:"Please select an event and round to view the score tables and rankings."})]})]}),O&&e.jsx("div",{className:"fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4",children:e.jsxs("div",{className:"bg-white rounded-lg shadow-xl max-w-7xl w-full max-h-[90vh] overflow-hidden flex flex-col",children:[e.jsxs("div",{className:"flex items-center justify-between px-6 py-4 border-b border-gray-200",children:[e.jsx("h2",{className:"text-2xl font-bold text-gray-800",children:"General Tabulated Result"}),e.jsx("button",{onClick:()=>G(!1),className:"text-gray-500 hover:text-gray-700 transition-colors",children:e.jsx(re,{className:"w-6 h-6"})})]}),e.jsxs("div",{className:"flex-1 overflow-y-auto px-6 py-4",children:[e.jsx("div",{className:"mb-4 text-center",children:e.jsx("h3",{className:"text-lg font-semibold text-gray-700",children:v.find(t=>t.id==m)?.event_name||"Event"})}),e.jsx("div",{className:"overflow-x-auto",children:e.jsxs("table",{className:"w-full border-collapse border border-gray-300",children:[e.jsxs("thead",{children:[e.jsxs("tr",{className:"bg-gray-800 text-white",children:[e.jsx("th",{rowSpan:"2",className:"border border-gray-300 px-4 py-2",children:"NO"}),e.jsx("th",{rowSpan:"2",className:"border border-gray-300 px-4 py-2",children:"CONTESTANT"}),g.map(t=>e.jsx("th",{colSpan:"2",className:"border border-gray-300 px-4 py-2",children:t.name.toUpperCase()},t.id)),e.jsxs("th",{rowSpan:"2",className:"border border-gray-300 px-4 py-2",children:["AVG",e.jsx("br",{}),"PERCENTAGE"]}),e.jsx("th",{rowSpan:"2",className:"border border-gray-300 px-4 py-2",children:"RANK"})]}),e.jsx("tr",{className:"bg-gray-700 text-white",children:g.map(t=>e.jsxs(z.Fragment,{children:[e.jsx("th",{className:"border border-gray-300 px-4 py-2",children:"% SCORE"}),e.jsx("th",{className:"border border-gray-300 px-4 py-2",children:"RANK"})]},t.id))})]}),e.jsx("tbody",{children:C.length===0?e.jsx("tr",{children:e.jsx("td",{colSpan:2+g.length*2+2,className:"border border-gray-300 px-4 py-8 text-center text-gray-500",children:"No data available"})}):C.map((t,o)=>{let a="bg-gray-400";return t.overallRank===1?a="bg-red-500":t.overallRank===2?a="bg-green-500":t.overallRank===3?a="bg-blue-500":t.overallRank===4&&(a="bg-sky-400"),e.jsxs("tr",{className:o%2===0?"bg-white":"bg-gray-50",children:[e.jsx("td",{className:`border border-gray-300 px-4 py-2 text-center font-bold text-white ${a}`,children:t.sequence_no}),e.jsx("td",{className:"border border-gray-300 px-4 py-2 text-left font-semibold",children:t.name}),t.judgeData.map(r=>e.jsxs(z.Fragment,{children:[e.jsxs("td",{className:"border border-gray-300 px-4 py-2 text-center",children:[r.percentage.toFixed(2),"%"]}),e.jsx("td",{className:"border border-gray-300 px-4 py-2 text-center font-bold",children:r.rank})]},r.judgeId)),e.jsxs("td",{className:"border border-gray-300 px-4 py-2 text-center font-bold",children:[t.avgPercentage.toFixed(2),"%"]}),e.jsx("td",{className:`border border-gray-300 px-4 py-2 text-center font-bold text-white ${a}`,children:t.overallRank})]},t.id)})})]})})]}),e.jsxs("div",{className:"flex items-center justify-end gap-4 px-6 py-4 border-t border-gray-200 bg-gray-50",children:[e.jsxs("button",{onClick:Ie,className:"px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2",children:[e.jsx(xe,{className:"w-4 h-4"}),"Export to CSV"]}),e.jsxs("button",{onClick:Ge,className:"px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2",children:[e.jsx(he,{className:"w-4 h-4"}),"Export to Excel"]}),e.jsxs("button",{onClick:Ue,className:"px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors flex items-center gap-2",children:[e.jsx(ae,{className:"w-4 h-4"}),"Print"]})]})]})}),pe&&e.jsx("div",{className:"fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4",children:e.jsxs("div",{className:"bg-white rounded-lg shadow-xl max-w-7xl w-full max-h-[90vh] overflow-hidden flex flex-col",children:[e.jsxs("div",{className:"flex items-center justify-between px-6 py-4 border-b border-gray-200",children:[e.jsx("h2",{className:"text-2xl font-bold text-gray-800",children:"Special Awards"}),e.jsx("button",{onClick:()=>V(!1),className:"text-gray-500 hover:text-gray-700 transition-colors",children:e.jsx(re,{className:"w-6 h-6"})})]}),e.jsx("div",{className:"flex-1 overflow-y-auto px-6 py-4",children:U.map((t,o)=>e.jsxs("div",{className:o>0?"mt-8":"",children:[e.jsxs("h3",{className:"text-lg font-bold text-gray-800 mb-3 flex items-center",children:["Best in ",t.criteriaName]}),e.jsx("div",{className:"overflow-x-auto",children:e.jsxs("table",{className:"w-full border-collapse border border-white-300",children:[e.jsxs("thead",{children:[e.jsxs("tr",{className:"bg-white-800 text-black",children:[e.jsx("th",{rowSpan:"2",className:"border border-gray-300 px-4 py-2",children:"NO"}),e.jsx("th",{rowSpan:"2",className:"border border-gray-300 px-4 py-2",children:"CONTESTANT"}),g.map(a=>e.jsx("th",{colSpan:"2",className:"border border-gray-300 px-4 py-2",children:a.name.toUpperCase()},a.id)),e.jsx("th",{rowSpan:"2",className:"border border-white-300 px-4 py-2",children:"AVG SCORE"}),e.jsx("th",{rowSpan:"2",className:"border border-white-300 px-4 py-2",children:"FINAL RANK"})]}),e.jsx("tr",{className:"bg-white-700 text-black",children:g.map(a=>e.jsxs(z.Fragment,{children:[e.jsx("th",{className:"border border-gray-300 px-4 py-2",children:"% SCORE"}),e.jsx("th",{className:"border border-gray-300 px-4 py-2",children:"RANK"})]},a.id))})]}),e.jsx("tbody",{children:t.contestants.map(a=>{let r="bg-white-400";return a.overallRank===1?r="bg-red-500":a.overallRank===2||a.overallRank===3?r="bg-white-500":a.overallRank===4&&(r="bg-white-400"),e.jsxs("tr",{className:"hover:bg-gray-50",children:[e.jsx("td",{className:`border border-white-300 px-4 py-2 text-center font-bold text-black ${r}`,children:a.sequence_no}),e.jsx("td",{className:"border border-white-300 px-4 py-2 text-left font-semibold",children:a.name}),a.judgeData.map(s=>e.jsxs(z.Fragment,{children:[e.jsxs("td",{className:"border border-white-300 px-4 py-2 text-center",children:[s.percentage.toFixed(2),"%"]}),e.jsx("td",{className:"border border-white-300 px-4 py-2 text-center font-bold",children:s.rank})]},s.judgeId)),e.jsxs("td",{className:"border border-white-300 px-4 py-2 text-center font-bold",children:[a.avgPercentage.toFixed(2),"%"]}),e.jsx("td",{className:`border border-white-300 px-4 py-2 text-center font-bold text-black ${r}`,children:a.overallRank})]},a.id)})})]})})]},t.criteriaId))}),e.jsxs("div",{className:"flex justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50",children:[e.jsx("button",{onClick:()=>V(!1),className:"px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors",children:"Close"}),e.jsxs("button",{onClick:()=>{const t=v.find(l=>l.id==m)?.name||"Event",o=k.find(l=>l.round_no==c)?.round_no||c,a=U.map(l=>{const d=`
${l.criteriaName} (${l.percentage}%)
NO,CONTESTANT,${g.map(p=>`${p.name} % SCORE,${p.name} RANK`).join(",")},AVG PERCENTAGE,FINAL RANK
`,i=l.contestants.map(p=>`${p.sequence_no},${p.name},${p.judgeData.map(w=>`${w.percentage.toFixed(2)}%,${w.rank}`).join(",")},${p.avgPercentage.toFixed(2)}%,${p.overallRank}`).join(`
`);return d+i}).join(`

`),r=new Blob([`Special Awards - ${t} - Round ${o}
${a}`],{type:"text/csv"}),s=window.URL.createObjectURL(r),n=document.createElement("a");n.href=s,n.download=`Special_Awards_${t}_Round_${o}.csv`,n.click(),window.URL.revokeObjectURL(s)},className:"px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2",children:[e.jsx(xe,{className:"w-4 h-4"}),"Export CSV"]}),e.jsxs("button",{onClick:()=>{const t=v.find(l=>l.id==m)?.name||"Event",o=k.find(l=>l.round_no==c)?.round_no||c;let a=`
                                        <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
                                        <head>
                                            <meta charset="UTF-8">
                                            <!--[if gte mso 9]>
                                            <xml>
                                                <x:ExcelWorkbook>
                                                    <x:ExcelWorksheets>
                                                        <x:ExcelWorksheet>
                                                            <x:Name>Special Awards</x:Name>
                                                            <x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions>
                                                        </x:ExcelWorksheet>
                                                    </x:ExcelWorksheets>
                                                </x:ExcelWorkbook>
                                            </xml>
                                            <![endif]-->
                                        </head>
                                        <body>
                                            ${U.map(l=>`
                                                <table>
                                                    <tr><td colspan="${2+g.length*2+2}"><b>${l.criteriaName} (${l.percentage}%)</b></td></tr>
                                                    <tr>
                                                        <th>NO</th>
                                                        <th>CONTESTANT</th>
                                                        ${g.map(d=>`<th>${d.name} % SCORE</th><th>${d.name} RANK</th>`).join("")}
                                                        <th>AVG PERCENTAGE</th>
                                                        <th>FINAL RANK</th>
                                                    </tr>
                                                    ${l.contestants.map(d=>`
                                                        <tr>
                                                            <td>${d.sequence_no}</td>
                                                            <td>${d.name}</td>
                                                            ${d.judgeData.map(i=>`<td>${i.percentage.toFixed(2)}%</td><td>${i.rank}</td>`).join("")}
                                                            <td>${d.avgPercentage.toFixed(2)}%</td>
                                                            <td>${d.overallRank}</td>
                                                        </tr>
                                                    `).join("")}
                                                </table>
                                                <br/>
                                            `).join("")}
                                        </body>
                                        </html>
                                    `;const r=new Blob([a],{type:"application/vnd.ms-excel"}),s=window.URL.createObjectURL(r),n=document.createElement("a");n.href=s,n.download=`Special_Awards_${t}_Round_${o}.xls`,n.click(),window.URL.revokeObjectURL(s)},className:"px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2",children:[e.jsx(he,{className:"w-4 h-4"}),"Export Excel"]}),e.jsxs("button",{onClick:Me,className:"px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors flex items-center gap-2",children:[e.jsx(ae,{className:"w-4 h-4"}),"Print"]})]})]})}),e.jsx(He,{showModal:ue,setShowModal:X,rounds:k,selectedRound:c,criteria:b,contestants:N,importingScores:be,handleImportScores:Pe})]})};export{Ze as default};
