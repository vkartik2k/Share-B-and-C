$(document).ready( function () {
    let db = firebase.firestore();
    $('#drawBoard')[0].height= $('#drawEditor').height()
    $('#drawBoard')[0].width=$('#drawEditor').width()
    const context = $('#drawBoard')[0].getContext('2d')

    $(window).resize(()=>location.reload())

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
            'cpp': '#include<bits/stdc++.h>\nusing namespace std\n\nint main() {\n\n\treturn 0;\n\n}\n',
            'c': '#include <stdio.h>\n\nint main() {\n\n\treturn 0;\n\n}\n',
            'python': '#write your code here',
            'markdown': '# Heading 1',
            'dart': '// code in dart here'
        },
        strokeSize : 2,
        isRecording : false,
        timer : "00:00",
        codeEditorId : 'fwUqAbDCPHAi7Mi09GYz',
        paintBuffer : [],
        startPaintBufferTime : null
    }

    function writeInCodeEditor(obj) {
        localStorage.editorValue = window.editor.getValue()
        if(localStorage.user == "a") {
            db.collection("codeEditor").doc(variables.codeEditorId).set({content : [{
                range : {
                    startLineNumber: obj.changes[0].range.startLineNumber,
                    startColumn: obj.changes[0].range.startColumn,
                    endLineNumber: obj.changes[0].range.endLineNumber,
                    endColumn: obj.changes[0].range.endColumn,
                    
                },
                text : obj.changes[0].text
            }]})
            .then(function() {
                console.log("Object successfully written!");
            })
            .catch(function(error) {
                console.error("Error writing document: ", error);
            });
        }
    }

    function loadCodeEditor () {
        require.config({ paths: { 'vs': 'https://unpkg.com/monaco-editor@latest/min/vs' }})
        window.MonacoEnvironment = { getWorkerUrl: () => proxy }
        let proxy = URL.createObjectURL(new Blob([`
            self.MonacoEnvironment = {
                baseUrl: 'https://unpkg.com/monaco-editor@latest/min/'
            }
            importScripts('https://unpkg.com/monaco-editor@latest/min/vs/base/worker/workerMain.js')
        `], { type: 'text/javascript' }))

        require(["vs/editor/editor.main"], function () {
            window.editor = monaco.editor.create(document.getElementById('codeEditor'), {
                value: localStorage.editorValue,
                language: localStorage.language,
                fontSize: localStorage.fontSize,
                minimap: {
                    enabled: false
                },
                theme : localStorage.theme
            })
            window.editor.onDidChangeModelContent((event => writeInCodeEditor(event)))
        })
    }

    function dragElement(element, direction) {
        let md
        const first = document.getElementById("drawEditor")
        const second = document.getElementById("codeEditor")
        element.onmousedown = e => {
            md = {
                e,
                offsetLeft: element.offsetLeft,
                offsetTop: element.offsetTop,
                firstWidth: first.offsetWidth,
                secondWidth: second.offsetWidth
            }
            document.onmousemove = onMouseMove
            document.onmouseup = () => document.onmousemove = document.onmouseup = null
        }
        function onMouseMove(e) {
            element.style.width = '10px'
            let delta = { x: e.clientX - md.e.x, y: e.clientY - md.e.y }
            if (direction === "H") {
                delta.x = Math.min(Math.max(delta.x, -md.firstWidth), md.secondWidth)
                element.style.left = md.offsetLeft + delta.x + "px"
                first.style.width = (md.firstWidth + delta.x) + "px"
                second.style.width = (md.secondWidth - delta.x) + "px"
            }
            window.editor.layout()
            $('#drawBoard')[0].height= $('#drawEditor').height() - 4
            $('#drawBoard')[0].width=$('#drawEditor').width()
        }
    }

    function signIn() {
        let provider = new firebase.auth.GoogleAuthProvider()
        provider.addScope('https://www.googleapis.com/auth/contacts.readonly')
        firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
        .then(function() {
            return firebase.auth().signInWithPopup(provider).then(result => {
                $('#avator').attr('src', result.user.photoURL)
                $('#avatorContainer').show()
                $('#joinRoomBtnContainer').show()
                $('#signInContainer').hide()
                console.log("hello ji")
            }).catch(err => console.error(err))
            
        })
        .catch(function(error) {
            console.error(error.message)
        })
        
    }

    function enableDrawing() {
        let painting = false

        const startPainting = (e) => {
            painting = true
            draw(e)
        }
        const endPainting = () => {
            context.beginPath()
            painting = false
        }

        const draw = e => {
            if (!painting) return
            context.lineWidth = variables.strokeSize
            context.lineCap = "round"
            context.strokeStyle = variables.color

            context.lineTo(e.clientX-8, e.clientY - 42)
            context.stroke()
            context.beginPath()
            context.moveTo(e.clientX-8, e.clientY - 42)

            variables.paintBuffer.push([e.clientX, e.clientY, Date.now()])
            if (!variables.startPaintBufferTime) {
                variables.startPaintBufferTime = Date.now()
                setTimeout(function () {
                    console.log(variables.paintBuffer)
                    variables.paintBuffer = []
                    variables.startPaintBufferTime = null
                }, 1000)
            }
        }

        const canvas = $('#drawBoard')[0]
        canvas.addEventListener('mousedown', startPainting)
        canvas.addEventListener('mouseup', endPainting)

        canvas.addEventListener('mousemove', draw)
        
    }

    function saveDrawing() {
        const canvas = $('#drawBoard')[0]
        var imgurl= canvas.toDataURL( ) ;
        console.log(imgurl)
    }

    function enableSettings() {
        for (let propt in variables.colorPalatte) {
            document.getElementById(propt).onclick = () => {
                variables.color = variables.colorPalatte[propt]
                for (let item in variables.colorPalatte) {
                    document.getElementById(item).classList.remove('selectedColor')
                }
                document.getElementById(propt).classList.add('selectedColor')
            }
        }
    
        document.getElementById('languages').onchange = () => {
            let i = document.getElementById('languages').selectedIndex
            let arr = document.getElementById('languages').options
            localStorage.language = arr[i].value
            let model = window.editor.getModel()
            monaco.editor.setModelLanguage(model, localStorage.language)
            var e = document.querySelector("#codeEditor") 
            var child = e.lastElementChild  
            while (child) { 
                e.removeChild(child) 
                child = e.lastElementChild 
            } 
            localStorage.editorValue = variables.defaultCode[localStorage.language]
            window.editor = monaco.editor.create(document.getElementById('codeEditor'), {
                value: localStorage.editorValue,
                language: localStorage.language,
                fontSize: localStorage.fontSize,
                minimap: {
                    enabled: false
                },
                theme : localStorage.theme
    
            })
            window.editor.onDidChangeModelContent((event => {
                window.obj = (event)
            }))
        }
    
        document.getElementById('themes').onchange = () => {
            let i = document.getElementById('themes').selectedIndex
            let arr = document.getElementById('themes').options
            localStorage.theme = arr[i].value
            console.log(variables.theme)
            let model = window.editor.getModel()
            monaco.editor.setTheme(localStorage.theme)
        }
    
        document.getElementById('strokeSize').onchange = () => {
            let i = document.getElementById('strokeSize').selectedIndex
            let arr = document.getElementById('strokeSize').options
            variables.strokeSize = parseInt(arr[i].value)
            console.log(variables.strokeSize)
        }
    }
    
    function updateCodeEditor() {
        if(localStorage.user != "a") {
            db.collection("codeEditor").doc(variables.codeEditorId).onSnapshot(function(snapshot) { 
                let newObj = new monaco.Range(1,1,1,1)
                console.log(newObj)
                window.editor.executeEdits("", [
                    { range: new monaco.Range(
                        snapshot.data().content[0].range.startLineNumber,
                        snapshot.data().content[0].range.startColumn,
                        
                        snapshot.data().content[0].range.endLineNumber,
                        
                        snapshot.data().content[0].range.endColumn,
                        
                    ), text: snapshot.data().content[0].text }
               ]);
            });
        }
    }

    function loadPage() {
        if(!localStorage.language || localStorage.language == '') {
            localStorage.language = 'cpp'
        }
        if(!localStorage.theme || localStorage.theme == '') {
            localStorage.theme = 'vs-light'
        }
        if(!localStorage.editorValue || localStorage.editorValue == '') {
            localStorage.editorValue = variables.defaultCode[localStorage.language]
        }
        $('#languages option[value="'+localStorage.language+'"]').attr("selected",true);
        $('#themes option[value="'+localStorage.theme+'"]').attr("selected",true);
    }

    loadPage()
    loadCodeEditor()
    dragElement($('#mainSlider')[0], "H")
    $('#signIn').click(signIn)
    enableDrawing()
    enableSettings()
    updateCodeEditor()
})