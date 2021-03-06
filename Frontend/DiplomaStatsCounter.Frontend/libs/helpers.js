
class HelpersClass {
    getFileName(path) {
        var array = path.split("/")
        var fileName = array[array.length - 1];

        var lastDotPosition = fileName.lastIndexOf(".");
        if (lastDotPosition === -1)
            return fileName;
        else
            return fileName.substr(0, lastDotPosition);
    }

    setZoom(zoom) {
        var setSizes = function () {
            if (!zoom)
                zoom = 0.7;
            var windowWidth = (self.innerWidth / zoom);
            var viewportValue = "width=" + windowWidth + "px,initial-scale=" + zoom + ",user-scalable=1";
            var viewportEl = document.getElementById("viewport");
            viewportEl.setAttribute("content", viewportValue);

            var bigger = document.body.clientHeight;
            var smaller = innerHeight;
            var percent = 1 - (bigger - smaller) / bigger;
            percent = Math.round(percent * 100) / 100;
            //console.log(percent);
            document.body.style.zoom = percent;
        }

        if (performance.timing.loadEventEnd) {
            setInterval(setSizes, 200);
        } else {
            window.onload = setSizes;
        }
    }

    validateEmail(email) {
        /* eslint-disable-next-line */
        const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }

    textGen(length) {
        var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }


    formatDateTime(dateTime) {
        var date = dateTime.getFullYear() + '-' + ((dateTime.getMonth() + 1) + '').padStart(2, '0') + '-' + (dateTime.getDate() + '').padStart(2, '0');
        var time = (dateTime.getHours() + '').padStart(2, '0') + ":" + (dateTime.getMinutes() + '').padStart(2, '0') + ":" + (dateTime.getSeconds() + '').padStart(2, '0');
        var dateTimeStr = date + 'T' + time + 'Z';
        return dateTimeStr;
    }

    getCurrentDateTime() {
        return this.formatDateTime(new Date());
    }

    randInt(min, max) {
        let rand = min + Math.random() * (max + 1 - min);
        return Math.floor(rand);
    }

    randInt2(max) {
        let rand = Math.random() * (max + 1);
        return Math.floor(rand);
    }

    redirect(url) {
        url = url.trim();
        window.location.href = url;
    }

    redirectWithUrlParams(url, urlParamsObject) {
        url = url.trim();
        if (url.includes("?")) {
            url = url + "&";
        }
        else {
            url = "?";
        }

        var paramsWasAdded = false;
        for (var urlParamName of Object.keys(urlParamsObject)) {
            urlParamName = encodeURIComponent(urlParamName);
            if (urlParamValue) {
                var urlParamValue = encodeURIComponent(urlParamsObject[urlParamName]);
                url = url + urlParamName + "=" + urlParamValue + "&";
                paramsWasAdded = true;
            }
        }
        if (paramsWasAdded)
            url = url.substr(0, url.length - 2);
        window.location.href = url;
    }

    getUrlParameter(name, url = window.location.href) {
        return this.getAllUrlParameters(url)[name];
    }

    getAllUrlParameters(url = window.location.href) {
        //eslint-disable-next-line
        url = url.replace(/^.*\/\/[^\/][^\?]+/, '')
        var match,
            //eslint-disable-next-line
            pl = /\+/g,  // Regex for replacing addition symbol with a space
            //eslint-disable-next-line
            search = /([^&=]+)=?([^&]*)/g,
            decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
            query = url.substring(1);

        var urlParams = {};
        //eslint-disable-next-line
        while (match = search.exec(query))
            urlParams[decode(match[1])] = decode(match[2]);
        return urlParams;
    }

    logAsJson(obj) {
        console.log(JSON.stringify(obj, null, 2));
    }

    log(obj) {
        console.log(obj);
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    generateRandomUUID() { // Public Domain/MIT
        var d = new Date().getTime();//Timestamp
        var d2 = ((typeof performance !== 'undefined') && performance.now && (performance.now() * 1000)) || 0;//Time in microseconds since page-load or 0 if unsupported
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16;//random number between 0 and 16
            if (d > 0) {//Use timestamp until depleted
                r = (d + r) % 16 | 0;
                d = Math.floor(d / 16);
            } else {//Use microseconds since page-load if supported
                r = (d2 + r) % 16 | 0;
                d2 = Math.floor(d2 / 16);
            }
            return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
    }

}

const  Helpers = new HelpersClass();

export default Helpers;