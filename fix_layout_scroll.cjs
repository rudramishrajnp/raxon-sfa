const fs = require('fs');
let code = fs.readFileSync('src/components/Layout.tsx', 'utf8');

// We want to change the layout structure so that scrolling happens on the window, not in a nested div.
// Original:
// <div className="min-h-screen bg-gray-50 flex">
//   ... sidebar ...
//   <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
//     <div className="flex-shrink-0 flex h-16 bg-white border-b border-gray-200"> ... </div>
//     <main className="flex-1 overflow-y-auto bg-gray-50 p-4 md:p-6 lg:p-8">

code = code.replace('<div className="min-h-screen bg-gray-50 flex">', '<div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">');
code = code.replace('<div className="flex-1 flex flex-col min-w-0 overflow-hidden">', '<div className="flex-1 flex flex-col min-w-0">');
code = code.replace('<div className="flex-shrink-0 flex h-16 bg-white border-b border-gray-200">', '<div className="sticky top-0 z-20 flex-shrink-0 flex h-16 bg-white border-b border-gray-200">');
code = code.replace('<main className="flex-1 overflow-y-auto bg-gray-50 p-4 md:p-6 lg:p-8">', '<main className="flex-1 bg-gray-50 p-4 md:p-6 lg:p-8">');

// The sidebar needs to be fixed on lg too if we want it to not scroll with the page, but lg:static makes it grow with the content.
// Actually, if we use lg:sticky lg:top-0 lg:h-screen for the sidebar, it will stay fixed while the main content scrolls!
// Original sidebar classes:
// fixed inset-y-0 left-0 z-30 w-64 bg-indigo-900 text-white transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-auto

code = code.replace('lg:static lg:inset-auto', 'lg:sticky lg:top-0 lg:h-screen');

fs.writeFileSync('src/components/Layout.tsx', code);
