//=include ../../node_modules/bootstrap/dist/js/bootstrap.min.js
//=include ./components/form.js
//=include ./components/price.js

$(function () {
    try{
        /* countdown */
        let dateEnd = new Date();
        dateEnd.setDate(dateEnd.getDay() ? dateEnd.getDate() - dateEnd.getDay() + 8 : dateEnd.getDate() + 1);
        dateEnd.setHours(0, 0, 0);
        let countdown = new LightCountdown('.countdown-week', dateEnd, {animation: "animate__animated animate__flipInX", animationDuration: "600ms"});
    }catch (e) {console.error(e);}
});


$(function () {
    formSubmit('form');
});
