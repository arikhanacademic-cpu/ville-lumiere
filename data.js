// Levels.fyi France figures, retrieved 13 Oct 2026. m = median total comp (EUR).
// lv = [level, total, base, stock/yr, bonus]; p = single "median package" [base, stock, bonus]; r = common range when the median is locked.
// Office positions are approximate (neighbourhood level).
const COMPANIES = [
// AI
{n:"Mistral AI",s:"mistral-ai",sec:"ai",ar:"1er",hood:"Les Halles",ll:[48.8620,2.3465],roles:{swe:{m:103468,lv:[["L1 · Entry",104000,95200,8700,0],["L2",78000,71700,6400,0],["L3 · Lead",134000,127000,6700,0]]}}},
{n:"Hugging Face",s:"hugging-face",sec:"ai",ar:"2e",hood:"Sentier",ll:[48.8697,2.3458],roles:{swe:{m:81646,p:[81600,0,0]}}},
{n:"Photoroom",s:"photoroom",sec:"ai",ar:"10e",hood:"Strasbourg–Saint-Denis",ll:[48.8712,2.3545],roles:{swe:{m:137092,p:[104000,32800,0]}}},
{n:"Owkin",s:"owkin",sec:"ai",ar:"9e",hood:"Grands Boulevards",ll:[48.8716,2.3432],roles:{swe:{m:66497,p:[66500,0,0]},ds:{m:77891,p:[77900,0,0]}}},
{n:"Dataiku",s:"dataiku",sec:"ai",ar:"12e",hood:"Gare de Lyon",ll:[48.8452,2.3752],roles:{swe:{m:75250,p:[66100,9200,0]}}},
{n:"Shift Technology",s:"shift-technology",sec:"ai",ar:"9e",hood:"Saint-Georges",ll:[48.8788,2.3352],roles:{swe:{m:62008,p:[62000,0,0]},ds:{m:46799,p:[43900,0,2900]}}},
// Big tech
{n:"Google",s:"google",sec:"bigtech",ar:"9e",hood:"SoPi",ll:[48.8771,2.3289],roles:{swe:{m:139446,lv:[["L3 · SWE II",98600,71600,22700,4300],["L4 · SWE III",118000,76700,33100,7900],["L5 · Senior",178000,109000,55500,12700],["L6 · Staff",274000,140000,115000,19000]]},ds:{m:61925,p:[61000,0,947]},pm:{m:153815,lv:[["PM I · L4",122000,80200,30400,11900],["PM II · L5",169000,96400,56400,15800]]}}},
{n:"Meta",s:"facebook",sec:"bigtech",ar:"2e",hood:"Bourse",ll:[48.8703,2.3392],roles:{swe:{m:206935,lv:[["E3 · Entry",89900,75100,10400,4400],["E4",195000,85100,97800,11600],["E5",243000,105000,122000,15500],["E6",359000,140000,192000,26800]]},ds:{m:53823,p:[54700,0,1900]}}},
{n:"Microsoft",s:"microsoft",sec:"bigtech",ar:"Issy",hood:"Issy-les-Moulineaux",ll:[48.8265,2.2660],roles:{swe:{m:109501,lv:[["61 · SDE II",91900,70500,21500,0],["62",93600,68600,16700,8200]]},pm:{m:128006}}},
{n:"Amazon",s:"amazon",sec:"bigtech",ar:"Clichy",hood:"Clichy",ll:[48.9030,2.3060],roles:{swe:{m:73256,lv:[["SDE I · L4",68200,52200,11200,4800],["SDE II · L5",95600,72400,20300,2900],["SDE III · L6",145000,95900,49500,0]]},ds:{m:89172,lv:[["DS II · L5",92900,73700,10900,8300],["DS III · L6",123000,85100,37500,0]]},pm:{m:94491,lv:[["PM · L5",65900,48000,15300,2600],["Senior PM · L6",117000,81600,34900,0],["Principal PM · L7",200000,104000,96000,0]]}}},
{n:"Apple",s:"apple",sec:"bigtech",ar:"16e",hood:"Iéna",ll:[48.8652,2.2935],roles:{swe:{m:170942,lv:[["ICT2",122000,74900,35300,12000],["ICT3",132000,77400,48000,6400],["ICT4",192000,99900,81600,9900],["ICT5",248000,121000,109000,17700]]}}},
{n:"Salesforce",s:"salesforce",sec:"bigtech",ar:"8e",hood:"Golden Triangle",ll:[48.8748,2.3015],roles:{swe:{m:69596}}},
{n:"Airbnb",s:"airbnb",sec:"bigtech",ar:"10e",hood:"Faubourg Saint-Denis",ll:[48.8728,2.3580],roles:{swe:{m:247932,lv:[["G10 · Staff",304000,109000,180000,15200]]}}},
// Tech & scale-ups
{n:"Datadog",s:"datadog",sec:"tech",ar:"9e",hood:"Châteaudun",ll:[48.8758,2.3402],roles:{swe:{m:108536,lv:[["SWE I",77000,64400,12400,149],["SWE II",99900,78000,21800,143],["Senior",147000,106000,41300,232],["Staff",198000,130000,68200,0]]},ds:{m:97510,lv:[["DS I",79900,63200,16700,0],["Senior DS",124000,95700,28100,0]]},pm:{m:97260,lv:[["PM 1",114000,66400,47300,0],["PM 2",128000,74600,53800,0],["Senior PM",195000,97400,97300,0]]}}},
{n:"Criteo",s:"criteo",sec:"tech",ar:"9e",hood:"Blanche",ll:[48.8812,2.3322],roles:{swe:{m:87439,lv:[["L2 · Entry",64100,56300,3500,4200],["L3 · SWE II",79600,71000,3800,4700],["L4 · Senior",97400,82800,5200,9300],["L5 · Staff",132000,107000,15100,10700]]},ds:{m:64911,lv:[["L2 · DS I",63300,55500,2800,5000],["L3 · DS II",66300,60500,2500,3200],["L4 · Senior",91500,77800,1200,12500]]},pm:{m:109445,lv:[["L2 · PM I",73800,67100,0,6700],["L3 · PM II",62700,59500,0,3200],["L5 · Staff",124000,108000,10100,6500]]}}},
{n:"Doctolib",s:"doctolib",sec:"tech",ar:"Levallois",hood:"Levallois-Perret",ll:[48.8930,2.2880],roles:{swe:{m:56122,lv:[["L1 · Entry",44400,44000,383,0],["L2",54900,54900,0,0],["L3 · Senior",69100,69100,0,0],["L4 · Staff",78900,73700,1700,3500]]}}},
{n:"Algolia",s:"algolia",sec:"tech",ar:"8e",hood:"Europe",ll:[48.8792,2.3268],roles:{swe:{m:69869,lv:[["IC3",67600,66200,0,1400],["IC4",78000,74000,0,4000]]}}},
{n:"Deezer",s:"deezer",sec:"tech",ar:"9e",hood:"Place de Clichy",ll:[48.8832,2.3302],roles:{swe:{m:57720,lv:[["Senior",58000,58000,0,0]]}}},
{n:"Mirakl",s:"mirakl",sec:"tech",ar:"3e",hood:"Arts et Métiers",ll:[48.8665,2.3540],roles:{swe:{m:48834,p:[48800,0,0]}}},
{n:"Aircall",s:"aircall",sec:"tech",ar:"9e",hood:"Saint-Georges",ll:[48.8770,2.3352],roles:{swe:{m:54627,p:[54600,0,0]}}},
{n:"ManoMano",s:"manomano",sec:"tech",ar:"10e",hood:"Poissonnière",ll:[48.8748,2.3500],roles:{swe:{m:55598,p:[55600,0,0]}}},
{n:"Back Market",s:"back-market",sec:"tech",ar:"2e",hood:"Sentier",ll:[48.8660,2.3446],roles:{swe:{m:73885,p:[73900,0,0]}}},
{n:"Contentsquare",s:"contentsquare",sec:"tech",ar:"8e",hood:"Europe",ll:[48.8798,2.3225],roles:{swe:{m:81776,p:[81800,0,0]},pm:{m:71699,p:[71700,0,0]}}},
{n:"Ubisoft",s:"ubisoft",sec:"tech",ar:"Saint-Mandé",hood:"Saint-Mandé",ll:[48.8440,2.4200],roles:{swe:{m:55361,lv:[["L1",35800,35100,0,690],["L2",47900,47300,0,578],["L3",66200,61000,0,5200],["L4",80700,75700,5000,0]]},pm:{m:54250,lv:[["L2",53600,50800,0,2800]]}}},
{n:"Dassault Systèmes",s:"dassault-systemes",sec:"tech",ar:"Vélizy",hood:"Vélizy-Villacoublay",ll:[48.7840,2.1950],roles:{swe:{m:51431,lv:[["100",44200,37400,3100,3600],["200",53500,44200,2200,7100],["300",55500,49400,2800,3300]]},ds:{m:53407,p:[44300,0,9100]}}},
{n:"Adevinta · leboncoin",s:"adevinta",sec:"tech",ar:"9e",hood:"Opéra",ll:[48.8738,2.3302],roles:{swe:{m:59454,lv:[["11",54700,51300,0,3400],["12",62400,62400,0,0]]}}},
{n:"Veepee",s:"veepee",sec:"tech",ar:"Saint-Denis",hood:"La Plaine Saint-Denis",ll:[48.9135,2.3580],roles:{swe:{m:56500,p:[56500,0,0]}}},
{n:"PayFit",s:"payfit",sec:"tech",ar:"8e",hood:"Europe",ll:[48.8808,2.3248],roles:{swe:{m:75397},pm:{r:[87200,101000]}}},
{n:"Malt",s:"malt",sec:"tech",ar:"9e",hood:"Rochechouart",ll:[48.8800,2.3462],roles:{swe:{m:63754}}},
{n:"Sorare",s:"sorare",sec:"tech",ar:"3e",hood:"Haut Marais",ll:[48.8640,2.3600],roles:{swe:{r:[82200,96200]}}},
{n:"Ankorstore",s:"ankorstore",sec:"tech",ar:"9e",hood:"Faubourg Montmartre",ll:[48.8726,2.3415],roles:{swe:{m:75576},ds:{r:[37100,43700]}}},
{n:"OVHcloud",s:"ovhcloud",sec:"tech",ar:"La Défense",hood:"La Défense (Paris office)",ll:[48.8878,2.2512],roles:{swe:{m:59884}}},
{n:"Thales",s:"thales",sec:"tech",ar:"La Défense",hood:"La Défense",ll:[48.8935,2.2375],roles:{swe:{m:47009,lv:[["LR6",40600,39500,190,876],["LR7",46800,45000,671,1200],["LR8",52500,49800,706,2000]]},ds:{m:35068},pm:{r:[57900,77800]}}},
// Fintech
{n:"Qonto",s:"qonto",sec:"fintech",ar:"9e",hood:"SoPi",ll:[48.8802,2.3396],roles:{swe:{m:65975},ds:{m:66626},pm:{m:85367}}},
{n:"Lydia · Sumeria",s:"sumeria",sec:"fintech",ar:"1er",hood:"Opéra",ll:[48.8665,2.3335],roles:{swe:{r:[53400,63300]}}},
{n:"Pennylane",s:"pennylane",sec:"fintech",ar:"10e",hood:"Canal Saint-Martin",ll:[48.8776,2.3612],roles:{swe:{m:80342},pm:{r:[81500,92900]}}},
{n:"Spendesk",s:"spendesk",sec:"fintech",ar:"9e",hood:"Cadet",ll:[48.8760,2.3466],roles:{swe:{m:66956},pm:{m:88520}}},
{n:"Revolut",s:"revolut",sec:"fintech",ar:"10e",hood:"République",ll:[48.8692,2.3622],roles:{swe:{m:86236,lv:[["Middle SWE",85100,68500,16600,0]]}}},
{n:"Ledger",s:"ledger",sec:"fintech",ar:"2e",hood:"Rue du Mail",ll:[48.8674,2.3420],roles:{swe:{m:62422},pm:{r:[84000,99700]}}},
{n:"Swile",s:"swile",sec:"fintech",ar:"2e",hood:"Sentier",ll:[48.8686,2.3500],roles:{swe:{m:67022}}},
{n:"Agicap",s:"agicap",sec:"fintech",ar:"10e",hood:"Bonne Nouvelle",ll:[48.8708,2.3478],roles:{swe:{m:57604}}},
{n:"Alan",s:"alan",sec:"fintech",ar:"10e",hood:"Quai de Valmy",ll:[48.8790,2.3640],roles:{swe:{m:84458,p:[74200,10300,0]},pm:{m:53327,p:[53300,0,0]}}},
{n:"Lemon Way",s:"lemonway",sec:"fintech",ar:"Montreuil",hood:"Montreuil",ll:[48.8600,2.4400],roles:{swe:{r:[78800,93500]}}},
{n:"Upflow",s:"upflow",sec:"fintech",ar:"10e",hood:"Canal Saint-Martin",ll:[48.8716,2.3648],roles:{swe:{r:[48700,56900]},pm:{r:[76400,92400]}}},
// Finance
{n:"BNP Paribas",s:"bnp-paribas",sec:"finance",ar:"9e",hood:"Boulevard des Italiens",ll:[48.8714,2.3370],roles:{swe:{m:60632,p:[60600,0,0]},ds:{m:54663,p:[54700,0,0]},ib:{m:118960,p:[72400,0,46500]}}},
{n:"Société Générale",s:"societe-generale",sec:"finance",ar:"La Défense",hood:"La Défense",ll:[48.8962,2.2366],roles:{swe:{m:62012,lv:[["L1",46000,43600,1600,737],["L2",58300,52700,3500,2100],["L3",61200,55700,2500,2900],["L4",60600,55400,1700,3600]]},ds:{m:45593,lv:[["L1",34700,34200,0,582],["L3",31300,29600,0,1700]]}}},
{n:"Crédit Agricole CIB",s:"credit-agricole-cib",sec:"finance",ar:"Montrouge",hood:"Montrouge",ll:[48.8175,2.3190],roles:{swe:{m:58994,p:[44800,0,14200]}}},
{n:"Natixis",s:"natixis",sec:"finance",ar:"13e",hood:"Paris Rive Gauche",ll:[48.8360,2.3725],roles:{swe:{m:58452,p:[44600,8900,5000]}}},
{n:"AXA",s:"axa",sec:"finance",ar:"8e",hood:"Avenue Matignon",ll:[48.8712,2.3105],roles:{ds:{m:56977,p:[57000,0,0]}}},
{n:"Morgan Stanley",s:"morgan-stanley",sec:"finance",ar:"8e",hood:"Monceau",ll:[48.8790,2.3105],roles:{swe:{m:103912,lv:[["L3 · Analyst",100000,68200,22200,10000],["L4 · Associate",95100,75800,6000,13300]]},ds:{m:104420,lv:[["L4 · Associate",125000,84100,0,41300]]}}},
{n:"Capital Fund Management",s:"capital-fund-management",sec:"finance",ar:"7e",hood:"Saint-Germain",ll:[48.8580,2.3290],roles:{swe:{m:110815,p:[80600,0,30200]}}},
{n:"Squarepoint Capital",s:"squarepoint-capital",sec:"finance",ar:"8e",hood:"Golden Triangle",ll:[48.8722,2.3048],roles:{swe:{m:113432,p:[94500,0,18900]}}}
];

