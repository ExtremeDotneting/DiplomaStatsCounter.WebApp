import Dialogs from "@/js/Dialogs";
import {
    CharacterList
} from "@/js/router.js";
import Vue from 'vue'

let Tests = {
    DialogTests: {
        async HtmlElementContent() {
            let el = document.createElement("p");
            el.innerHTML="HI!!!!!!!";
            await Dialogs.showDialog({
                htmlElementContent: el,
                maxWidth: 600
            });
        },
        async CreatedComponentContent() {
            let CompClass = Vue.extend(CharacterList);
            let instance = new CompClass( /* here can configure it */ );
            await Dialogs.showDialog({
                createdComponentContent: instance,
                maxWidth: 600
            });
        },
        async TypeOfComponentContent() {
            await Dialogs.showDialog({
                typeOfComponentContent: CharacterList,
                fullscreen: true
            });
        },
        async AwaitTest() {
            var index = 1;
            var promiseRes = await Dialogs.showDialog({
                title: "Form 1",
                text: "Form text 1",
                maxWidth: 1000            
            });
            console.log("Form #" + index + ":\n" + promiseRes);
            index++;

            promiseRes = await Dialogs.showDialog({
                title: "Form 2",
                text: "Form text 2",
                fullscreen: true
            });
            console.log("Form #" + index + ":\n" + promiseRes);
            index++;

            promiseRes = await Dialogs.showDialog({
                title: "Form 3",
                maxWidth: 500
            });
            console.log("Form #" + index + ":\n" + promiseRes);
            index++;

        },
        async FS() {
            var index = 1;
            var promiseRes = await Dialogs.showDialog({
                title: "Fullscreen form",
                text: "Form text",
                fullscreen: true
            });
            console.log("Form #" + index + ":\n" + promiseRes);
        },
        async NotFS() {
            var index = 1;
            var promiseRes = await Dialogs.showDialog({
                title: "1000px width form",
                maxWidth: 1000
            });
            console.log("Form #" + index + ":\n" + promiseRes);

        },
        Multiple() {
            Dialogs.showDialog({
                title: "Form 1",
                text: "Open many forms.",
                maxWidth: 1000
            });
            Dialogs.showDialog({
                title: "Form 2",
                text: "Open many forms.",
                maxWidth: 800
            });
            Dialogs.showDialog({
                title: "Form 3",
                text: "Open many forms.",
                maxWidth: 600
            });
            Dialogs.showDialog({
                title: "Form 4",
                text: "Open many forms.",
                maxWidth: 500
            });
            Dialogs.showDialog({
                title: "Form 5",
                text: "Open many forms.",
                maxWidth: 400
            });

        }
    }
}

export default Tests;