import dialogs from "@/js/dialogs";
import {
    LoginPage
} from "@/js/router.js";
import Vue from 'vue'

let tests = {
    DialogTests: {
        async HtmlElementContent() {
            let el = document.createElement("p");
            el.innerHTML="HI!!!!!!!";
            await dialogs.showDialog({
                htmlElementContent: el,
                maxWidth: 600
            });
        },
        async CreatedComponentContent() {
            let CompClass = Vue.extend(LoginPage);
            let instance = new CompClass( /* here can configure it */ );
            await dialogs.showDialog({
                createdComponentContent: instance,
                maxWidth: 600
            });
        },
        async TypeOfComponentContent() {
            await dialogs.showDialog({
                typeOfComponentContent: LoginPage,
                fullscreen: true
            });
        },
        async AwaitTest() {
            var index = 1;
            var promiseRes = await dialogs.showDialog({
                title: "Form 1",
                text: "Form text 1",
                maxWidth: 1000            
            });
            console.log("Form #" + index + ":\n" + promiseRes);
            index++;

            promiseRes = await dialogs.showDialog({
                title: "Form 2",
                text: "Form text 2",
                fullscreen: true
            });
            console.log("Form #" + index + ":\n" + promiseRes);
            index++;

            promiseRes = await dialogs.showDialog({
                title: "Form 3",
                maxWidth: 500
            });
            console.log("Form #" + index + ":\n" + promiseRes);
            index++;

        },
        async FS() {
            var index = 1;
            var promiseRes = await dialogs.showDialog({
                title: "Fullscreen form",
                text: "Form text",
                fullscreen: true
            });
            console.log("Form #" + index + ":\n" + promiseRes);
        },
        async NotFS() {
            var index = 1;
            var promiseRes = await dialogs.showDialog({
                title: "1000px width form",
                maxWidth: 1000
            });
            console.log("Form #" + index + ":\n" + promiseRes);

        },
        Multiple() {
            dialogs.showDialog({
                title: "Form 1",
                text: "Open many forms.",
                maxWidth: 1000
            });
            dialogs.showDialog({
                title: "Form 2",
                text: "Open many forms.",
                maxWidth: 800
            });
            dialogs.showDialog({
                title: "Form 3",
                text: "Open many forms.",
                maxWidth: 600
            });
            dialogs.showDialog({
                title: "Form 4",
                text: "Open many forms.",
                maxWidth: 500
            });
            dialogs.showDialog({
                title: "Form 5",
                text: "Open many forms.",
                maxWidth: 400
            });

        }
    }
}

export default tests;