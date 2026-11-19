import numpy as np, wave
SR=44100; DUR=20.0; N=int(SR*DUR); B=0.5  # 120 BPM
rng=np.random.default_rng(7)
mus=np.zeros((N,2)); sfx=np.zeros((N,2))
def hz(m): return 440*2**((m-69)/12)
def add(buf,t,sig,pan=0.0,g=1.0):
    i=int(round(t*SR)); j=min(N,i+len(sig))
    if i>=N: return
    l=np.cos((pan+1)*np.pi/4); r=np.sin((pan+1)*np.pi/4)
    buf[i:j,0]+=sig[:j-i]*g*l*1.414; buf[i:j,1]+=sig[:j-i]*g*r*1.414
def env(n,a=0.005,d=0.3,s=0.0,rel=None):
    tt=np.arange(n)/SR; e=np.minimum(1,tt/a)*np.exp(-tt/d)
    return e
def tone(f,dur,kind='sine',a=0.005,d=0.3):
    n=int(dur*SR); tt=np.arange(n)/SR
    if kind=='sine': w=np.sin(2*np.pi*f*tt)
    elif kind=='bell': w=np.sin(2*np.pi*f*tt+0.8*np.sin(2*np.pi*f*3.5*tt)*np.exp(-tt*6))
    elif kind=='tri': w=2/np.pi*np.arcsin(np.sin(2*np.pi*f*tt))
    elif kind=='saw': w=sum(np.sin(2*np.pi*f*k*tt)/k for k in range(1,8))*0.6
    return w*env(n,a,d)
def lp(x,c):
    a=np.exp(-2*np.pi*c/SR); y=np.zeros_like(x); s=0.
    for i in range(len(x)): s=(1-a)*x[i]+a*s; y[i]=s
    return y
# chords (F major): F Dm Bb C
CH=[[53,57,60],[50,53,57],[46,50,53],[48,52,55]]
ROOT=[41,38,34,36]
bars=int(DUR/2)
# pad (whole song, soft)
for b in range(bars):
    c=CH[b%4]; t0=b*2.0
    for m in c:
        n=int(2.1*SR); tt=np.arange(n)/SR
        w=(np.sin(2*np.pi*hz(m+12)*tt)+0.5*np.sin(2*np.pi*hz(m+12)*1.003*tt))*np.minimum(1,tt/0.25)*np.minimum(1,(2.1-tt)/0.3)
        add(mus,t0,w,pan=(m%3-1)*0.4,g=0.035 if b>0 else 0.05)
# drums from 2.0, stop at 19.0 with a final hit
kick=lambda: np.sin(2*np.pi*np.cumsum(60+90*np.exp(-np.arange(int(.35*SR))/SR*30))/SR)*np.exp(-np.arange(int(.35*SR))/SR*9)
def clap():
    n=int(.25*SR); x=rng.standard_normal(n)*np.exp(-np.arange(n)/SR*18); return x-lp(x,1200)
def hat():
    n=int(.06*SR); x=rng.standard_normal(n); x=x-lp(x,7000); return x*np.exp(-np.arange(n)/SR*70)
K,C=kick(),clap()
for i in range(int(2/B), int(19/B)):
    t=i*B
    add(mus,t,K,g=0.55)
    if i%2==1: add(mus,t,C,g=0.22)
    add(mus,t+B/2,hat(),pan=0.3,g=0.10); add(mus,t,hat(),pan=-0.3,g=0.05)
add(mus,19.0,K,g=0.6)
# bass eighths
for b in range(1,bars):
    if b*2>=19.5: break
    r=ROOT[b%4]
    for k in range(8):
        t=b*2+k*0.25
        if t>=19.0: break
        s=tone(hz(r),0.24,'saw',0.004,0.12); s=lp(s,500)
        add(mus,t,s,g=0.22 if k%2==0 else 0.14)
