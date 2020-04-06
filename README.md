# Share-B-and-C

Open Source Online Teaching/Interview Platform

The objective of this platform is to provide share board and code to users in same room, where all can edit the content and live communication can be done.

## Todo

- [ ] design icons and logo
- [X] resizing issue
- [X] authentication
- [ ] sockets
- [X] Schema in firebase
- [ ] tokenise data for transmission
- [ ] Record option
- [ ] page to play recorded videos


## Contributions

Contribution to issues mentioned are always welcomed.



window.editor.executeEdits("", [
     { range: obj.changes[0].range, text: obj.changes[0].text }
]);

use this to update the data

function writeInCodeEditor(obj) {
        db.collection("codeEditor").doc(variables.codeEditorId).set(obj)
        .then(function() {
            console.log("Object successfully written!");
        })
        .catch(function(error) {
            console.error("Error writing document: ", error);
        });
    }