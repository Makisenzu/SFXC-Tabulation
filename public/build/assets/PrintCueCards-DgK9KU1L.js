import{r as o,j as e,H as x}from"./app-DDccbg5i.js";function p({tally:a}){o.useEffect(()=>{window.print()},[]);const d=l=>{const i=a.scores.filter(s=>s.event_id===l.id),t={champion:[],first:[],second:[]};return i.forEach(s=>{const r=a.participants.find(n=>n.id===s.participant_id);r&&s.score>=1&&s.score<=3&&(s.score===3?t.champion.push(r.participant_name):s.score===2?t.first.push(r.participant_name):s.score===1&&t.second.push(r.participant_name))}),t},c=l=>{const i=a.scores.filter(n=>n.participant_id===l),t=i.filter(n=>n.score===3).length,s=i.filter(n=>n.score===2).length,r=i.filter(n=>n.score===1).length;return{gold:t,silver:s,bronze:r,total:t+s+r}};return e.jsxs(e.Fragment,{children:[e.jsx(x,{title:`${a.tally_title} - Cue Cards`}),e.jsx("style",{children:`
                @media print {
                    body { 
                        margin: 0;
                        padding: 0;
                    }
                    @page {
                        size: A4;
                        margin: 10mm;
                    }
                    .no-print {
                        display: none;
                    }
                    .cue-card {
                        page-break-after: always;
                        page-break-inside: avoid;
                    }
                    .cue-card:last-child {
                        page-break-after: auto;
                    }
                }
                
                body {
                    font-family: Arial, sans-serif;
                }
                
                .cue-card {
                    min-height: 100vh;
                    display: flex;
                    flex-direction: column;
                    padding: 20px;
                }
            `}),e.jsxs("div",{className:"max-w-full",children:[e.jsxs("div",{className:"no-print p-8 bg-gray-100 text-center border-b-4 border-blue-600",children:[e.jsx("h1",{className:"text-3xl font-bold text-gray-900 mb-2",children:a.tally_title}),e.jsx("p",{className:"text-lg text-gray-600 mb-4",children:"Cue Cards - One per Competition"}),e.jsxs("p",{className:"text-sm text-gray-500 mb-6",children:[a.events?.length," cards will be printed"]}),e.jsxs("div",{className:"flex gap-4 justify-center",children:[e.jsx("button",{onClick:()=>window.print(),className:"px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold",children:"Print Cue Cards"}),e.jsx("button",{onClick:()=>window.close(),className:"px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-semibold",children:"Close"})]})]}),a.events.map((l,i)=>{const t=d(l);return e.jsxs("div",{className:"cue-card bg-white",children:[e.jsxs("div",{className:"text-center mb-8 pb-4 border-b-4 border-gray-800",children:[e.jsx("div",{className:"text-sm text-gray-500 mb-2",children:a.tally_title}),e.jsx("h1",{className:"text-5xl font-bold text-gray-900 mb-2",children:l.event_name}),e.jsxs("div",{className:"text-lg text-gray-600",children:["Competition #",i+1," of ",a.events.length]})]}),e.jsxs("div",{className:"flex-1 space-y-8 mb-8",children:[e.jsxs("div",{className:"border-l-8 border-orange-500 bg-orange-50 rounded-r-2xl p-6",children:[e.jsx("div",{className:"text-xl font-semibold text-orange-700 mb-1",children:"2nd PLACE:"}),e.jsx("div",{className:"text-4xl font-bold text-gray-900",children:t.second.length>0?t.second.join(", "):"___________________"})]}),e.jsxs("div",{className:"border-l-8 border-gray-500 bg-gray-50 rounded-r-2xl p-6",children:[e.jsx("div",{className:"text-xl font-semibold text-gray-700 mb-1",children:"1st PLACE:"}),e.jsx("div",{className:"text-4xl font-bold text-gray-900",children:t.first.length>0?t.first.join(", "):"___________________"})]}),e.jsxs("div",{className:"border-l-8 border-yellow-500 bg-yellow-50 rounded-r-2xl p-6",children:[e.jsx("div",{className:"text-xl font-semibold text-yellow-700 mb-1",children:"CHAMPION:"}),e.jsx("div",{className:"text-4xl font-bold text-gray-900",children:t.champion.length>0?t.champion.join(", "):"___________________"})]})]}),e.jsxs("div",{className:"border-t-4 border-gray-800 pt-6",children:[e.jsx("h2",{className:"text-2xl font-bold text-gray-900 mb-6 text-center",children:"OVERALL MEDAL SUMMARY"}),e.jsx("div",{className:"grid grid-cols-1 gap-4",children:a.participants.map(s=>{const r=c(s.id);return e.jsx("div",{className:"bg-white border-2 border-gray-300 rounded-lg p-4",children:e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsx("h3",{className:"text-2xl font-bold text-gray-900",children:s.participant_name}),e.jsxs("div",{className:"flex items-center gap-6 text-lg",children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("span",{className:"text-2xl",children:"🥇"}),e.jsx("span",{className:"font-bold",children:r.gold})]}),e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("span",{className:"text-2xl",children:"🥈"}),e.jsx("span",{className:"font-bold",children:r.silver})]}),e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("span",{className:"text-2xl",children:"🥉"}),e.jsx("span",{className:"font-bold",children:r.bronze})]}),e.jsxs("div",{className:"flex items-center gap-2 ml-4 pl-4 border-l-2 border-gray-400",children:[e.jsx("span",{className:"font-semibold text-gray-600",children:"Total:"}),e.jsx("span",{className:"font-bold text-xl",children:r.total})]})]})]})},s.id)})})]}),e.jsxs("div",{className:"mt-6 pt-4 border-t border-gray-300 text-center text-sm text-gray-500",children:[e.jsx("p",{children:"SFXC Tabulation System"}),e.jsxs("p",{className:"text-xs mt-1",children:["Generated: ",new Date().toLocaleString()]})]})]},l.id)})]})]})}export{p as default};