add(mus,19.0,lp(tone(hz(41),1.0,'saw',0.004,0.5),400),g=0.25)
# melody: bell, pentatonic, from bar 2 (t=4)
mel=[(4.0,72),(4.5,77),(5.0,76),(5.5,72),(6.0,74),(6.75,72),(7.0,70),(7.5,72),(8.0,69),(8.5,72),(9.0,74),(9.5,77),
     (10.0,76),(10.75,74),(11.0,72),(12.0,77),(12.5,79),(13.0,77),(13.5,74),(14.0,74),(14.5,77),(15.0,76),(15.5,79),
     (16.0,81),(16.5,79),(17.0,77),(17.5,74),(18.0,76),(18.5,79),(19.0,77)]
for t,m in mel:
    add(mus,t,tone(hz(m),0.9 if t<19 else 2.0,'bell',0.003,0.28 if t<19 else 0.8),pan=0.15,g=0.12)
# ---- SFX (in key, on grid) ----
for t,m in [(0.5,84),(1.0,84),(1.5,84)]:   # countdown beeps (C)
    add(sfx,t,lp(tone(hz(m),0.18,'tri',0.003,0.06),5000),g=0.16)
# shutter at 2.0: click + mech
n=int(.12*SR); x=rng.standard_normal(n)*np.exp(-np.arange(n)/SR*60); x=x-lp(x,2500)
add(sfx,2.0,x,g=0.35); add(sfx,2.06,x*0.6,g=0.25)
add(sfx,2.0,tone(hz(89),0.6,'sine',0.002,0.2),g=0.06)  # F shimmer
# sticker pops: S2 stickers + S4 stamps
def pop(f):
    n=int(.18*SR); tt=np.arange(n)/SR
    return np.sin(2*np.pi*np.cumsum(f*(1+0.6*np.exp(-tt*40)))/SR)*np.exp(-tt*22)
for i,t in enumerate([4.0,4.25,4.5,4.75,5.0,5.25,5.5,5.75]):
    add(sfx,t,pop(hz([77,81,84,81,77,84,81,89][i])),pan=(i%2*2-1)*0.4,g=0.08)
for i,t in enumerate([12.0,13.0,14.0,15.0]):
    add(sfx,t,pop(hz([77,81,84,89][i])),g=0.10)
# typing ticks
for k in range(6):
    n=int(.03*SR); x=rng.standard_normal(n)*np.exp(-np.arange(n)/SR*200); x=x-lp(x,3000)
    add(sfx,7.5+k*0.25,x,pan=0.3,g=0.10)
# click at 9.5, connect chime 10.0 (F-A-C)
n=int(.03*SR); x=rng.standard_normal(n)*np.exp(-np.arange(n)/SR*150); add(sfx,9.5,x-lp(x,2000),g=0.18)
for k,m in enumerate([77,81,84]): add(sfx,10.0+k*0.125,tone(hz(m),0.5,'bell',0.003,0.2),g=0.07)
# soft whooshes into scene cuts
for t in [3.75,6.75,11.25,15.75]:
    n=int(.25*SR); tt=np.arange(n)/SR; x=lp(rng.standard_normal(n),1500)*np.sin(np.pi*tt/0.25)
    add(sfx,t,x,g=0.12)
# print-out slide at 16
n=int(1.0*SR); tt=np.arange(n)/SR; x=lp(rng.standard_normal(n),900)*np.sin(np.pi*tt/1.0)*(0.6+0.4*np.sin(2*np.pi*14*tt))
add(sfx,16.0,x,g=0.10)
mix=mus+sfx*0.9
# simple reverb-ish: short multi-tap
out=mix.copy()
for d,g in [(0.031,0.18),(0.047,0.14),(0.071,0.1),(0.113,0.07)]:
    k=int(d*SR); out[k:,0]+=mix[:-k,1]*g; out[k:,1]+=mix[:-k,0]*g
# fades
fi=int(0.02*SR); out[:fi]*=np.linspace(0,1,fi)[:,None]
fo=int(0.8*SR); out[-fo:]*=np.linspace(1,0,fo)[:,None]
out=np.tanh(out/np.max(np.abs(out))*1.3)*0.89
w=wave.open('music.wav','wb'); w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
w.writeframes((out*32767).astype(np.int16).tobytes()); w.close(); print('ok')
