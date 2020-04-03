let variables = {
    color : 'white',
    colorPalatte : {
        'white' : 'white',
        'teal' : 'teal',
        'red' : 'rgb(204, 3, 3)',
        'purple' : '#626ee3',
        'brown' : 'rgb(126, 47, 47)'
    },
    language : 'cpp'
}
const x  = document.getElementById("drawEditor");
const canvas = document.getElementById('drawBoard')
canvas.height = x.offsetHeight
canvas.width = x.offsetWidth

require.config({ paths: { 'vs': 'https://unpkg.com/monaco-editor@latest/min/vs' }});
window.MonacoEnvironment = { getWorkerUrl: () => proxy };

let proxy = URL.createObjectURL(new Blob([`
	self.MonacoEnvironment = {
		baseUrl: 'https://unpkg.com/monaco-editor@latest/min/'
	};
	importScripts('https://unpkg.com/monaco-editor@latest/min/vs/base/worker/workerMain.js');
`], { type: 'text/javascript' }));

require(["vs/editor/editor.main"], function () {
	window.editor = monaco.editor.create(document.getElementById('codeEditor'), {
		value: '#include<bits/stdc++.h>\nusing namespace std;\n\nint main() {\n\n\treturn 0;\n\n}\n',
        language: variables.language,
        fontSize: '12px',
        minimap: {
            enabled: false
        },
        
    });
    window.editor.onDidChangeModelContent((event => {
        console.log(event)
    })); 
});

function dragElement( element, direction) {
    let md;
    const first  = document.getElementById("drawEditor");
    const second = document.getElementById("codeEditor");
    element.onmousedown = e => {
        md = {
            e,
            offsetLeft:  element.offsetLeft,
            offsetTop:   element.offsetTop,
            firstWidth:  first.offsetWidth,
            secondWidth: second.offsetWidth
        };
        document.onmousemove = onMouseMove;
        document.onmouseup = () => document.onmousemove = document.onmouseup = null;
    }
    function onMouseMove(e) {
        element.style.width = '10px';
        let delta = {x: e.clientX - md.e.x, y: e.clientY - md.e.y};
        if (direction === "H" ) {
            delta.x = Math.min(Math.max(delta.x, -md.firstWidth), md.secondWidth);
            element.style.left = md.offsetLeft + delta.x + "px";
            first.style.width = (md.firstWidth + delta.x) + "px";
            second.style.width = (md.secondWidth - delta.x) + "px";
        }
        window.editor.layout();
        const x  = document.getElementById("drawEditor");
        const canvas = document.getElementById('drawBoard')
        canvas.height = x.offsetHeight-4
        canvas.width = x.offsetWidth
    }
}
dragElement( document.getElementById("mainSlider"), "H" );

const context = document.querySelector('#drawBoard').getContext('2d');

let painting = false;

const startPainting = (e) => {
    painting = true;
    draw(e)
}
const endPainting = () => {
    context.beginPath();
    painting = false;
}

const draw = e => {
    if(!painting) return;
    context.lineWidth = 2;
    context.lineCap = "round"
    context.strokeStyle= variables.color

    context.lineTo(e.clientX-8, e.clientY-58);
    context.stroke();
    context.beginPath();
    context.moveTo(e.clientX-8, e.clientY-58); 
}

canvas.addEventListener('mousedown', startPainting)
canvas.addEventListener('mouseup', endPainting)

canvas.addEventListener('mousemove', draw)

for(let propt in variables.colorPalatte){
    document.getElementById(propt).onclick = () => {
        variables.color = variables.colorPalatte[propt]
        for(let item in variables.colorPalatte) {
            document.getElementById(item).classList.remove('selectedColor');
        }
        document.getElementById(propt).classList.add('selectedColor');
    }
}

document.getElementById('languages').onchange = () => {
    let i = document.getElementById('languages').selectedIndex
    let arr = document.getElementById('languages').options
    variables.language = arr[i]
    window.editor.language = variables.language
}
