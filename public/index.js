let variables = {
    color: 'white',
    colorPalatte: {
        'white': 'white',
        'teal': 'teal',
        'red': 'rgb(204, 3, 3)',
        'purple': '#626ee3',
        'brown': 'rgb(126, 47, 47)'
    },
    defaultCode: {
        'javascript': '// Code your js here',
        'cpp': '#include<bits/stdc++.h>\nusing namespace std;\n\nint main() {\n\n\treturn 0;\n\n}\n',
        'c': '#include <stdio.h>\n\nint main() {\n\n\treturn 0;\n\n}\n',
        'python': '#write your code here',
        'markdown': '# Heading 1',
        'dart': '// code in dart here'
    },
    editorValue: '#include<bits/stdc++.h>\nusing namespace std;\n\nint main() {\n\n\treturn 0;\n\n}\n',
    language: 'cpp',
    fontSize: '12px',
    theme : 'vs-light',
    strokeSize : 2,
    isRecording : false,
    timer : "00:00"
}

const x = document.getElementById("drawEditor");
const canvas = document.getElementById('drawBoard')
canvas.height = x.offsetHeight
canvas.width = x.offsetWidth

require.config({ paths: { 'vs': 'https://unpkg.com/monaco-editor@latest/min/vs' } });
window.MonacoEnvironment = { getWorkerUrl: () => proxy };

let proxy = URL.createObjectURL(new Blob([`
	self.MonacoEnvironment = {
		baseUrl: 'https://unpkg.com/monaco-editor@latest/min/'
	};
	importScripts('https://unpkg.com/monaco-editor@latest/min/vs/base/worker/workerMain.js');
`], { type: 'text/javascript' }));

require(["vs/editor/editor.main"], function () {
    window.editor = monaco.editor.create(document.getElementById('codeEditor'), {
        value: variables.editorValue,
        language: variables.language,
        fontSize: variables.fontSize,
        minimap: {
            enabled: false
        },

    });
    window.editor.onDidChangeModelContent((event => {
        console.log(event)
    }));
});

function dragElement(element, direction) {
    let md;
    const first = document.getElementById("drawEditor");
    const second = document.getElementById("codeEditor");
    element.onmousedown = e => {
        md = {
            e,
            offsetLeft: element.offsetLeft,
            offsetTop: element.offsetTop,
            firstWidth: first.offsetWidth,
            secondWidth: second.offsetWidth
        };
        document.onmousemove = onMouseMove;
        document.onmouseup = () => document.onmousemove = document.onmouseup = null;
    }
    function onMouseMove(e) {
        element.style.width = '10px';
        let delta = { x: e.clientX - md.e.x, y: e.clientY - md.e.y };
        if (direction === "H") {
            delta.x = Math.min(Math.max(delta.x, -md.firstWidth), md.secondWidth);
            element.style.left = md.offsetLeft + delta.x + "px";
            first.style.width = (md.firstWidth + delta.x) + "px";
            second.style.width = (md.secondWidth - delta.x) + "px";
        }
        window.editor.layout();
        const x = document.getElementById("drawEditor");
        const canvas = document.getElementById('drawBoard')
        canvas.height = x.offsetHeight - 4
        canvas.width = x.offsetWidth
    }
}
dragElement(document.getElementById("mainSlider"), "H");

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
    if (!painting) return;
    context.lineWidth = variables.strokeSize;
    context.lineCap = "round"
    context.strokeStyle = variables.color

    context.lineTo(e.clientX - 8, e.clientY - 50);
    context.stroke();
    context.beginPath();
    context.moveTo(e.clientX - 8, e.clientY - 50);
}

canvas.addEventListener('mousedown', startPainting)
canvas.addEventListener('mouseup', endPainting)

canvas.addEventListener('mousemove', draw)

for (let propt in variables.colorPalatte) {
    document.getElementById(propt).onclick = () => {
        variables.color = variables.colorPalatte[propt]
        for (let item in variables.colorPalatte) {
            document.getElementById(item).classList.remove('selectedColor');
        }
        document.getElementById(propt).classList.add('selectedColor');
    }
}


document.getElementById('languages').onchange = () => {
    let i = document.getElementById('languages').selectedIndex
    let arr = document.getElementById('languages').options
    variables.language = arr[i].value
    console.log(variables.language)
    let model = window.editor.getModel();
    monaco.editor.setModelLanguage(model, variables.language)


    var e = document.querySelector("#codeEditor"); 
    var child = e.lastElementChild;  
    while (child) { 
        e.removeChild(child); 
        child = e.lastElementChild; 
    } 
    window.editor = monaco.editor.create(document.getElementById('codeEditor'), {
        value: variables.defaultCode[variables.language],
        language: variables.language,
        fontSize: variables.fontSize,
        minimap: {
            enabled: false
        },

    });
    window.editor.onDidChangeModelContent((event => {
        console.log(event)
    }));
}

document.getElementById('themes').onchange = () => {
    let i = document.getElementById('themes').selectedIndex
    let arr = document.getElementById('themes').options
    variables.theme = arr[i].value
    console.log(variables.theme)
    let model = window.editor.getModel();
    monaco.editor.setTheme(variables.theme)
}

document.getElementById('strokeSize').onchange = () => {
    let i = document.getElementById('strokeSize').selectedIndex
    let arr = document.getElementById('strokeSize').options
    variables.strokeSize = parseInt(arr[i].value)
    console.log(variables.strokeSize)
}

document.getElementById()