$(function($) {
    var weekday = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
        months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
        calendar = $('div.calendar'),
        dateDetail = $('div.dateDetail'),
        cal = new Date(),
        dateDetailOpened = false,
        yearWidth = 120,
        count = 0,
        yearRange = 0;
    // weekday[0] = "日";
    // weekday[1] = "一";
    // weekday[2] = "二";
    // weekday[3] = "三";
    // weekday[4] = "四";
    // weekday[5] = "五";
    // weekday[6] = "六";



    /**
     * create years divs
     * @param {*} y the year 
     * @param {*} radius 
     */
    function headerDivs(y = (new Date()).getFullYear(), radius = 5) {
        let x = '';
        for (let i = y - radius; i <= y + radius; i++) {
            x += '<div>' + i + '</div>';
        }
        //return '<div class="yearDiv">'+x+'</div>';
        return x;
    };



    /**
     * 
     * @param {*} calendar The dom container
     * @param {*} year the calendar year
     * @param {*} today the date of today
     */
    function yearCalendar(calendar, year = (new Date()).getFullYear(), today = (new Date())) {
        let month = new Date();
        month.setFullYear(year);
        for (var i = 1; i <= 12; i++) {
            var monDiv = $('<div class="month" data-value="' + months[i - 1] + '"></div>');
            //monDiv.append('<div>' + i + '月</div>');
            monDiv.append('<div>' + months[i - 1] + '</div>');
            var week = $('<div class="week"></div>');
            monDiv.append(week);
            for (var j = 0; j < 7; j++) {
                week.append('<div class="weekday">' + weekday[j] + '</div>');
            }
            var daysDiv = $('<div class="days"></div>');
            monDiv.append(daysDiv);
            calendar.append(monDiv);
            month.setMonth(i, 0);
            monthCalendar(month, daysDiv, today);
            // monDiv.on('click', 'div.theDate', function(e) {
            //     if (calendar.children('div.month').hasClass('blur')) {
            //         return;
            //     }
            // });
            //monDiv.on('mouseover', 'div.theDate', mouseoverOnDay);
        }
    }

    /**
     * create calendar of month
     * @param {*} month 
     * @param {*} monDiv 
     * @param {*} highLightDate 
     */
    function monthCalendar(month, monDiv, highLightDate = new Date()) {
        var days = [];
        var daysOfMonth = month.getDate();
        var weeks = Math.ceil(daysOfMonth / 7);
        if (daysOfMonth % 7 == 0) {
            weeks++;
        }
        for (d = 1; d <= (weeks * 7); d++) {
            var _d = $('<div class="day"></div>');
            monDiv.append(_d);
            days.push(_d);
        }
        month.setDate(1);

        // var today = new Date();
        var highLightDateStr = highLightDate.getFullYear() + '/' + (highLightDate.getMonth() + 1) + '/' + highLightDate.getDate();
        var weekFirstDay = month.getDay();
        var count = 1;
        for (; weekFirstDay < days.length; weekFirstDay++) {
            if (count > daysOfMonth) {
                break;
            }
            var dateStr = month.getFullYear() + '/' + (month.getMonth() + 1) + '/' + count;
            days[weekFirstDay].append('<div>' + count + '</div>').addClass('theDate').data({
                date: dateStr
            }).attr('data-value', dateStr);
            if (dateStr === highLightDateStr) {
                days[weekFirstDay].children().first().addClass('highlight');
            }
            count++;
        }

    };

    //create year calendar dom
    yearCalendar(calendar, cal.getFullYear(), cal);
    //create year headers dom
    $('<div class="yearTitle"><div class="yearDiv"><div class="abc">' + headerDivs(cal.getFullYear(), yearRange) + '</div></div></div>').insertBefore(calendar);

    $('#prev').on('click', function() {
        if ($('div.yearDiv').data('expanded')) {
            let years = $('div.yearDiv').children().children(),
                yearNum = parseInt(years.first().text()),
                basicTimeline = anime.timeline();
            yearNum -= years.length;
            years.removeClass('yearHighlight');
            years.each(function() {
                basicTimeline.add({
                    targets: this,
                    opacity: 0,
                    delay: 0,
                    duration: 60,
                    complete: function(anim) {
                        $(anim.animatables[0].target).text(yearNum++).css({ opacity: 1 });
                        if (parseInt($(anim.animatables[0].target).text()) === (new Date()).getFullYear()) {
                            $(anim.animatables[0].target).addClass('yearHighlight');
                        }
                    }
                });
            });
            return;
        }
        count++;
        cal.setFullYear(cal.getFullYear() - 1);
        updateYearCalendar('prev');
    });
    $('#next').on('click', function() {
        if ($('div.yearDiv').data('expanded')) {
            let years = $('div.yearDiv').children().children(),
                yearNum = parseInt(years.last().text()),
                basicTimeline = anime.timeline();
            yearNum += years.length;
            years.removeClass('yearHighlight');
            years.toArray().reverse().forEach(function(e) {
                basicTimeline.add({
                    targets: e,
                    opacity: 0,
                    delay: 0,
                    duration: 60,
                    complete: function(anim) {
                        $(e).text(yearNum--).css({ opacity: 1 });
                        if (parseInt($(e).text()) == (new Date()).getFullYear()) {
                            $(e).addClass('yearHighlight');
                        }
                    }
                });
            });
            return;
        }
        count--;
        cal.setFullYear(cal.getFullYear() + 1);
        updateYearCalendar('next');
    });

    $('#today').on('click', function(e) {
        cal = new Date();
        count = 0;
        let yd = $('div.yearDiv');
        if (yd.data('expanded')) {
            yd.data('expanded', !yd.data('expanded'));
            calendar.removeClass('blur');
            yd.removeClass('expand');
        }
        updateYearCalendar();
        //highLightDate(cal);
    });

    $('div.yearTitle').on('click', 'div.yearDiv>div.abc>div', function(e) {
        let yt = $(this).parent().parent();
        if (yt.data('expanded') == undefined) {
            yt.data('expanded', true);
        } else {
            yt.data('expanded', !yt.data('expanded'));
        }
        if (yt.data('expanded')) {
            calendar.addClass('blur');
            yt.children().children().remove();
            yt.children().append(headerDivs(cal.getFullYear(), 5));
            yt.children().children("div:contains('" + cal.getFullYear() + "')").addClass('yearHighlight');
            yt.addClass('expand');
        } else {
            calendar.removeClass('blur');
            $(this).siblings().remove();
            let _now = new Date(),
                selectedYear = parseInt($(this).text());
            count = (_now.getFullYear() - selectedYear);
            cal.setFullYear(selectedYear);
            updateYearCalendar();
            console.log('collapse here');
            yt.removeClass('expand');
        }
    });


    function updateYearCalendar(direction = '') {
        function getDistance(dir) {
            let dis = 0;
            switch (dir) {
                case 'prev':
                    dis = '10%';
                    break;
                case 'next':
                    dis = '-10%';
                    break;

                default:
                    dis = 0;
                    break;
            }
            return dis;
        }
        $('div.abc').children().text(cal.getFullYear());
        anime({
            targets: calendar.children('div.month').children('div.days').toArray(),
            translateX: getDistance(direction),
            opacity: 0,
            easing: 'easeInQuint',
            easing: 'linear',
            duration: 100,
            complete: function(obj) {
                obj.animatables.forEach((element, idx) => {
                    $(element.target).css({
                        transform: 'translateX(0px)'
                    }).children().remove();
                });
                obj.animatables.forEach((element, idx) => {
                    cal.setMonth((idx + 1), 0);
                    monthCalendar(cal, $(element.target));
                    anime({
                        targets: element.target,
                        opacity: 1,
                        duration: 60,
                        easing: 'easeInQuint'
                    });
                });
            }
        });

        /**
        let yearTitle = anime({
            targets: $('div.abc').get(0),
            translateX: (yearWidth * count),
            easing: [.91, -0.54, .29, 1.56],
            duration: 200,
            complete: function () {
                anime({
                    targets: calendar.children('div.month').toArray(),
                    translateX: (yearWidth * count),
                    rotateY: 45,
                    scale: 1,
                    opacity: 0.1,
                    easing: [.91, -0.54, .29, 1.56],
                    duration: 260,
                    complete: function (obj) {
                        //let month = new Date();
                        //month.setFullYear(cal.getFullYear() - count);
                        //console.log(month);
                        console.log('===>' + cal);
                        obj.animatables.forEach((element, idx) => {
                            $(element.target).children('div.days').children().remove();
                            cal.setMonth((idx + 1), 0);
                            monthCalendar(cal, $(element.target).children('div.days'));
                        });
                        obj.reset();
                    }
                });
            }
        });
         */
    }

    function mouseoverOnDay(e) {
        dateDetail.css({
            left: $(this).offset().left,
            top: $(this).offset().top
        });
    }

    function mouseClickOnDay(e) {
        if (calendar.hasClass('blur')) {
            return;
        }
        dateDetail.data('dd', $(this).attr('data-value'));
        console.log($(this).attr('data-value'));
        dateDetail.css({
            left: $(this).offset().left,
            top: $(this).offset().top
        });
        dateDetailOpened = !dateDetailOpened;
        $(document.body).children().not('div.dateDetail').addClass('blur');
        openDetail.call(dateDetail, $(this));
    }

    //calendar.children('div.month').on('mouseover', 'div.theDate', mouseoverOnDay);
    calendar.children('div.month').on('click', 'div.theDate', mouseClickOnDay);

    var colorStep = 255 / 6,
        hl = dateDetail.find('div.hour').length;
    dateDetail.find('div.hour').each(function(idx) {
        let c = colorStep*(idx+1)/2;
        if(idx >= 12){
            c = colorStep*(hl - idx)/2;
        }
        $(this).html((idx >= 10)?(idx+':00'):('0'+idx+':00')).css({
            backgroundColor: 'rgba('+Math.round(c)+','+Math.round(c)+','+Math.round(c)+',1)',
            color:'rgba('+(255-Math.round(c))+','+(255-Math.round(c))+','+(255-Math.round(c))+',1)'
        });//.append('<div class="close icon"></div>');
        $(this).on('click', function(){
            alert('Add event not finished yet, coming soon.');
        });
    });

    $('#close').on('click', closeDetail);

    function openDetail(daySrc) {
        $(this).addClass('detailOpen');
        //basicTimeline = anime.timeline();
        let scaleTimes = $(window).width() / daySrc.width() * 2;
        $(this).children('div.transitionLayerIn').toArray().forEach(function(e, idx) {
            // basicTimeline.add({
            let x = anime({
                targets: e,
                duration: 500,
                delay: 100 * idx,
                scale: scaleTimes,
                easing: 'linear',
                backgroundColor: 'rgba(238, 238, 238, 0.2)',
                // update: function(anim) {
                // },
                complete: function(an){
                    an.reset();
                }
            });
        });

        anime({
            targets: dateDetail.children('div.hours').toArray(),
            width: '100%',
            delay: 500
        });

        anime({
            targets: dateDetail.find('div.hour').toArray(),
            opacity: 1,
            delay: 600
        });
    }

    function closeDetail() {
        //calendar.children('div.month').on('mouseover', 'div.theDate', mouseoverOnDay);
        if (!dateDetailOpened) {
            return;
        }
        console.log(this);
        //dateDetail.removeClass('detailOpen');
        dateDetail.data('dd', '');
        dateDetailOpened = !dateDetailOpened;

        anime({
            targets:$('div.hours').get(0),
            scaleX: 0.5,
            opacity:0,
            complete: function(a){
                a.reset();
            }
            // easing: 'linear',
        });
        let scaleTimes = $(window).width() / dateDetail.children().first().width() * 2;
        let layer = dateDetail.children('div.transitionLayerOut').toArray(),
            len = layer.length;
        layer.forEach(function(e, idx) {
            anime({
                targets: e,
                duration: 500,
                delay: 150 * idx,
                scale: scaleTimes,
                easing: 'linear',
                backgroundColor: 'rgba(255,255,255,0.15)',
                complete: function(anim) {
                    anim.reset();
                    dateDetail.children('div.transitionLayerIn').css({
                        transform: '',
                        backgroundColor: '',
                        transform:'scale(0)'
                    });
                    $(anim.animatables[0].target).css({
                        backgroundColor: '',
                        transform: 'scale(0)'
                    });
                    dateDetail.children('div.hours').css({
                        width:0,
                        transform: ''
                    });
                    dateDetail.find('div.hour').css({
                        opacity: 0
                    });
                    dateDetail.removeClass('detailOpen').css({
                        backgroundColor:''
                    });
                    $(document.body).children().not('div.dateDetail').removeClass('blur');
                }
            });
        });

        
    };

    // dateDetail.children('div.hours').on('mouseenter','div.hour', function(e){
    //     $(this).parent().css({
    //        backgroundColor: $(this).css('background-color') 
    //     });
    // });


    // var clock = new Clock(document.getElementById('clock'), {
    //     size: 450,
    //     style:'night'
    // });


    // function highLightDate(target, clzz = 'highlight') {
    //     if (!target) {
    //         return;
    //     }
    //     //var dateStr = target.getFullYear() + '/' + (target.getMonth() + 1) + '/' + target.getDate();
    //     var highLightDateStr = target.getFullYear() + '/' + (target.getMonth() + 1) + '/' + target.getDate();
    //     //console.log(highLightDateStr);
    //     var x = calendar.find('div.theDate[data-value="' + highLightDateStr + '"]');
    //     x.children().addClass(clzz);
    // }


    //highLightDate(cal);

    // var lydong = ['2018/2/15','2018/2/16','2018/2/17','2018/2/18','2018/2/19','2018/2/10','2018/2/11','2018/2/12',
    // '2018/2/13','2018/2/14','2018/2/15','2018/2/16','2018/2/17','2018/2/18','2018/2/19','2018/2/20','2018/2/21','2018/2/24'];

    // for (let d = 0; d < lydong.length; d++) {
    //     highLightDate(lydong[d],"today");
    // }
});