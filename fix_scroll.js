import fs from 'fs';
const files = [
    'c:/Users/thesi/OneDrive/Desktop/aurora/index.html',
    'c:/Users/thesi/OneDrive/Desktop/aurora/analytics.html',
    'c:/Users/thesi/OneDrive/Desktop/aurora/add_expense.html',
    'c:/Users/thesi/OneDrive/Desktop/aurora/profile.html',
    'c:/Users/thesi/OneDrive/Desktop/aurora/wallet.html',
    'c:/Users/thesi/OneDrive/Desktop/aurora/settings.html',
    'c:/Users/thesi/OneDrive/Desktop/aurora/archive.html'
];
files.forEach(f => {
    if (!fs.existsSync(f)) return;
    let content = fs.readFileSync(f, 'utf8');
    content = content.replace('<div class="flex h-screen">', '<div class="flex min-h-screen">');
    content = content.replace('<div class="flex h-screen w-full">', '<div class="flex min-h-screen w-full">');
    content = content.replace('flex-1 ml-64 flex flex-col relative z-10 h-full overflow-y-auto w-full scroll-smooth', 'flex-1 ml-64 flex flex-col relative z-10 w-full scroll-smooth');
    fs.writeFileSync(f, content);
});
console.log('Scrollbars fixed.');
