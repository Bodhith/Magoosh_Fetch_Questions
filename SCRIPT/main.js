// ==UserScript==
// @name         Magoosh Fetch Questions
// @namespace    Magoosh
// @version      3.2
// @description  Be like a hungry soul seeking for knowledege.
// @author       Bodhith
// @include      https://gre.magoosh.com/practices/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/html2canvas/0.5.0-beta4/html2canvas.js
// ==/UserScript==

(function() {
    'use strict';

    var timeOut = 1000;

    function MarkAnswer() {

        var objectHTMLCollection = document.getElementsByTagName("input"),
                                    string = [].map.call( objectHTMLCollection, function(node){
                                        return " ".concat(node.id);
                                    }).join("");

        var ids = string.match(/_answer__parts_val_[0-9]+_choice_id_[0-9]+|_answer__parts_val_[0-9]+_text[_a-z]*/g);

        if( ids[0].indexOf("text") == -1 )                        //      Radio button  and  Checkboxe  Questions 
        {
            if( document.getElementById(ids[0]).checked )
            {
                setTimeout(NextQuestion, timeOut*3);

                return;
            }

            document.getElementById(ids[0]).click();
        }

        else if ( ids[0].indexOf("text") != -1 )                //      Numerical Entries  and  fractions  Questions
        {
            if( document.getElementById(ids[0]).value == "1" )
            {
                setTimeout(NextQuestion, timeOut*3);

                return;
            }

            for(var i=0,n=ids.length; i<n; i++)
            {
                document.getElementById(ids[i]).value = "1";
            }
        }

        else
        {
            console.log("Error at question : ", window.location.href);

            setTimeout(NextQuestion, timeout*3);

            return;
        }

        setTimeout(SubmitAnswer, timeOut);
    }

    function SubmitAnswer() {

        document.getElementsByTagName("form")[0].submit();

        setTimeout(NextQuestion, timeOut*5);
    }

    function NextQuestion() {

        TakeScreenShot("");

        var nextQuestion, viewResult, objectHTMLCollection, tag, aTags, currentTag;

        nextQuestion = "Next Question";

        viewResult = "View Results";

        objectHTMLCollection = document.getElementsByTagName("a");

        for(tag=0, aTags=objectHTMLCollection.length; tag < aTags; tag++)
        {
            if( objectHTMLCollection[tag].innerText == nextQuestion || objectHTMLCollection[tag].innerText == viewResult )
            {
                currentTag = objectHTMLCollection[tag];

                break;
            }
        }

        currentTag.click();
    }

    function GetFileName() {

        var link, index;

        link = window.location.href.slice(window.location.origin.length, window.location.href.length);

        for( index = 0; index != -1; index = link.indexOf('/') )
        {
            link = link.replace('/', '');
        }

        return link;
    }

    function SaveAS(uri, filename) {

        var link = document.createElement('a');

        if (typeof link.download === 'string') {
        
            link.href = uri;
            
            link.download = filename;

            document.body.appendChild(link);
            
            link.click();
            
            document.body.removeChild(link);

        } else {

            window.open(uri);

        }
    }

    function TakeScreenShot(filename) {

        html2canvas(document.body).then(function(canvas) {

            SaveAS(canvas.toDataURL(), filename.concat(GetFileName()));

        });
    }

    function Main() {

        TakeScreenShot("");

        setTimeout(MarkAnswer, timeOut*3);

    }

    Main();

})();
