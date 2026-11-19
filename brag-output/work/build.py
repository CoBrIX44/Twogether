import re
s=open('video.src.html').read()
def rep(m):
    svg=open(f'node_modules/lucide-static/icons/{m.group(1)}.svg').read()
    svg=re.sub(r'<!--.*?-->','',svg,flags=re.S)
    return svg.replace('width="24"','width="34"').replace('height="24"','height="34"')
open('video.html','w').write(re.sub(r'\{\{icon:([\w-]+)\}\}',rep,s))
