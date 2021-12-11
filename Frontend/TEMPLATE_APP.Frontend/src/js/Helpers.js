var Helpers = {
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
    },

    validateEmail (email) {
        /* eslint-disable-next-line */
        const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    },

    textGen(length) {
        var result           = '';
        var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
           result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
     }
    
}

export default Helpers;