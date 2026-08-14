const fs = require('fs');
let code = fs.readFileSync('src/pages/Mtp.tsx', 'utf8');

const oldClasses = "`w-full p-2 rounded-md border ${                        !selectedArea && !isWeekend ? 'border-amber-300 bg-amber-50' : 'border-gray-300'                      } ${status !== 'draft' ? 'bg-gray-100 opacity-75' : 'bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'}`";
const newClasses = "`w-full p-2 rounded-md border ${selectedArea ? 'text-green-700 font-bold bg-green-50' : 'text-gray-700'} ${!selectedArea && !isWeekend ? 'border-amber-300 bg-amber-50' : 'border-gray-300'} ${status !== 'draft' ? 'bg-gray-100' : 'focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white'}`";

// I'll just use regex replacing to be safe if indentation differs
code = code.replace(/className=\{`w-full p-2 rounded-md border \$\{[^}]+\} \$\{[^}]+\}`\}/g, 
`className={\`w-full p-2 rounded-md border transition-colors \${
                        selectedArea ? 'text-green-700 font-bold' : 'text-gray-700'
                      } \${
                        !selectedArea && !isWeekend ? 'border-amber-300 bg-amber-50' : 'border-gray-300'
                      } \${status !== 'draft' ? 'bg-gray-50' : 'bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'}\`}`);

fs.writeFileSync('src/pages/Mtp.tsx', code);
