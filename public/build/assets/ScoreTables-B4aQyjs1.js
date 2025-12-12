import{r as g,j as e,R as D,a as Y}from"./app-Bx3wU7Nx.js";import{a as H}from"./printLogo-Dw7oCvxT.js";import{c as A,F as z,R as Ae,C as Ce}from"./refresh-cw-Nucg_RDn.js";/**
 * @license lucide-react v0.552.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Pe=[["path",{d:"m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526",key:"1yiouv"}],["circle",{cx:"12",cy:"8",r:"6",key:"1vp47v"}]],X=A("award",Pe);/**
 * @license lucide-react v0.552.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Te=[["path",{d:"M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z",key:"1oefj6"}],["path",{d:"M14 2v5a1 1 0 0 0 1 1h5",key:"wfsgrz"}],["path",{d:"M12 18v-6",key:"17g6i2"}],["path",{d:"m9 15 3 3 3-3",key:"1npd3o"}]],Q=A("file-down",Te);/**
 * @license lucide-react v0.552.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Fe=[["path",{d:"M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z",key:"1oefj6"}],["path",{d:"M14 2v5a1 1 0 0 0 1 1h5",key:"wfsgrz"}],["path",{d:"M8 13h2",key:"yr2amv"}],["path",{d:"M14 13h2",key:"un5t4a"}],["path",{d:"M8 17h2",key:"2yhykz"}],["path",{d:"M14 17h2",key:"10kma7"}]],Z=A("file-spreadsheet",Fe);/**
 * @license lucide-react v0.552.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const De=[["path",{d:"M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2",key:"143wyd"}],["path",{d:"M6 9V3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v6",key:"1itne7"}],["rect",{x:"6",y:"14",width:"12",height:"8",rx:"1",key:"1ue0tg"}]],B=A("printer",De);/**
 * @license lucide-react v0.552.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Oe=[["path",{d:"M18 6 6 18",key:"1bl5f8"}],["path",{d:"m6 6 12 12",key:"d8bk6v"}]],ee=A("x",Oe),Ie=()=>{const[v,te]=g.useState([]),[p,re]=g.useState(null),[j,ae]=g.useState([]),[x,C]=g.useState(null),[k,se]=g.useState([]),[h,ne]=g.useState([]),[w,oe]=g.useState([]),[R,O]=g.useState([]),[P,E]=g.useState(!0),[le,M]=g.useState(!1),[_,de]=g.useState([]),[ie,L]=g.useState(!1),[T,ce]=g.useState([]),[K,G]=g.useState(!1),[U,I]=g.useState(null),[V,F]=g.useState(""),W=g.useRef(null);g.useEffect(()=>{he()},[]),g.useEffect(()=>{p&&pe(p)},[p]),g.useEffect(()=>{x&&q(p,x)},[x]),g.useEffect(()=>{if(console.log("🔍 Broadcasting setup check:",{selectedEvent:p,selectedRound:x,hasEcho:!!window.Echo,echoType:window.Echo?.constructor?.name}),p&&x&&window.Echo){const t=`score-updates.${p}.${x}`;console.log("🟡 Attempting to subscribe to:",t);try{const a=window.Echo.private(t).listen(".score.updated",r=>{console.log("🟢 Score update received:",r),r.score&&xe(r.score)});return console.log("✅ Successfully subscribed to channel:",t),()=>{console.log("🔴 Leaving channel:",t),window.Echo.leave(t)}}catch(a){console.error("❌ Failed to subscribe to channel:",a)}}else console.warn("⚠️ Cannot subscribe - missing:",{selectedEvent:!!p,selectedRound:!!x,windowEcho:!!window.Echo})},[p,x]),g.useEffect(()=>{const t=a=>{W.current&&!W.current.contains(a.target)&&G(!1)};return document.addEventListener("mousedown",t),()=>document.removeEventListener("mousedown",t)},[]);const xe=t=>{O(a=>{const r=[...a],n=r.findIndex(o=>o.judge_id===t.judge_id&&o.contestant_id===t.contestant_id&&o.criteria_id===t.criteria_id),s={id:t.tabulation_id,judge_id:t.judge_id,contestant_id:t.contestant_id,criteria_id:t.criteria_id,score:t.score,is_lock:t.is_lock};return n>=0?r[n]=s:r.push(s),console.log("✅ Score updated in state:",s),r})},he=async()=>{try{E(!0);const a=await(await fetch("/getEvents")).json(),r=Array.isArray(a)?a:a?.events||a?.data||[];te(r)}catch(t){console.error("Error fetching events:",t)}finally{E(!1)}},pe=async t=>{try{E(!0);const r=await(await fetch(`/getActiveRounds/${t}`)).json(),n=Array.isArray(r)?r:[];if(ae(n),n.length>0){const s=n.find(o=>o.is_active===1||o.is_active===!0);C(s?s.round_no:n[0].round_no)}}catch(a){console.error("Error fetching rounds:",a)}finally{E(!1)}},q=async(t,a)=>{try{E(!0);const n=await(await fetch(`/get-round-contestants/${t}/${a}`)).json();se(Array.isArray(n)?n:[]);const o=await(await fetch(`/getJudgesByEvent/${t}`)).json();ne(Array.isArray(o)?o:o?.judges||[]);const i=await(await fetch(`/getCriteriaByRound/${t}/${a}`)).json();oe(Array.isArray(i)?i:[]);const c=await(await fetch(`/getScoresByRound/${t}/${a}`)).json();O(Array.isArray(c)?c:[])}catch(r){console.error("Error fetching round data:",r)}finally{E(!1)}},ge=async(t,a)=>{try{(await Y.post("/admin/notify-judge",{judge_id:t,event_id:p,round_no:x,message:"Please enter your scores as soon as possible."})).data.success?alert(`Notification sent to ${a} successfully!`):alert("Failed to send notification. Please try again.")}catch(r){console.error("Error sending notification:",r),console.error("Error response:",r.response?.data),alert(`Failed to send notification: ${r.response?.data?.message||r.message}`)}},me=(t,a,r,n)=>{I({judgeId:t,contestantId:a,criteriaId:r}),F(n==="0.00"?"":n)},be=t=>{const a=t.target.value;(a===""||/^\d*\.?\d*$/.test(a)&&parseFloat(a)<=10)&&F(a)},ue=async(t,a,r)=>{const n=parseFloat(V)||0;if(n<0||n>10){alert("Score must be between 0 and 10");return}try{const s=await Y.post("/admin/update-score",{judge_id:t,contestant_id:a,criteria_id:r,event_id:p,round_no:x,score:n});if(s.data.success){const o={id:s.data.tabulation.id,judge_id:t,contestant_id:a,criteria_id:r,score:n,is_lock:s.data.tabulation.is_lock};O(l=>{const i=l.findIndex(d=>d.judge_id===t&&d.contestant_id===a&&d.criteria_id===r);if(i>=0){const d=[...l];return d[i]=o,d}else return[...l,o]}),I(null),F("")}}catch(s){console.error("Error updating score:",s),alert(`Failed to update score: ${s.response?.data?.message||s.message}`)}},J=()=>{I(null),F("")},fe=(t,a,r,n)=>{t.key==="Enter"?ue(a,r,n):t.key==="Escape"&&J()},ye=(t,a,r)=>{const n=R.find(s=>s.judge_id===t&&s.contestant_id===a&&s.criteria_id===r);return n?parseFloat(n.score||0).toFixed(2):"0.00"},we=(t,a)=>{let r=0;return w.forEach(n=>{const s=R.find(o=>o.judge_id===t&&o.contestant_id===a&&o.criteria_id===n.id);s&&(r+=parseFloat(s.score||0))}),r.toFixed(2)},ve=(t,a)=>{let r=0;return w.forEach(n=>{const s=R.find(o=>o.judge_id===t&&o.contestant_id===a&&o.criteria_id===n.id);if(s){const o=parseInt(n.percentage)/100;r+=parseFloat(s.score||0)/10*o*100}}),r.toFixed(2)},je=t=>{const a=k.map(i=>({id:i.id,name:i.contestant_name,sequence_no:i.sequence_no,totalScore:parseFloat(we(t,i.id)),percentage:parseFloat(ve(t,i.id))})),r=[...a].sort((i,d)=>d.percentage-i.percentage);let n=1,s=null,o=0;r.forEach((i,d)=>{s!==null&&i.percentage<s?(n+=o,o=1):s===i.percentage?o++:o=1,s=i.percentage,i.rank=n});const l={};return r.forEach(i=>{l[i.id]=i.rank}),a.map(i=>({...i,rank:l[i.id]})).sort((i,d)=>i.sequence_no-d.sequence_no)},Ne=t=>{switch(t){case 1:return"bg-red-500 text-white";case 2:return"bg-green-500 text-white";case 3:return"bg-blue-500 text-white";case 4:return"bg-sky-400 text-white";default:return"bg-gray-400 text-white"}},ke=()=>{if(console.log("Print Debug:",{contestants:k.length,judges:h.length,criteria:w.length,scores:R.length,contestantsData:k}),k.length===0){alert("No contestants data available. Please select an event and round first.");return}if(h.length===0){alert("No judges data available. Please ensure judges are assigned to this event.");return}const t=k.map(o=>{console.log("Processing contestant:",o);const l=h.map(d=>{const c=R.filter(y=>y.judge_id===d.id&&y.contestant_id===o.id);let f=0;return w.forEach(y=>{const m=c.find(b=>b.criteria_id===y.id);if(m&&m.score){const b=parseInt(y.percentage)/100;f+=parseFloat(m.score)/10*b*100}}),{judgeId:d.id,judgeName:d.name,percentage:f}}),i=l.length>0?l.reduce((d,c)=>d+c.percentage,0)/l.length:0;return{id:o.id,sequence_no:o.sequence_no||0,name:o.contestant_name||o.name||"Unknown",judgeData:l,avgPercentage:i}});console.log("General Data:",t),h.forEach(o=>{const l=[...t].sort((f,y)=>{const m=f.judgeData.find(u=>u.judgeId===o.id)?.percentage||0;return(y.judgeData.find(u=>u.judgeId===o.id)?.percentage||0)-m});let i=1,d=null,c=0;l.forEach((f,y)=>{const m=f.judgeData.find(u=>u.judgeId===o.id)?.percentage||0;d!==null&&m<d?(i+=c,c=1):d===m?c++:c=1,d=m;const b=f.judgeData.find(u=>u.judgeId===o.id);b&&(b.rank=i)})});const a=[...t].sort((o,l)=>l.avgPercentage-o.avgPercentage);let r=1,n=null,s=0;a.forEach((o,l)=>{n!==null&&o.avgPercentage<n?(r+=s,s=1):n===o.avgPercentage?s++:s=1,n=o.avgPercentage,o.overallRank=r}),t.sort((o,l)=>o.overallRank-l.overallRank),de(t),M(!0)},Re=t=>{const a=w.find(d=>d.id===t);if(!a)return;const r=k.map(d=>{const c=h.map(m=>{const b=R.find(N=>N.judge_id===m.id&&N.contestant_id===d.id&&N.criteria_id===a.id),u=b?parseFloat(b.score||0):0,$=parseInt(a.percentage)/100,S=u/10*$*100;return{judgeId:m.id,judgeName:m.name,score:u,percentage:S}}),f=c.reduce((m,b)=>m+b.percentage,0),y=c.length>0?f/c.length:0;return{id:d.id,sequence_no:d.sequence_no,name:d.contestant_name,judgeData:c,avgPercentage:y}});h.forEach(d=>{const c=[...r].sort((b,u)=>{const $=b.judgeData.find(N=>N.judgeId===d.id)?.percentage||0;return(u.judgeData.find(N=>N.judgeId===d.id)?.percentage||0)-$});let f=1,y=null,m=0;c.forEach(b=>{const u=b.judgeData.find(S=>S.judgeId===d.id)?.percentage||0;y!==null&&u<y?(f+=m,m=1):y===u?m++:m=1,y=u;const $=b.judgeData.find(S=>S.judgeId===d.id);$&&($.rank=f)})});const n=[...r].sort((d,c)=>c.avgPercentage-d.avgPercentage);let s=1,o=null,l=0;n.forEach(d=>{o!==null&&d.avgPercentage<o?(s+=l,l=1):o===d.avgPercentage?l++:l=1,o=d.avgPercentage,d.overallRank=s}),r.sort((d,c)=>d.sequence_no-c.sequence_no);const i={criteriaId:a.id,criteriaName:a.criteria_name||a.criteria_desc,percentage:a.percentage,contestants:r};ce([i]),L(!0),G(!1)},Ee=()=>{v.find(s=>s.id==p)?.name,j.find(s=>s.round_no==x)?.round_no;let t=`General Tabulated Result

`;t+="NO,CONTESTANT,",h.forEach(s=>{t+=`${s.name} % SCORE,${s.name} RANK,`}),t+=`AVG PERCENTAGE,RANK
`,_.forEach((s,o)=>{t+=`${o+1},${s.name},`,s.judgeData.forEach(l=>{t+=`${l.percentage.toFixed(2)}%,${l.rank},`}),t+=`${s.avgPercentage.toFixed(2)}%,${s.overallRank}
`});const a=new Blob([t],{type:"text/csv"}),r=window.URL.createObjectURL(a),n=document.createElement("a");n.href=r,n.download="General_Tabulated_Result.csv",n.click(),window.URL.revokeObjectURL(r)},_e=()=>{v.find(s=>s.id==p)?.name,j.find(s=>s.round_no==x)?.round_no;let t=`
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
                    <tr><td colspan="${2+h.length*2+2}"><b>General Tabulated Result</b></td></tr>
                    <tr></tr>
                    <tr>
                        <th>NO</th>
                        <th>CONTESTANT</th>
                        ${h.map(s=>`<th>${s.name} % SCORE</th><th>${s.name} RANK</th>`).join("")}
                        <th>AVG PERCENTAGE</th>
                        <th>RANK</th>
                    </tr>
                    ${_.map((s,o)=>`
                        <tr>
                            <td>${o+1}</td>
                            <td>${s.name}</td>
                            ${s.judgeData.map(l=>`<td>${l.percentage.toFixed(2)}%</td><td>${l.rank}</td>`).join("")}
                            <td>${s.avgPercentage.toFixed(2)}%</td>
                            <td>${s.overallRank}</td>
                        </tr>
                    `).join("")}
                </table>
            </body>
            </html>
        `;const a=new Blob([t],{type:"application/vnd.ms-excel"}),r=window.URL.createObjectURL(a),n=document.createElement("a");n.href=r,n.download="General_Tabulated_Result.xls",n.click(),window.URL.revokeObjectURL(r)},$e=()=>{v.find(a=>a.id==p)?.name,j.find(a=>a.round_no==x)?.round_no;const t=window.open("","_blank");t.document.write(`
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
                <img src="${H}" alt="Logo" class="logo" />
                <div class="header-content">
                    <h1>GENERAL TABULATED RESULT</h1>
                </div>
                <div style="clear: both;"></div>
                
                <table>
                    <thead>
                        <tr>
                            <th rowspan="2">NO</th>
                            <th rowspan="2">CONTESTANT</th>
                            ${h.map(a=>`
                                <th colspan="2">${a.name.toUpperCase()}</th>
                            `).join("")}
                            <th rowspan="2">AVG<br/>PERCENTAGE</th>
                            <th rowspan="2">FINAL RANK</th>
                        </tr>
                        <tr>
                            ${h.map(()=>`
                                <th>% SCORE</th>
                                <th>RANK</th>
                            `).join("")}
                        </tr>
                    </thead>
                    <tbody>
                        ${_.length===0?`
                            <tr>
                                <td colspan="${2+h.length*2+2}" style="text-align: center; padding: 20px;">
                                    No data available
                                </td>
                            </tr>
                        `:_.map((a,r)=>{let n="#d1d5db";return a.overallRank===1?n="#ef4444":a.overallRank===2?n="#22c55e":a.overallRank===3?n="#3b82f6":a.overallRank===4&&(n="#38bdf8"),`
                            <tr>
                                <td style="background-color: ${n}; color: white; font-weight: bold;">${a.sequence_no}</td>
                                <td style="text-align: left; padding-left: 10px;"><strong>${a.name}</strong></td>
                                ${a.judgeData.map(s=>`
                                    <td>${s.percentage.toFixed(2)}%</td>
                                    <td><strong>${s.rank}</strong></td>
                                `).join("")}
                                <td><strong>${a.avgPercentage.toFixed(2)}%</strong></td>
                                <td style="background-color: ${n}; color: white; font-weight: bold;">
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
                    ${h.map(a=>`
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
        `),t.document.close()},Se=()=>{v.find(a=>a.id==p)?.name,j.find(a=>a.round_no==x)?.round_no;const t=window.open("","_blank");t.document.write(`
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
                <img src="${H}" alt="Logo" class="logo" />
                <div class="header-content">
                    <h1>SPECIAL AWARDS</h1>
                </div>
                <div style="clear: both;"></div>
                
                ${T.map(a=>`
                    <h2 style="text-align: center; margin: 20px 0 15px 0; font-size: 16px;">Best in ${a.criteriaName}</h2>
                    <table>
                        <thead>
                            <tr>
                                <th rowspan="2">NO</th>
                                <th rowspan="2">CONTESTANT</th>
                                ${h.map(r=>`
                                    <th colspan="2">${r.name.toUpperCase()}</th>
                                `).join("")}
                                <th rowspan="2">AVG<br/>PERCENTAGE</th>
                                <th rowspan="2">FINAL RANK</th>
                            </tr>
                            <tr>
                                ${h.map(()=>`
                                    <th>% SCORE</th>
                                    <th>RANK</th>
                                `).join("")}
                            </tr>
                        </thead>
                        <tbody>
                            ${a.contestants.map(r=>{let n="",s="";return r.overallRank===1?(n="#ef4444",s=`background-color: ${n}; color: white; font-weight: bold;`):s="font-weight: bold;",`
                                <tr>
                                    <td style="${r.overallRank===1?s:"font-weight: bold;"}">${r.sequence_no}</td>
                                    <td style="text-align: left; padding-left: 10px;"><strong>${r.name}</strong></td>
                                    ${r.judgeData.map(o=>`
                                        <td>${o.percentage.toFixed(2)}%</td>
                                        <td><strong>${o.rank}</strong></td>
                                    `).join("")}
                                    <td><strong>${r.avgPercentage.toFixed(2)}%</strong></td>
                                    <td style="${s}">
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
        `),t.document.close()};return e.jsxs("div",{className:"h-screen flex flex-col overflow-hidden",children:[e.jsx("div",{className:"flex-shrink-0 px-4 py-6 bg-gray-50",children:e.jsxs("div",{className:"bg-white rounded-lg shadow-md p-6",children:[e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-4",children:[e.jsxs("div",{children:[e.jsxs("label",{className:"block text-sm font-medium text-gray-700 mb-2",children:[e.jsx(z,{className:"w-4 h-4 inline mr-2"}),"Select Event"]}),e.jsxs("select",{value:p||"",onChange:t=>{re(t.target.value),C(null)},className:"w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500",children:[e.jsx("option",{value:"",children:"-- Select Event --"}),v.map(t=>e.jsx("option",{value:t.id,children:t.event_name},t.id))]})]}),e.jsxs("div",{children:[e.jsxs("label",{className:"block text-sm font-medium text-gray-700 mb-2",children:[e.jsx(z,{className:"w-4 h-4 inline mr-2"}),"Select Round"]}),e.jsxs("select",{value:x||"",onChange:t=>C(t.target.value),className:"w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500",disabled:!p,children:[e.jsx("option",{value:"",children:"-- Select Round --"}),j.map(t=>e.jsxs("option",{value:t.round_no,children:["Round ",t.round_no,t.is_active?" (Active)":""]},t.id))]})]})]}),p&&x&&e.jsxs("div",{className:"mt-4 flex gap-4",children:[e.jsxs("button",{onClick:()=>q(p,x),className:"px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center",children:[e.jsx(Ae,{className:"w-4 h-4 mr-2"}),"Refresh Data"]}),e.jsxs("button",{onClick:ke,className:"px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center",children:[e.jsx(B,{className:"w-4 h-4 mr-2"}),"Print General Tabulated Result"]}),e.jsxs("div",{className:"relative",ref:W,children:[e.jsxs("button",{onClick:()=>G(!K),className:"px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center",children:[e.jsx(X,{className:"w-4 h-4 mr-2"}),"Special Awards",e.jsx(Ce,{className:"w-4 h-4 ml-2"})]}),K&&w.length>0&&e.jsx("div",{className:"absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50 min-w-[250px] max-h-[300px] overflow-y-auto",children:w.map(t=>e.jsx("button",{onClick:()=>Re(t.id),className:"w-full text-left px-4 py-2 hover:bg-purple-50 transition-colors border-b border-gray-200 last:border-b-0",children:e.jsx("div",{className:"font-medium text-gray-800",children:t.criteria_name||t.criteria_desc})},t.id))})]})]})]})}),e.jsxs("div",{className:"flex-1 overflow-y-auto px-4 pb-6 bg-gray-50",children:[P&&e.jsx("div",{className:"flex justify-center items-center h-64",children:e.jsx("p",{className:"text-gray-600 text-lg",children:"Loading data..."})}),!P&&p&&x&&h.length>0&&e.jsx("div",{className:"space-y-8 py-4",children:h.map(t=>{const a=je(t.id);return e.jsxs("div",{className:"bg-white rounded-lg shadow overflow-hidden border border-gray-300",children:[e.jsxs("div",{className:"bg-gray-800 text-white px-6 py-3 flex items-center justify-between",children:[e.jsx("h2",{className:"text-xl font-bold",children:t.name}),e.jsxs("button",{onClick:()=>ge(t.id,t.name),className:"bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors",title:"Notify judge to enter scores",children:[e.jsx("svg",{className:"w-5 h-5",fill:"currentColor",viewBox:"0 0 20 20",children:e.jsx("path",{d:"M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"})}),"Notify"]})]}),e.jsx("div",{className:"overflow-x-auto",children:e.jsxs("table",{className:"w-full border-collapse",children:[e.jsx("thead",{children:e.jsxs("tr",{className:"border-b-2 border-gray-800",children:[e.jsx("th",{className:"px-4 py-3 text-left text-sm font-bold text-gray-900 uppercase border-r border-gray-300",children:"No"}),e.jsx("th",{className:"px-4 py-3 text-left text-sm font-bold text-gray-900 uppercase border-r border-gray-300",children:"Contestant"}),w.map(r=>e.jsxs("th",{className:"px-4 py-3 text-center text-sm font-bold text-gray-900 uppercase border-r border-gray-300",children:[e.jsx("div",{children:r.criteria_desc}),e.jsxs("div",{className:"text-xs text-gray-600 font-normal normal-case mt-1",children:["(",r.percentage,"%)"]})]},r.id)),e.jsx("th",{className:"px-4 py-3 text-center text-sm font-bold text-gray-900 uppercase border-r border-gray-300",children:"Total Score"}),e.jsx("th",{className:"px-4 py-3 text-center text-sm font-bold text-gray-900 uppercase border-r border-gray-300",children:"Total Percentage"}),e.jsx("th",{className:"px-4 py-3 text-center text-sm font-bold text-gray-900 uppercase",children:"Rank"})]})}),e.jsx("tbody",{children:a.map(r=>e.jsxs("tr",{className:"border-b border-gray-300 hover:bg-gray-50",children:[e.jsx("td",{className:"px-4 py-3 border-r border-gray-300",children:e.jsx("div",{className:"font-bold text-gray-900 flex items-center gap-2",children:e.jsx("span",{className:"text-black-500",children:r.sequence_no})})}),e.jsx("td",{className:"px-4 py-3 border-r border-gray-300",children:e.jsx("div",{className:"font-semibold text-gray-900 flex items-center gap-2",children:e.jsx("span",{children:r.name})})}),w.map(n=>{const s=ye(t.id,r.id,n.id),o=parseFloat(s)>0,l=U?.judgeId===t.id&&U?.contestantId===r.id&&U?.criteriaId===n.id;return e.jsx("td",{className:`px-4 py-3 text-center border-r border-gray-300 cursor-pointer hover:bg-blue-50 ${o?"bg-yellow-300":""} ${l?"bg-blue-100":""}`,onClick:()=>!l&&me(t.id,r.id,n.id,s),children:l?e.jsx("input",{type:"text",value:V,onChange:be,onBlur:J,onKeyDown:i=>fe(i,t.id,r.id,n.id),className:"w-16 px-2 py-1 text-center border border-blue-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-500",autoFocus:!0,placeholder:"0-10"}):e.jsx("span",{className:"text-gray-900 font-medium",children:s})},n.id)}),e.jsx("td",{className:"px-4 py-3 text-center border-r border-gray-300",children:e.jsxs("span",{className:"font-bold text-gray-900",children:[r.totalScore.toFixed(2),"%"]})}),e.jsx("td",{className:"px-4 py-3 text-center border-r border-gray-300",children:e.jsxs("span",{className:"font-bold text-gray-900",children:[r.percentage.toFixed(2),"%"]})}),e.jsx("td",{className:`px-4 py-3 text-center ${Ne(r.rank)}`,children:e.jsx("div",{className:"flex items-center justify-center",children:e.jsx("span",{className:"text-sm font-bold flex items-center gap-1",children:e.jsx("span",{children:r.rank})})})})]},r.id))})]})})]},t.id)})}),!P&&p&&x&&h.length===0&&e.jsxs("div",{className:"bg-white rounded-lg shadow-md p-12 text-center",children:[e.jsx("div",{className:"text-gray-400 mb-4",children:e.jsx(X,{className:"w-16 h-16 mx-auto"})}),e.jsx("h3",{className:"text-xl font-semibold text-gray-700 mb-2",children:"No Data Available"}),e.jsx("p",{className:"text-gray-600",children:"No judges or scores found for the selected event and round."})]}),!P&&(!p||!x)&&e.jsxs("div",{className:"bg-white rounded-lg shadow-md p-12 text-center",children:[e.jsx("div",{className:"text-gray-400 mb-4",children:e.jsx(z,{className:"w-16 h-16 mx-auto"})}),e.jsx("h3",{className:"text-xl font-semibold text-gray-700 mb-2",children:"Select Event and Round"}),e.jsx("p",{className:"text-gray-600",children:"Please select an event and round to view the score tables and rankings."})]})]}),le&&e.jsx("div",{className:"fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4",children:e.jsxs("div",{className:"bg-white rounded-lg shadow-xl max-w-7xl w-full max-h-[90vh] overflow-hidden flex flex-col",children:[e.jsxs("div",{className:"flex items-center justify-between px-6 py-4 border-b border-gray-200",children:[e.jsx("h2",{className:"text-2xl font-bold text-gray-800",children:"General Tabulated Result"}),e.jsx("button",{onClick:()=>M(!1),className:"text-gray-500 hover:text-gray-700 transition-colors",children:e.jsx(ee,{className:"w-6 h-6"})})]}),e.jsxs("div",{className:"flex-1 overflow-y-auto px-6 py-4",children:[e.jsx("div",{className:"mb-4 text-center",children:e.jsx("h3",{className:"text-lg font-semibold text-gray-700",children:v.find(t=>t.id==p)?.event_name||"Event"})}),e.jsx("div",{className:"overflow-x-auto",children:e.jsxs("table",{className:"w-full border-collapse border border-gray-300",children:[e.jsxs("thead",{children:[e.jsxs("tr",{className:"bg-gray-800 text-white",children:[e.jsx("th",{rowSpan:"2",className:"border border-gray-300 px-4 py-2",children:"NO"}),e.jsx("th",{rowSpan:"2",className:"border border-gray-300 px-4 py-2",children:"CONTESTANT"}),h.map(t=>e.jsx("th",{colSpan:"2",className:"border border-gray-300 px-4 py-2",children:t.name.toUpperCase()},t.id)),e.jsxs("th",{rowSpan:"2",className:"border border-gray-300 px-4 py-2",children:["AVG",e.jsx("br",{}),"PERCENTAGE"]}),e.jsx("th",{rowSpan:"2",className:"border border-gray-300 px-4 py-2",children:"RANK"})]}),e.jsx("tr",{className:"bg-gray-700 text-white",children:h.map(t=>e.jsxs(D.Fragment,{children:[e.jsx("th",{className:"border border-gray-300 px-4 py-2",children:"% SCORE"}),e.jsx("th",{className:"border border-gray-300 px-4 py-2",children:"RANK"})]},t.id))})]}),e.jsx("tbody",{children:_.length===0?e.jsx("tr",{children:e.jsx("td",{colSpan:2+h.length*2+2,className:"border border-gray-300 px-4 py-8 text-center text-gray-500",children:"No data available"})}):_.map((t,a)=>{let r="bg-gray-400";return t.overallRank===1?r="bg-red-500":t.overallRank===2?r="bg-green-500":t.overallRank===3?r="bg-blue-500":t.overallRank===4&&(r="bg-sky-400"),e.jsxs("tr",{className:a%2===0?"bg-white":"bg-gray-50",children:[e.jsx("td",{className:`border border-gray-300 px-4 py-2 text-center font-bold text-white ${r}`,children:t.sequence_no}),e.jsx("td",{className:"border border-gray-300 px-4 py-2 text-left font-semibold",children:t.name}),t.judgeData.map(n=>e.jsxs(D.Fragment,{children:[e.jsxs("td",{className:"border border-gray-300 px-4 py-2 text-center",children:[n.percentage.toFixed(2),"%"]}),e.jsx("td",{className:"border border-gray-300 px-4 py-2 text-center font-bold",children:n.rank})]},n.judgeId)),e.jsxs("td",{className:"border border-gray-300 px-4 py-2 text-center font-bold",children:[t.avgPercentage.toFixed(2),"%"]}),e.jsx("td",{className:`border border-gray-300 px-4 py-2 text-center font-bold text-white ${r}`,children:t.overallRank})]},t.id)})})]})})]}),e.jsxs("div",{className:"flex items-center justify-end gap-4 px-6 py-4 border-t border-gray-200 bg-gray-50",children:[e.jsxs("button",{onClick:Ee,className:"px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2",children:[e.jsx(Q,{className:"w-4 h-4"}),"Export to CSV"]}),e.jsxs("button",{onClick:_e,className:"px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2",children:[e.jsx(Z,{className:"w-4 h-4"}),"Export to Excel"]}),e.jsxs("button",{onClick:$e,className:"px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors flex items-center gap-2",children:[e.jsx(B,{className:"w-4 h-4"}),"Print"]})]})]})}),ie&&e.jsx("div",{className:"fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4",children:e.jsxs("div",{className:"bg-white rounded-lg shadow-xl max-w-7xl w-full max-h-[90vh] overflow-hidden flex flex-col",children:[e.jsxs("div",{className:"flex items-center justify-between px-6 py-4 border-b border-gray-200",children:[e.jsx("h2",{className:"text-2xl font-bold text-gray-800",children:"Special Awards"}),e.jsx("button",{onClick:()=>L(!1),className:"text-gray-500 hover:text-gray-700 transition-colors",children:e.jsx(ee,{className:"w-6 h-6"})})]}),e.jsx("div",{className:"flex-1 overflow-y-auto px-6 py-4",children:T.map((t,a)=>e.jsxs("div",{className:a>0?"mt-8":"",children:[e.jsxs("h3",{className:"text-lg font-bold text-gray-800 mb-3 flex items-center",children:["Best in ",t.criteriaName]}),e.jsx("div",{className:"overflow-x-auto",children:e.jsxs("table",{className:"w-full border-collapse border border-white-300",children:[e.jsxs("thead",{children:[e.jsxs("tr",{className:"bg-white-800 text-black",children:[e.jsx("th",{rowSpan:"2",className:"border border-gray-300 px-4 py-2",children:"NO"}),e.jsx("th",{rowSpan:"2",className:"border border-gray-300 px-4 py-2",children:"CONTESTANT"}),h.map(r=>e.jsx("th",{colSpan:"2",className:"border border-gray-300 px-4 py-2",children:r.name.toUpperCase()},r.id)),e.jsx("th",{rowSpan:"2",className:"border border-white-300 px-4 py-2",children:"AVG SCORE"}),e.jsx("th",{rowSpan:"2",className:"border border-white-300 px-4 py-2",children:"FINAL RANK"})]}),e.jsx("tr",{className:"bg-white-700 text-black",children:h.map(r=>e.jsxs(D.Fragment,{children:[e.jsx("th",{className:"border border-gray-300 px-4 py-2",children:"% SCORE"}),e.jsx("th",{className:"border border-gray-300 px-4 py-2",children:"RANK"})]},r.id))})]}),e.jsx("tbody",{children:t.contestants.map(r=>{let n="bg-white-400";return r.overallRank===1?n="bg-red-500":r.overallRank===2||r.overallRank===3?n="bg-white-500":r.overallRank===4&&(n="bg-white-400"),e.jsxs("tr",{className:"hover:bg-gray-50",children:[e.jsx("td",{className:`border border-white-300 px-4 py-2 text-center font-bold text-black ${n}`,children:r.sequence_no}),e.jsx("td",{className:"border border-white-300 px-4 py-2 text-left font-semibold",children:r.name}),r.judgeData.map(s=>e.jsxs(D.Fragment,{children:[e.jsxs("td",{className:"border border-white-300 px-4 py-2 text-center",children:[s.percentage.toFixed(2),"%"]}),e.jsx("td",{className:"border border-white-300 px-4 py-2 text-center font-bold",children:s.rank})]},s.judgeId)),e.jsxs("td",{className:"border border-white-300 px-4 py-2 text-center font-bold",children:[r.avgPercentage.toFixed(2),"%"]}),e.jsx("td",{className:`border border-white-300 px-4 py-2 text-center font-bold text-black ${n}`,children:r.overallRank})]},r.id)})})]})})]},t.criteriaId))}),e.jsxs("div",{className:"flex justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50",children:[e.jsx("button",{onClick:()=>L(!1),className:"px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors",children:"Close"}),e.jsxs("button",{onClick:()=>{const t=v.find(l=>l.id==p)?.name||"Event",a=j.find(l=>l.round_no==x)?.round_no||x,r=T.map(l=>{const i=`
${l.criteriaName} (${l.percentage}%)
NO,CONTESTANT,${h.map(c=>`${c.name} % SCORE,${c.name} RANK`).join(",")},AVG PERCENTAGE,FINAL RANK
`,d=l.contestants.map(c=>`${c.sequence_no},${c.name},${c.judgeData.map(f=>`${f.percentage.toFixed(2)}%,${f.rank}`).join(",")},${c.avgPercentage.toFixed(2)}%,${c.overallRank}`).join(`
`);return i+d}).join(`

`),n=new Blob([`Special Awards - ${t} - Round ${a}
${r}`],{type:"text/csv"}),s=window.URL.createObjectURL(n),o=document.createElement("a");o.href=s,o.download=`Special_Awards_${t}_Round_${a}.csv`,o.click(),window.URL.revokeObjectURL(s)},className:"px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2",children:[e.jsx(Q,{className:"w-4 h-4"}),"Export CSV"]}),e.jsxs("button",{onClick:()=>{const t=v.find(l=>l.id==p)?.name||"Event",a=j.find(l=>l.round_no==x)?.round_no||x;let r=`
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
                                            ${T.map(l=>`
                                                <table>
                                                    <tr><td colspan="${2+h.length*2+2}"><b>${l.criteriaName} (${l.percentage}%)</b></td></tr>
                                                    <tr>
                                                        <th>NO</th>
                                                        <th>CONTESTANT</th>
                                                        ${h.map(i=>`<th>${i.name} % SCORE</th><th>${i.name} RANK</th>`).join("")}
                                                        <th>AVG PERCENTAGE</th>
                                                        <th>FINAL RANK</th>
                                                    </tr>
                                                    ${l.contestants.map(i=>`
                                                        <tr>
                                                            <td>${i.sequence_no}</td>
                                                            <td>${i.name}</td>
                                                            ${i.judgeData.map(d=>`<td>${d.percentage.toFixed(2)}%</td><td>${d.rank}</td>`).join("")}
                                                            <td>${i.avgPercentage.toFixed(2)}%</td>
                                                            <td>${i.overallRank}</td>
                                                        </tr>
                                                    `).join("")}
                                                </table>
                                                <br/>
                                            `).join("")}
                                        </body>
                                        </html>
                                    `;const n=new Blob([r],{type:"application/vnd.ms-excel"}),s=window.URL.createObjectURL(n),o=document.createElement("a");o.href=s,o.download=`Special_Awards_${t}_Round_${a}.xls`,o.click(),window.URL.revokeObjectURL(s)},className:"px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2",children:[e.jsx(Z,{className:"w-4 h-4"}),"Export Excel"]}),e.jsxs("button",{onClick:Se,className:"px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors flex items-center gap-2",children:[e.jsx(B,{className:"w-4 h-4"}),"Print"]})]})]})})]})};export{Ie as default};