const SECTORS = {
  ai:{label:"AI labs", color:"#ec7f9f"},
  bigtech:{label:"Big Tech", color:"#8fb3ff"},
  tech:{label:"Tech & scale-ups", color:"#f29a5b"},
  fintech:{label:"Fintech", color:"#5cc8b8"},
  finance:{label:"Banks & funds", color:"#e8c26a"}
};
const ROLES = {swe:["Software Engineer","software-engineer"],ds:["Data Scientist","data-scientist"],pm:["Product Manager","product-manager"],ib:["Investment Banker","investment-banker"]};

const SEINE = [[48.8215,2.4110],[48.8290,2.3930],[48.8360,2.3790],[48.8420,2.3705],[48.8475,2.3625],[48.8505,2.3560],[48.8528,2.3490],[48.8562,2.3420],[48.8592,2.3330],[48.8618,2.3245],[48.8640,2.3160],[48.8638,2.3085],[48.8630,2.3010],[48.8600,2.2930],[48.8550,2.2852],[48.8492,2.2782],[48.8432,2.2740],[48.8378,2.2645],[48.8330,2.2560],[48.8310,2.2470],[48.8370,2.2370],[48.8470,2.2290],[48.8610,2.2275],[48.8745,2.2320],[48.8850,2.2420],[48.8955,2.2520],[48.9055,2.2710],[48.9135,2.2930],[48.9185,2.3150],[48.9240,2.3380],[48.9330,2.3470]];
const PERIPH = [[48.9010,2.3200],[48.9002,2.3700],[48.8962,2.3900],[48.8862,2.4040],[48.8742,2.4110],[48.8552,2.4150],[48.8402,2.4122],[48.8300,2.3900],[48.8205,2.3600],[48.8172,2.3400],[48.8222,2.3100],[48.8300,2.2900],[48.8400,2.2700],[48.8480,2.2560],[48.8650,2.2560],[48.8780,2.2800],[48.8870,2.2950],[48.8960,2.3100]];
const LINE1 = {id:"1",name:"Line 1",color:"#FFCD00",fg:"#1a1a1a",ends:"La Défense ↔ Château de Vincennes",st:[["La Défense",48.8920,2.2380],["Esplanade de La Défense",48.8880,2.2500],["Pont de Neuilly",48.8855,2.2585],["Les Sablons",48.8810,2.2720],["Porte Maillot",48.8780,2.2820],["Argentine",48.8756,2.2894],["Charles de Gaulle–Étoile",48.8738,2.2950],["George V",48.8720,2.3007],["Franklin D. Roosevelt",48.8690,2.3096],["Champs-Élysées–Clemenceau",48.8676,2.3140],["Concorde",48.8656,2.3212],["Tuileries",48.8644,2.3297],["Palais Royal",48.8625,2.3364],["Louvre–Rivoli",48.8608,2.3410],["Châtelet",48.8584,2.3474],["Hôtel de Ville",48.8574,2.3520],["Saint-Paul",48.8551,2.3608],["Bastille",48.8532,2.3691],["Gare de Lyon",48.8443,2.3730],["Reuilly–Diderot",48.8472,2.3863],["Nation",48.8484,2.3959],["Porte de Vincennes",48.8470,2.4108],["Saint-Mandé",48.8463,2.4190],["Bérault",48.8454,2.4283],["Château de Vincennes",48.8443,2.4401]]};
const LINE14 = {id:"14",name:"Line 14",color:"#8B4FC4",fg:"#fff",ends:"Saint-Denis Pleyel ↔ Olympiades",st:[["Saint-Denis Pleyel",48.9187,2.3463],["Mairie de Saint-Ouen",48.9119,2.3343],["Saint-Ouen",48.9046,2.3220],["Porte de Clichy",48.8946,2.3134],["Pont Cardinet",48.8885,2.3150],["Saint-Lazare",48.8754,2.3253],["Madeleine",48.8700,2.3245],["Pyramides",48.8657,2.3346],["Châtelet",48.8584,2.3474],["Gare de Lyon",48.8443,2.3730],["Bercy",48.8401,2.3794],["Cour Saint-Émilion",48.8333,2.3866],["Bibliothèque François Mitterrand",48.8299,2.3762],["Olympiades",48.8270,2.3670]]};
const ARRS = [["1er",48.8625,2.3363],["2e",48.8683,2.3428],["3e",48.8630,2.3600],["4e",48.8543,2.3576],["5e",48.8445,2.3507],["6e",48.8491,2.3328],["7e",48.8562,2.3121],["8e",48.8728,2.3125],["9e",48.8771,2.3375],["10e",48.8762,2.3608],["11e",48.8590,2.3800],["12e",48.8400,2.3900],["13e",48.8283,2.3623],["14e",48.8292,2.3266],["15e",48.8401,2.2929],["16e",48.8630,2.2750],["17e",48.8873,2.3067],["18e",48.8925,2.3484],["19e",48.8871,2.3848],["20e",48.8634,2.4012]];

