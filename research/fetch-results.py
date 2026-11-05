from html.parser import HTMLParser
from pathlib import Path
import json, subprocess, concurrent.futures

class Rankings(HTMLParser):
    def __init__(self):
        super().__init__(); self.href=''; self.links=[]
    def handle_starttag(self, tag, attrs):
        if tag == 'a': self.href=dict(attrs).get('href','')
    def handle_data(self, data):
        if ('generalna' in data or 'końcowa' in data) and ('kobiet' in data or 'mężczyzn' in data):
            self.links.append({'title':data.strip(),'url':self.href})

archive=Path('/tmp/wintercup-wyniki.html')
subprocess.run(['rtk','proxy','curl','-sS','-L','--fail','--user-agent','Mozilla/5.0','https://wintercup.pl/wyniki/','-o',str(archive)],check=True)
parser=Rankings(); parser.feed(archive.read_text())
links=parser.links[:28]
root=Path('/tmp/wintercup-results'); root.mkdir(exist_ok=True)
def fetch(item):
    file=root/item['url'].split('/')[-1]
    p=subprocess.run(['rtk','proxy','curl','-sS','-L','--fail','--user-agent','Mozilla/5.0',item['url'],'-o',str(file)],capture_output=True,text=True)
    if p.returncode: return {**item,'error':p.stderr}
    subprocess.run(['rtk','proxy','pdftotext','-layout',str(file),str(file.with_suffix('.txt'))],check=True,capture_output=True)
    return {**item,'file':str(file),'text_file':str(file.with_suffix('.txt'))}
with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
    fetched=list(pool.map(fetch,links))
Path('/tmp/wintercup-results/index.json').write_text(json.dumps(fetched,ensure_ascii=False,indent=2))
print(json.dumps({'fetched':len([x for x in fetched if 'file' in x]),'errors':[x for x in fetched if 'error' in x]},ensure_ascii=False))
