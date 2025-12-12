import{r as c,j as e,H as o}from"./app-wEFeHy9u.js";function m({tally:s}){c.useEffect(()=>{window.print()},[]);const d=a=>{const n=s.scores.filter(r=>r.event_id===a.id),t={champion:[],first:[],second:[]};return n.forEach(r=>{const i=s.participants.find(l=>l.id===r.participant_id);i&&r.score>=1&&r.score<=3&&(r.score===3?t.champion.push(i.participant_name):r.score===2?t.first.push(i.participant_name):r.score===1&&t.second.push(i.participant_name))}),t};return e.jsxs(e.Fragment,{children:[e.jsx(o,{title:`${s.tally_title} - Cue Cards`}),e.jsx("style",{children:`
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
            `}),e.jsxs("div",{className:"max-w-full",children:[e.jsxs("div",{className:"no-print p-8 bg-gray-100 text-center border-b-4 border-blue-600",children:[e.jsx("h1",{className:"text-3xl font-bold text-gray-900 mb-2",children:s.tally_title}),e.jsx("p",{className:"text-lg text-gray-600 mb-4",children:"Cue Cards - One per Competition"}),e.jsxs("p",{className:"text-sm text-gray-500 mb-6",children:[s.events?.length," cards will be printed"]}),e.jsxs("div",{className:"flex gap-4 justify-center",children:[e.jsx("button",{onClick:()=>window.print(),className:"px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold",children:"Print Cue Cards"}),e.jsx("button",{onClick:()=>window.close(),className:"px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-semibold",children:"Close"})]})]}),s.events.map((a,n)=>{const t=d(a);return e.jsxs("div",{className:"cue-card bg-white",children:[e.jsxs("div",{className:"text-center mb-8 pb-4 border-b-4 border-gray-800",children:[e.jsx("div",{className:"text-sm text-gray-500 mb-2",children:s.tally_title}),e.jsx("h1",{className:"text-5xl font-bold text-gray-900 mb-2",children:a.event_name}),e.jsxs("div",{className:"text-lg text-gray-600",children:["Competition #",n+1," of ",s.events.length]})]}),e.jsxs("div",{className:"flex-1 space-y-8 mb-8",children:[e.jsxs("div",{className:"border-l-8 border-orange-500 bg-orange-50 rounded-r-2xl p-6",children:[e.jsx("div",{className:"text-xl font-semibold text-orange-700 mb-1",children:"2nd PLACE:"}),e.jsx("div",{className:"text-4xl font-bold text-gray-900",children:t.second.length>0?t.second.join(", "):"___________________"})]}),e.jsxs("div",{className:"border-l-8 border-gray-500 bg-gray-50 rounded-r-2xl p-6",children:[e.jsx("div",{className:"text-xl font-semibold text-gray-700 mb-1",children:"1st PLACE:"}),e.jsx("div",{className:"text-4xl font-bold text-gray-900",children:t.first.length>0?t.first.join(", "):"___________________"})]}),e.jsxs("div",{className:"border-l-8 border-yellow-500 bg-yellow-50 rounded-r-2xl p-6",children:[e.jsx("div",{className:"text-xl font-semibold text-yellow-700 mb-1",children:"CHAMPION:"}),e.jsx("div",{className:"text-4xl font-bold text-gray-900",children:t.champion.length>0?t.champion.join(", "):"___________________"})]})]}),e.jsxs("div",{className:"mt-6 pt-4 border-t border-gray-300 text-center text-sm text-gray-500",children:[e.jsx("p",{children:"SFXC Tabulation System"}),e.jsxs("p",{className:"text-xs mt-1",children:["Generated: ",new Date().toLocaleString()]})]})]},a.id)})]})]})}export{m as default};
