// MicroAnim Library v1.0
// Ripple + Cluster micro animation foundation
// 50 continuously-looping canvas animations
// Usage:
//   MicroAnim.init(devicePixelRatio, canvasSize)
//   MicroAnim.lib[i] => [name, cycleMs, drawFn(ctx, t)]
//   t ranges 0..1, loops continuously
//
// Colors: MicroAnim.R (shu red), MicroAnim.K (ink black)
// Easing: MicroAnim.easing.{oC,oQ,oQn,oE,oB,io,bn,iQ}
// Helpers: MicroAnim.cr(x,y,r,ctx,style,width) — circle stroke
//          MicroAnim.dt(x,y,r,ctx,fill) — dot fill
//          MicroAnim.ln(x1,y1,x2,y2,ctx,style,width) — line

const MicroAnim=(function(){
const R='179,58,58',K='26,26,26';
let P=2,Z=56,M=28,D=2;
function init(dpr,size){P=dpr||2;Z=(size||28)*P;M=Z/2;D=P}

const oC=t=>1-(1-t)**3,oQ=t=>1-(1-t)**4,oQn=t=>1-(1-t)**5,
oE=t=>t<=0?0:t>=1?1:2**(-10*t)*Math.sin((t*10-.75)*2.094)+1,
oB=t=>{const c=1.7;return 1+(c+1)*(t-1)**3+c*(t-1)**2},
io=t=>t<.5?4*t**3:1-(-2*t+2)**3/2,
bn=t=>{const n=7.5625,d=2.75;if(t<1/d)return n*t*t;if(t<2/d)return n*(t-=1.5/d)*t+.75;if(t<2.5/d)return n*(t-=2.25/d)*t+.9375;return n*(t-=2.625/d)*t+.984375},
iQ=t=>t*t,cl=v=>v<0?0:v>1?1:v,sin=Math.sin,cos=Math.cos,PI=Math.PI,TAU=PI*2;

function cr(x,y,r,c,s,w){if(r<.3)return;c.beginPath();c.arc(x,y,r,0,TAU);c.strokeStyle=s;c.lineWidth=w;c.stroke()}
function dt(x,y,r,c,f){if(r<.2)return;c.beginPath();c.arc(x,y,r,0,TAU);c.fillStyle=f;c.fill()}
function ln(x1,y1,x2,y2,c,s,w){c.beginPath();c.moveTo(x1,y1);c.lineTo(x2,y2);c.strokeStyle=s;c.lineWidth=w;c.stroke()}

// [name, cycle_ms, fn(ctx, t:0..1)]
const lib=[
['Ripple',1800,function(c,t){for(let i=0;i<3;i++){var d=cl((t-i*.1)/.55);if(d<=0||d>=1)continue;cr(M,M,oC(d)*M*.85,c,'rgba('+(i?K:R)+','+(.7*sin(d*PI))+')',(!i?1.3:.7)*D)}dt(M,M,2.2*D,c,'rgba('+R+','+(.7*sin(t*PI))+')')}],
['Cluster',1400,function(c,t){var b=sin(t*TAU)*.5+.5;var P2=[[.32,.36,3],[.63,.3,2],[.43,.63,3.5],[.72,.63,1.5]];for(var i=0;i<4;i++){var p=P2[i],s=.85+b*.15,dx=(p[0]-.5)*b*.06,dy=(p[1]-.5)*b*.06;cr((p[0]+dx)*Z,(p[1]+dy)*Z,p[2]*D*s,c,'rgba('+K+','+(.5+b*.3)+')',1.1*D)}}],
['Sonar',2200,function(c,t){for(var i=0;i<4;i++){var d=cl((t-i*.15)/.5);if(d<=0||d>=1)continue;cr(M,M,oQ(d)*M*.88,c,'rgba('+K+','+(.35*sin(d*PI))+')',.6*D)}dt(M,M,1.5*D,c,'rgba('+K+',.25)')}],
['Magnetic',2e3,function(c,t){var P2=[[.2,.2],[.8,.2],[.2,.8],[.8,.8],[.5,.5]],ph=sin(t*TAU)*.5+.5;for(var i=0;i<5;i++){var p=P2[i],x=p[0]*Z+(M-p[0]*Z)*ph*.6,y=p[1]*Z+(M-p[1]*Z)*ph*.6;cr(x,y,(1.3+i*.3)*D,c,'rgba('+K+',.65)',.9*D);if(i<4){var n=P2[(i+1)%5];ln(x,y,n[0]*Z+(M-n[0]*Z)*ph*.6,n[1]*Z+(M-n[1]*Z)*ph*.6,c,'rgba('+K+','+(ph*.18)+')',.4*D)}}}],
['Shu Flash',1600,function(c,t){var fl=sin(t*TAU)*.5+.5;dt(M,M,2*D,c,'rgba('+R+','+(.3+fl*.3)+')');for(var i=0;i<3;i++){var d=cl((t-i*.08)/.5);if(d<=0||d>=1)continue;cr(M,M,oC(d)*M*.8,c,'rgba('+(fl>.6?R:K)+','+(.6*sin(d*PI))+')',(!i?1.2:.6)*D)}}],
['Orbit',3e3,function(c,t){dt(M,M,1.5*D,c,'rgba('+K+',.2)');for(var i=0;i<4;i++){var a=t*TAU*(i%2?-.7:1)+i*PI/2,r=(8+i*3)*D;cr(M+cos(a)*r,M+sin(a)*r,(1.1+i*.35)*D,c,'rgba('+(!i?R:K)+',.6)',.9*D)}}],
['Heartbeat',1600,function(c,t){var b1=Math.abs(sin(t*TAU)),b2=Math.abs(sin(t*TAU+1));cr(M,M,b1*M*.55,c,'rgba('+R+','+((1-b1)*.5)+')',1.1*D);cr(M,M,b2*M*.55,c,'rgba('+K+','+((1-b2)*.4)+')',1.1*D);dt(M,M,2*D*(1+b1*.2),c,'rgba('+R+','+(.5+b1*.2)+')')}],
['Float',2400,function(c,t){var P2=[[.28,.55,2.8],[.5,.5,1.8],[.68,.55,3.2],[.42,.5,1.3]];for(var i=0;i<4;i++){var p=P2[i],ph=sin(t*TAU+i*1.2)*.12;cr(p[0]*Z+sin(t*TAU+i)*2*D,(p[1]+ph)*Z,p[2]*D,c,'rgba('+K+',.55)',.9*D)}}],
['Liquid',2400,function(c,t){for(var i=0;i<2;i++){var bR=(8+i*5)*D;c.beginPath();for(var j=0;j<=48;j++){var ag=j/48*TAU,w=sin(ag*3+t*12+i*2)*2*D+sin(ag*5-t*8)*D,r=bR+w,x=M+cos(ag)*r,y=M+sin(ag)*r;j?c.lineTo(x,y):c.moveTo(x,y)}c.closePath();c.strokeStyle='rgba('+K+','+(.3-.1*i)+')';c.lineWidth=(.9-.2*i)*D;c.stroke()}}],
['Constellate',2e3,function(c,t){var P2=[[.22,.28],[.62,.18],[.78,.52],[.45,.72],[.18,.58]],br=sin(t*TAU)*.5+.5;for(var i=0;i<5;i++){var n=P2[(i+1)%5];ln(P2[i][0]*Z,P2[i][1]*Z,n[0]*Z,n[1]*Z,c,'rgba('+K+','+(.08+br*.06)+')',.4*D)}for(var i=0;i<5;i++){var s=.85+sin(t*TAU+i*1.2)*.15;cr(P2[i][0]*Z,P2[i][1]*Z,(1.2+i*.4)*D*s,c,'rgba('+(!i?R:K)+',.6)',D)}}],
['Radar',2800,function(c,t){for(var i=0;i<3;i++)cr(M,M,[.28,.55,.82][i]*M,c,'rgba('+K+',.08)',.35*D);var a=t*TAU;ln(M,M,M+cos(a)*M*.82,M+sin(a)*M*.82,c,'rgba('+R+',.4)',D);for(var i=1;i<6;i++)ln(M,M,M+cos(a-i*.12)*M*.82,M+sin(a-i*.12)*M*.82,c,'rgba('+R+','+((.06*(1-i/6)))+')',.4*D)}],
['Breathe',2800,function(c,t){var b=sin(t*TAU)*.5+.5;var P2=[[.33,.36,2.8],[.64,.3,1.8],[.4,.64,3.5],[.7,.6,1.3]];for(var i=0;i<4;i++){var p=P2[i],dx=(p[0]-.5)*b*.15,dy=(p[1]-.5)*b*.15;cr((p[0]+dx)*Z,(p[1]+dy)*Z,p[2]*D*(.85+b*.15),c,'rgba('+K+','+(.45+b*.3)+')',D)}}],
['Sq Ripple',1800,function(c,t){for(var i=0;i<3;i++){var d=cl((t-i*.1)/.55);if(d<=0||d>=1)continue;var p=oC(d),s=p*M*1.4;c.beginPath();c.rect(M-s/2,M-s/2,s,s);c.strokeStyle='rgba('+(!i?R:K)+','+(.6*sin(d*PI))+')';c.lineWidth=(!i?1.1:.6)*D;c.stroke()}}],
['Explode',1600,function(c,t){var ph=sin(t*TAU)*.5+.5;for(var i=0;i<6;i++){var ag=i*PI/3+t*.5;cr(M+cos(ag)*(4+ph*10)*D,M+sin(ag)*(4+ph*10)*D,(1.2+i*.12)*D,c,'rgba('+(!i?R:K)+',.65)',D)}dt(M,M,1.5*D*(1-ph*.3),c,'rgba('+R+','+(.3*(1-ph))+')')}],
['Ensō',2400,function(c,t){c.beginPath();c.arc(M,M,M*.6,-PI/2,-PI/2+t*5.5);c.strokeStyle='rgba('+R+',.5)';c.lineWidth=1.8*D;c.lineCap='round';c.stroke();c.beginPath();c.arc(M,M,M*.36,-PI/2,-PI/2+t*4.4);c.strokeStyle='rgba('+K+',.1)';c.lineWidth=.6*D;c.lineCap='round';c.stroke()}],
['Wave',2200,function(c,t){for(var i=0;i<7;i++){var y=M+sin(t*TAU*2-i*.9)*5*D;cr((.1+i*.115)*Z,y,(1+sin(i*1.2)*.5)*D,c,'rgba('+(i===3?R:K)+','+(i===3?.6:.45)+')',.9*D)}}],
['Drop',2e3,function(c,t){if(t<.3){dt(M,M*.15+iQ(t/.3)*M*1.2,2*D,c,'rgba('+R+',.6)')}else{for(var i=0;i<3;i++){var d=cl(((t-.3)/.7-i*.1)/.5);if(d<=0||d>=1)continue;c.beginPath();c.arc(M,M*1.35,oC(d)*M*.65,PI,0);c.strokeStyle='rgba('+(!i?R:K)+','+(.5*sin(d*PI))+')';c.lineWidth=.8*D;c.stroke()}}}],
['Stagger',1600,function(c,t){for(var i=0;i<5;i++){var ph=sin(t*TAU+i*.6)*.5+.5;cr((.18+i*.16)*Z,M+sin(t*TAU+i*.8)*3*D,(1+i*.4)*D*(.85+ph*.15),c,'rgba('+(i===2?R:K)+','+(.45+ph*.3)+')',D)}}],
['Bloom',2400,function(c,t){for(var i=0;i<5;i++){var ag=-PI/2+i*TAU/5,ph=sin(t*TAU+i*.5)*.5+.5,dist=M*.35+ph*M*.15;cr(M+cos(ag)*dist,M+sin(ag)*dist,(2.2+i*.2)*D*(.9+ph*.1),c,'rgba('+(!i?R:K)+','+(.4+ph*.2)+')',.8*D)}dt(M,M,1.5*D,c,'rgba('+R+',.35)')}],
['Spiral',2600,function(c,t){for(var i=0;i<12;i++){var ag=i*.5+t*TAU,dist=(2.5+i*1.2)*D;dt(M+cos(ag)*dist,M+sin(ag)*dist,(.5+i*.13)*D,c,'rgba('+(i<2?R:K)+','+(.5-.02*i)+')')}}],
['Double',2200,function(c,t){var C=[[M-5*D,M-3*D,R],[M+5*D,M+3*D,K]];for(var si=0;si<2;si++){var s=C[si],d=cl((t-si*.12)/.5);if(d>0&&d<1)cr(s[0],s[1],oC(d)*M*.55,c,'rgba('+s[2]+','+(.45*sin(d*PI))+')',(.8+si*.2)*D);dt(s[0],s[1],1.5*D,c,'rgba('+(si?K:R)+',.3)')}}],
['Morph',2400,function(c,t){var F=[[.28,.28],[.72,.28],[.72,.72],[.28,.72]],T=[[.5,.18],[.78,.5],[.5,.82],[.22,.5]],mt=sin(t*TAU)*.5+.5;c.beginPath();for(var i=0;i<4;i++){var x=(F[i][0]+(T[i][0]-F[i][0])*mt)*Z,y=(F[i][1]+(T[i][1]-F[i][1])*mt)*Z;i?c.lineTo(x,y):c.moveTo(x,y)}c.closePath();c.strokeStyle='rgba('+K+',.45)';c.lineWidth=.8*D;c.stroke();for(var i=0;i<4;i++){var x=(F[i][0]+(T[i][0]-F[i][0])*mt)*Z,y=(F[i][1]+(T[i][1]-F[i][1])*mt)*Z;cr(x,y,1.5*D,c,'rgba('+(!i?R:K)+',.6)',D)}}],
['Interfere',2600,function(c,t){var C=[[M-7*D,M],[M+7*D,M]];for(var si=0;si<2;si++){for(var i=0;i<3;i++){var d=cl((t-si*.05-i*.08)/.45);if(d<=0||d>=1)continue;cr(C[si][0],C[si][1],oC(d)*M*.6,c,'rgba('+K+','+(sin(d*PI)*.25)+')',.5*D)}dt(C[si][0],C[si][1],1.2*D,c,'rgba('+K+',.2)')}}],
['Bounce',2e3,function(c,t){var P2=[[.28,.33,2.2],[.55,.26,3.2],[.72,.52,1.8],[.38,.65,2.6]];for(var i=0;i<4;i++){var p=P2[i],b=Math.abs(sin(t*TAU+i*.8));cr(p[0]*Z,p[1]*Z+sin(t*TAU+i)*(1-b)*3*D,p[2]*D*(.9+b*.15),c,'rgba('+(i===1?R:K)+','+(.5+b*.25)+')',1.1*D)}}],
['Fusion',2800,function(c,t){var P2=[[.28,.33],[.67,.28],[.57,.67],[.28,.6]];for(var i=0;i<4;i++){var p=P2[i],br=sin(t*TAU+i*1.2)*.5+.5;cr(p[0]*Z,p[1]*Z,(1.5+i*.25)*D,c,'rgba('+(!i?R:K)+','+(.5+br*.2)+')',D);var rd=cl((t+i*.15)%1);if(rd<.6)cr(p[0]*Z,p[1]*Z,oC(rd/.6)*7*D,c,'rgba('+(!i?R:K)+','+((.2*(1-rd/.6)))+')',.4*D)}}],
['Ping',1400,function(c,t){dt(M,M,2.5*D,c,'rgba('+R+',.6)');var d=(t*2)%1;cr(M,M,oC(d)*M*.7,c,'rgba('+R+','+((1-d)*.35)+')',D)}],
['Pendulum',2800,function(c,t){var ag=sin(t*TAU)*.5,x=M+sin(ag)*M*.55,y=M*.3+cos(ag)*M*.55;ln(M,M*.18,x,y,c,'rgba('+K+',.18)',.5*D);cr(x,y,2.5*D,c,'rgba('+K+',.55)',.9*D)}],
['DNA',3e3,function(c,t){for(var i=0;i<8;i++){var y=(.1+i*.1)*Z,ph=t*4*PI+i*.7,x1=M+sin(ph)*M*.38,x2=M-sin(ph)*M*.38;dt(x1,y,.9*D,c,'rgba('+K+',.5)');dt(x2,y,.9*D,c,'rgba('+K+',.35)');ln(x1,y,x2,y,c,'rgba('+K+',.12)',.3*D)}}],
['Shockwave',1400,function(c,t){var d=(t*2)%1;c.beginPath();c.arc(M,M,oC(d)*M*.9,0,TAU);c.lineWidth=(.5+3.5*(1-d))*D;c.strokeStyle='rgba('+R+','+((1-d)*.6)+')';c.stroke();dt(M,M,1.5*D,c,'rgba('+R+',.3)')}],
['Gravity',2200,function(c,t){for(var i=0;i<5;i++){var ph=(t+i*.12)%1;dt((.15+i*.175)*Z,M*.12+iQ(ph)*Z*.72,(1.2+i*.25)*D,c,'rgba('+(i===2?R:K)+','+(i===2?.6:.4)+')')}}],
['Rotate',2400,function(c,t){c.save();c.translate(M,M);c.rotate(t*TAU);var s=M*.48;c.beginPath();c.rect(-s/2,-s/2,s,s);c.strokeStyle='rgba('+K+',.45)';c.lineWidth=D;c.stroke();c.restore()}],
['Typewriter',2e3,function(c,t){for(var i=0;i<6;i++){var show=((t*6-i)%6+6)%6<1.5;if(!show)continue;var x=(.12+i*.14)*Z;c.beginPath();c.moveTo(x,M-3*D);c.lineTo(x,M+3*D);c.strokeStyle='rgba('+K+',.5)';c.lineWidth=1.3*D;c.lineCap='round';c.stroke()}}],
['Crosshair',2e3,function(c,t){var p=sin(t*TAU)*.5+.5,L=M*.6;c.beginPath();c.moveTo(M-L,M);c.lineTo(M+L,M);c.moveTo(M,M-L);c.lineTo(M,M+L);c.strokeStyle='rgba('+K+','+(.3+p*.15)+')';c.lineWidth=.5*D;c.stroke();cr(M,M,M*.35*(1+p*.08),c,'rgba('+K+','+(.2+p*.1)+')',.5*D);dt(M,M,1.8*D,c,'rgba('+R+','+(.4+p*.2)+')')}],
['Glitch',900,function(c,t){var P2=[[.3,.35,2.5],[.6,.4,3],[.45,.65,2],[.7,.55,1.5]];for(var i=0;i<4;i++){var p=P2[i],f=sin(t*80+i*20)>.1?1:.4,ox=(sin(t*50+i*15)>.5?1.5:-1.5)*D;cr(p[0]*Z+ox*f,p[1]*Z,p[2]*D*(.7+f*.3),c,'rgba('+(!i?R:K)+','+(.5+f*.2)+')',D)}}],
['Tri Ripple',1800,function(c,t){for(var i=0;i<3;i++){var d=cl((t-i*.1)/.55);if(d<=0||d>=1)continue;var p=oC(d),s=p*M*1.15;c.beginPath();for(var j=0;j<3;j++){var ag=-PI/2+j*TAU/3;j?c.lineTo(M+cos(ag)*s,M+sin(ag)*s):c.moveTo(M+cos(ag)*s,M+sin(ag)*s)}c.closePath();c.strokeStyle='rgba('+(!i?R:K)+','+(.6*sin(d*PI))+')';c.lineWidth=(!i?1:.6)*D;c.stroke()}}],
['Scatter',2e3,function(c,t){for(var i=0;i<8;i++){var ag=i*.785+.3+sin(t*TAU+i)*.15,dist=(5+i*1.5)*D;dt(M+cos(ag)*dist,M+sin(ag)*dist,(.7+i*.1)*D,c,'rgba('+(i<2?R:K)+',.5)')}}],
['Sine',2800,function(c,t){c.beginPath();for(var i=0;i<=40;i++){var x=i/40*Z,y=M+sin(i/40*3*PI+t*4*PI)*M*.3;i?c.lineTo(x,y):c.moveTo(x,y)}c.strokeStyle='rgba('+K+',.35)';c.lineWidth=D;c.stroke()}],
['Matrix',2e3,function(c,t){for(var r=0;r<4;r++)for(var co=0;co<4;co++){var i=r*4+co,on=sin(t*12+i*1.3)>.2;if(!on)continue;dt((.2+co*.2)*Z,(.2+r*.2)*Z,1.1*D,c,'rgba('+((r+co)%3===0?R:K)+',.5)')}}],
['Vortex',3e3,function(c,t){for(var i=0;i<16;i++){var a=i/16*TAU+t*TAU*2,d=(3.5+i*.7)*D;dt(M+cos(a)*d,M+sin(a)*d,.55*D,c,'rgba('+(i<3?R:K)+',.45)')}}],
['Hex Ripple',1800,function(c,t){for(var i=0;i<3;i++){var d=cl((t-i*.1)/.55);if(d<=0||d>=1)continue;var p=oC(d),s=p*M;c.beginPath();for(var j=0;j<6;j++){var ag=-PI/6+j*PI/3;j?c.lineTo(M+cos(ag)*s,M+sin(ag)*s):c.moveTo(M+cos(ag)*s,M+sin(ag)*s)}c.closePath();c.strokeStyle='rgba('+(!i?R:K)+','+(.6*sin(d*PI))+')';c.lineWidth=(!i?1:.6)*D;c.stroke()}}],
['Cascade',2e3,function(c,t){for(var i=0;i<5;i++){var ph=sin(t*TAU+i*.7)*.5+.5;cr((.15+i*.175)*Z,(.2+i*.15)*Z+sin(t*TAU+i*.9)*2*D,(1.5+i*.25)*D*(.9+ph*.1),c,'rgba('+(!i?R:K)+','+(.45+ph*.25)+')',D)}}],
['Pulse Grid',2e3,function(c,t){for(var r=0;r<3;r++)for(var co=0;co<3;co++){var i=r*3+co,pl=sin(t*TAU+i*.6)*.5+.5;cr((.25+co*.25)*Z,(.25+r*.25)*Z,(1.3+pl*.5)*D,c,'rgba('+(i===4?R:K)+','+(.35+pl*.3)+')',.7*D)}}],
['Comet',2200,function(c,t){var hx=Z*.08+t*Z*.84,hy=M+sin(t*TAU)*-M*.25;dt(hx,hy,2*D,c,'rgba('+R+',.65)');for(var i=1;i<6;i++){var tp=(t-i*.04+1)%1;dt(Z*.08+tp*Z*.84,M+sin(tp*TAU)*-M*.25,(.8-i*.1)*D,c,'rgba('+K+','+((.2*(1-i/6)))+')')}}],
['Zip',1200,function(c,t){for(var i=0;i<3;i++){var ph=(t+i*.15)%1,w=Z*.55*oQn(ph<.5?ph*2:2-ph*2),y=(.3+i*.2)*Z;c.beginPath();c.moveTo(M-w/2,y);c.lineTo(M+w/2,y);c.strokeStyle='rgba('+(i===1?R:K)+','+(i===1?.45:.3)+')';c.lineWidth=(i===1?1.1:.5)*D;c.lineCap='round';c.stroke()}}],
['Iris',2200,function(c,t){var op=sin(t*TAU)*.5+.5;for(var i=0;i<6;i++){var ag=i*PI/3,inner=M*.15,outer=inner+M*.55*op;ln(M+cos(ag)*inner,M+sin(ag)*inner,M+cos(ag)*outer,M+sin(ag)*outer,c,'rgba('+(!i?R:K)+','+(.35+op*.2)+')',.7*D)}cr(M,M,M*.15,c,'rgba('+K+',.15)',.4*D)}],
['Sprinkle',1800,function(c,t){var s=[.12,.37,.62,.85,.23,.51,.74,.42,.68,.15];for(var i=0;i<10;i++){if(sin(t*3*PI+i*1.7)>.1)dt(s[i]*Z,s[(i+3)%10]*Z,(.5+s[(i+5)%10]*.7)*D,c,'rgba('+(i%4===0?R:K)+',.45)')}}],
['Lighthouse',3e3,function(c,t){dt(M,M*1.55,1.6*D,c,'rgba('+K+',.2)');var ag=-PI/2+t*TAU;for(var i=-2;i<=2;i++)ln(M,M*1.55,M+cos(ag+i*.05)*M*1.3,M*1.55+sin(ag+i*.05)*M*1.3,c,'rgba('+R+','+((.14*(1-Math.abs(i)/3)))+')',.5*D)}],
['Molecule',2400,function(c,t){var N=[[.5,.5],[.25,.25],[.75,.25],[.25,.75],[.75,.75]],br=sin(t*TAU)*.5+.5;var E2=[[0,1],[0,2],[0,3],[0,4]];for(var i=0;i<4;i++){var f=N[E2[i][0]],to=N[E2[i][1]];ln(f[0]*Z,f[1]*Z,to[0]*Z,to[1]*Z,c,'rgba('+K+','+(.1+br*.05)+')',.4*D)}for(var i=0;i<5;i++){var s=.9+sin(t*TAU+i*1.1)*.1;cr(N[i][0]*Z,N[i][1]*Z,(!i?2.5:1.6)*D*s,c,'rgba('+(!i?R:K)+','+(!i?.6:.45)+')',D)}}],
['Wipe',1600,function(c,t){var w=Z*t;c.beginPath();c.rect(0,M-1.2*D,w,2.4*D);c.fillStyle='rgba('+R+','+(sin(t*PI)*.2)+')';c.fill();for(var i=0;i<4;i++){var x=(.2+i*.2)*Z;if(x<=w)dt(x,M,(1.1+i*.2)*D,c,'rgba('+K+',.5)')}}],
['Aurora',3200,function(c,t){for(var l=0;l<3;l++){c.beginPath();for(var i=0;i<=32;i++){var x=i/32*Z,w=sin(i/32*TAU+t*5+l*1.5)*M*.22+sin(i/32*4*PI+t*3)*M*.08,y=(.3+l*.14)*Z+w;i?c.lineTo(x,y):c.moveTo(x,y)}c.strokeStyle='rgba('+(!l?R:K)+','+(!l?.25:.12)+')';c.lineWidth=(1-.2*l)*D;c.stroke()}}],
];
return{init:init,lib:lib,easing:{oC:oC,oQ:oQ,oQn:oQn,oE:oE,oB:oB,io:io,bn:bn,iQ:iQ},cl:cl,cr:cr,dt:dt,ln:ln,R:R,K:K}
})();

if(typeof module!=="undefined")module.exports=MicroAnim;