const CHAPTERS = [
 {k:"Paris, after dark",t:[48.858,2.335],d:15,az:12,el:52,
  p:"Twenty arrondissements spiral out from the Louvre like a snail shell. Haussmann's rules keep the skyline at six storeys, so most tech companies work out of converted apartment blocks. Each glowing tower here is a company; its height is the median engineer's total pay in France.",
  g:"I'm Gaston. I know every rooftop in this city. Scroll and follow me."},
 {k:"La Défense",t:[48.892,2.245],d:3.2,az:-35,el:30,ids:["Société Générale","Thales","OVHcloud"],
  p:"Just past the city limit, at the western end of Métro Line 1, sits Europe's largest purpose-built business district. Société Générale's towers and Thales's headquarters share the slab with the Grande Arche.",
  g:"The wind up here could blow a pigeon to Versailles."},
 {k:"The Golden Triangle · 8e",t:[48.872,2.303],d:3.0,az:20,el:38,ids:["Squarepoint Capital","Morgan Stanley","AXA","Apple","Salesforce"],
  p:"Between the Arc de Triomphe and the Seine, the 8e houses insurers, investment banks and hedge funds. Squarepoint and Morgan Stanley both report engineer medians above €100K.",
  g:"Tourists drop croissant here. Bankers drop nothing."},
 {k:"SoPi · 9e",t:[48.877,2.336],d:2.6,az:8,el:42,ids:["Google","Datadog","Criteo","Qonto","BNP Paribas","Algolia","Contentsquare","PayFit","Deezer","Owkin"],
  p:"South Pigalle is where Paris tech pay peaks. Google's French headquarters, Datadog's Paris engineering hub and Criteo all sit within a short walk of Gare Saint-Lazare.",
  g:"Every café here has a laptop at every table."},
 {k:"Silicon Sentier · 2e",t:[48.868,2.344],d:2.2,az:-20,el:40,ids:["Meta","Hugging Face","Ledger","Back Market","Swile"],
  p:"In the late 1990s the old textile quarter around Rue du Sentier became the city's first startup district. Meta's Paris office, Ledger and Back Market still keep it busy.",
  g:"The rag trade left. The hoodies arrived."},
 {k:"Les Halles & the Louvre",t:[48.861,2.338],d:2.4,az:200,el:36,ids:["Mistral AI","Lydia · Sumeria","Capital Fund Management"],
  p:"Mistral AI, the Paris-born frontier lab, works a few streets from the Louvre. Lydia, now Sumeria, runs from Avenue de l'Opéra, and the quant fund CFM sits just across the river in the 7e.",
  g:"I nest on the pyramid. Don't tell anyone."},
 {k:"Canal Saint-Martin · 10e",t:[48.874,2.360],d:2.4,az:40,el:40,ids:["Alan","Pennylane","Revolut","Airbnb","Photoroom","Upflow"],
  p:"The 10e is where newer companies go when the 9e fills up. Alan, Pennylane and Revolut's French team sit near the canal locks, a short walk from Gare de l'Est.",
  g:"Best breadcrumbs in Paris, along the canal."},
 {k:"Rive Gauche",t:[48.840,2.360],d:4.4,az:0,el:42,ids:["Natixis","Dataiku"],
  p:"South-east along the river, Station F, the world's largest startup campus, sits beside the four towers of the Bibliothèque François Mitterrand. Natixis and Dataiku are nearby on either bank.",
  g:"Station F has 1,000 startups and no pigeons. I checked."},
 {k:"La petite couronne",t:[48.862,2.325],d:20,az:-10,el:58,ids:["Microsoft","Doctolib","Amazon","Ubisoft","Crédit Agricole CIB","Veepee","Lemon Way","Dassault Systèmes"],
  p:"Many of the biggest employers sit just outside the Périphérique: Microsoft in Issy-les-Moulineaux, Doctolib in Levallois, Amazon in Clichy, Ubisoft in Saint-Mandé, Crédit Agricole CIB in Montrouge and Dassault Systèmes out in Vélizy.",
  g:"The suburbs: more space, fewer tourists, same pay."},
 {k:"Ride the Métro",t:[48.862,2.332],d:9,az:8,el:34,ride:true,
  p:"Line 1 is the city's spine, from La Défense under the Champs-Élysées to Château de Vincennes. Line 14, the driverless line, runs from Saint-Denis Pleyel through Saint-Lazare to the Bibliothèque. Pick one and ride.",
  g:"I ride free. Nobody checks a pigeon's ticket."}
];
