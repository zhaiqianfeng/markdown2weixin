const marked=require('marked');
const fs=require('fs');
const path=require('path');
const render=new marked.Renderer();


const args=process.argv.splice(2);
if(args.length==0){
    console.error('没有处理的文件....\r\n使用方式node app-html input.tmd out.html')
    return;
}

let mdFile=path.resolve(args[0]);
let outFile=path.resolve(args[1]?args[1]:'./output/out.html');

function escape(html, encode) {
    return html
        .replace(!encode ? /&(?!#?\w+;)/g : /&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}


render.heading=function (text, level) {
    let html=[];
    if(level==4) {
        html.push('<section>\
        <section style="text-align:center;margin:12px 0px;">\
        <section style="display: inline-block; padding: 0px 10px; color: rgb(255, 255, 255); background-color: rgb(122, 191, 130);">\
        <section style="display:inline-block;vertical-align:top;margin-top:1px;padding:0px 5px;">\
        <p style="line-height: 1.8em; letter-spacing: 2px; margin: 0px; font-size: 16px;">');
        html.push(text);
        html.push(' </p>\
        </section>\
        </section>\
        </section>\
        </section>');
    }else if(level==5){
        html.push('<section>\
            <section style="margin:0 auto;overflow:hidden">\
            <section style="border-bottom:1px solid #000;padding-bottom:.4em">\
            <section style="border-left-width:.2em;border-left-style:solid;border-left-color:#5FAAFF;padding-left:10px">\
            <p style="margin:0;display:inline-block;vertical-align:top;font-size:15px;font-weight:bold">');
        html.push(text);
        html.push('                </p>\
            </section>\
            </section>\
            </section>\
            </section>');
    }
    return html.join('');
}

render.code=function (code, lang, escaped) {
    let html=[];
    html.push('<pre style="margin:2px;overflow-x: auto;font-size:12px;padding:5px;border:1px solid #4CAF50;line-height:1.5em"><code>');
    html.push(escaped ? code : escape(code, true));
    html.push('</code></pre>');
    return html.join('');
}


render.list=function(body, ordered){
    let html=[];
    html.push('<ul class=" list-paddingleft-2" style="list-style-type: square;">');
    html.push(body);
    html.push('</ul>');
    return html.join('');
}

render.listitem=function(text){
    let html=[];
    html.push('<li><p>');
    html.push(text);
    html.push('</p></li>');
    return html.join('');
}

render.blockquote=function(text){
    let html=[];
    html.push('<blockquote style="margin-bottom:8px;font-size:12px;color:gray;">');
    html.push(text);
    html.push('</blockquote>');
    return html.join('');
}

render.image=function(href, title, text) {
    var out = '<img src="' + href + '" alt="' + text + '"';
    if (title) {
        out += ' title="' + title + '"';
    }
    out += this.options.xhtml ? '/>' : '>';
    return '<p align="center">'+out+"</p>";
}
render.paragraph=function(text){
    let html=[];
    html.push('<section>\
        <section style="margin:0 auto;overflow:hidden">\
        <section style="margin-top:5px;line-height:30px;">\
        <p style="margin:0;font-size:14px">');
    html.push(text);
    html.push('            </p>\
        </section>\
        </section>\
        </section>');
    return html.join('');

}

var tmpHmtl='';

fs.readFile(path.resolve(__dirname,'./resources/tmp.md'),'utf8',(err,data)=>{
    if(err)throw err;

    tmpHmtl=data;
});

fs.readFile(mdFile,'utf8',(err,data)=>{
    if(err)throw err;

    data=data.replace(/{%\s+qqgroup.*%}/,'');

    let html=marked(data,{renderer:render});
    tmpHmtl=tmpHmtl.replace('\{bodyContent\}',html);

    fs.writeFile(outFile,tmpHmtl, 'utf8',function (err) {
        if(err){fs.mkdir(path.dirname(outFile),(err)=>{
            fs.writeFile(outFile,tmpHmtl, 'utf8',function (err) {
               if(err)throw  err;
            });
        });}
    })
});